const mongoose = require('mongoose');
require('dotenv').config();
const PricingPageContent = require('./schema/pricingPageContent');

const MONGO_URI = process.env.MONGODB_URI;

const basicPlans = [
    {
        title: "Basic Landing Option 1",
        price: "₹5,000",
        suffix: "/project",
        desc: "Ideal for personal libraries or small individual collections.",
        features: ["Single Page Website", "Home Section", "About Library Section", "Contact Information", "Mobile Friendly Design", "Basic UI Design", "WhatsApp Contact Button", "Social Media Links"],
        highlight: false
    },
    {
        title: "Basic Landing Option 2",
        price: "₹7,000",
        suffix: "/project",
        desc: "Enhanced experience with responsive design and map integration.",
        features: ["Better UI/UX Design", "Fully Responsive Website", "Contact Form", "Image Gallery Section", "Google Map Integration", "Fast Loading Pages", "Basic Animations", "Custom Color Theme"],
        highlight: true
    },
    {
        title: "Basic Landing Option 3",
        price: "₹9,000",
        suffix: "/project",
        desc: "Premium single-page solution with speed and SEO optimization.",
        features: ["Premium Modern Design", "SEO Friendly Structure", "Advanced Animations", "Speed Optimization", "Testimonials Section", "FAQ Section", "Custom Banner Design", "Free Basic Maintenance Support"],
        highlight: false
    }
];

const standardSolutions = [
    {
        title: "Standard Website Option 1",
        price: "₹12,000",
        desc: "Multi-page website for growing library collections.",
        img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
        features: ["4–5 Website Pages", "Home, About, Books & Contact Pages", "Responsive Design", "Contact Form", "Gallery Section", "Google Map Integration", "Announcement Section", "Social Media Integration"]
    },
    {
        title: "Standard Website Option 2",
        price: "₹18,000",
        desc: "Dynamic system with cataloging and search functionality.",
        img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
        features: ["Book Catalog System", "Search Functionality", "Modern UI/UX Design", "Student Inquiry Form", "Dynamic Content Sections", "Blog/News Section", "SEO Optimization", "Speed Optimization"]
    },
    {
        title: "Standard Website Option 3",
        price: "₹25,000",
        desc: "Advanced management with dashboard and priority support.",
        img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop",
        features: ["Admin Update Support", "Advanced Website Design", "Custom Dashboard", "Dynamic Book Management", "Performance Optimization", "Enhanced Security Setup", "Email Integration", "Priority Support"]
    }
];

const enterpriseSystems = [
    {
        title: "Advanced Option 1",
        price: "₹30,000",
        desc: "Complete login system for students and library members.",
        icon: "Shield",
        features: ["User Login & Registration", "Book Listing System", "Student Dashboard", "Responsive Design", "Profile Management", "Search & Filter Options", "Notification System", "Secure Database Setup"],
        highlight: false
    },
    {
        title: "Advanced Option 2",
        price: "₹45,000",
        desc: "Full administrative control over book issuance and returns.",
        icon: "Rocket",
        features: ["Book Issue/Return Management", "Admin Panel", "User Management System", "Database Integration", "Fine/Payment Management", "Email Notifications", "Activity Tracking", "Multi-role Access"],
        highlight: true
    },
    {
        title: "Advanced Option 3",
        price: "₹60,000",
        desc: "Enterprise-grade library management with full analytics.",
        icon: "Zap",
        features: ["Full Library Management System", "Advanced Dashboard", "Reports & Analytics", "Multi-user Access", "Custom Feature Development", "Online Membership System", "Backup & Security Setup", "Premium Technical Support"],
        highlight: false
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing or update
        let content = await PricingPageContent.findOne();
        if (!content) {
            content = new PricingPageContent({
                header: {
                    title: "Library Management Solutions",
                    subtitle: "Choose the perfect digital infrastructure for your library or institution.",
                    highlightText: "Custom packages available for unique institutional needs."
                },
                basicPlans,
                standardSolutions,
                enterpriseSystems
            });
        } else {
            content.basicPlans = basicPlans;
            content.standardSolutions = standardSolutions;
            content.enterpriseSystems = enterpriseSystems;
        }

        await content.save();
        console.log("Pricing data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
