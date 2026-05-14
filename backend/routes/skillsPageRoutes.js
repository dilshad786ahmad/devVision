const express = require("express");
const router = express.Router();
const { 
    getSkillsPageContent, 
    updateSkillsHeader, 
    updateSkillsCategories, 
    updateBestCombo 
} = require("../controllers/skillsPageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", getSkillsPageContent);
router.put("/header", isAuthenticated, isAdmin, updateSkillsHeader);
router.put("/categories", isAuthenticated, isAdmin, updateSkillsCategories);
router.put("/best-combo", isAuthenticated, isAdmin, updateBestCombo);

module.exports = router;
