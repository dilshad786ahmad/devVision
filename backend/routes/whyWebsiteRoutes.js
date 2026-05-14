const express = require("express");
const router = express.Router();
const whyWebsiteController = require("../controllers/whyWebsiteController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

// Public route to get content
router.get("/", whyWebsiteController.getWhyWebsiteContent);

// Admin route to update content
router.put("/", isAuthenticated, isAdmin, whyWebsiteController.updateWhyWebsiteContent);

module.exports = router;
