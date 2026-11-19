const CartItem = require('../models/CartItem');

module.exports = async function sessionCart(req, res, next) {
    try {
        if (req.session && !req.session.cartSessionId) {
            const { randomUUID } = require('crypto');
            req.session.cartSessionId = randomUUID();
        }
        res.locals.cartCount = 0;
        if (req.session) {
            await CartItem.mergeGuestCart(req);
            res.locals.cartCount = await CartItem.count(CartItem.identity(req));
        }
        next();
    } catch (error) {
        res.locals.cartCount = 0;
        next();
    }
};
