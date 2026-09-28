"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ArrowRight, User, Rocket, Plane, Target, Layers, Gem, Gift, RefreshCcw, CircleDollarSign, Aperture, Volume2, Mail, ChevronLeft, ChevronRight, ArrowLeft, Globe, Search, FileText, Share2, Users, Download, Headset, HelpCircle, Info, MapPin, Moon, MessageCircle, Globe as Web, Camera, Send, MessageSquare } from "lucide-react";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { useRouter } from "next/navigation";

const gamesList = [
  // Row 1
  { name: "Aviator", img: "bg-gradient-to-b from-[#2a2a2a] to-[#501c1c]", logo: "WG", hot: true, graphic: "🛩️", popups: ["none"] },
  { name: "Crash", img: "bg-gradient-to-b from-[#3a6be8] to-[#1e3c8c]", logo: "WG", hot: true, graphic: "🚀" },
  { name: "Crazy 777", img: "bg-gradient-to-b from-[#411b6c] to-[#250d40]", logo: "WG", hot: true, graphic: "🎰" },
  // Row 2
  { name: "Pinata Wins", img: "bg-gradient-to-b from-[#f26b3a] to-[#d61a5c]", logo: "PG", hot: true, graphic: "🪅" },
  { name: "Aviator", img: "bg-gradient-to-b from-[#333] to-[#111]", logo: "SPRIBE", hot: false, graphic: "✈️" },
  { name: "Aviator", img: "bg-gradient-to-b from-[#400] to-[#100]", logo: "💠", hot: false, graphic: "🛩️" },
  // Row 3
  { name: "WG Slots", img: "bg-gradient-to-b from-[#0f4d19] to-[#082a0e]", logo: "WG", hot: false, graphic: "🦁", popups: ["coin"] },
  { name: "Jili Slots", img: "bg-gradient-to-b from-[#3d8c1c] to-[#194008]", logo: "JILI", hot: false, graphic: "🃏" },
  { name: "PG Slots", img: "bg-gradient-to-b from-[#1c7b8c] to-[#083a40]", logo: "PG", hot: false, graphic: "🐱" },
  // Row 4
  { name: "13000X", img: "bg-gradient-to-b from-[#8c3c1c] to-[#401608]", logo: "DB", hot: false, graphic: "🎯", popups: ["wheel"] },
  { name: "JILI Extra", img: "bg-gradient-to-b from-[#b8911c] to-[#5c4605]", logo: "JILI", hot: false, graphic: "👑" },
  { name: "iN Games", img: "bg-gradient-to-b from-[#444] to-[#222]", logo: "iN", hot: false, graphic: "🎲" },
  // Row 5
  { name: "Fortune Tiger", img: "bg-gradient-to-b from-[#c41e3a] to-[#800000]", logo: "PG", hot: true, graphic: "🐅" },
  { name: "Dragon Hatch", img: "bg-gradient-to-b from-[#e67300] to-[#8c3a00]", logo: "PG", hot: false, graphic: "🐉" },
  { name: "Sweet Bonanza", img: "bg-gradient-to-b from-[#ff6699] to-[#990033]", logo: "PP", hot: false, graphic: "🍬" },
  // Row 6
  { name: "Super Ace", img: "bg-gradient-to-b from-[#0066cc] to-[#003366]", logo: "JILI", hot: true, graphic: "♠️" },
  { name: "Golden Empire", img: "bg-gradient-to-b from-[#cca300] to-[#665200]", logo: "JILI", hot: false, graphic: "🏰" },
  { name: "Mines", img: "bg-gradient-to-b from-[#33cc33] to-[#006600]", logo: "SPRIBE", hot: false, graphic: "💣" },
  // Row 7
  { name: "Roulette", img: "bg-gradient-to-b from-[#2e004f] to-[#170028]", logo: "EVO", hot: false, graphic: "🎡" },
  { name: "Baccarat", img: "bg-gradient-to-b from-[#004d40] to-[#002620]", logo: "EVO", hot: true, graphic: "👔" },
  { name: "Blackjack", img: "bg-gradient-to-b from-[#1a1a1a] to-[#000000]", logo: "EVO", hot: false, graphic: "🂡" },
];

const miniGamesList = [
  { 
    name: "Blockchain", 
    img: "bg-gradient-to-b from-[#2b2b68] via-[#4d4d99] to-[#3ca33c]", 
    logo: <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffdf00] to-[#00aaff]">WG</span>, 
    graphic: "🦜🚀", 
    popups: ["coin"] 
  },
  { 
    name: "Spribe Blockchain", 
    img: "bg-gradient-to-b from-[#2b2b68] via-[#4d4d99] to-[#3ca33c]", 
    logo: "SPRIBE", 
    graphic: "✈️" 
  },
  { 
    name: "2J Blockchain", 
    img: "bg-gradient-to-b from-[#2b2b68] via-[#4d4d99] to-[#3ca33c]", 
    logo: <span className="text-[#ff6600]">2J</span>, 
    graphic: "🛩️" 
  },
];

