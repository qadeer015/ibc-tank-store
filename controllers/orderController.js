const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const { readOrderInput, phonesMatch } = require('../utils/orderInput');
const calculateTotals = require('../utils/calculateTotals');

async function currentCart(req) {
    await CartItem.mergeGuestCart(req);
    const identity = CartItem.identity(req);
    const items = await CartItem.list(identity);
    const totals = calculateTotals(items);
    return { identity, items, totals };
}

exports.showCheckout = async (req, res, next) => {
    try {
        const cart = await currentCart(req);
        if (!cart.items.length) {
            req.flash('error', 'Your cart is empty.');
            return res.redirect('/cart');
        }
        res.render('public/checkout/index', {
            title: 'Checkout',
            cartItems: cart.items,
            totals: cart.totals,
            currency: (res.locals.settings && res.locals.settings.price_currency) || 'PKR',
            form: {
                fullName: req.user ? req.user.name : '',
                email: req.user ? req.user.email : '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                notes: '',
                paymentMethod: 'cod',
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const cart = await currentCart(req);
        const input = readOrderInput(req.body);
        if (!cart.items.length) {
            req.flash('error', 'Your cart is empty.');
            return res.redirect('/cart');
        }
        if (input.errors.length) {
            req.flash('error', input.errors[0]);
            return res.render('public/checkout/index', {
                title: 'Checkout',
                cartItems: cart.items,
                totals: cart.totals,
                currency: (res.locals.settings && res.locals.settings.price_currency) || 'PKR',
                form: req.body,
            });
        }

        const order = await Order.createFromCart(cart.identity, input.value, req.user && req.user.id);
        res.redirect(`/checkout/success/${order.order_number}`);
    } catch (error) {
        if (error.status === 400) {
            req.flash('error', error.message);
            return res.redirect('/checkout');
        }
        next(error);
    }
};

exports.orderSuccess = async (req, res, next) => {
    try {
        const order = await Order.findByNumber(req.params.orderNumber);
        if (!order) {
            req.flash('error', 'Order not found.');
            return res.redirect('/cart');
        }
        res.render('public/checkout/success', {
            title: 'Order placed',
            order,
            currency: (res.locals.settings && res.locals.settings.price_currency) || 'PKR',
        });
    } catch (error) {
        next(error);
    }
};

exports.track = async (req, res, next) => {
    try {
        const orderNumber = typeof req.query.order === 'string' ? req.query.order.trim() : '';
        const phone = typeof req.query.phone === 'string' ? req.query.phone.trim() : '';
        let order = null;
        let searched = false;
        if (orderNumber && phone) {
            searched = true;
            const found = await Order.findByNumber(orderNumber);
            if (found && phonesMatch(found.phone, phone)) order = found;
        }
        res.render('public/pages/track-order', {
            title: 'Order Tracking',
            path: '/order-tracking',
            canonicalPath: '/order-tracking',
            metaDescription: 'Track your IBC Tank Store order status and get delivery updates for purchases across Pakistan.',
            order,
            searched,
            orderNumber,
            phone,
            currency: (res.locals.settings && res.locals.settings.price_currency) || 'PKR',
        });
    } catch (error) {
        next(error);
    }
};

exports.adminList = async (req, res, next) => {
    try {
        const orders = await Order.list();
        res.render('admin/orders/index', { title: 'Orders', viewPage: 'orders', orders });
    } catch (error) {
        next(error);
    }
};

exports.adminShow = async (req, res, next) => {
    try {
        const [rows] = await require('../config/db').execute('SELECT order_number FROM orders WHERE id = ?', [req.params.id]);
        if (!rows[0]) {
            req.flash('error', 'Order not found.');
            return res.redirect('/admin/orders');
        }
        const order = await Order.findByNumber(rows[0].order_number);
        res.render('admin/orders/show', { title: order.order_number, viewPage: 'orders', order });
    } catch (error) {
        next(error);
    }
};

exports.adminUpdateStatus = async (req, res, next) => {
    try {
        await Order.updateStatus(req.params.id, req.body.order_status);
        req.flash('success', 'Order status updated.');
        res.redirect(`/admin/orders/${req.params.id}`);
    } catch (error) {
        if (error.status) {
            req.flash('error', error.message);
            return res.redirect(`/admin/orders/${req.params.id}`);
        }
        next(error);
    }
};
