const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { addQuantity, setQuantity } = require('../utils/cartRules');

function wantsJson(req) {
    return req.xhr || (req.headers.accept || '').includes('application/json');
}

async function loadCart(req) {
    await CartItem.mergeGuestCart(req);
    const identity = CartItem.identity(req);
    const items = await CartItem.list(identity);
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    return { identity, items, subtotal, count: items.reduce((sum, item) => sum + item.quantity, 0) };
}

exports.showCart = async (req, res, next) => {
    try {
        const cart = await loadCart(req);
        res.render('public/cart/index', {
            title: 'Cart',
            cartItems: cart.items,
            subtotal: cart.subtotal,
            count: cart.count,
            currency: (res.locals.settings && res.locals.settings.price_currency) || 'PKR',
        });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const productId = parseInt(req.body.productId, 10);
        const product = Number.isInteger(productId) ? await Product.getById(productId) : null;
        if (!product) {
            if (wantsJson(req)) return res.status(404).json({ success: false, message: 'Product not found.' });
            req.flash('error', 'Product not found.');
            return res.redirect('/products');
        }

        await CartItem.mergeGuestCart(req);
        const identity = CartItem.identity(req);
        const existing = await CartItem.find(identity, product.id);
        const result = addQuantity(existing ? existing.quantity : 0, req.body.quantity || 1, product.stock);
        if (!result.ok) {
            if (wantsJson(req)) return res.status(400).json({ success: false, message: result.error });
            req.flash('error', result.error);
            return res.redirect(`/products/${product.id}`);
        }

        await CartItem.saveQuantity(identity, product.id, result.quantity);
        if (wantsJson(req)) {
            const count = await CartItem.count(identity);
            return res.json({ success: true, quantity: result.quantity, count });
        }
        req.flash('success', `${product.name} added to your cart.`);
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
};

exports.updateQuantity = async (req, res, next) => {
    try {
        const cart = await loadCart(req);
        const item = cart.items.find((entry) => String(entry.id) === String(req.params.id));
        if (!item) {
            if (wantsJson(req)) return res.status(404).json({ success: false, message: 'Cart item not found.' });
            req.flash('error', 'That item is no longer in your cart.');
            return res.redirect('/cart');
        }

        const result = setQuantity(req.body.quantity, item.stock);
        if (!result.ok) {
            if (wantsJson(req)) return res.status(400).json({ success: false, message: result.error });
            req.flash('error', result.error);
            return res.redirect('/cart');
        }

        if (result.remove) await CartItem.remove(cart.identity, item.id);
        else await CartItem.saveQuantity(cart.identity, item.product_id, result.quantity);

        if (wantsJson(req)) {
            const updated = await loadCart(req);
            const line = updated.items.find((entry) => entry.product_id === item.product_id);
            return res.json({
                success: true,
                removed: result.remove,
                quantity: result.quantity,
                lineTotal: line ? Number(line.price) * line.quantity : 0,
                subtotal: updated.subtotal,
                count: updated.count,
            });
        }

        req.flash('success', result.remove ? 'Item removed from your cart.' : 'Quantity updated.');
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        await CartItem.mergeGuestCart(req);
        const identity = CartItem.identity(req);
        await CartItem.remove(identity, req.params.id);
        if (wantsJson(req)) {
            const cart = await loadCart(req);
            return res.json({ success: true, subtotal: cart.subtotal, count: cart.count });
        }
        req.flash('success', 'Item removed from your cart.');
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
};