const slotGamesList = [
  // Row 1 (Collage cards)
  { 
    name: "WG Slots", 
    collage: [
       "bg-gradient-to-br from-red-600 to-orange-500",
       "bg-gradient-to-bl from-yellow-500 to-orange-400",
       "bg-gradient-to-t from-green-600 to-emerald-400"
    ],
    graphic: ["🎰", "🤠", "🦁"],
    logo: <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffdf00] to-[#00aaff] drop-shadow-md">WG</span>, 
  },
  { 
    name: "PG Slots", 
    collage: [
       "bg-gradient-to-br from-yellow-900 to-amber-700",
       "bg-gradient-to-bl from-stone-800 to-stone-600",
       "bg-gradient-to-t from-teal-500 to-cyan-300"
    ],
    graphic: ["🗿", "🔫", "🐱"],
    logo: <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">PG</span>, 
  },
  { 
    name: "Jili Slots", 
    collage: [
       "bg-gradient-to-br from-green-800 to-emerald-600",
       "bg-gradient-to-bl from-yellow-400 to-amber-500",
       "bg-gradient-to-t from-green-500 to-lime-400"
    ],
    graphic: ["💵", "🦅", "🃏"],
    logo: <span className="text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">JILI</span>, 
  },
  // Row 2 (Character cards)
  { 
    name: "DB Slots", 
    img: "bg-gradient-to-b from-purple-700 via-indigo-500 to-teal-500", 
    logo: <span className="text-orange-500 italic font-black drop-shadow-md">DB</span>, 
    graphic: "🐒", 
    popups: ["coin_top", "wheel_bottom"] 
  },
  { 
    name: "FC Slots", 
    img: "bg-gradient-to-b from-blue-600 via-cyan-500 to-green-600", 
    logo: <span className="text-white italic font-black drop-shadow-md">FC</span>, 
    graphic: "🐷" 
  },
  { 
    name: "YellowBat Slots", 
    img: "bg-gradient-to-b from-indigo-500 via-blue-400 to-yellow-600", 
    logo: <span className="text-yellow-400 font-black drop-shadow-md">YB</span>, 
    graphic: "🤴", 
    popups: ["aviator_multiplier"] 
  },
];

const fishingGamesList = [
  { 
    name: "JILI Fishing", 
    img: "bg-gradient-to-b from-[#0c4a85] via-[#187bcd] to-[#3ca33c]", 
    logo: <span className="text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] text-[15px]">JILI</span>, 
    graphic: "🦈" 
  },
  { 
    name: "WG Fishing", 
    img: "bg-gradient-to-b from-[#0c4a85] via-[#187bcd] to-[#3ca33c]", 
    logo: <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffdf00] to-[#00aaff] drop-shadow-md text-[15px]">WG</span>, 
    graphic: "👲" 
  },
  { 
    name: "YellowBat Fishing", 
    img: "bg-gradient-to-b from-[#0c4a85] via-[#187bcd] to-[#3ca33c]", 
    logo: <span className="text-yellow-400 font-black drop-shadow-md text-[15px]">YB</span>, 
    graphic: "🦅" 
  },
];

const cardsGamesList = [
  { 
    name: "WG Cards", 
    img: "bg-gradient-to-b from-[#5c2a85] via-[#7d3cb3] to-[#3ca33c]", 
    logo: <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffdf00] to-[#00aaff] drop-shadow-md text-[15px]">WG</span>, 
    graphic: "🚘", 
    popups: ["coin_top", "huge_bottom"] 
  },
  { 
    name: "JILI Cards", 
    img: "bg-gradient-to-b from-[#5c2a85] via-[#7d3cb3] to-[#3ca33c]", 
    logo: <span className="text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] text-[15px]">JILI</span>, 
    graphic: "👩🏽" 
  },
  { 
    name: "KingMidas Cards", 
    img: "bg-gradient-to-b from-[#5c2a85] via-[#7d3cb3] to-[#3ca33c]", 
    logo: <div className="w-4 h-4 bg-pink-500 rounded-full border border-white flex items-center justify-center mx-auto shadow-md"><span className="text-[7px] text-white font-bold">KM</span></div>, 
    graphic: "👩🏻", 
    popups: ["trophies"] 
  },
];

