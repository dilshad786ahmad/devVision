const WhyWebsite = require("../schema/whyWebsiteSchema");

// Get Why Website Content
exports.getWhyWebsiteContent = async (req, res) => {
    try {
        let content = await WhyWebsite.findOne();
        if (!content) {
            // Create default content if none exists
            content = await WhyWebsite.create({
                badgeText: "Business Growth",
                heading: "Why a Website is Important for Your Business",
                description: "Nowadays, having a website gives a strong advantage to any business in the digital world.",
                points: [
                    { icon: "Globe", title: "Online Presence", description: "Your business will appear online, helping more people discover your services." },
                    { icon: "Users", title: "More Customers & Reach", description: "People can easily learn about your services and contact you anytime." },
                    { icon: "Clock", title: "24/7 Information Access", description: "Customers can check your details, services, pricing, and updates anytime." },
                    { icon: "Award", title: "Professional Brand Image", description: "A website makes your business look more professional, modern, and trustworthy." },
                    { icon: "Zap", title: "Easy Updates & Announcements", description: "You can quickly update new services, offers, announcements, or information." },
                    { icon: "Coffee", title: "Time Saving", description: "Customers can get all important information directly from the website without calling repeatedly." },
                    { icon: "BarChart", title: "Better Marketing Opportunity", description: "A website helps in digital marketing, social media promotion, and Google visibility." },
                    { icon: "TrendingUp", title: "Future Business Growth", description: "In the future, you can easily add advanced features like online booking, payments, dashboards, or management systems." }
                ]
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        console.error("Error fetching WhyWebsite content:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Why Website Content (Admin only)
exports.updateWhyWebsiteContent = async (req, res) => {
    try {
        const { badgeText, heading, description, points } = req.body;
        const content = await WhyWebsite.findOneAndUpdate(
            {}, 
            { badgeText, heading, description, points }, 
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        console.error("Error updating WhyWebsite content:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
