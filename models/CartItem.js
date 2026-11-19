const db = require('../config/db');
const { cartKey } = require('../utils/cartRules');

class CartItem {
    static identity(req) {
        if (!req.session.cartSessionId) {
            const { randomUUID } = require('crypto');
            req.session.cartSessionId = randomUUID();
        }
        return cartKey(req.user, req.session.cartSessionId);
    }

    static async mergeGuestCart(req) {
        if (!req.user || !req.user.id || !req.session.cartSessionId) return;
        const guest = cartKey(null, req.session.cartSessionId);
        const user = cartKey(req.user, req.session.cartSessionId);
        if (guest.key === user.key) return;

        const [rows] = await db.execute(
            'SELECT product_id, quantity FROM cart_items WHERE cart_key = ?',
            [guest.key]
        );
        for (const row of rows) {
            await db.execute(
                `INSERT INTO cart_items (cart_key, user_id, product_id, quantity)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), user_id = VALUES(user_id)`,
                [user.key, user.userId, row.product_id, row.quantity]
            );
        }
        await db.execute('DELETE FROM cart_items WHERE cart_key = ?', [guest.key]);
        await db.execute(
            `UPDATE cart_items ci
             JOIN products p ON p.id = ci.product_id
             SET ci.quantity = LEAST(ci.quantity, GREATEST(p.stock, 0))
             WHERE ci.cart_key = ?`,
            [user.key]
        );
        await db.execute(
            `DELETE ci FROM cart_items ci
             JOIN products p ON p.id = ci.product_id
             WHERE ci.cart_key = ? AND p.stock < 1`,
            [user.key]
        );
    }

    static async list(identity) {
        const [rows] = await db.execute(
            `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image, p.stock, p.product_condition
             FROM cart_items ci
             JOIN products p ON p.id = ci.product_id
             WHERE ci.cart_key = ?
             ORDER BY ci.created_at ASC`,
            [identity.key]
        );
        return rows;
    }

    static async count(identity) {
        const [rows] = await db.execute(
            'SELECT COALESCE(SUM(quantity), 0) AS count FROM cart_items WHERE cart_key = ?',
            [identity.key]
        );
        return Number(rows[0].count) || 0;
    }

    static async find(identity, productId) {
        const [rows] = await db.execute(
            'SELECT id, quantity FROM cart_items WHERE cart_key = ? AND product_id = ? LIMIT 1',
            [identity.key, productId]
        );
        return rows[0] || null;
    }

    static async saveQuantity(identity, productId, quantity) {
        await db.execute(
            `INSERT INTO cart_items (cart_key, user_id, product_id, quantity)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), user_id = VALUES(user_id)`,
            [identity.key, identity.userId, productId, quantity]
        );
    }

    static async remove(identity, cartItemId) {
        await db.execute(
            'DELETE FROM cart_items WHERE id = ? AND cart_key = ?',
            [cartItemId, identity.key]
        );
    }

    static async clear(identity) {
        await db.execute('DELETE FROM cart_items WHERE cart_key = ?', [identity.key]);
    }
}

module.exports = CartItem;
