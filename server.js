const express = require('express');
const cors = require('cors');
// const { GoogleGenerativeAI } = require('@google/generative-ai'); // Commented out for rule-based estimator

// 🚨🚨🚨 YOUR GEMINI API KEY IS STILL HERE, BUT NOT USED FOR ESTIMATOR IN THIS VERSION 🚨🚨🚨
// It's kept for when you're ready to switch back to the LLM-based estimator (Phase 2).
const GEMINI_API_KEY = "AIzaSyDsupKwCOesYkEZ5iqv9iacGRSUwTlHZ84"; 

const app = express();
const port = 3000;

// Enable CORS for all origins, allowing your HTML file to communicate with this server
app.use(cors());
// Parse JSON bodies from incoming requests
app.use(express.json());

// ⚠️ Gemini AI initialization is commented out for the rule-based estimator
// let genAI;
// let model;
// if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10 && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
//     try {
//         genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//         model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//         console.log("✅ Gemini AI model initialized successfully (but not used for estimator in this version).");
//     } catch (e) {
//         console.error("❌ Failed to initialize Gemini AI model. Please check your API key in server.js:", e);
//         model = null;
//     }
// } else {
//     console.warn("⚠️ Gemini API key is missing or is the default placeholder in server.js. LLM estimator will not function if enabled.");
//     model = null;
// }


// --- Rule-Based Estimator Logic ---
function formatCurrency(amount) {
    if (typeof amount !== 'number') return amount; // Return as-is if not a number
    return `$${amount.toLocaleString('en-US')}`;
}

function handleRuleBasedEstimation(userText) {
    const lowerText = userText.toLowerCase();
    let baseCost = 0;
    let features = [];
    let response = "";

    // Base Website Types
    if (lowerText.includes("one-page") || lowerText.includes("simple website") || lowerText.includes("portfolio") || lowerText.includes("basic site") || lowerText.includes("personal site")) {
        baseCost = 500;
        features.push("One-Page Website");
    } else if (lowerText.includes("multi-page") || lowerText.includes("small business website") || lowerText.includes("up to 5 pages") || lowerText.includes("company site")) {
        baseCost = 1500;
        features.push("Multi-Page Website (up to 5 pages)");
    } else if (lowerText.includes("e-commerce") || lowerText.includes("online store") || lowerText.includes("shop") || lowerText.includes("selling products")) {
        baseCost = 3500; // Base e-commerce
        features.push("E-commerce Store");
        // These are typically included in base e-commerce cost or are highly variable
        // if (lowerText.includes("inventory management")) features.push("Inventory Management (can be additional)");
        // if (lowerText.includes("payment gateway")) features.push("Payment Gateway Integration (can be additional)");
    } else {
        return "I need a bit more detail to give you an estimate. Could you tell me if you're looking for a simple one-page site, a multi-page business website, or an e-commerce store?";
    }

    // Add-on Features
    if (lowerText.includes("blog") || lowerText.includes("articles") || lowerText.includes("news section")) {
        baseCost += 300;
        features.push("Integrated Blog");
    }
    if (lowerText.includes("contact form") || lowerText.includes("inquiry form") || lowerText.includes("get in touch form")) {
        baseCost += 150;
        features.push("Custom Contact Form");
    }
    if (lowerText.includes("advanced seo") || lowerText.includes("deep seo") || lowerText.includes("comprehensive seo")) {
        baseCost += 500;
        features.push("Advanced SEO & Keyword Research");
    } else if (lowerText.includes("seo") || lowerText.includes("search engine optimization") || lowerText.includes("ranking")) {
        baseCost += 200;
        features.push("Basic SEO Optimization");
    }
    if (lowerText.includes("google analytics")) {
        baseCost += 100;
        features.push("Google Analytics Setup");
    }
    if (lowerText.includes("custom animations") || lowerText.includes("interactive elements") || lowerText.includes("dynamic effects")) {
        baseCost += 350; // Average cost for custom animation
        features.push("Custom Animations (estimated)");
    }
    if (lowerText.includes("ui design") || lowerText.includes("ux design") || lowerText.includes("user interface") || lowerText.includes("user experience") || lowerText.includes("wireframes") || lowerText.includes("mockups")) {
        baseCost += 1000; // Base UI/UX standalone
        features.push("UI/UX Design (standalone)");
    }
    if (lowerText.includes("branding package") || lowerText.includes("logo design") || lowerText.includes("brand identity") || lowerText.includes("color palette") || lowerText.includes("style guide")) {
        baseCost += 800;
        features.push("Full Branding Package");
    }
    if (lowerText.includes("social media integration") || lowerText.includes("social links") || lowerText.includes("share buttons")) {
        baseCost += 100;
        features.push("Social Media Integration");
    }
    if (lowerText.includes("crm integration") || lowerText.includes("customer relationship management")) {
        baseCost += 600; // Average for CRM
        features.push("CRM Integration (estimated)");
    }
    if (lowerText.includes("cms setup") || lowerText.includes("content management system") || lowerText.includes("wordpress") || lowerText.includes("headless cms")) {
        baseCost += 700;
        features.push("Content Management System (CMS) Setup");
    }
    if (lowerText.includes("database integration") || lowerText.includes("custom database") || lowerText.includes("user profiles") || lowerText.includes("data storage")) {
        baseCost += 450; // Average for database
        features.push("Database Integration (estimated)");
    }

    let monthlyCost = 0;
    if (lowerText.includes("ongoing maintenance") || lowerText.includes("monthly support") || lowerText.includes("website updates")) {
        if (lowerText.includes("premium maintenance") || lowerText.includes("advanced support") || lowerText.includes("proactive monitoring")) {
            monthlyCost = 200;
            features.push("Ongoing Maintenance & Support (Premium - monthly)");
        } else {
            monthlyCost = 75;
            features.push("Ongoing Maintenance & Support (Basic - monthly)");
        }
    }
    
    // Constructing the response
    if (features.length === 0) {
        return "I need a bit more detail to give you an estimate. Could you tell me if you're looking for a simple one-page site, a multi-page business website, or an e-commerce store? Also, mention any specific features like a blog or contact form.";
    }

    response = `Alright! Based on your request, here's an estimated breakdown:`;
    response += `\n\n**Included Features:**\n- ${features.join('\n- ')}`;
    response += `\n\n**Estimated Upfront Cost:** **${formatCurrency(baseCost)}**`;
    
    if (monthlyCost > 0) {
        response += `\n**Estimated Monthly Maintenance:** **${formatCurrency(monthlyCost)} per month**`;
    }
    response += `\n\nPlease note, this is an estimate and final pricing depends on detailed requirements discussed in a consultation.`;

    return response;
}

