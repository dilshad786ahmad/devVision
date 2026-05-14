const HomePageContent = require("../schema/homePageContent");

// Get Home Page Content
exports.getHomePageContent = async (req, res) => {
    try {
        let content = await HomePageContent.findOne();
        if (!content) {
            content = await HomePageContent.create({
                hero: {
                    heading: "Shaping the future of digital infrastructure.",
                    subheading: "ModernCorp delivers high-stakes corporate solutions prioritizing clarity, authority, and precision.",
                    images: [],
                    mainImage: "",
                    cardImages: []
                },
                introCards: [
                    { title: "Cloud Infrastructure", description: "Scalable and resilient cloud architectures.", icon: "Cloud" },
                    { title: "Network Security", description: "Advanced threat protection.", icon: "Lock" },
                    { title: "Data Analytics", description: "Actionable insights.", icon: "BarChart3" }
                ]
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Hero
exports.updateHomeHero = async (req, res) => {
    try {
        const content = await HomePageContent.findOneAndUpdate({}, { hero: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Cards
exports.updateHomeCards = async (req, res) => {
    try {
        const content = await HomePageContent.findOneAndUpdate({}, { introCards: req.body.cards }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Update Social Links
exports.updateSocialLinks = async (req, res) => {
    try {
        const content = await HomePageContent.findOneAndUpdate({}, { socialLinks: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Image Upload
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        
        // If it's Cloudinary, req.file.path will be a URL starting with http
        // If it's local, req.file.path will be an absolute system path, so we use filename
        const imageUrl = req.file.path.startsWith('http') 
            ? req.file.path 
            : `/uploads/${req.file.filename}`;
            
        res.status(200).json({ success: true, url: imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
