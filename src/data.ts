import { FoodItem, Testimonial } from "./types";

export const MENU_ITEMS: FoodItem[] = [
  // SECTION 1 – NEW SPECIAL FLAVOURS
  {
    id: "ns1",
    name: "Double Cheese Pizza",
    price: 600,
    description: "Rich premium crust loaded with extra mozzarella, homemade marinara, cooked to a perfect golden brown.",
    image: "/assets/images/double_cheese_pizza_1781663465004.jpg",
    category: "special",
    sizes: { Regular: 600, Medium: 1050, Large: 1500, Family: 2000 }
  },
  {
    id: "ns2",
    name: "Malai Booti Pizza",
    price: 650,
    description: "Creamy marinated chicken boneless malai booti, special white sauce, onions, jalapenos, and loaded cheese.",
    image: "/assets/images/malai_booti_pizza_1781663486651.jpg",
    badge: "Most Popular",
    category: "special",
    sizes: { Regular: 650, Medium: 1150, Large: 1600, Family: 2100 }
  },
  {
    id: "ns3",
    name: "Chicken Lovers Pizza",
    price: 650,
    description: "Smoked chicken strip slices, minced seekh kabab, fresh onions, black olives, bell peppers, mozzarella masterclass.",
    image: "/assets/images/chicken_lovers_pizza_1781663504841.jpg",
    category: "special",
    sizes: { Regular: 650, Medium: 1150, Large: 1600, Family: 2150 }
  },
  {
    id: "ns4",
    name: "Italy Special Pizza",
    price: 700,
    description: "Our signature luxury recipe made with sliced roasted mushroom, sweet corn cubes, olives, sausages and fresh bell pepper.",
    image: "/assets/images/italy_special_pizza_1781663520142.jpg",
    badge: "Chef's Signature",
    category: "special",
    sizes: { Regular: 700, Medium: 1250, Large: 1750, Family: 2250 }
  },
  {
    id: "ns5",
    name: "Chicken Achar Pizza",
    price: 600,
    description: "Tangy pickled chicken breast strips, pickle spice infusion, red onion flakes, and premium melted mozzarella.",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=600&auto=format&fit=crop",
    category: "special",
    sizes: { Regular: 600, Medium: 1050, Large: 1500, Family: 2000 }
  },
  {
    id: "ns6",
    name: "Chicken Supreme Pizza",
    price: 650,
    description: "Tender chicken tikka + chicken fajita meats, onions, capsicum, bell peppers, mushrooms and olives.",
    image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=600&auto=format&fit=crop",
    category: "special",
    sizes: { Regular: 650, Medium: 1150, Large: 1600, Family: 2150 }
  },
  {
    id: "ns7",
    name: "Kabab Crust Pizza",
    price: 750,
    description: "Symphony of flavors where the crust is uniquely folded with juicy chicken seekh kababs inside. Must try!",
    image: "/assets/images/kabab_crust_pizza_1781663542853.jpg",
    badge: "Unique",
    category: "special",
    sizes: { Regular: 750, Medium: 1300, Large: 1800, Family: 2300 }
  },
  {
    id: "ns8",
    name: "Mashroom Pizza",
    price: 600,
    description: "Tender local mushrooms sautéed in white truffle oil, luxury white base sauce, double mozzarella cheese toppings.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop",
    category: "special",
    sizes: { Regular: 600, Medium: 1050, Large: 1500, Family: 2000 }
  },
  {
    id: "ns9",
    name: "Creamy Special Pizza",
    price: 650,
    description: "Luscious heavy white cream, grilled soft chicken chunks, red sweet bell pepper slices, premium local spices.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    category: "special",
    sizes: { Regular: 650, Medium: 1150, Large: 1600, Family: 2150 }
  },
  {
    id: "ns10",
    name: "Cheese Stick",
    price: 450,
    description: "Freshly baked hot garlic sticks with melting local premium mozzarella-cheddar blend and rich garlic herb dip.",
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=600&auto=format&fit=crop",
    category: "special"
  },

  // SECTION 2 – CLASSIC PIZZAS
  {
    id: "cl1",
    name: "Chicken Tikka BBQ",
    price: 550,
    description: "Smoked local clay oven chicken tikka bites, crisp red onion layers, and a rich, sweet hickory BBQ drizzle.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    category: "classic",
    sizes: { Regular: 550, Medium: 950, Large: 1350, Family: 1800 }
  },
  {
    id: "cl2",
    name: "Chicken Fajita",
    price: 550,
    description: "Mexican style sizzling chicken breast fillets, colorful capsicums, red onion rings, and a hint of lime and spice.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop",
    category: "classic",
    sizes: { Regular: 550, Medium: 950, Large: 1350, Family: 1800 }
  },
  {
    id: "cl3",
    name: "Tandoori Pizza",
    price: 550,
    description: "Traditional spicy tandoori chicken shreds, local yogurt-herb drizzle, green coriander fields, sliced red onion.",
    image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=600&auto=format&fit=crop",
    category: "classic",
    sizes: { Regular: 550, Medium: 950, Large: 1350, Family: 1800 }
  },
  {
    id: "cl4",
    name: "Hot-N-Spicy",
    price: 550,
    description: "Fierce spicy red chicken pieces, fire-roasted jalapenos, organic green chilis, hot chili flakes, and hot dynamic sauce.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    category: "classic",
    sizes: { Regular: 550, Medium: 950, Large: 1350, Family: 1800 }
  },
  {
    id: "cl5",
    name: "Vegetarian Pizza",
    price: 550,
    description: "A garden freshness: juicy sweet sweetcorn, sweet garden bell peppers, sliced mushrooms, green peppers, black olives.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop",
    category: "classic",
    sizes: { Regular: 550, Medium: 950, Large: 1350, Family: 1800 }
  },
  {
    id: "cl6",
    name: "Cheese Gold Pizza",
    price: 550,
    description: "Extra layer of premium white mozzarella cheese with rich golden premium garlic spread inside the hand-made crust.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    category: "classic",
    sizes: { Regular: 550, Medium: 950, Large: 1350, Family: 1800 }
  },

  // SECTION 3 – BUY 1 GET 1 FREE DEALS
  {
    id: "d1",
    name: "Deal 1 (Buy 1 Get 1)",
    price: 799,
    description: "Buy 1 Regular Pizza of any style and get another Regular Pizza absolutely FREE! Perfect for date nights.",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop",
    badge: "Best Seller",
    category: "bogo"
  },
  {
    id: "d2",
    name: "Deal 2 (Buy 1 Get 1)",
    price: 1399,
    description: "Buy 1 Medium Pizza of any style and get another Medium Pizza absolutely FREE! Twice the delicious flavor.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop",
    badge: "Popular",
    category: "bogo"
  },
  {
    id: "d3",
    name: "Deal 3 (Buy 1 Get 1)",
    price: 1899,
    description: "Buy 1 Large Pizza of any style and get another Large Pizza absolutely FREE! Ultimate treat for small gatherings.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    badge: "Best Value",
    category: "bogo"
  },
  {
    id: "d4",
    name: "Deal 4 (Pizza & Burger)",
    price: 899,
    description: "1 Premium Regular Pizza, 1 Crispy Chicken Burger, and 1 Chilled soft drink can of your choice.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
    category: "bogo"
  },
  {
    id: "d5",
    name: "Deal 5 (Double Medium)",
    price: 1599,
    description: "Buy 1 Medium Pizza and get 1 Medium Pizza FREE with a massive 1.5 Liter cold refreshing soft drink.",
    image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=600&auto=format&fit=crop",
    badge: "Popular",
    category: "bogo"
  },
  {
    id: "d6",
    name: "Deal 6 (Double Family)",
    price: 2599,
    description: "Buy 1 Family Pizza and get 1 Family Pizza FREE + 1.5 Liter chilled soft drink. Big savings for big circles.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop",
    category: "bogo"
  },
  {
    id: "d7",
    name: "Deal 7 (Fast Food Combo)",
    price: 590,
    description: "1 Spicy Zinger Burger + 1 Soft Chicken Paratha Roll wrap. A delicious street snack blend.",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop",
    category: "bogo"
  },
  {
    id: "d8",
    name: "Deal 8 (Zinger Party)",
    price: 950,
    description: "2 Crunchy Zinger Burgers + 1 Medium crispy fries box + 2 chilled soft drink cans.",
    image: "/assets/images/zinger_burger_1781663562088.jpg",
    badge: "Limited Time",
    category: "bogo"
  },
  {
    id: "d9",
    name: "Deal 9 (Double Burger)",
    price: 850,
    description: "2 Premium Chicken Cheese Burgers with melt-in-your-mouth cheese + 1 Golden Medium French fries.",
    image: "https://images.unsplash.com/photo-1481070414801-51fd732d7484?q=80&w=600&auto=format&fit=crop",
    category: "bogo"
  },
  {
    id: "d10",
    name: "Deal 10 (Large + Medium)",
    price: 1650,
    description: "1 Huge Large Pizza + 1 Medium Pizza absolutely FREE! Ultimate variety dinner combo.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop",
    category: "bogo"
  },
  {
    id: "d11",
    name: "Deal 11 (3 Zingers Promo)",
    price: 990,
    description: "Buy 2 Crispy Zinger Burgers and get 1 Crispy Zinger Burger absolutely FREE! (Total 3 Zingers)",
    image: "/assets/images/zinger_burger_1781663562088.jpg",
    badge: "Best Seller",
    category: "bogo"
  },
  {
    id: "d12",
    name: "Deal 12 (Paratha Double)",
    price: 550,
    description: "1 Premium Chicken Paratha + 1 Crispy Golden Zinger Paratha Roll wrap. Spicy local fillings.",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop",
    category: "bogo"
  },
  {
    id: "d13",
    name: "Deal 13 (Zinger Cheese Meal)",
    price: 520,
    description: "1 Spicy Zinger Cheese Burger + 1 hot Crispy Regular French Fries box.",
    image: "/assets/images/zinger_burger_1781663562088.jpg",
    category: "bogo"
  },

  // SECTION 4 – SPECIAL DEALS (Promo count-downs)
  {
    id: "sd11",
    name: "Special Deal 11",
    price: 699,
    description: "1 Golden Zinger Burger + 1 Chicken Paratha Wrap + 1 Crispy French Fries + 1 Chilled Can.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    category: "special-deal",
    badge: "Save 30%"
  },
  {
    id: "sd12",
    name: "Special Deal 12",
    price: 1950,
    description: "2 Premium Medium Pizzas of your choice + 5 Hot Crispy chicken wings + 1.5 Liter cold Drink.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop",
    category: "special-deal",
    badge: "Crowd Favorite"
  },
  {
    id: "sd13",
    name: "Special Deal 13",
    price: 2199,
    description: "1 Massive Large Pizza + 1 Fresh Small Pizza + 1 Hot Medium Fries + 1.5 Liter chilled drink.",
    image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=600&auto=format&fit=crop",
    category: "special-deal",
    badge: "Value Pack"
  },
  {
    id: "sd14",
    name: "Special Deal 14",
    price: 3200,
    description: "2 Gigantic Large Pizzas of any flavour + 10 Golden Chicken Nuggets + 1.5L cold Pepsi.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop",
    category: "special-deal",
    badge: "Big Feast"
  },
  {
    id: "sd15",
    name: "Special Deal 15",
    price: 3500,
    description: "Mega Crowd Delight: 3 fresh Medium Pizzas + 10 Crispy hot shots + 1.5 Liter drink.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    category: "special-deal",
    badge: "Blockbuster"
  },

  // SECTION 5 – TRIPLE PIZZA OFFERS
  {
    id: "tr1",
    name: "Super Deal 1 (Triple Regular)",
    price: 1490,
    description: "Choose 3 Regular Pizzas of any style from our rich flavours chart. Incredible value!",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop",
    category: "triple",
    badge: "Triple Saver"
  },
  {
    id: "tr2",
    name: "Super Deal 2 (Triple Medium)",
    price: 2590,
    description: "Choose 3 Medium Pizzas of any style from our premium selection. Best suited for small groups.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop",
    category: "triple",
    badge: "Best Seller"
  },
  {
    id: "tr3",
    name: "Super Deal 3 (Triple Large)",
    price: 3590,
    description: "Choose 3 Large Pizzas of any style. Extravaganza of melting cheese and delicious toppings.",
    image: "/assets/images/triple_large_deal_1781663582968.jpg",
    category: "triple",
    badge: "Elite Feast"
  },
  {
    id: "tr4",
    name: "Super Deal 4 (Triple Family)",
    price: 4990,
    description: "Choose 3 Family Pizzas of any luxury flavor. Perfect for birthday bashes and mega parties.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop",
    category: "triple",
    badge: "Grand Feast"
  },

  // SECTION 6 – BURGER & WRAPS
  {
    id: "bw1",
    name: "Chicken Burger",
    price: 320,
    description: "Savory golden pan-fried seasoned chicken breast patty, rich fresh mayonnaise, lettuce crown.",
    image: "https://images.unsplash.com/photo-1481070414801-51fd732d7484?q=80&w=600&auto=format&fit=crop",
    category: "burger-wrap"
  },
  {
    id: "bw2",
    name: "Chicken Cheese Burger",
    price: 380,
    description: "Our signature Chicken Burger upgraded with a melted slice of premium cheddar cheese.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
    category: "burger-wrap"
  },
  {
    id: "bw3",
    name: "Zinger Burger",
    price: 450,
    description: "Extravagant deep fried spicy double-crisp chicken thigh fillet, signature dressing sauce, iceberg lettuce.",
    image: "/assets/images/zinger_burger_1781663562088.jpg",
    badge: "Legendary Crisp",
    category: "burger-wrap"
  },
  {
    id: "bw4",
    name: "Zinger Cheese Burger",
    price: 500,
    description: "The Legendary crunchy Zinger Burger loaded with melted cheddar cheese slice.",
    image: "/assets/images/zinger_burger_1781663562088.jpg",
    category: "burger-wrap"
  },
  {
    id: "bw5",
    name: "Zinger Paratha Roll",
    price: 350,
    description: "Crispy fried zinger strips wrapped snugly in flaky local paratha with dynamic spicy sauce.",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop",
    badge: "Spicy Wrap",
    category: "burger-wrap"
  },
  {
    id: "bw6",
    name: "Chicken Paratha Roll",
    price: 300,
    description: "Grilled chicken chunks layered inside flaky flatbread paratha with traditional mint-coriander chutney.",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop",
    category: "burger-wrap"
  },
  {
    id: "bw7",
    name: "Chicken Cheese Paratha",
    price: 360,
    description: "Flaky paratha roll stuffed with juicy spiced chicken and generous melting mozzarella goodness.",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop",
    category: "burger-wrap"
  },
  {
    id: "bw8",
    name: "Chicken Shawarma",
    price: 220,
    description: "Shredded Lebanese chicken meat wrapped in warm pita with pickled cucumbers and garlic toum sauce.",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=600&auto=format&fit=crop",
    category: "burger-wrap"
  },
  {
    id: "bw9",
    name: "Chicken Cheese Shawarma",
    price: 280,
    description: "Juicy chicken shawarma wrapped in flatbread with melting extra mozzarella layers.",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=600&auto=format&fit=crop",
    category: "burger-wrap"
  },

  // SECTION 7 – SIDE ORDERS
  {
    id: "so1",
    name: "Full Fried Chicken",
    price: 1400,
    description: "A whole tender chicken, double-breaded in secret spices and fried to perfect juicy golden crisp skin.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    category: "sides",
    badge: "Big Family Size"
  },
  {
    id: "so2",
    name: "Half Fried Chicken",
    price: 750,
    description: "Half portions of crispy, spicy southern style fried chicken. Crisp and absolutely tender inside.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },
  {
    id: "so3",
    name: "Fried Chicken Pieces (1 Pc)",
    price: 180,
    description: "One single piece of premium hot crispy fried chicken thigh or breast, hand tossed.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },
  {
    id: "so4",
    name: "Hot Wings (6 Pcs / 10 Pcs)",
    price: 350,
    description: "Crunchy chicken wings coated in hot fiery spices. Served hot with garlic dip.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },
  {
    id: "so5",
    name: "Hot Shots (10 Pcs)",
    price: 350,
    description: "10 bite-sized boneless tenders breaded in hot pepper spices and high flame fried.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },
  {
    id: "so6",
    name: "Nuggets (6 Pcs / 10 Pcs)",
    price: 320,
    description: "Tender white-meat premium chicken nuggets coated in seasoned breading. Hot and crispy.",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },
  {
    id: "so7",
    name: "Medium Fries",
    price: 250,
    description: "Freshly cut local luxury potatoes, golden double fried, lightly peppered with sea salt dust.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },
  {
    id: "so8",
    name: "Large Fries",
    price: 380,
    description: "King sized serving of golden french fries with peri peri seasoning dust.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop",
    category: "sides"
  },

  // SECTION 8 – BIRTHDAY DEAL
  {
    id: "bd_offer",
    name: "Grand Birthday Deal Offer",
    price: 9500,
    description: "Unparalleled luxurious birthday celebration bundle! Buy 3 Large Pizzas and get 3 Large Pizzas absolutely FREE (6 Large Pizzas total). Includes: a FREE premium 2-Pound Birthday cake, 1.5 Liter chilled drink bottle, and FREE Dining Hall setup and charges. Book or order now for Rs. 9500/-",
    image: "https://images.unsplash.com/photo-1533223291567-9aa2980c5df1?q=80&w=800&auto=format&fit=crop",
    badge: "Ultimate Celebration Deal",
    category: "birthday"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Saad Rehman",
    text: "Mouth-watering pizza right in Gujranwala! The Kabab Crust Pizza is absolutely spectacular. The cheese flow is world-class and delivery was extremely fast.",
    role: "Local Food Critic",
    stars: 5,
    date: "June 2026"
  },
  {
    id: "t2",
    name: "Amna Shahzadi",
    text: "The Buy 1 Get 1 Deals are incredibly generous! We ordered Deal 5 (Double Medium) and it fed our entire fam. High-quality toppings and wonderful soft crust.",
    role: "Regular Customer",
    stars: 5,
    date: "June 2026"
  },
  {
    id: "t3",
    name: "Haris Butt",
    text: "Italy Pizza at Model Town is our go-to spot. Clean environment, premium ingredients, and their website order workflow takes you directly to WhatsApp so quickly!",
    role: "Model Town Resident",
    stars: 5,
    date: "May 2026"
  },
  {
    id: "t4",
    name: "Zainab Malik",
    text: "Seriously, the Malai Booti Pizza is to die for. Incredible creamy rich flavor with green chilies that highlight the local charm perfectly.",
    role: "Gourmet Enthusiast",
    stars: 5,
    date: "June 2026"
  }
];
