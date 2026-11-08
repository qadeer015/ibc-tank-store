const db = require("../config/db");

class Review {
    static async productExists(productId) {
        const [rows] = await db.execute(
            "SELECT id FROM products WHERE id = ? LIMIT 1",
            [productId]
        );
        return rows.length > 0;
    }

    static async save(productId, { rating, email, reviewTitle, nickname, review }) {
        const [existingReviews] = await db.execute(
            `SELECT id
             FROM reviews
             WHERE product_id = ? AND email = ?
             ORDER BY id
             LIMIT 1`,
            [productId, email]
        );

        if (existingReviews.length > 0) {
            await db.execute(
                `UPDATE reviews
                 SET rating = ?, review_title = ?, nickname = ?, review = ?
                 WHERE product_id = ? AND email = ?`,
                [rating, reviewTitle, nickname, review, productId, email]
            );
            return { created: false };
        }

        const [result] = await db.execute(
            `INSERT INTO reviews (product_id, rating, email, review_title, nickname, review)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [productId, rating, email, reviewTitle, nickname, review]
        );
        return { created: true, insertId: result.insertId };
    }

    static async getProductReviews(productId) {
        const [rows] = await db.execute(
            `SELECT id, product_id, rating, email, review_title, nickname, review, created_at
             FROM reviews
             WHERE product_id = ?
             ORDER BY created_at DESC`,
            [productId]
        );
        return rows;
    }
}

module.exports = Review;
