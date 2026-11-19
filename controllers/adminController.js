const Order = require('../models/Order');

exports.listOrders = async (req, res, next) => {
    try {
        const orders = await Order.list();
        res.render('admin/orders/index', { title: 'Orders', viewPage: 'orders', orders });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        await Order.updateStatus(req.params.id, req.body.orderStatus || req.body.order_status);
        req.flash('success', 'Order status updated.');
        res.redirect('/admin/orders');
    } catch (error) {
        if (error.status) {
            req.flash('error', error.message);
            return res.redirect('/admin/orders');
        }
        next(error);
    }
};