// Handle POST requests to the /api/estimator endpoint
app.post('/api/estimator', async (req, res) => {
    try {
        const { chatHistory } = req.body;
        
        // --- Enhanced Validation ---
        if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
            console.error("❌ Estimator Error: Received invalid or empty chatHistory. Request Body:", req.body);
            return res.status(400).json({ text: "I couldn't understand your request. Please try typing something like 'I need a simple website' or 'How much for an e-commerce store?'" });
        }

        const lastUserMessage = chatHistory[chatHistory.length - 1];
        
        if (!lastUserMessage || !lastUserMessage.parts || !Array.isArray(lastUserMessage.parts) || lastUserMessage.parts.length === 0 || !lastUserMessage.parts[0].text) {
            console.error("❌ Estimator Error: Last user message is malformed. Last message object:", lastUserMessage);
            return res.status(400).json({ text: "Your message format was unexpected. Please try typing your request directly." });
        }

        const userText = lastUserMessage.parts[0].text;
        console.log(`➡️ Received user query for estimator: "${userText}"`);

        const aiResponseText = handleRuleBasedEstimation(userText);
        console.log(`⬅️ Sending estimator response: "${aiResponseText}"`);
        
        // Send the AI's response back to the client
        res.json({ text: aiResponseText });

    } catch (error) {
        // This catch block now explicitly logs the full error object for better debugging
        console.error("❌ Uncaught Error in Rule-Based Estimator route (server.js):", error); 
        res.status(500).json({ text: "An unexpected error occurred with the estimator on our server. Please try again or contact support." });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Rule-Based Estimator is active. External Gemini API calls are currently bypassed.`);
});