const liveGamesList = [
  { 
    name: "EVO Live", 
    img: "bg-gradient-to-b from-[#1a2b4c] via-[#2a4b7c] to-[#3ca33c]", 
    logo: <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mx-auto shadow-md border border-white/20"><div className="w-3 h-3 rounded-full border-b-[3px] border-l-[3px] border-white transform -rotate-45"></div></div>, 
    graphic: "👩🏼", 
    star: false
  },
  { 
    name: "PP Live", 
    img: "bg-gradient-to-b from-[#1a2b4c] via-[#2a4b7c] to-[#3ca33c]", 
    logo: <div className="w-6 h-6 bg-orange-500 rounded-full flex flex-col items-center justify-center mx-auto shadow-md border-2 border-white"><span className="text-[10px] text-white leading-none -mt-1">👑</span></div>, 
    graphic: "👩🏻", 
    star: true
  },
  { 
    name: "Ezugi Live", 
    img: "bg-gradient-to-b from-[#1a2b4c] via-[#2a4b7c] to-[#3ca33c]", 
    logo: <span className="text-white font-black drop-shadow-[0_2px_4px_rgba(255,0,0,1)] text-[16px] tracking-tight">Ezugi</span>, 
    graphic: "👩🏼", 
    star: true
  },
];

const sportsGamesList = [
  { 
    name: "9Wickets Sports", 
    img: "bg-gradient-to-b from-[#3ba4ff] via-[#5cb8ff] to-[#3ca33c]", 
    logo: <span className="text-white font-black drop-shadow-md italic text-[14px] tracking-tighter">9WICKET</span>, 
    graphic: "🏏", 
    star: true,
    popups: ["coin_top", "wheel_bottom"]
  },
  { 
    name: "WG Sports", 
    img: "bg-gradient-to-b from-[#3ba4ff] via-[#5cb8ff] to-[#3ca33c]", 
    logo: <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffdf00] to-[#00aaff] drop-shadow-md text-[16px] italic font-black">WG</span>, 
    graphic: "🏃‍♂️", 
    star: true
  },
  { 
    name: "SABA Sports", 
    img: "bg-gradient-to-b from-[#3ba4ff] via-[#5cb8ff] to-[#3ca33c]", 
    logo: <div className="flex items-center gap-1"><div className="w-5 h-5 bg-neutral-600 rounded-full flex flex-col items-center justify-center border border-white/40 shadow-sm"><span className="text-[6px] text-white font-black leading-none">SA</span><span className="text-[6px] text-white font-black leading-none -mt-[1px]">BA</span></div></div>, 
    graphic: "⚽", 
    star: true,
    popups: ["deposit_rewards"]
  },
];

const grandPrizeWinners = [
  { img: "bg-gradient-to-br from-green-400 to-emerald-600", game: "WG", icon: "🀄", user: "1***87", amount: "50,760.0" },
  { img: "bg-gradient-to-br from-yellow-300 to-amber-600", game: "JILI", icon: "🦅", user: "7***93", amount: "88,000.0" },
  { img: "bg-gradient-to-br from-red-500 to-red-900", game: "SPRIBE", icon: "✈️", user: "3***31", amount: "122K" },
  { img: "bg-gradient-to-br from-purple-500 to-indigo-800", game: "JILI", icon: "🗿", user: "4***87", amount: "58,500.0" },
  { img: "bg-gradient-to-br from-blue-400 to-blue-800", game: "PG", icon: "🐅", user: "9***12", amount: "15,200.0" },
  { img: "bg-gradient-to-br from-orange-400 to-red-600", game: "EVO", icon: "🎡", user: "2***44", amount: "250K" },
];
const marqueeWinners = [...grandPrizeWinners, ...grandPrizeWinners, ...grandPrizeWinners, ...grandPrizeWinners];

