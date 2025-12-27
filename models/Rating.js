const db = require("../config/db");

class Rating {
    static async create(productId, userId, rating) {
        const [result] = await db.execute(
            "INSERT INTO ratings (product_id, user_id, rating) VALUES (?, ?, ?)",
            [productId, userId, rating]
        );
        return result;
    }

    static async getProductRatings(productId) {
        const [rows] = await db.execute(
            `SELECT
             r.id,
             r.product_id,
             r.user_id,
             r.rating,
             r.created_at,  
             u.name as user_name,
             u.profile_photo as user_profile_photo
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE product_id = ?`,
            [productId]
        );
        return rows;
    }

    static async updateRating(productId, userId, rating) {
        const [result] = await db.execute(
            "UPDATE ratings SET rating = ? WHERE product_id = ? AND user_id = ?",
            [rating, productId, userId]
        );
        return result;
    }
}

module.exports = Rating;