const { randomUUID } = require('crypto');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { addQuantity } = require('../utils/cartRules');
const { readOrderInput } = require('../utils/orderInput');
const calculateTotals = require('../utils/calculateTotals');

function currencyOf(res) {
    return (res.locals.settings && res.locals.settings.price_currency) || 'PKR';
}

function blankForm(req) {
    return {
        fullName: req.user ? req.user.name : '',
        email: req.user ? req.user.email : '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        notes: '',
        paymentMethod: 'cod',
    };
}

function identity(req) {
    return { key: req.session.buyNowKey, userId: req.user ? req.user.id : null };
}

exports.start = async (req, res, next) => {
    try {
        const productId = parseInt(req.body.productId, 10);
        const product = Number.isInteger(productId) ? await Product.getById(productId) : null;
        if (!product) {
            req.flash('error', 'Product not found.');
            return res.redirect('/products');
        }
        const result = addQuantity(0, req.body.quantity || 1, product.stock);
        if (!result.ok) {
            req.flash('error', result.error);
            return res.redirect(`/products/${product.id}`);
        }

        if (req.session.buyNowKey) {
            await CartItem.clear({ key: req.session.buyNowKey, userId: null });
        }
        req.session.buyNowKey = `buy:${randomUUID()}`;
        await CartItem.saveQuantity(identity(req), product.id, result.quantity);
        res.redirect('/buy-now');
    } catch (error) {
        next(error);
    }
};

exports.show = async (req, res, next) => {
    try {
        if (!req.session.buyNowKey) {
            req.flash('error', 'Choose Buy now on a product first.');
            return res.redirect('/products');
        }
        const items = await CartItem.list(identity(req));
        if (!items.length) {
            req.flash('error', 'That buy-now request is no longer available.');
            return res.redirect('/products');
        }
        res.render('public/checkout/index', {
            title: 'Buy now',
            cartItems: items,
            totals: calculateTotals(items),
            currency: currencyOf(res),
            checkoutAction: '/buy-now/place',
            form: blankForm(req),
        });
    } catch (error) {
        next(error);
    }
};

exports.place = async (req, res, next) => {
    try {
        if (!req.session.buyNowKey) return res.redirect('/products');
        const current = identity(req);
        const items = await CartItem.list(current);
        const input = readOrderInput(req.body);
        if (!items.length) {
            req.flash('error', 'That buy-now request is no longer available.');
            return res.redirect('/products');
        }
        if (input.errors.length) {
            req.flash('error', input.errors[0]);
            return res.render('public/checkout/index', {
                title: 'Buy now',
                cartItems: items,
                totals: calculateTotals(items),
                currency: currencyOf(res),
                checkoutAction: '/buy-now/place',
                form: req.body,
            });
        }
        const order = await Order.createFromCart(current, input.value, req.user && req.user.id);
        delete req.session.buyNowKey;
        res.redirect(`/checkout/success/${order.order_number}`);
    } catch (error) {
        if (error.status === 400) {
            req.flash('error', error.message);
            return res.redirect('/buy-now');
        }
        next(error);
    }
};