const heroBanners = [
  {
    title: "Become an agent",
    subtitle: "Multiple agent\npromotion rebate offers",
    highlight: "Easily earn millions per month",
    bg: "from-[#2e0a0a] via-[#1f0000] to-[#3a0a0a]",
    border: "border-[#ff0b0b]",
    shadow: "shadow-[0_0_15px_rgba(255,11,11,0.3)]",
    primaryText: "text-[#ffdf00]",
    badgeBorder: "border-[#ff0b0b]",
    highlightColor: "text-[#ffdf00]",
    emoji1: "🤵‍♂️", emoji2: "💰", emoji3: "🌍"
  },
  {
    title: "Welcome Bonus",
    subtitle: "New member\nfirst deposit 100% bonus",
    highlight: "Get up to Rs 8,888 free",
    bg: "from-[#3a0a0a] via-[#240000] to-[#4a1f1f]",
    border: "border-[#ff0b0b]",
    shadow: "shadow-[0_0_15px_rgba(255,11,11,0.3)]",
    primaryText: "text-[#ffdf00]",
    badgeBorder: "border-[#ff0b0b]",
    highlightColor: "text-[#ffdf00]",
    emoji1: "🎁", emoji2: "💵", emoji3: "✨"
  },
  {
    title: "Daily Check-in",
    subtitle: "Log in every day\nto claim free rewards",
    highlight: "7 days streak for VIP box",
    bg: "from-[#1a0000] via-[#2a0505] to-[#330000]",
    border: "border-[#ff0b0b]",
    shadow: "shadow-[0_0_15px_rgba(255,11,11,0.3)]",
    primaryText: "text-[#ffdf00]",
    badgeBorder: "border-[#ff0b0b]",
    highlightColor: "text-[#ffdf00]",
    emoji1: "📅", emoji2: "💎", emoji3: "🔥"
  },
  {
    title: "VIP Club",
    subtitle: "Upgrade VIP level\nunlock exclusive benefits",
    highlight: "Weekly salary & loss rebate",
    bg: "from-[#220000] via-[#330000] to-[#440000]",
    border: "border-[#ff0b0b]",
    shadow: "shadow-[0_0_15px_rgba(255,11,11,0.3)]",
    primaryText: "text-[#ffdf00]",
    badgeBorder: "border-[#ff0b0b]",
    highlightColor: "text-[#ffdf00]",
    emoji1: "👑", emoji2: "⭐", emoji3: "🚀"
  }
];

import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
export default function HomeScreen({ onLoginClick, onRegisterClick }: { onLoginClick?: () => void, onRegisterClick?: () => void }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [realGames, setRealGames] = useState<any[]>([]);
    const [loadingGames, setLoadingGames] = useState(true);
  
  useEffect(() => {
    fetch('/api/v1/games/gregmorn/list?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if(Array.isArray(data)) setRealGames(data.slice(0, 250));
        setLoadingGames(false);
      })
      .catch(e => console.error("Error fetching games", e)).finally(() => setLoadingGames(false));
  }, []);

  const handleLaunchGame = async (gameId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to play");
      return;
    }
    try {
      toast.loading("Launching game...", { id: 'launch' });
      const res = await fetch('/api/v1/games/gregmorn/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId, demo: false })
      });
      const data = await res.json();
      toast.dismiss('launch');
      if (res.ok && data.url) {
          setGameUrl(data.url);
        } else {
        toast.error("Failed to launch game");
      }
    } catch (e) {
      toast.dismiss('launch');
      toast.error("Error launching game");
    }
  };

  const [isDepositMenuOpen, setIsDepositMenuOpen] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const router = useRouter();
  const { user, logout } = useUser();


  useEffect(() => {
    (window as any).handleLaunchGame = async (gameName: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to play games!");
        if (onLoginClick) onLoginClick();
        return;
      }
      toast.error(`"${gameName}" is a UI Demo. Please play real games from the 'Slot Game' section below!`, { duration: 4000 });
    };

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroBanners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Game Iframe Overlay */}
      <AnimatePresence>
        {gameUrl && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[500] bg-black flex flex-col"
          >
            <div className="h-12 bg-neutral-900 flex items-center justify-between px-4 border-b border-neutral-800 shrink-0">
              <span className="text-white font-bold text-sm">Playing Game</span>
              <button 
                onClick={() => setGameUrl(null)}
                className="bg-[#cc0000] hover:bg-[#ff0000] text-white px-4 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Close Game
              </button>
            </div>
            <iframe 
              src={gameUrl} 
              className="w-full flex-1 border-0"
              allow="autoplay; fullscreen"
            />
          </motion.div>
        )}
      </AnimatePresence>

