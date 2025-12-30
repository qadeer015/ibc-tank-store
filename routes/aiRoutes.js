const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { isAuthenticated, isAdmin } = require("../middlewares/authenticate");

router.use(isAuthenticated);
router.use(isAdmin);

// POST /api/ai/gemini
router.post("/gemini",  aiController.gemini);

module.exports = router;
