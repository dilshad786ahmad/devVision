const express = require("express");
const router = express.Router();
const { getAllLegalPages, getLegalBySlug, updateLegalContent } = require("../controllers/legalController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

// Public Routes
router.get("/", getAllLegalPages);
router.get("/:slug", getLegalBySlug);

// Admin Routes
router.put("/:slug", isAuthenticated, isAdmin, updateLegalContent);

module.exports = router;
