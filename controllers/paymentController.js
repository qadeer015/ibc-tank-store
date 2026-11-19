const Order = require('../models/Order');

// Records a payment an admin has confirmed (cash collected or a bank transfer checked).
// There is no public mock gateway: the previous one targeted MongoDB and was not mounted.
exports.recordPayment = async (req, res, next) => {
    try {
        await Order.markPaid(req.params.id);
        req.flash('success', 'Payment recorded. A pending order moves to packed.');
        res.redirect(`/admin/orders/${req.params.id}`);
    } catch (error) {
        if (error.status) {
            req.flash('error', error.message);
            return res.redirect(`/admin/orders/${req.params.id}`);
        }
        next(error);
    }
};
