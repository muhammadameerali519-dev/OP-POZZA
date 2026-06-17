import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Send, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  Sparkles, 
  CheckCircle, 
  Truck, 
  ShieldAlert, 
  PartyPopper, 
  Timer, 
  Star,
  Search,
  Check,
  Compass
} from "lucide-react";
import { MENU_ITEMS, TESTIMONIALS } from "./data";
import { FoodItem, CartItem } from "./types";

export default function App() {
  // App States
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Size selection state keyed by food item ID
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Welcome to Italy Pizza 🍕. How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  // Countdown timer for Section 4 Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 51 });

  // Web Audio Synthesizer for premium sound effects
  const playSynthSound = (type: "click" | "success" | "chime" | "cart") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "cart") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "chime") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      console.warn("Web Audio not supported or blocked by user gesture:", e);
    }
  };

  // Simulating loading screen of Italy Pizza
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      playSynthSound("chime");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Update countdown clock for deals
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 59, seconds: 59 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set default sizes for pizza items
  useEffect(() => {
    const initialSizes: Record<string, string> = {};
    MENU_ITEMS.forEach((item) => {
      if (item.sizes) {
        // Default to 'Medium' or the first available size
        initialSizes[item.id] = Object.keys(item.sizes)[1] || Object.keys(item.sizes)[0];
      }
    });
    setSelectedSizes(initialSizes);
  }, []);

  const handleSizeChange = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
    playSynthSound("click");
  };

  const getPriceOfItem = (item: FoodItem) => {
    if (item.sizes) {
      const selectedSize = selectedSizes[item.id] || "Medium";
      return item.sizes[selectedSize] || item.price;
    }
    return item.price;
  };

  // Shopping Cart Actions
  const addToCart = (item: FoodItem) => {
    const selectedSize = item.sizes ? (selectedSizes[item.id] || "Medium") : undefined;
    const price = getPriceOfItem(item);
    
    // Uniquely identify item in cart using id and size
    const cartItemId = selectedSize ? `${item.id}-${selectedSize}` : item.id;

    const existing = cart.find((i) => i.id === cartItemId);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: cartItemId,
          foodId: item.id,
          name: item.name,
          selectedSize: selectedSize,
          selectedPrice: price,
          quantity: 1,
          description: item.description,
          image: item.image
        }
      ]);
    }
    setCartOpen(true);
    playSynthSound("cart");
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCart(cart.filter((i) => i.id !== cartItemId));
    } else {
      setCart(
        cart.map((i) =>
          i.id === cartItemId ? { ...i, quantity: newQty } : i
        )
      );
    }
    playSynthSound("click");
  };

  // Calculations
  const subtotal = cart.reduce((total, item) => total + item.selectedPrice * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 150 : 0;
  const totalAmount = subtotal + deliveryFee;

  // Contact / Order Links
  const WHATSAPP_NUM = "923216118080";
  const COMPLAINT_NUM = "+92 321 6118080";

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    playSynthSound("success");
    
    let orderText = `🍕 *ITALY PIZZA ORDER* 🍕\n`;
    orderText += `-----------------------------\n`;
    cart.forEach((item, index) => {
      const sizeStr = item.selectedSize ? ` (${item.selectedSize})` : "";
      orderText += `${index + 1}. *${item.name}${sizeStr}* x ${item.quantity} \n   Rs. ${item.selectedPrice * item.quantity}\n`;
    });
    orderText += `-----------------------------\n`;
    orderText += `*Subtotal:* Rs. ${subtotal}\n`;
    orderText += `*Delivery Fee:* Rs. ${deliveryFee}\n`;
    orderText += `*Total Bill:* *Rs. ${totalAmount}*\n\n`;
    orderText += `📍 Please deliver as fresh as possible. Thank you!`;

    const encoded = encodeURIComponent(orderText);
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encoded}`, "_blank");
  };

  const handleDirectWhatsAppOnly = () => {
    playSynthSound("click");
    const msg = "Hi Italy Pizza, I would like to place an order.";
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // AI Chat bot Logic
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || userInput;
    if (!textToSend.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    if (!customMessage) setUserInput("");
    setBotTyping(true);
    playSynthSound("click");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.reply || "I am glad to assist you. What can I get for you next?" }]);
      playSynthSound("chime");
    } catch (e) {
      // Fallback
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { 
          sender: "bot", 
          text: "I am happy to guide you! We recommend our *Malai Booti Pizza* and *Buy 1 Get 1 Free Deals*. Can I help you with the checkout?" 
        }]);
        playSynthSound("chime");
      }, 800);
    } finally {
      setBotTyping(false);
    }
  };

  // Fast auto scrolls
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      playSynthSound("click");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#070707] flex flex-col items-center justify-center z-50 transition-all duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Animated Pizza Slices Logo block */}
        <div className="relative mb-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-t-2 border-b-2 border-[#D4AF37] animate-spin flex items-center justify-center">
            <span className="text-4xl animate-pulse">🍕</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs tracking-[0.4em] text-[#D4AF37] uppercase font-bold mt-16 font-display">
            ITALY
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-widest text-[#F5F5F5] uppercase font-serif-luxury mt-8">
          ITALY PIZZA
        </h1>
        <p className="text-xs text-white/50 tracking-[0.3em] uppercase mt-2 font-display">
          Where Every Slice Tells a Story
        </p>

        <div className="w-48 h-[2px] bg-white/10 rounded-full mt-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-[#D4AF37] animate-infinite tracking-[0.3em]" style={{
            width: "70%",
            animation: "shimmer 1.5s infinite linear",
          }} />
        </div>
        <p className="text-[10px] text-[#D4AF37]/70 font-mono mt-4">GUJRANWALA, PK</p>
      </div>
    );
  }

  return (
    <div id="app-container" className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#D4AF37]/30 relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#111] to-[#222] border border-[#D4AF37]/30 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍕</span>
            </div>
            <div>
              <div className="text-xl font-extrabold uppercase tracking-tight text-white flex items-center gap-1 font-serif-luxury">
                ITALY PIZZA <span className="text-[#D4AF37]">.</span>
              </div>
              <p className="text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase font-mono">MODEL TOWN, GRW</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[10px] xl:text-xs uppercase tracking-widest font-semibold text-white/70">
            <button onClick={() => scrollToSection("home")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection("special-flavours")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Special Flavours</button>
            <button onClick={() => scrollToSection("classic-pizzas")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Classic Menu</button>
            <button onClick={() => scrollToSection("bogo-deals")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Deals</button>
            <button onClick={() => scrollToSection("triple-offers")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Triple</button>
            <button onClick={() => scrollToSection("burgers-wraps")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Burgers & Wraps</button>
            <button onClick={() => scrollToSection("side-orders")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Sides</button>
            <button onClick={() => scrollToSection("birthday-deal")} className="text-amber-400 hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1">
              <PartyPopper className="w-3.5 h-3.5" /> Birthday Deals
            </button>
            <button onClick={() => setChatOpen(true)} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-emerald-400">AI Assistant</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Contact</button>
          </nav>

          {/* Practical Action Toolbar */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if(!soundEnabled) setTimeout(() => playSynthSound("click"), 100);
              }}
              title={soundEnabled ? "Disable premium UI sound triggers" : "Enable premium UI sound triggers"}
              className={`p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all ${soundEnabled ? "text-[#D4AF37]" : "text-white/40"}`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Shopping Bag Button with count badge */}
            <button 
              onClick={() => {
                setCartOpen(true);
                playSynthSound("click");
              }}
              className="px-4 py-2.5 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white flex items-center gap-2 transition-all relative"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold hidden sm:inline">Bag</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-[#D4AF37] animate-pulse-gold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE LOWER HORIZONTAL NAVIGATION CAROUSEL FOR COMPACT SCREEN */}
      <div className="lg:hidden sticky top-20 z-30 bg-black/95 border-b border-white/5 py-3 px-4 overflow-x-auto flex gap-2 no-scrollbar">
        <button onClick={() => scrollToSection("special-flavours")} className="shrink-0 px-3 py-1 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white hover:text-[#D4AF37] border border-white/10">Special Flavours</button>
        <button onClick={() => scrollToSection("classic-pizzas")} className="shrink-0 px-3 py-1 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white hover:text-[#D4AF37] border border-white/10">Classic</button>
        <button onClick={() => scrollToSection("bogo-deals")} className="shrink-0 px-3 py-1 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white hover:text-[#D4AF37] border border-white/10">BOGO Deals</button>
        <button onClick={() => scrollToSection("triple-offers")} className="shrink-0 px-3 py-1 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white hover:text-[#D4AF37] border border-white/10">Triple Offers</button>
        <button onClick={() => scrollToSection("burgers-wraps")} className="shrink-0 px-3 py-1 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white hover:text-[#D4AF37] border border-white/10">Burgers</button>
        <button onClick={() => scrollToSection("side-orders")} className="shrink-0 px-3 py-1 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white hover:text-[#D4AF37] border border-white/10">Sides</button>
        <button onClick={() => scrollToSection("birthday-deal")} className="shrink-0 px-3 py-1 bg-amber-500/10 text-[10px] uppercase font-bold tracking-widest text-amber-300 border border-amber-500/30">Birthday Deal</button>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[85vh] flex items-center justify-center py-16 px-4 md:px-8 bg-gradient-to-b from-black via-zinc-950 to-[#050505]">
        
        {/* Cinematic Background Food Imagery Grid with absolute blend */}
        <div className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop')" }} />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Floating Realistic Slices Animation Components (3D parallax vibe) */}
        <div className="absolute top-24 left-[10%] animate-float-1 pointer-events-none hidden md:block">
          <div className="glass-panel rounded-2xl p-3 flex items-center gap-2 border-[#D4AF37]/30 shadow-2xl">
            <span className="text-3xl">🍕</span>
            <div>
              <p className="text-[9px] uppercase tracking-widest opacity-55">Stuffed Crust</p>
              <p className="text-[10px] font-bold text-[#D4AF37]">Double Cheese</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-[12%] animate-float-2 pointer-events-none hidden md:block">
          <div className="glass-panel rounded-2xl p-3 flex items-center gap-2 border-white/10 shadow-2xl">
            <span className="text-3xl">🌶️</span>
            <div>
              <p className="text-[9px] uppercase tracking-widest opacity-55">Authentic Spicy</p>
              <p className="text-[10px] font-bold text-white">Tandoori Smoked</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
          
          {/* Hero Left Info */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] md:text-xs uppercase tracking-[0.2em] font-mono leading-none">
              <Sparkles className="w-3 h-3 text-[#D4AF37] animate-spin" /> MODEL TOWN, GUJRANWALA BEST CHICE
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase text-white font-serif-luxury">
                ITALY <span className="text-gold block sm:inline">PIZZA</span>
              </h1>
              <p className="text-xl sm:text-2xl text-[#D4AF37] italic font-serif tracking-wide">
                &ldquo;Where Every Slice Tells a Story.&rdquo;
              </p>
            </div>

            <p className="text-sm md:text-base text-white/70 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Premium hand-crafted pizzas, crisp flame zinger burgers, stuffed paratha wraps, and irresistible BOGO free deals cooked under clean authentic Italian standards.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={() => {
                  scrollToSection("special-flavours");
                }}
                className="px-8 py-4 bg-[#D4AF37] hover:bg-white text-black font-extrabold uppercase text-xs tracking-[0.2em] transition-all duration-300 rounded-none shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 group animate-glow-button cursor-pointer font-display"
              >
                <span>View Real Menu</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => {
                  setCartOpen(true);
                  playSynthSound("click");
                }}
                className="px-8 py-4 bg-zinc-950 hover:bg-zinc-900 text-white border border-white/20 font-extrabold uppercase text-xs tracking-[0.2em] hover:border-white transition-all cursor-pointer font-display"
              >
                Order Online
              </button>

              <button 
                onClick={handleDirectWhatsAppOnly}
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs tracking-widest uppercase font-extrabold flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>WhatsApp Order</span>
              </button>
            </div>

            {/* Core Stats badges in Hero */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-white font-serif-luxury">12:30 AM</p>
                <p className="text-[9px] uppercase tracking-widest text-white/50">Open Daily</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-2xl font-extrabold text-[#D4AF37] font-serif-luxury">Rs. 1000</p>
                <p className="text-[9px] uppercase tracking-widest text-white/50">Min. Order</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-2xl font-extrabold text-emerald-400 font-serif-luxury">Rs. 150</p>
                <p className="text-[9px] uppercase tracking-widest text-white/50">Delivery fee</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Floating Food Circle with 3D Depth effect */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#111] to-[#010101] border-4 border-[#D4AF37]/30 shadow-2xl flex items-center justify-center p-2 overflow-hidden group">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.3)_0%,transparent_70%)] animate-pulse" />
              
              {/* Central Premium Food Pizza Image inside frame - Perfect Symmetric Spin */}
              <img 
                src="/assets/images/rotating_pizza_1781662384132.jpg" 
                alt="Italy Pizza Special Rotating Chef's Choice" 
                className="w-full h-full object-cover rounded-full shadow-inner animate-spin border-2 border-white/5"
                style={{ animationDuration: "60s" }}
              />

              {/* Badges on circle border */}
              <div className="absolute -top-3 -right-3 bg-red-600 text-white font-extrabold text-[10px] tracking-widest uppercase px-4 py-2 rotate-12 shadow-md hover:scale-105 transition-transform duration-300">
                BOGO ACTIVE!
              </div>

              <div className="absolute -bottom-3 left-6 glass-panel border-[#D4AF37]/50 text-[#D4AF37] text-[10px] tracking-wider font-extrabold py-2 px-4 shadow-xl flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <span>⭐ 4.9 Critic Choice</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 1: NEW SPECIAL FLAVOURS */}
      <section id="special-flavours" className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold mb-3">// Chef's Masterpieces</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
                NEW SPECIAL FLAVOURS
              </h2>
            </div>
            <p className="text-xs text-white/50 max-w-xs uppercase tracking-widest font-mono">
              Carefully baked with custom handrolled dough and locally imported dairy cheeses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MENU_ITEMS.filter(it => it.category === "special").map((item) => {
              const currentSize = selectedSizes[item.id] || "Medium";
              const currentPrice = getPriceOfItem(item);

              return (
                <div 
                  key={item.id}
                  id={`item-${item.id}`}
                  className="group bg-black/60 border border-white/5 hover:border-[#D4AF37]/40 rounded-none p-5 flex flex-col transition-all duration-300 relative overflow-hidden"
                >
                  {item.badge && (
                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-black font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 z-10 font-display">
                      {item.badge}
                    </div>
                  )}

                  {/* Image with Zoom */}
                  <div className="w-full h-56 bg-zinc-900 overflow-hidden relative mb-5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-65" />
                  </div>

                  {/* Header Title and Dynamic Price */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-xl font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors font-serif-luxury">
                      {item.name}
                    </h3>
                    <div className="text-right">
                      <p className="text-lg font-black text-[#D4AF37]">Rs. {currentPrice}</p>
                      {item.sizes && <p className="text-[10px] text-white/40 uppercase font-mono">{currentSize} Price</p>}
                    </div>
                  </div>

                  <p className="text-xs text-white/60 mb-6 line-clamp-2 leading-relaxed flex-grow">
                    {item.description}
                  </p>

                  {/* Interactive Size Picker (Exclusive premium feel!) */}
                  {item.sizes && (
                    <div className="mb-5 space-y-2 border-t border-white/5 pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Select Size:</p>
                      <div className="grid grid-cols-4 gap-1">
                        {Object.keys(item.sizes).map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`py-1 text-[9px] uppercase tracking-tighter transition-all font-bold ${
                              currentSize === size 
                                ? "bg-[#D4AF37] text-black" 
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trigger dynamic sound option */}
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-3 bg-zinc-950 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-transparent font-extrabold uppercase text-[10px] tracking-widest transition-all duration-300 font-display cursor-pointer"
                  >
                    Add to Cart Bag
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 2: CLASSIC PIZZAS */}
      <section id="classic-pizzas" className="py-24 px-4 md:px-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-center md:text-left">
            <div>
              <p className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold mb-3">// Time-Tested Recipes</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
                CLASSIC PIZZAS
              </h2>
            </div>
            <div className="flex justify-center md:justify-end">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] border-b border-[#D4AF37] pb-1">
                AVAILABLE IN: REGULAR | MEDIUM | LARGE | FAMILY
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MENU_ITEMS.filter(it => it.category === "classic").map((item) => {
              const currentSize = selectedSizes[item.id] || "Medium";
              const currentPrice = getPriceOfItem(item);

              return (
                <div 
                  key={item.id}
                  className="group bg-[#0c0c0c] border border-white/5 hover:border-[#D4AF37]/30 rounded-none p-5 flex flex-col transition-all duration-300 relative"
                >
                  
                  {/* Photo frame */}
                  <div className="w-full h-48 bg-zinc-950 overflow-hidden relative mb-5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold uppercase text-white group-hover:text-[#D4AF37] font-serif-luxury">
                      {item.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-[#D4AF37]">Rs. {currentPrice}</p>
                      <p className="text-[9px] text-white/30 uppercase font-mono">{currentSize}</p>
                    </div>
                  </div>

                  <p className="text-xs text-white/50 mb-6 flex-grow leading-relaxed">
                    {item.description}
                  </p>

                  {/* Size selectors for Classics */}
                  {item.sizes && (
                    <div className="mb-4 space-y-2 border-t border-white/5 pt-3">
                      <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-white/40">
                        <span>Select Size:</span>
                        <span className="text-gold font-bold">{currentSize}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {Object.keys(item.sizes).map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`py-1 text-[8px] uppercase tracking-tighter font-bold transition-all ${
                              currentSize === size 
                                ? "bg-white text-black font-black" 
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2.5 bg-black hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-transparent text-[9px] uppercase tracking-widest font-display transition-all cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: BUY 1 GET 1 FREE DEALS */}
      <section id="bogo-deals" className="py-24 px-4 md:px-8 bg-zinc-950/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-red-500 tracking-[0.4em] uppercase font-extrabold blink">🔥 HIGH VALUE VALUE MEALS</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury tracking-normal">
              BUY 1 GET 1 FREE DEALS
            </h2>
            <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto" />
            <p className="text-xs text-white/60 leading-relaxed uppercase tracking-wider">
              BOGO promo valid for limited time. Fresh recipes served with premium fries & cold soft drinks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MENU_ITEMS.filter(it => it.category === "bogo").map((item) => (
              <div 
                key={item.id}
                className="group relative bg-[#090909] border border-white/5 hover:border-red-600/40 rounded-none p-4 flex flex-col justify-between transition-all duration-300"
              >
                {/* Promo Badges */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 text-[8px] uppercase tracking-widest font-extrabold bg-red-600 text-white rounded-none">
                    {item.badge || "BOGO DEAL"}
                  </span>
                </div>

                <div>
                  <div className="w-full h-40 bg-zinc-950 overflow-hidden relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight mb-1 uppercase font-serif-luxury">
                    {item.name}
                  </h3>
                  
                  <p className="text-[11px] text-white/55 line-clamp-3 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Mega Offer</span>
                    <span className="text-lg font-black text-[#D4AF37]">Rs. {item.price}/-</span>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-red-600 hover:bg-black text-white border border-transparent hover:border-red-600/50 text-[10px] uppercase tracking-widest font-extrabold transition-all duration-300 cursor-pointer"
                  >
                    Add Deal to Bag
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: SPECIAL DEALS */}
      <section id="special-deals" className="py-24 px-4 md:px-8 bg-[#090909] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold mb-3">// Limited Time Extravaganza</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
                SPECIAL PROMO DEALS (11 - 15)
              </h2>
            </div>
            
            {/* Dynamic Realtime Count-down Timer Widget */}
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 px-6 py-3 flex items-center gap-4">
              <Timer className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/50">Deal Window Ends In:</p>
                <div className="flex gap-2 font-mono text-base font-black text-[#D4AF37]">
                  <span>{timeLeft.hours.toString().padStart(2, "0")}h</span>:
                  <span>{timeLeft.minutes.toString().padStart(2, "0")}m</span>:
                  <span>{timeLeft.seconds.toString().padStart(2, "0")}s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {MENU_ITEMS.filter(it => it.category === "special-deal").map((item) => (
              <div 
                key={item.id}
                className="group bg-black border border-white/5 hover:border-[#D4AF37]/40 p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="w-full h-36 bg-zinc-950 overflow-hidden relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5">
                      {item.badge}
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-white/50 line-clamp-3 mb-4 leading-normal">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="text-lg font-black text-rose-500 mb-3">Rs. {item.price}/-</div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-white hover:bg-[#D4AF37] text-black font-bold text-[9px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Add Deal
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: TRIPLE PIZZA OFFERS */}
      <section id="triple-offers" className="py-24 px-4 md:px-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold">👑 THE PARTY TRIOS</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury tracking-wide">
              TRIPLE PIZZA OFFERS
            </h2>
            <p className="text-xs text-white/55 uppercase tracking-widest font-mono">
              Get Three Piping Hot Pizzas of any custom flavour combination and feast together!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {MENU_ITEMS.filter(it => it.category === "triple").map((item) => (
              <div 
                key={item.id}
                className="group relative bg-[#0b0b0b] border border-white/5 hover:border-[#D4AF37]/50 rounded-none p-5 flex flex-col justify-between transition-all"
              >
                <div className="absolute top-4 right-4 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[8px] uppercase tracking-widest px-2.5 py-1">
                  {item.badge}
                </div>

                <div>
                  <div className="w-full h-44 bg-zinc-950 overflow-hidden mb-5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase font-serif-luxury mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/50 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">3 Pizza Bundle</span>
                    <span className="text-xl font-extrabold text-[#D4AF37]">Rs. {item.price}</span>
                  </div>

                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-transparent text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                  >
                    Select Triple Offer
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: BURGERS & WRAPS */}
      <section id="burgers-wraps" className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold mb-3">// Sizzling Fast Food Elite</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
                BURGER & WRAPS
              </h2>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-mono">
              Succulent crispy thigh fillets and localized paratha rolls stuffed with pure garlic mayo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MENU_ITEMS.filter(it => it.category === "burger-wrap").map((item) => (
              <div 
                key={item.id}
                className="group bg-black/70 border border-white/5 hover:border-[#D4AF37]/30 p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="w-full h-40 bg-zinc-950 overflow-hidden relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="absolute bottom-2 left-2 bg-rose-600 text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] uppercase text-white/45 tracking-widest font-mono">Hot serving</span>
                    <span className="text-sm font-black text-[#D4AF37]">Rs. {item.price}/-</span>
                  </div>

                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-zinc-900 hover:bg-white text-white hover:text-black [transition:all_0.30s] text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Add Component
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 7: SIDE ORDERS */}
      <section id="side-orders" className="py-24 px-4 md:px-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold">// Crispy Golden Delicacies</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
              CRISPY SIDE ORDERS
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-mono">
              Premium nuggets, hot wings, whole fried chicken and peri-peri golden fries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MENU_ITEMS.filter(it => it.category === "sides").map((item) => (
              <div 
                key={item.id}
                className="group bg-[#0b0b0b] border border-white/5 hover:border-[#D4AF37]/30 p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="w-full h-36 bg-zinc-950 overflow-hidden relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white font-bold text-[8px] uppercase tracking-widest px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] text-white/40 uppercase font-mono tracking-widest text-[#D4AF37]">Premium side</span>
                    <span className="text-sm font-extrabold text-white">Rs. {item.price}</span>
                  </div>

                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-zinc-900 border border-white/5 hover:bg-white hover:text-black text-[9px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                  >
                    Add to order
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: BIRTHDAY DEAL */}
      <section id="birthday-deal" className="py-24 px-4 md:px-8 bg-zinc-950 border-t border-b border-[#D4AF37]/20 relative overflow-hidden">
        
        {/* Absolute ambient party dynamic circles */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-red-650/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-650/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="text-center mb-12 space-y-4">
            <span className="px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] inline-flex items-center gap-2">
              <PartyPopper className="w-4 h-4 animate-bounce" /> GUJRANWALA CELEBRATION BASH SPECIAL
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
              GRAND BIRTHDAY DEAL
            </h2>
            <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
              Plan the perfect birthday bash in our spacious modern party segment at Model Town Gujranwala or order directly for a grand feast!
            </p>
          </div>

          {/* Luxury Presentation Card for the Birthday Deal */}
          {MENU_ITEMS.filter(it => it.category === "birthday").map((item) => (
            <div 
              key={item.id}
              className="glass-panel-gold border-[#D4AF37]/50 rounded-none p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              
              {/* Photo Display */}
              <div className="lg:col-span-5 relative w-full h-64 md:h-80 bg-zinc-900 overflow-hidden shadow-2xl">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[9px] uppercase tracking-widest font-extrabold px-3 py-1">
                  OFFER OF THE YEAR!
                </div>
              </div>

              {/* Package detailed items list */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-white tracking-wide">
                    Buy 3 Large Pizzas = <span className="text-rose-500 animate-pulse">Get 3 Large Pizzas FREE!</span>
                  </h3>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>

                {/* Grid checklist highlighting free inclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <span className="text-xs uppercase font-extrabold text-white">6 Large Luxury Pizzas Total</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs uppercase font-extrabold text-emerald-400">FREE 2-Pound Birthday Cake</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <span className="text-xs uppercase font-extrabold text-white">FREE 1.5 Liter Chilled Drink</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs uppercase font-extrabold text-emerald-400">FREE Dining Hall Setup/Charges</span>
                  </div>
                </div>

                {/* Price and Add segment */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest">All-Inclusive Luxury Price:</p>
                    <p className="text-3xl font-black text-[#D4AF37]">Rs. 9500/-</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => addToCart(item)}
                      className="px-6 py-3.5 bg-[#D4AF37] hover:bg-white text-black font-extrabold uppercase text-[10px] tracking-widest transition-all cursor-pointer"
                    >
                      Add Deal To Bag
                    </button>
                    
                    <button 
                      onClick={() => {
                        playSynthSound("click");
                        window.open(`https://wa.me/${WHATSAPP_NUM}?text=Hi France/Italy Pizza, I would like to book the Grand Birthday Deal of Rs. 9500/-, please confirm availability.`, "_blank");
                      }}
                      className="px-6 py-3.5 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                    >
                      Book Hall Now
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

      {/* DELIVERY SECTION */}
      <section className="py-20 px-4 md:px-8 bg-black/60 relative">
        <div className="max-w-7xl mx-auto text-center">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Home Delivery Available</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                Enjoy hot and steaming pizzas delivered straight to your residence in Model Town & surrounding areas.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Super Fast Delivery</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                We respect your hunger cravings! Our dynamic delivery fleet promises swift transportation on time.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Fresh Handcrafted Ingredients</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                From hand-rolled fresh daily dough to secret imported herbs, quality is never compromised.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">100% Hygienic Kitchen</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                Strict sanitization controls, headcover mandates, and clean processes for safe healthy consumption.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold">⭐ THE VOICE OF GUJRANWALA</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white font-serif-luxury">
              WHAT OUR LOVERS SAY
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-mono">
              Do not take our words for it. Read honest luxury reviews from our loyal patrons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="bg-black border border-white/5 p-6 rounded-none flex flex-col justify-between hover:border-[#D4AF37]/30 transition-all"
              >
                <div>
                  <div className="flex gap-0.5 text-[#D4AF37] mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-white/70 italic leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.name}</h4>
                    <span className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-mono">{t.role}</span>
                  </div>
                  <span className="text-[9px] text-white/30 uppercase font-mono">{t.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MAP & DIRECTIONS SECTION */}
      <section id="contact" className="py-24 px-4 md:px-8 bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Map info Left */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase font-mono font-bold">// Locate the Taste</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-serif-luxury">
              ITALY PIZZA BRIDGES
            </h2>
            
            <p className="text-xs text-white/60 leading-relaxed">
              We welcome food lovers to dine at our premium hygienic workspace in heart of Model Town. Beautiful spacious ambiance tailored for families, groups and couples.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Address Details</h4>
                  <p className="text-xs text-white/50">Italy Pizza, Model Town, Gujranwala, Punjab, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Opening Hours</h4>
                  <p className="text-xs text-white/50">12:00 PM – 12:30 AM (Open everyday)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Order Lines / Customer care</h4>
                  <p className="text-xs text-[#D4AF37] font-bold font-mono">+92 321 6118080</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                playSynthSound("click");
                window.open("https://maps.app.goo.gl/FRTGK9asNXpKpWHG7?g_st=ac", "_blank");
              }}
              className="mt-6 px-6 py-3.5 bg-white hover:bg-[#D4AF37] text-black font-extrabold text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer font-display"
            >
              <Compass className="w-4 h-4" />
              <span>Get Directions to Restaurant</span>
            </button>
          </div>

          {/* Embedded Google Maps right iframe */}
          <div className="lg:col-span-8 bg-zinc-950 p-2 border border-white/5 relative">
            <div className="absolute top-4 left-4 z-10 bg-black/90 p-3 border border-[#D4AF37]/30 text-left">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37]">Location Verified</p>
              <h5 className="text-xs font-extrabold text-white mt-1">Italy Pizza, Model Town</h5>
            </div>
            
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3377.458994503761!2d74.1953!3d32.1611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCMDknNDAuMCJOIDc0wrAxMSc0My4xIkU!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk" 
              className="w-full h-96 grayscale invert brightness-75 hover:grayscale-0 hover:invert-0 hover:brightness-100 transition-all"
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>

      {/* PERSISTENT FLOATING ACTION CONTROLS FIXED BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        
        {/* Special Mobile Cart Trigger */}
        {cart.length > 0 && !cartOpen && (
          <button 
            onClick={() => {
              setCartOpen(true);
              playSynthSound("click");
            }}
            className="flex lg:hidden items-center justify-center w-12 h-12 bg-red-650 rounded-full text-white shadow-2xl animate-bounce border border-white/20"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Float AI Chat Assistant button */}
        <button 
          onClick={() => {
            setChatOpen(!chatOpen);
            playSynthSound("click");
          }}
          className="flex items-center justify-center w-14 h-14 bg-black border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] rounded-full shadow-2xl transition-all group animate-pulse-gold cursor-pointer"
          title="Talk with AI Assistant"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>

        {/* Floating WhatsApp button */}
        <button 
          onClick={handleDirectWhatsAppOnly}
          className="flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white shadow-2xl transition-all animate-bounce cursor-pointer"
          title="Direct WhatsApp Order Line"
        >
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.453 4.815 1.454 5.53 0 10.029-4.5 10.032-10.035.002-2.68-1.038-5.197-2.932-7.098-1.89-1.901-4.405-2.946-7.086-2.947-5.542 0-10.04 4.5-10.045 10.037-.002 1.838.485 3.636 1.414 5.216l-.994 3.632 3.731-.979zM17.76 14.86c-.315-.158-1.86-.92-2.15-.1.025-.297-.585-.515-.71-.515s-.25.1.065.176c1.15.534.113.12-.11 1.625-.213.23-.42.457-.69.69-.533.456-1.127.818-1.785 1.077-.456.179-.838.214-1.163.167-.354-.055-.838-.284-1.11-.565-.272-.28-.51-.692-.61-1.047-.197-.7-.34-1.556-1.01-1.884-.136-.065-.213-.141-.213-.141s-.114-.143-.372-.442c-.258-.298-.674-.827-.674-1.4 0-.573.302-.876.413-.988.112-.11.246-.224.37-.336.082-.07.135-.125.135-.125l.235-.224c.12-.118.2-.246.223-.335.025-.09-.134-1.25-.27-1.574-.136-.324-.284-.66-.388-.66h-.56c-.225 0-.466.087-.665.253-.2.164-.766.75-.766 1.83 0 1.078.784 2.117.893 2.263.11.147 1.547 2.362 3.746 3.313 2.2.95 2.2.634 2.6.598.4-.035 1.862-.762 2.122-1.464.26-.702.26-1.303.18-.1.012l-.08-.125z" />
          </svg>
        </button>

        {/* Customer Care Complaint Floating Label */}
        <button 
          onClick={() => {
            playSynthSound("click");
            window.location.href = `tel:${WHATSAPP_NUM}`;
          }}
          className="bg-zinc-900 border border-white/10 hover:border-[#D4AF37] px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-extrabold text-white/80 shadow-2xl transition-all cursor-pointer flex items-center gap-1"
        >
          <ShieldAlert className="w-3 h-3 text-[#D4AF37]" /> Customer Care
        </button>
      </div>

      {/* AI CHATBOT DIALOG MODAL (Slide-Up) */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[480px] bg-zinc-950 border border-white/10 shadow-2xl rounded-none z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-black border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                <span className="text-base">🤖</span>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                  Italy Pizza Assistant 
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                </h4>
                <p className="text-[9px] text-white/50 tracking-wider">AI Copilot • Online 24/7</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setChatOpen(false);
                playSynthSound("click");
              }}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bg-white/5 p-2 overflow-x-auto flex gap-1.5 border-b border-white/5 no-scrollbar shrink-0">
            <button 
              onClick={() => handleSendMessage("Recommend best local pizza flavor")}
              className="shrink-0 px-2.5 py-1 bg-black hover:bg-[#D4AF37] text-white/70 hover:text-black rounded-none text-[8px] uppercase tracking-wider font-extrabold"
            >
              👍 Top Flavor Suggestion
            </button>
            <button 
              onClick={() => handleSendMessage("Explore Buy 1 Get 1 Free Deals")}
              className="shrink-0 px-2.5 py-1 bg-black hover:bg-red-600 text-white/70 hover:text-white rounded-none text-[8px] uppercase tracking-wider font-extrabold"
            >
              🔥 BOGO Free Offers
            </button>
            <button 
              onClick={() => handleSendMessage("Tell me about Grand Birthday Deal")}
              className="shrink-0 px-2.5 py-1 bg-black hover:bg-amber-600 text-white/70 hover:text-white rounded-none text-[8px] uppercase tracking-wider font-extrabold"
            >
              🎂 Birthday Package
            </button>
            <button 
              onClick={() => handleSendMessage("What are opening hours and minimum order?")}
              className="shrink-0 px-2.5 py-1 bg-black hover:bg-white text-white/70 hover:text-black rounded-none text-[8px] uppercase tracking-wider font-extrabold"
            >
              🕒 Opening Hours
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
            {chatMessages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-3 rounded-none ${
                  m.sender === "user" 
                    ? "bg-[#D4AF37] text-black font-semibold" 
                    : "bg-white/5 border border-white/5 text-white"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {botTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-none text-white/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Form sending integration */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-black border-t border-white/10 flex gap-2 shrink-0"
          >
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask anything about our pizzas & deals..."
              className="flex-grow bg-white/5 hover:bg-white/10 focus:bg-white/10 outline-none border border-white/10 focus:border-[#D4AF37] text-xs px-3 py-2 text-white placeholder-white/30 rounded-none transition-colors"
            />
            <button 
              type="submit"
              className="p-2 bg-[#D4AF37] text-black hover:bg-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* SHOPPING CART OVERLAY SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          
          {/* Backdrop */}
          <div 
            onClick={() => {
              setCartOpen(false);
              playSynthSound("click");
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all" 
          />

          {/* Sidebar Drawer Panel */}
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-zinc-950 border-l border-white/10 flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Header top line */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Your Order Bag</h3>
                <span className="px-2 py-0.5 bg-white/5 text-[9px] text-[#D4AF37] uppercase font-mono font-bold tracking-wider">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>

              <button 
                onClick={() => {
                  setCartOpen(false);
                  playSynthSound("click");
                }}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle body containing cart scroll area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <span className="text-4xl">🛒</span>
                  <p className="text-xs uppercase tracking-widest text-white/40">Your Bag is Empty</p>
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      scrollToSection("special-flavours");
                    }}
                    className="mt-2 text-xs text-[#D4AF37] uppercase border-b border-[#D4AF37]/50 pb-0.5"
                  >
                    Explore Flavours
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-3 bg-white/5 p-3 border border-white/5 relative"
                  >
                    {/* Tiny thumbnail */}
                    {item.image && (
                      <div className="w-16 h-16 bg-zinc-900 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 text-left space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">
                          Rs. {item.selectedPrice * item.quantity}
                        </span>
                      </div>

                      {item.selectedSize && (
                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
                          Size selected: <span className="text-[#D4AF37] font-semibold">{item.selectedSize}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-white/10 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-white/50 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs text-white font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-white/50 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Direct Delete trigger */}
                        <button 
                          onClick={() => updateQuantity(item.id, -item.quantity)}
                          className="text-[9px] text-red-400 hover:text-red-300 uppercase tracking-wider font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal calculation box */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-6 space-y-4 shrink-0 bg-zinc-950">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Subtotal Bill:</span>
                    <span className="text-white font-mono">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Delivery Charges:</span>
                    <span className="text-white font-mono">Rs. {deliveryFee}</span>
                  </div>
                  
                  {subtotal < 1000 && (
                    <div className="p-2 bg-red-650/10 border border-red-500/20 text-red-400 text-[10px] uppercase text-center tracking-wider font-semibold">
                      ⚠️ Minimum order for delivery is Rs. 1000/-
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-extrabold border-t border-white/5 pt-2 text-white">
                    <span className="uppercase tracking-widest font-display text-gold">Grand Total Bill:</span>
                    <span className="text-rose-500 font-mono text-base">Rs. {totalAmount}/-</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCheckoutWhatsApp}
                    disabled={subtotal < 1000}
                    className="w-full py-4 bg-[#D4AF37] disabled:bg-zinc-800 disabled:text-white/30 disabled:border-transparent text-black font-extrabold uppercase text-[11px] tracking-widest transition-all rounded-none hover:bg-white flex items-center justify-center gap-2 cursor-pointer font-display"
                  >
                    <span>Send Order to WhatsApp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <p className="text-[9px] text-center text-white/30 uppercase tracking-widest leading-loose">
                    Opening hours: 12:00 PM – 12:30 AM everyday.<br />
                    Once clicked, we format your cart, calculate tax and redirect you safely to our WhatsApp dispatch line!
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 pt-20 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-left">
          
          {/* Col 1 Brand details */}
          <div className="space-y-6">
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-serif-luxury uppercase">
                ITALY PIZZA <span className="text-[#D4AF37]">.</span>
              </span>
              <p className="text-[10px] text-[#D4AF37]/80 uppercase tracking-widest font-mono mt-1">Guijranwala Premium Standard</p>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Serving highly customized deep dish family pizzas, stuffed seekh kabab crusts, seasoned zinger cheese burgers and paratha wraps. Indulge in luxury flavors daily.
            </p>
            <div className="text-xs">
              <span className="text-white/40 block">Opening Hours:</span>
              <span className="text-[#D4AF37] font-semibold">12:00 PM – 12:30 AM (Everyday)</span>
            </div>
          </div>

          {/* Col 2 Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white border-l-2 border-[#D4AF37] pl-3">
              Explore Our Menu
            </h4>
            <div className="grid grid-cols-1 gap-2.5 text-xs text-white/60">
              <button onClick={() => scrollToSection("special-flavours")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold">Special Flavours</button>
              <button onClick={() => scrollToSection("classic-pizzas")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold">Classic Pizza Menu</button>
              <button onClick={() => scrollToSection("bogo-deals")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold">BOGO Free Deals</button>
              <button onClick={() => scrollToSection("triple-offers")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold">Triple Pizza Offers</button>
              <button onClick={() => scrollToSection("burgers-wraps")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold">Burgers & Wraps</button>
              <button onClick={() => scrollToSection("side-orders")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold">Crispy Side Orders</button>
              <button onClick={() => scrollToSection("birthday-deal")} className="hover:text-[#D4AF37] text-left transition-colors font-semibold text-amber-300">Birthday Deal Offer</button>
            </div>
          </div>

          {/* Col 3 Contact details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white border-l-2 border-emerald-500 pl-3">
              Contact Channels
            </h4>
            <div className="space-y-3 text-xs text-white/60">
              <p>📍 Model Town, Gujranwala, PK</p>
              <p>📞 Phone Order: +92 321 6118080</p>
              <p>💬 WhatsApp: +92 321 6118080</p>
              <p>🛡️ Customer Care: +92 321 6118080</p>
              <p>🕒 Minimum Order: Rs. 1000</p>
              <p>🚀 Delivery Fee: Rs. 150</p>
            </div>
          </div>

          {/* Col 4 Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white border-l-2 border-[#D4AF37] pl-3">
              Newsletter Premium
            </h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Subscribe to unlock secret promo codes, upcoming BOGO deals, and celebration discounts.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                playSynthSound("success");
                alert("Thank you for subscribing! Italy Pizza premium updates will be sent to your email.");
              }}
              className="flex gap-1"
            >
              <input 
                type="email" 
                required 
                placeholder="Your email address..."
                className="flex-grow bg-[#111] hover:bg-[#151515] text-xs px-3 py-2 text-white outline-none border border-white/5 focus:border-[#D4AF37] rounded-none transition-colors"
              />
              <button 
                type="submit" 
                className="bg-[#D4AF37] text-black font-extrabold uppercase text-[10px] tracking-widest px-4 py-2 hover:bg-white transition-all cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Brand Bottom Credits line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-[10px] text-white/40 uppercase tracking-widest">
            © 2026 ITALY PIZZA • Model Town, Gujranwala • All Rights Reserved.
          </div>
          <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span>Website Created by</span>
            <span className="text-white hover:text-[#D4AF37] transition-colors">Fast Target Co General Trading</span>
          </div>
        </div>

      </footer>

    </div>
  );
}
