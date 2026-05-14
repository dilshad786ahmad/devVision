const mongoose = require("mongoose");

const skillItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String, default: "Code" }
});

const skillCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    skills: [skillItemSchema]
});

const skillsPageContentSchema = new mongoose.Schema({
    header: {
        badgeText: { type: String, default: "Capabilities" },
        title: { type: String, default: "Expertise Roadmap" },
        description: { type: String, required: true }
    },
    categories: [skillCategorySchema],
    bestCombo: {
        title: { type: String, default: "🔥 Best Combo for 2026" },
        description: { type: String },
        items: [{ type: String }]
    }
}, { timestamps: true });

const SkillsPageContent = mongoose.model("SkillsPageContent", skillsPageContentSchema);

module.exports = SkillsPageContent;
