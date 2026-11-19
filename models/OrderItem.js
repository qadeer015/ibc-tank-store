const db = require('../config/db');

class OrderItem {
    static async forOrder(orderId) {
        const [rows] = await db.execute(
            'SELECT * FROM order_items WHERE order_id = ? ORDER BY id',
            [orderId]
        );
        return rows;
    }
}

module.exports = OrderItem;
