const SkillsPageContent = require("../schema/skillsPageContent");

// Get Skills
exports.getSkillsPageContent = async (req, res) => {
    try {
        let content = await SkillsPageContent.findOne();
        if (!content) {
            content = await SkillsPageContent.create({
                header: {
                    description: "The 2026 Full Stack + AI Developer Roadmap. A comprehensive guide to modern development."
                },
                categories: [
                    {
                        title: "CORE MERN STACK",
                        description: "Foundational technologies for modern web apps.",
                        skills: [
                            { name: "MongoDB", description: "NoSQL database for scalable app data storage.", icon: "Database" },
                            { name: "Express.js", description: "Backend framework for APIs and server logic.", icon: "Server" },
                            { name: "React.js", description: "Frontend library for modern interactive UI.", icon: "Layout" },
                            { name: "Node.js", description: "JavaScript runtime for backend development.", icon: "Cpu" }
                        ]
                    }
                ],
                bestCombo: {
                    items: ["MERN", "TypeScript", "PostgreSQL", "Next.js", "AI Integration", "Docker", "AWS"]
                }
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Header
exports.updateSkillsHeader = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { header: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Categories
exports.updateSkillsCategories = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { categories: req.body.categories }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Best Combo
exports.updateBestCombo = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { bestCombo: req.body.bestCombo }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
