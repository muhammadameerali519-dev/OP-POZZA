import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or is the default placeholder.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Pizza Menu data context for AI Chatbot to understand what it can answer
const MENU_CONTEXT = `
You are the AI Pizza Assistant for "ITALY PIZZA", a premium luxury pizza restaurant located in Model Town, Gujranwala.
Available contact details: Phone/WhatsApp: +92 321 6118080.
Opening Hours: 12:00 PM to 12:30 AM everyday.
Delivery details: Home Delivery is available in Model Town and surroundings. Minimum order: Rs. 1000. Delivery charges: Rs. 150.
Tone: Warm, human, polite, enthusiastic, food-loving, premium, and professional. Use emojis like 🍕, 🍔, 🍟, ✨ appropriately.

MENU DIRECTORY:
1. NEW SPECIAL FLAVOURS:
   - Double Cheese Pizza (Rs. 600 Regular, 1050 Medium, 1500 Large, 2000 Family) - Overloaded with premium mozzarella and special marinara.
   - Malai Booti Pizza (Rs. 650 Regular, 1150 Medium, 1600 Large, 2100 Family) - Creamy local Malai boti chicken chunk toppings, green chilies, onions.
   - Chicken Lovers Pizza (Rs. 650 Regular, 1150 Medium, 1600 Large, 2150 Family) - BBQ chicken, smoked premium chicken nuggets, chicken sausages, and olives.
   - Italy Special Pizza (Rs. 700 Regular, 1250 Medium, 1750 Large, 2250 Family) - Special chef secrets, mixed meats, mushrooms, capsicum, olives, sweet corn.
   - Chicken Achar Pizza (Rs. 600 Regular, 1050 Medium, 1500 Large, 2000 Family) - Spicy pickled chicken chunks with traditional achari flavor.
   - Chicken Supreme Pizza (Rs. 650 Regular, 1150 Medium, 1600 Large, 2150 Family) - Onion, bell peppers, olives, premium chicken tikka & fajita meats, mozzarella.
   - Kabab Crust Pizza (Rs. 750 Regular, 1300 Medium, 1800 Large, 2300 Family) - Hand-crafted outer crust loaded with juicy chicken seekh kababs.
   - Mushroom Pizza (Rs. 600 Regular, 1050 Medium, 1500 Large, 2000 Family) - Sautéed mushrooms, double cheese, and premium Italian herbs.
   - Creamy Special Pizza (Rs. 650 Regular, 1150 Medium, 1600 Large, 2150 Family) - White sauce base, creamy chicken cubes, onions, mild spice.
   - Cheese Stick (Rs. 450) - Warm breadsticks filled with premium melted mozzarella and garlic butter.

2. CLASSIC PIZZAS (Sizes: Regular (approx Rs. 550), Medium (Rs. 950), Large (Rs. 1350), Family (Rs. 1800)):
   - Chicken Tikka BBQ - Charred chicken tikka chunks with smoky BBQ drizzle.
   - Chicken Fajita - Mildly spiced Mexican style chicken with onion & capsicum.
   - Tandoori Pizza - Smoked tandoori chicken chunks, onions, rich tomato base.
   - Hot-N-Spicy - Spicy chicken, jalapenos, chili flakes, red onions, hot sauce.
   - Vegetarian Pizza - Sweet corn, capsicum, mushrooms, onions, black olives.
   - Cheese Gold Pizza - Triple loaded mozzarella cheese with golden crust brush.

3. BUY 1 GET 1 FREE DEALS (Amazing high value promo):
   - Deal 1: Regular Pizza + Regular Pizza Free (Rs. 799)
   - Deal 2: Medium Pizza + Medium Pizza Free (Rs. 1399)
   - Deal 3: Large Pizza + Large Pizza Free (Rs. 1899)
   - Deal 4: Regular Pizza + Chicken Burger + 1 Drink (Rs. 899)
   - Deal 5: Medium Pizza + Medium Pizza Free + 1.5L Drink (Rs. 1599)
   - Deal 6: Family Pizza + Family Pizza Free + 1.5L Drink (Rs. 2599)
   - Deal 7: 1 Zinger Burger + 1 Chicken Paratha Wrap (Rs. 590)
   - Deal 8: 2 Zinger Burgers + 1 Medium Fries + 2 Drinks (Rs. 950)
   - Deal 9: 2 Chicken Cheese Burgers + 1 Medium Fries (Rs. 850)
   - Deal 10: 1 Large Pizza + 1 Medium Pizza Free (Rs. 1650)
   - Deal 11: 3 Zinger Burgers (Buy 2 Get 1 Free Promo - Rs. 990)
   - Deal 12: 1 Chicken Paratha Paratha + 1 Zinger Paratha Paratha (Rs. 550)
   - Deal 13: 1 Zinger Cheese Burger + 1 Regular Fries (Rs. 520)

4. SPECIAL DEALS:
   - Deal 11: Zinger Burger + Chicken Wrap + Regular Fries + Drink (Rs. 699)
   - Deal 12: 2 Medium Pizzas + 5 Hot Wings + 1.5L Pepsi (Rs. 1950)
   - Deal 13: 1 Large Pizza + 1 Small Pizza + 1 Medium Fries + 1.5L Drink (Rs. 2199)
   - Deal 14: 2 Large Pizzas + 10 Nuggets + 1.5L Pepsi (Rs. 3200)
   - Deal 15: Mega Crowd Deal: 3 Medium Pizzas + 10 Hot Shots + 1.5L Drink (Rs. 3500)

5. TRIPLE PIZZA OFFERS (3 Pizzas combined for groups):
   - Super Deal 1 (Rs. 1490) - 3 Regular Pizzas of any flavour!
   - Super Deal 2 (Rs. 2590) - 3 Medium Pizzas of any flavour!
   - Super Deal 3 (Rs. 3590) - 3 Large Pizzas of any flavour!
   - Super Deal 4 (Rs. 4990) - 3 Family Pizzas of any flavour!

6. BURGER & WRAPS:
   - Chicken Burger (Rs. 320)
   - Chicken Cheese Burger (Rs. 380)
   - Zinger Burger (Rs. 450)
   - Zinger Cheese Burger (Rs. 500)
   - Zinger Paratha (Rs. 350)
   - Chicken Paratha (Rs. 300)
   - Chicken Cheese Paratha (Rs. 360)
   - Chicken Shawarma (Rs. 220)
   - Chicken Cheese Shawarma (Rs. 280)

7. SIDE ORDERS:
   - Full Fried Chicken (Rs. 1400)
   - Half Fried Chicken (Rs. 750)
   - Fried Chicken Piece (1 Pc - Rs. 180)
   - Hot Wings (6 Pcs - Rs. 350, 10 Pcs - Rs. 550)
   - Hot Shots (10 Pcs - Rs. 350)
   - Nuggets (6 Pcs - Rs. 320, 10 Pcs - Rs. 500)
   - Medium Fries (Rs. 250)
   - Large Fries (Rs. 380)

8. BIRTHDAY DEAL:
   - Buy 3 Large Pizzas Get 3 Large Pizzas FREE! Includes: 2-Pound Cake Free, 1.5 Liter Drink Free, and FREE Dining Hall Charges! All of this for only Rs. 9500/-.

Instructions for chat interactions:
- If a customer is asking for recommendation, offer them deals or top flavors like Malai Booti Pizza or Kabab Crust!
- Answer directly and kindly. Maintain our luxury restaurant persona. Use short digestible paragraphs. Keep responses concise so they fit well in the floating chat window.
`;

