const Legal = require("../schema/legalSchema");

// Seed default legal content if they don't exist
const seedDefaults = async (slug) => {
    let content = await Legal.findOne({ slug });
    if (!content) {
        if (slug === "privacy-policy") {
            content = await Legal.create({
                slug: "privacy-policy",
                title: "Privacy Policy",
                content: `<h1>Privacy Policy</h1><p>Your privacy is important. This policy explains how I handle your data as a freelance developer.</p><h2>1. Data Collection</h2><p>I only collect data necessary to provide services, such as your name and email for communication.</p><h2>2. Data Usage</h2><p>Your data is used solely for project collaboration and is never shared with third parties without consent.</p>`
            });
        } else if (slug === "terms-of-service") {
            content = await Legal.create({
                slug: "terms-of-service",
                title: "Terms of Service",
                content: `<h1>Terms of Service</h1><p>These terms govern my freelance services.</p><h2>1. Project Scope</h2><p>Deliverables and timelines are defined in the project proposal.</p><h2>2. Payments</h2><p>Payments are made as per the agreed milestones.</p>`
            });
        } else if (slug === "security") {
            content = await Legal.create({
                slug: "security",
                title: "Security",
                content: `<h1>Security Policy</h1><p>I follow industry best practices to ensure your code and data are secure.</p><h2>1. Secure Coding</h2><p>I implement security measures like encryption and sanitization in every project.</p><h2>2. Access Control</h2><p>Access to client repositories is strictly limited and handled via secure authentication.</p>`
            });
        } else if (slug === "cookie-settings") {
            content = await Legal.create({
                slug: "cookie-settings",
                title: "Cookie Settings",
                content: `<h1>Cookie Policy</h1><p>This site uses minimal cookies for essential functionality.</p>`
            });
        }
    }
    return content;
};

// Public: Get all legal pages titles and slugs
exports.getAllLegalPages = async (req, res) => {
    try {
        const pages = await Legal.find({}, "title slug lastUpdated");
        res.status(200).json({ success: true, data: pages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Public: Get legal content by slug
exports.getLegalBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let content = await seedDefaults(slug);
        
        if (!content) {
            return res.status(404).json({ success: false, message: "Legal page not found." });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Admin: Update legal content
exports.updateLegalContent = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;
        
        const updated = await Legal.findOneAndUpdate(
            { slug },
            { title, content, lastUpdated: Date.now() },
            { new: true, upsert: true }
        );
        
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
