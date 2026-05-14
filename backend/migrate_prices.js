const mongoose = require('mongoose');
require('dotenv').config();

const PricingPageContent = require('./schema/pricingPageContent');

async function updatePrices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/my-life-website");
        console.log("Connected to MongoDB");
        
        const content = await PricingPageContent.findOne();
        if (content) {
            // Basic Plans
            if (content.basicPlans) {
                content.basicPlans.forEach(p => {
                    if (!p.price.includes('-')) {
                        p.price = `${p.price} - ₹${parseInt(p.price.replace(/[^\d]/g, '')) + 2000}`;
                    }
                });
            }
            
            // Standard Solutions
            if (content.standardSolutions) {
                content.standardSolutions.forEach(p => {
                    if (!p.price.includes('-')) {
                        p.price = `${p.price} - ₹${parseInt(p.price.replace(/[^\d]/g, '')) + 5000}`;
                    }
                });
            }

            // Enterprise Systems
            if (content.enterpriseSystems) {
                content.enterpriseSystems.forEach(p => {
                    if (!p.price.includes('-')) {
                        p.price = `${p.price} - ₹${parseInt(p.price.replace(/[^\d]/g, '')) + 10000}`;
                    }
                });
            }
            
            await content.save();
            console.log("Prices updated to ranges successfully");
        } else {
            console.log("No pricing content found");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

updatePrices();
