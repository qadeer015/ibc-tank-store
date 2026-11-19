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
        const commentsByReview = await this.getCommentsForReviews(rows.map((row) => row.id));
        return rows.map((row) => ({
            ...row,
            comments: commentsByReview[row.id] || [],
        }));
    }

    static async findById(reviewId) {
        const [rows] = await db.execute(
            'SELECT id, product_id FROM reviews WHERE id = ? LIMIT 1',
            [reviewId]
        );
        return rows[0] || null;
    }

    static async getCommentsForReviews(reviewIds) {
        if (!reviewIds.length) return {};
        try {
            const placeholders = reviewIds.map(() => '?').join(', ');
            const [rows] = await db.execute(
                `SELECT id, review_id, author_name, body, created_at
                 FROM review_comments
                 WHERE review_id IN (${placeholders})
                 ORDER BY created_at ASC`,
                reviewIds
            );
            return rows.reduce((grouped, row) => {
                if (!grouped[row.review_id]) grouped[row.review_id] = [];
                grouped[row.review_id].push(row);
                return grouped;
            }, {});
        } catch (error) {
            console.error('Review comments unavailable:', error.message);
            return {};
        }
    }

    static async addComment(reviewId, { authorName, email, body }) {
        const [result] = await db.execute(
            `INSERT INTO review_comments (review_id, author_name, email, body)
             VALUES (?, ?, ?, ?)`,
            [reviewId, authorName, email, body]
        );
        return result.insertId;
    }
}

module.exports = Review;
