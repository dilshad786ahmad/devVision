const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
    icon: { type: String, default: "Layout" },
    title: { type: String, required: true },
    description: { type: String, required: true }
});

const whyWebsiteSchema = new mongoose.Schema({
    badgeText: { type: String, default: "Business Growth" },
    heading: { type: String, default: "Why a Website is Important for Your Business" },
    description: { type: String, default: "Nowadays, having a website gives a strong advantage to any business in the digital world." },
    points: [pointSchema]
}, { timestamps: true });

module.exports = mongoose.model("WhyWebsite", whyWebsiteSchema);
