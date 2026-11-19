const db = require('../config/db');
const calculateTotals = require('../utils/calculateTotals');
const { pricingFrom } = require('../utils/pricing');

function sellingPrice(row) {
    return pricingFrom(row).current;
}

class Order {
    static async createFromCart(identity, input, userId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [items] = await connection.execute(
                `SELECT ci.product_id, ci.quantity, p.name, p.price, p.sale_price, p.stock
                 FROM cart_items ci
                 JOIN products p ON p.id = ci.product_id
                 WHERE ci.cart_key = ?
                 FOR UPDATE`,
                [identity.key]
            );
            for (const item of items) item.price = sellingPrice(item);
            if (!items.length) {
                const error = new Error('Your cart is empty.');
                error.status = 400;
                throw error;
            }

            for (const item of items) {
                if (item.quantity > item.stock) {
                    const error = new Error(`${item.name} only has ${item.stock} in stock.`);
                    error.status = 400;
                    throw error;
                }
            }

            const totals = calculateTotals(items.map((item) => ({ price: item.price, quantity: item.quantity })));
            const placeholder = `TMP-${require('crypto').randomUUID().replace(/-/g, '').slice(0, 20)}`;
            const [inserted] = await connection.execute(
                `INSERT INTO orders
                    (order_number, user_id, full_name, phone, email, address_line1, address_line2, city, notes,
                     subtotal, delivery_charges, total_amount, payment_method)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    placeholder, userId || null, input.fullName, input.phone, input.email, input.addressLine1,
                    input.addressLine2, input.city, input.notes, totals.subtotal, totals.deliveryCharges,
                    totals.total, input.paymentMethod,
                ]
            );
            const orderNumber = `IBC-${new Date().getFullYear()}-${String(inserted.insertId).padStart(5, '0')}`;
            await connection.execute('UPDATE orders SET order_number = ? WHERE id = ?', [orderNumber, inserted.insertId]);

            for (const item of items) {
                await connection.execute(
                    `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_purchase)
                     VALUES (?, ?, ?, ?, ?)`,
                    [inserted.insertId, item.product_id, item.name, item.quantity, item.price]
                );
                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }
            await connection.execute('DELETE FROM cart_items WHERE cart_key = ?', [identity.key]);
            await connection.commit();
            return this.findByNumber(orderNumber);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByNumber(orderNumber) {
        const [orders] = await db.execute('SELECT * FROM orders WHERE order_number = ? LIMIT 1', [orderNumber]);
        if (!orders[0]) return null;
        const [items] = await db.execute(
            'SELECT * FROM order_items WHERE order_id = ? ORDER BY id',
            [orders[0].id]
        );
        return { ...orders[0], items };
    }

    static async list() {
        const [rows] = await db.execute(
            `SELECT o.*,
                    (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
             FROM orders o
             ORDER BY o.created_at DESC`
        );
        return rows;
    }

    static async count() {
        const [rows] = await db.execute('SELECT COUNT(*) AS count FROM orders');
        return rows[0].count;
    }

    static async markPaid(id) {
        const [result] = await db.execute(
            `UPDATE orders
             SET payment_status = 'paid',
                 order_status = IF(order_status = 'pending', 'packed', order_status)
             WHERE id = ? AND order_status <> 'cancelled'`,
            [id]
        );
        if (!result.affectedRows) {
            const error = new Error('A cancelled order cannot be marked paid.');
            error.status = 400;
            throw error;
        }
    }

    static async updateStatus(id, status) {
        const allowed = ['pending', 'packed', 'shipped', 'delivered', 'cancelled'];
        if (!allowed.includes(status)) {
            const error = new Error('Unknown order status.');
            error.status = 400;
            throw error;
        }
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [orders] = await connection.execute('SELECT * FROM orders WHERE id = ? FOR UPDATE', [id]);
            const order = orders[0];
            if (!order) {
                const error = new Error('Order not found.');
                error.status = 404;
                throw error;
            }
            if (order.order_status !== status) {
                const [items] = await connection.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
                if (status === 'cancelled' && order.order_status !== 'cancelled') {
                    for (const item of items) {
                        if (item.product_id) {
                            await connection.execute('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
                        }
                    }
                } else if (order.order_status === 'cancelled' && status !== 'cancelled') {
                    for (const item of items) {
                        const [products] = await connection.execute('SELECT stock FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
                        if (!products[0] || products[0].stock < item.quantity) {
                            const error = new Error('Not enough stock to reopen this order.');
                            error.status = 400;
                            throw error;
                        }
                        await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
                    }
                }
                const paymentStatus = status === 'cancelled' ? 'failed' : order.payment_status;
                await connection.execute(
                    'UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?',
                    [status, paymentStatus, id]
                );
            }
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Order;