<div className="min-h-screen w-full bg-[#111111] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMTExIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMTkxOTE5IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] text-white font-sans relative pb-[90px] sm:pb-[100px]">
      
      {/* Premium Top App Banner */}
      <div className="w-full max-w-md mx-auto bg-[#0a0a0a] flex items-center justify-between px-3 py-2 border-b border-neutral-900 sticky top-0 z-50 h-[50px]">
        
        {/* Left Side: X, Logo, Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button onClick={() => toast("Banner dismissed")} className="text-[#ffdf00] p-1 -ml-1 hover:opacity-80 transition-opacity shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <img src="/header-logo.jpg" alt="8111C" className="h-[28px] w-auto shrink-0 object-contain mix-blend-screen" />

          {/* Text ON ONE LINE */}
          <div className="truncate text-[13px] font-bold tracking-tight">
            <span className="text-white">Download app bonus </span>
            <span className="text-[#ffdf00]">Rs 888</span>
          </div>
        </div>
        
        {/* Right: Button */}
        <button onClick={() => toast.success("Downloading app...")} className="bg-[#cc0000] hover:bg-[#ff0000] text-white rounded-md font-bold text-[11px] leading-tight flex flex-col items-center justify-center h-[38px] px-3 shrink-0 ml-2 transition-colors">
          <span>Download</span>
          <span>now</span>
        </button>

      </div>

      {/* Main Header (Pixel Perfect & Responsive) */}
      <div className="w-full max-w-md mx-auto bg-[#0a0a0a] flex items-center justify-between px-3 sticky top-[50px] z-40 border-b border-neutral-900 h-[60px]">
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Custom Arrow Menu Icon */}
          <button onClick={() => setIsMenuOpen(true)} className="p-1 -ml-1 flex items-center justify-center text-[#ffdf00] shrink-0 hover:brightness-125 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M3 12H11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M3 17H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          {/* Custom Logo Image with screen blend mode to remove black background */}
          <div className="flex items-center shrink-0">
            <img src="/header-logo.jpg" alt="8111C" className="h-[38px] w-auto shrink-0 object-contain mix-blend-screen" />
          </div>
        </div>
        
                <div className="flex items-center gap-2 ml-auto shrink-0">
          {user ? (
            <>
              {/* Balance Pill */}
              <div className="flex items-center bg-black border border-[#1fdf1f]/30 rounded-[10px] px-1.5 py-1 h-[32px] gap-1.5 shrink-0 shadow-sm">
                <div className="w-[18px] h-[18px] bg-[#0d4026] rounded-full flex items-center justify-center text-[10px] text-[#1fdf1f] border border-[#1fdf1f]/50">
                  ☪
                </div>
                <span className="text-[#ffdf00] font-bold text-[14px]">{user.balance || "0.00"}</span>
                <button onClick={() => toast.success("Balance refreshed")} className="text-[#1fdf1f] hover:rotate-180 transition-transform duration-300 ml-0.5">
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Deposit Button */}
              <div className="relative shrink-0 ml-1">
                <div className="absolute -top-1.5 -right-1.5 bg-[#ff0b0b] text-white text-[9px] font-bold px-1 rounded-sm z-10 shadow-md transform rotate-12">
                  +3%
                </div>
                <div className="relative">
                  <div className="flex bg-[#66df2f] hover:bg-[#55cc25] text-black rounded-lg shadow-[0_2px_10px_rgba(102,223,47,0.3)] transition-colors h-[32px]">
                    <button onClick={() => window.location.href = '/deposit'} className="px-2.5 text-[13px] font-bold h-full flex items-center justify-center rounded-l-lg border-r border-black/10">
                      Deposit
                    </button>
                    <button onClick={() => setIsDepositMenuOpen(!isDepositMenuOpen)} className="px-1.5 h-full flex items-center justify-center rounded-r-lg">
                      <svg className="w-3.5 h-3.5 opacity-80 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                  {isDepositMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDepositMenuOpen(false)} />
                      <div className="absolute top-full right-0 mt-1.5 w-32 bg-[#1a1a1a] border border-[#ffdf00]/30 rounded-lg shadow-xl overflow-hidden z-50">
                        <button onClick={() => window.location.href = '/withdraw'} className="w-full text-left px-3 py-2 text-[13px] text-white hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2">
                          <span className="text-xl">💰</span> Withdraw
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={onLoginClick || (() => toast.success("Login coming soon"))} className="bg-[#0a0a0a] border border-[#ffdf00] text-[#ffdf00] px-3 py-1.5 rounded-[8px] text-[13px] font-medium min-w-[70px] tracking-tight shrink-0 shadow-sm hover:bg-[#1f1b02] transition-colors flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Login
              </button>
              
              <div className="relative shrink-0">
                <button onClick={onRegisterClick || (() => toast.success("Register coming soon"))} className="bg-[#cc0000] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-medium min-w-[80px] tracking-tight shrink-0 hover:bg-[#ff0000] transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 8v6m3-3h-6"></path>
                  </svg>
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto relative pt-4">
        
        {/* Quick Links (Pixel Perfect) */}
        <div className="grid grid-cols-6 gap-2 px-3 mb-4 mt-1">
          {[
            { name: "Invite", icon: <User className="w-6 h-6 text-[#ffdf00]" /> },
            { name: "VIP", icon: <Gem className="w-6 h-6 text-[#ffdf00]" /> },
            { name: "Receive", icon: <Gift className="w-6 h-6 text-[#ffdf00]" /> },
            { name: "Rebate", icon: <RefreshCcw className="w-6 h-6 text-[#ffdf00]" /> },
            { name: "Subsidy", icon: <CircleDollarSign className="w-6 h-6 text-[#ffdf00]" /> },
            { name: "Spins", icon: <Aperture className="w-6 h-6 text-[#ffdf00]" /> },
          ].map((item, i) => (
            <div key={i} onClick={() => {
    if (item.name === "Invite") window.location.href = "/invite";
    else if (item.name === "Spins" || item.name === "Rebate") window.location.href = "/promo";
    else toast.success(item.name + " opened");
  }} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full aspect-square rounded-[10px] bg-gradient-to-b from-[#2a0505] to-black border-t-[2px] border-t-[#ff0b0b] border-x border-b border-[#330000] flex items-center justify-center shadow-[0_0_12px_rgba(255,11,11,0.3)] mb-1">
                {item.icon}
              </div>
              <span className="text-white text-[11px] font-bold">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Main Banner (Animated Carousel) */}
        <div onClick={() => toast.success("Opening promotion...")} className="px-3 mb-3 relative h-[140px] cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`w-full h-full rounded-xl absolute inset-0 mx-3 overflow-hidden bg-gradient-to-r ${heroBanners[heroIndex].bg} border ${heroBanners[heroIndex].border} ${heroBanners[heroIndex].shadow}`}
              style={{ width: 'calc(100% - 24px)' }}
            >
              {/* Cyber matrix background effect */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.2)_50%,transparent_51%)] bg-[length:40px_100%]"></div>
              
              <div className="relative z-10 p-4 h-full flex flex-col justify-between w-[70%]">
                <h2 className={`${heroBanners[heroIndex].primaryText} font-black text-[22px] italic tracking-tight leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}>
                  {heroBanners[heroIndex].title}
                </h2>
                
                <div className={`bg-black/90 rounded-full border ${heroBanners[heroIndex].badgeBorder} px-2.5 py-1.5 my-1 shadow-sm inline-block w-fit`}>
                  <p className="text-white text-[11px] font-bold leading-tight whitespace-pre-line">
                    {heroBanners[heroIndex].subtitle}
                  </p>
                </div>
                
                <p className="text-white text-[12px] font-bold mt-1 tracking-tight">
                  {heroBanners[heroIndex].highlight.split(' ').map((word, i, arr) => 
                    (i === arr.length - 1 || i === arr.length - 2) ? 
                      <span key={i} className={`${heroBanners[heroIndex].highlightColor} mr-1`}>{word}</span> : 
                      <span key={i} className="mr-1">{word}</span>
                  )}
                </p>
              </div>
              
              {/* Right side placeholder for 3D elements */}
              <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, y: 10 }}
                  animate={{ scale: 1, y: -8 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-6xl drop-shadow-2xl translate-x-2"
                >
                  {heroBanners[heroIndex].emoji1}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-2 right-2 text-4xl drop-shadow-xl z-20"
                >
                  {heroBanners[heroIndex].emoji2}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-6 right-10 text-3xl drop-shadow-xl z-10"
                >
                  {heroBanners[heroIndex].emoji3}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {heroBanners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === heroIndex ? 'w-[12px] bg-white' : 'w-1.5 bg-white/40'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Alliance Cards (Pixel Perfect) */}
        <div className="px-3 mb-4 grid grid-cols-3 gap-2">
          {[
            { logo: "PKR365", text: "Rs 666", color: "from-[#2e0505]", border: "border-[#ff0b0b]", shadow: "shadow-[0_0_10px_rgba(255,11,11,0.3)]", icon: "🦅" },
            { logo: "PKRBET", text: "Rs 888", color: "from-[#0a1a2f]", border: "border-[#00aaff]", shadow: "shadow-[0_0_10px_rgba(0,170,255,0.2)]", icon: "🐔" },
            { logo: "PX8888", text: "Rs 888", color: "from-[#1a1a1a]", border: "border-[#ff0b0b]", shadow: "shadow-[0_0_10px_rgba(255,11,11,0.3)]", icon: "👑" },
          ].map((card, i) => (
            <div key={i} className={`relative rounded-xl bg-gradient-to-b ${card.color} to-[#0a0a0a] border border-neutral-800 border-b-[2px] ${card.border} p-1.5 flex flex-col items-center justify-between h-[85px] ${card.shadow}`}>
              {/* Red dot */}
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff3b30] rounded-full border border-black z-10 shadow-sm"></div>
              
              <h3 className="text-white font-black italic text-[14px] leading-tight flex items-center mt-1">
                 {card.logo}
              </h3>
              
              <div className="text-[28px] mt-auto mb-1 opacity-90 drop-shadow-md">{card.icon}</div>
              
              <div className="w-full bg-black/80 rounded-full py-[3px] px-1 border border-white/10 text-center relative z-10 mt-auto flex flex-col items-center">
                 <p className="text-[8px] text-white font-bold leading-none whitespace-nowrap mb-[2px]">Free to claim <span className="text-[#ffdf00]">{card.text}</span></p>
                 <div className="bg-black text-white text-[6px] border border-neutral-600 rounded-full py-[1px] px-1 font-bold leading-none w-fit">Cooperation Alliance</div>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee Bar (Pixel Perfect) */}
        <div className="px-3 mb-6 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#ff0b0b] shrink-0" />
          <div className="flex-1 overflow-hidden relative h-5 flex items-center border-r border-neutral-800">
             <p className="text-[#ffdf00] text-[13px] whitespace-nowrap absolute left-0 animate-marquee">
               Welcome to 8111C.com &nbsp;|&nbsp; Bigger Rewards &nbsp;|&nbsp; More Games &nbsp;|&nbsp; Play & Win!
             </p>
          </div>
          <div className="relative shrink-0 ml-1 mr-1">
            <Mail className="w-6 h-6 text-neutral-500" />
            <div className="absolute -top-1.5 -right-2 bg-[#ff3b30] text-white text-[10px] font-bold px-1 rounded-md min-w-[18px] text-center shadow-sm leading-tight border border-black">
              31
            </div>
          </div>
        </div>

        {/* Category Navigation Slider (Pixel Perfect) */}
        <div className="relative px-1 mb-8">
          {/* Left Arrow */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
            <button onClick={() => toast("Scrolling...")} className="w-6 h-6 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 shadow-md">
              <ChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
          </div>

          {/* Slider Container */}
          <div className="flex justify-between items-center overflow-x-hidden px-8">
            {[
              { name: "Slot", icon: "🎰" },
              { name: "Fishing", icon: "🦈" },
              { name: "Cards", icon: "🃏" },
              { name: "Live", icon: "👩‍💼" },
              { name: "Sports", icon: "⚽" },
            ].map((cat, i) => (
              <div key={i} onClick={() => toast.success(`Viewing ${cat.name} games`)} className="flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-[26px] mb-1 drop-shadow-md">{cat.icon}</span>
                <span className="text-[12px] text-neutral-400 font-medium">{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
            <button onClick={() => toast("Scrolling...")} className="w-6 h-6 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 shadow-md">
              <ChevronRight className="w-4 h-4 -mr-0.5" />
            </button>
          </div>
        </div>

        {/* Real Games Grid */}
          <div className="mb-8 px-4">
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,100,0,0.8)] -ml-1">🎰</span>
                <h2 className="text-[17px] font-bold text-white tracking-tight">Real Games</h2>
              </div>
            </div>

            {loadingGames ? (
              <div className="w-full flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-[#ff0b0b] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : realGames.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5">
                {realGames.map((game, gIdx) => (
                  <motion.div 
                    key={game.id || gIdx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLaunchGame(game.id)}
                    className="aspect-[3/4] bg-neutral-900 rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]"
                  >
                    <div className="absolute inset-0">
                      <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#cc0000] text-white text-[9px] font-bold rounded-bl-lg shadow-md z-10">
                      {game.provider}
                    </div>
                    <div className="mt-auto p-2 relative z-10">
                      <h3 className="text-white text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-md">{game.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center text-neutral-400 p-8">No games found.</div>
            )}
          </div>

          <Footer />
        
        {/* Floating TOP Button */}
        <div className="fixed bottom-[85px] right-4 z-50 pointer-events-auto">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="w-11 h-11 bg-black/90 backdrop-blur-md rounded-full border-[1.5px] border-[#ffdf00] flex flex-col items-center justify-center text-[#ffdf00] shadow-[0_0_15px_rgba(255,223,0,0.2)] hover:bg-[#1a1700] transition-transform duration-300 hover:scale-110"
          >
             <svg className="w-4 h-4 -mb-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
             <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">TOP</span>
          </button>
        </div>
      </div>
      
      
      {/* Sidebar Overlay (JJwin Style) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-[300px] h-full bg-[#1a1a1a] shadow-2xl flex flex-col overflow-hidden text-neutral-300">
            
            {/* Header */}
            <div className="px-4 py-3 bg-black flex items-center border-b border-neutral-800">
              <button onClick={() => setIsMenuOpen(false)} className="relative mr-4 p-1 cursor-pointer hover:bg-neutral-800 rounded-lg">
                <ArrowLeft className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-[#ff4747] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">6</span>
              </button>
              <img src="/header-logo.jpg" alt="Logo" className="h-[28px] object-contain mix-blend-screen" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-6 px-3 pt-3 flex flex-col gap-2">
              
              {/* Language Selector */}
              <div className="bg-[#242424] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-neutral-400" />
                  <span className="text-[14px]">English</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 rotate-90" />
              </div>

              {/* Search */}
              <div className="bg-[#242424] rounded-lg p-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-neutral-400" />
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[14px] text-white placeholder-neutral-400 w-full" />
              </div>

              {/* Game Categories Grid */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { name: "Hot", icon: "🔥" },
                  { name: "Mini Games", icon: "🎲" },
                  { name: "Slot", icon: "🎰" },
                  { name: "Fishing", icon: "🦈" },
                  { name: "Cards", icon: "🃏" },
                  { name: "Live", icon: "👩‍💼" },
                  { name: "Sports", icon: "⚽" },
                  { name: "Recent", icon: "🕒" },
                ].map((cat) => (
                  <button key={cat.name} onClick={() => { setIsMenuOpen(false); toast.success(`Viewing ${cat.name} games`); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[13px]">{cat.name}</span>
                  </button>
                ))}
                <button onClick={() => { setIsMenuOpen(false); toast.success("Viewing Favorites"); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1">
                    <span className="text-2xl">⭐</span>
                    <span className="text-[13px]">Favorites</span>
                </button>
              </div>

              {/* List Actions */}
              <div className="flex flex-col gap-1.5 mt-2">
                <button onClick={() => { setIsMenuOpen(false); router.push('/profile'); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">
                  <FileText className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-[14px]">Bet Record</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/invite'); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">
                  <Share2 className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-[14px]">Share</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/invite'); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">
                  <Users className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-[14px]">Invite</span>
                </button>
              </div>

              {/* Offer Center */}
              <div className="mt-3 text-center text-neutral-500 text-[13px]">Offer Center</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Event</span>
                  <span className="absolute -top-1 right-0 bg-[#ff4747] text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center z-20">3</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">🎯</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Mission</span>
                  <span className="absolute -top-1 right-0 bg-[#ff4747] text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center z-20">1</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">📅</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Spins</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">🎡</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Rebate</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">💰</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">VIP</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">👑</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/deposit"); }} className="relative bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Fund</span>
                  <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-1 rounded-bl-lg z-20">50%</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">👛</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative leading-tight">Unclaim<br/>ed</span>
                  <span className="absolute -top-1 right-0 bg-[#ff4747] text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center z-20">2</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">🎁</div>
                </div>
                <div onClick={() => { setIsMenuOpen(false); router.push("/profile"); }} className="relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">History</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">📜</div>
                </div>
              </div>

              {/* Text Links */}
              <div className="flex flex-col gap-1 mt-4">
                <button onClick={() => { setIsMenuOpen(false); toast.success("Downloading app..."); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Download className="w-5 h-5 shrink-0" /> <span className="text-[14px]">APP Download</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Headset className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Customer Service</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <HelpCircle className="w-5 h-5 shrink-0" /> <span className="text-[14px]">FAQ</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); toast.success("About 8111c.com V1.0"); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Info className="w-5 h-5 shrink-0" /> <span className="text-[14px]">About 8111c.com</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <MapPin className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Find us</span>
                </button>
                <button onClick={() => toast.success("Night mode toggled!")} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Moon className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Night mode</span>
                </button>
              </div>

              {/* Official Channels */}
              <div className="mt-4 mb-2 text-neutral-500 text-[13px] px-2 text-left w-full">Official Channel</div>
              <div className="flex flex-col gap-1">
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-[#25D366] flex items-center justify-center shrink-0"><MessageCircle className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Whatsapp Channel</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-[#1877F2] flex items-center justify-center shrink-0"><Web className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Facebook channel</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0"><Camera className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Instagram channel</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-[#0088cc] flex items-center justify-center shrink-0"><Send className="w-4 h-4 text-white -ml-0.5" /></div>
                  <span className="text-[14px]">Telegram channel</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-black border border-neutral-700 flex items-center justify-center shrink-0"><MessageSquare className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Twitter</span>
                </button>
              </div>

              {!user && (
                <div className="mt-4 pt-4 border-t border-neutral-800 pb-8 flex flex-col w-full">
                  <button onClick={() => { setIsMenuOpen(false); onLoginClick?.(); }} className="w-full bg-neutral-800 text-white font-bold py-2.5 rounded-lg mb-2 hover:brightness-110">Login</button>
                  <button onClick={() => { setIsMenuOpen(false); onRegisterClick?.(); }} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-2.5 rounded-lg hover:brightness-110">Register</button>
                </div>
              )}
              {user && (
                <div className="mt-4 pt-4 border-t border-neutral-800 pb-8 flex flex-col w-full">
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full bg-neutral-800 text-neutral-400 font-bold py-2.5 rounded-lg hover:bg-[#cc0000] hover:text-white transition-colors">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
<BottomNav />
    </div>
    </>
  );
}

