const mongoose = require('mongoose');
require('dotenv').config();

const PricingPageContent = require('./schema/pricingPageContent');

async function checkPrices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/my-life-website");
        console.log("Connected to MongoDB");
        
        const content = await PricingPageContent.findOne();
        if (content) {
            console.log("Current Prices:");
            content.basicPlans.forEach(p => console.log(`Basic: ${p.title} - ${p.price}`));
            content.standardSolutions.forEach(p => console.log(`Standard: ${p.title} - ${p.price}`));
            content.enterpriseSystems.forEach(p => console.log(`Enterprise: ${sys.title} - ${sys.price}`));
        } else {
            console.log("No pricing content found");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkPrices();
