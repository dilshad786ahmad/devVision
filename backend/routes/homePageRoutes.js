const express = require("express");
const router = express.Router();
const { getHomePageContent, updateHomeHero, updateHomeCards, uploadImage, updateSocialLinks } = require("../controllers/homePageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getHomePageContent);
router.post("/upload", isAuthenticated, isAdmin, upload.single("image"), uploadImage);
router.put("/hero", isAuthenticated, isAdmin, updateHomeHero);
router.put("/cards", isAuthenticated, isAdmin, updateHomeCards);
router.put("/social", isAuthenticated, isAdmin, require("../controllers/homePageController").updateSocialLinks);

module.exports = router;
