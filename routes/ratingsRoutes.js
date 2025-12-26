const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/:productId/create", async (req, res) => {
    const { rating } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id || 1;

    // check if user already rated
    const [existing] = await db.query(
        "SELECT * FROM ratings WHERE product_id=? AND user_id=?",
        [productId, userId]
    );

    if (existing.length > 0) {
        await db.query(
            "UPDATE ratings SET rating=? WHERE product_id=? AND user_id=?",
            [rating, productId, userId]
        );
    } else {
        await db.query(
            "INSERT INTO ratings (product_id, user_id, rating) VALUES (?, ?, ?)",
            [productId, userId, rating]
        );
    }

    res.redirect(`/products/${productId}`);
});

module.exports = router;