// API Endpoint for Chatbot
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Attempt to call Gemini API
    try {
      const ai = getGeminiClient();
      
      // Structure systemInstruction which tells the model about Italy Pizza context
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${MENU_CONTEXT}\n\nReview the chat history and answer the user's latest message.\nLatest message: ${message}` }] }
        ],
        config: {
          temperature: 0.7,
        }
      });

      const reply = response.text || "I'm having a small slice of trouble reading that. Could you please specify how I can assist you with Italy Pizza?";
      return res.json({ reply });
    } catch (sdkError: any) {
      console.warn("Gemini SDK error, falling back to rule-based response. Error:", sdkError.message);
      
      // Intelligent rule-based fallback response for preview environment when API keys aren't set
      const lowerMessage = message.toLowerCase();
      let reply = "Welcome to Italy Pizza 🍕! Let me assist you. ";

      if (lowerMessage.includes("pizza") || lowerMessage.includes("flavour") || lowerMessage.includes("flavor")) {
        reply += "Our top recommendations are the cream-loaded **Malai Booti Pizza** 🍗, our signature **Italy Special Pizza** 🍕, and the cheese-flowing **Kabab Crust Pizza**! Which size would you like to explore (Regular, Medium, Large, or Family)?";
      } else if (lowerMessage.includes("deal") || lowerMessage.includes("offer") || lowerMessage.includes("buy 1")) {
        reply += "You will love our **Buy 1 Get 1 Free Deals**! For instance, Deal 3 gets you 2 Large Pizzas for just *Rs. 1899*. Or look at our **Triple Pizza Offer** (Super Deal 3): 3 Large Pizzas for *Rs. 3590*!";
      } else if (lowerMessage.includes("burger") || lowerMessage.includes("wrap")) {
        reply += "We serve crispy **Zinger Burgers** (Rs. 450), **Zinger Cheese Burgers** (Rs. 500) and premium Wraps like the **Zinger Paratha** (Rs. 350) and **Chicken Cheese Shawarma** (Rs. 280). Real comfort food!";
      } else if (lowerMessage.includes("birthday")) {
        reply += "🎉 Our **Birthday Deal** is incredible! Buy 3 Large Pizzas and get 3 Large Pizzas FREE, plus a FREE 2-Pound Cake, a FREE 1.5L Drink and Free Dining Hall Charges. All for only *Rs. 9500*!";
      } else if (lowerMessage.includes("where") || lowerMessage.includes("location") || lowerMessage.includes("map") || lowerMessage.includes("address")) {
        reply += "We are located at **Model Town, Gujranwala**. You can view our location on the map at the bottom of our page or click 'Get Directions' to find us instantly!";
      } else if (lowerMessage.includes("order") || lowerMessage.includes("buy") || lowerMessage.includes("cart")) {
        reply += "You can add your favourite items directly to your cart right here on the website! Once you're ready, click checkout and we'll route you right to WhatsApp (+92 321 6118080) to complete your order automatically!";
      } else if (lowerMessage.includes("contact") || lowerMessage.includes("number") || lowerMessage.includes("whatsapp")) {
        reply += "You can reach us directly on WhatsApp/Phone at **+92 321 6118080**. For complaints, our Customer Care is active on the same number! 📞";
      } else {
        reply += "We are delighted to serve you premium taste crafted with love. What can I get for you today? We have Pizzas, Burgers, Wraps, Deals, and Crispy Sides! 🇮🇹🍕";
      }
      
      return res.json({ reply });
    }
  } catch (err: any) {
    console.error("General API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite middlewares
    app.use(vite.middlewares);
  } else {
    // Service static files from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Italy Pizza Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
