const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const validator = require("validator");

router.post("/:productId/create", async (req, res, next) => {
    try {
        const rating = Number(req.body.rating);
        const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
        const reviewTitle = typeof req.body.review_title === "string" ? req.body.review_title.trim() : "";
        const nickname = typeof req.body.nickname === "string" ? req.body.nickname.trim() : "";
        const review = typeof req.body.review === "string" ? req.body.review.trim() : "";

        if (
            !/^\d+$/.test(req.params.productId) ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5 ||
            !validator.isEmail(email) ||
            email.length > 255 ||
            reviewTitle.length > 255 ||
            !nickname ||
            nickname.length > 100 ||
            review.length > 5000
        ) {
            return res.status(400).json({ success: false, message: "Please provide a valid rating and complete all review fields." });
        }

        if (!(await Review.productExists(req.params.productId))) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        const result = await Review.save(req.params.productId, {
            rating,
            email,
            reviewTitle,
            nickname,
            review
        });

        res.status(result.created ? 201 : 200).json({
            success: true,
            message: result.created ? "Review submitted successfully!" : "Review updated successfully!"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;