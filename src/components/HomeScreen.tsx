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
  { imageUrl: "/banners/banner1.jpg" },
  { imageUrl: "/banners/banner2.jpg" },
  { imageUrl: "/banners/banner3.jpg" },
  { imageUrl: "/banners/banner4.jpg" },
  { imageUrl: "/banners/banner5.jpg" }
];

import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
export default function HomeScreen({ onLoginClick, onRegisterClick }: { onLoginClick?: () => void, onRegisterClick?: () => void }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [realGames, setRealGames] = useState<any[]>([]);
  const [dynamicWinners, setDynamicWinners] = useState<any[]>([]);

  useEffect(() => {
    if (realGames.length > 0) {
      const winners = [];
      for (let i = 0; i < 20; i++) {
        const randomGame = realGames[Math.floor(Math.random() * realGames.length)];
        const randomUser = `${Math.floor(Math.random() * 9) + 1}***${Math.floor(Math.random() * 90) + 10}`;
        const randomAmount = (Math.random() * 200000 + 10000).toLocaleString('en-US', { maximumFractionDigits: 0 });
        winners.push({
          gameId: randomGame.id,
          provider: randomGame.provider || 'Slot',
          title: randomGame.title || randomGame.name || 'Game',
          img: randomGame.imageUrl,
          user: randomUser,
          amount: randomAmount
        });
      }
      setDynamicWinners([...winners, ...winners, ...winners]);
    }
  }, [realGames]);

  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [pages, setPages] = useState<any>({ hot: 0, mini: 0, slot: 0, fishing: 0, cards: 0, live: 0, sports: 0 });
  
  

  const handleLaunchGame = async (gameId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to play");
      return;
    }
    try {
      toast.loading("Launching game...", { id: 'launch' });
      const res = await fetch('https://8111c.com/api/v1/games/gregmorn/launch', {
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
      fetch('https://8111c.com/api/v1/games/gregmorn/list?t=' + Date.now())
        .then(r => r.json())
        .then(data => { if(Array.isArray(data)) setRealGames(data); }).finally(() => setIsLoadingGames(false))
        .catch(e => console.error("Error fetching games", e));
        
      (window as any).handleLaunchGame = async (gameIdOrName: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to play games!");
          if (onLoginClick) onLoginClick();
          return;
        }
        
        if (gameIdOrName.length < 10) {
           toast.error(`"${gameIdOrName}" is a UI Demo. Please play real games from the 'Slot Game' section below!`, { duration: 4000 });
           return;
        }

        try {
          toast.loading("Launching game...", { id: 'launch' });
          const API_URL = "https://8111c.com/api/v1";
          const res = await fetch(`${API_URL}/games/gregmorn/launch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ gameId: gameIdOrName, demo: false })
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
          toast.error("An error occurred");
          console.error(e);
        }
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
              className="w-full h-full rounded-xl absolute inset-0 mx-3 overflow-hidden shadow-[0_0_15px_rgba(255,11,11,0.3)] border border-[#ff0b0b]"
              style={{ width: 'calc(100% - 24px)' }}
            >
              <img src={heroBanners[heroIndex].imageUrl} className="w-full h-full object-cover" alt="Promotion Banner" />
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

        {/* Alliance Cards (Beautiful) */}
        <div className="px-3 mb-5 grid grid-cols-3 gap-2.5">
          {[
            { logo: "PKR365", text: "Rs 666", color: "from-[#3a0a0a]", border: "border-[#ff0b0b]", shadow: "shadow-[0_0_15px_rgba(255,11,11,0.2)]", icon: "🦅" },
            { logo: "PKRBET", text: "Rs 888", color: "from-[#0a203f]", border: "border-[#00aaff]", shadow: "shadow-[0_0_15px_rgba(0,170,255,0.2)]", icon: "🐔" },
            { logo: "PX8888", text: "Rs 888", color: "from-[#2a2a2a]", border: "border-[#ffdf00]", shadow: "shadow-[0_0_15px_rgba(255,223,0,0.15)]", icon: "👑" },
          ].map((card, i) => (
            <div key={i} className={`relative rounded-2xl bg-gradient-to-b ${card.color} to-black border border-neutral-800 border-b-[3px] ${card.border} p-2 flex flex-col items-center justify-between h-[95px] ${card.shadow} hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden group`}>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Red dot */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#ff3b30] rounded-bl-xl flex items-center justify-center z-10 shadow-sm border-l border-b border-black">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="font-black italic text-[15px] leading-tight flex items-center mt-1 bg-gradient-to-r from-white via-gray-200 to-gray-400 text-transparent bg-clip-text drop-shadow-md">
                 {card.logo}
              </h3>
              
              <div className="text-[32px] mt-auto mb-1 opacity-95 drop-shadow-xl group-hover:scale-110 transition-transform">{card.icon}</div>
              
              <div className="w-full rounded-full overflow-hidden border border-white/10 text-center relative z-10 mt-auto flex flex-col">
                 <div className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 py-[3px]">
                   <p className="text-[9px] text-black font-black leading-none whitespace-nowrap drop-shadow-sm">Free to claim {card.text}</p>
                 </div>
                 <div className="bg-neutral-900 text-white/70 text-[6px] py-[2px] font-bold leading-none tracking-widest uppercase">Alliance</div>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee Bar (Beautiful) */}
        <div className="px-3 mb-7">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] rounded-full border border-neutral-800 p-1.5 shadow-inner relative overflow-hidden">
            <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-[#141414] to-transparent z-10"></div>
            
            <div 
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const msg = new SpeechSynthesisUtterance("Welcome to 8 1 1 1 C dot com. We wish you a big win!");
                  msg.rate = 0.9;
                  msg.pitch = 1.1;
                  window.speechSynthesis.speak(msg);
                  toast.success("Playing welcome message!");
                }
              }}
              className="bg-gradient-to-br from-red-600 to-red-900 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,0,0.4)] z-20 cursor-pointer hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(255,0,0,0.8)]"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 overflow-hidden relative h-6 flex items-center">
               <motion.div 
                 animate={{ x: [0, -400] }}
                 transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                 className="whitespace-nowrap flex gap-4"
               >
                 <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[13px] font-medium pr-10">
                   Welcome to 8111C.com &nbsp;✨&nbsp; Bigger Rewards &nbsp;✨&nbsp; More Games &nbsp;✨&nbsp; Play & Win Big Today!
                 </p>
                 <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[13px] font-medium pr-10">
                   Welcome to 8111C.com &nbsp;✨&nbsp; Bigger Rewards &nbsp;✨&nbsp; More Games &nbsp;✨&nbsp; Play & Win Big Today!
                 </p>
               </motion.div>
            </div>
            
            <div className="absolute right-0 w-12 h-full bg-gradient-to-l from-[#141414] to-transparent z-10"></div>
            
            <div className="relative shrink-0 ml-1 mr-2 z-20 cursor-pointer hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-neutral-400 hover:text-white transition-colors" />
              <div className="absolute -top-1.5 -right-2 bg-[#ff0b0b] text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center shadow-[0_0_8px_rgba(255,11,11,0.6)] leading-tight border border-black animate-pulse">
                31
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Slider (Beautiful) */}
        <div className="relative px-0 mb-8">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>

          {/* Left Arrow */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => {
              const container = document.getElementById('category-scroll-container');
              if (container) container.scrollBy({ left: -100, behavior: 'smooth' });
            }} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">
              <ChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
          </div>

          {/* Slider Container */}
          <div id="category-scroll-container" className="flex justify-between items-center overflow-x-auto no-scrollbar px-10 gap-4" style={{ scrollBehavior: 'smooth' }}>
            {[
              { name: "Mini", id: "section-mini", icon: "🎲" },
              { name: "Slot", id: "section-slot", icon: "🎰", active: true },
              { name: "Fishing", id: "section-fishing", icon: "🦈" },
              { name: "Cards", id: "section-cards", icon: "🃏" },
              { name: "Live", id: "section-live", icon: "👩‍💼" },
              { name: "Sports", id: "section-sports", icon: "⚽" },
            ].map((cat, i) => (
              <div key={i} onClick={() => {
                const el = document.getElementById(cat.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  toast.success(`Jumped to ${cat.name} games`);
                }
              }} className="flex flex-col items-center cursor-pointer group shrink-0">
                <div className={`w-[54px] h-[54px] rounded-[18px] flex flex-col items-center justify-center mb-2 transition-all duration-300 ${cat.active ? 'bg-gradient-to-br from-[#ffdf00] to-[#ffaa00] shadow-[0_0_15px_rgba(255,223,0,0.4)] scale-110' : 'bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] border border-neutral-800 shadow-inner group-hover:border-neutral-600 group-hover:scale-105'}`}>
                  <span className={`text-[28px] drop-shadow-md transition-transform ${cat.active ? 'scale-110' : 'grayscale-[0.3] group-hover:grayscale-0'}`}>{cat.icon}</span>
                </div>
                <span className={`text-[13px] font-bold tracking-tight transition-colors ${cat.active ? 'text-[#ffdf00]' : 'text-neutral-500 group-hover:text-neutral-300'}`}>{cat.name}</span>
                {cat.active && <div className="w-1 h-1 bg-[#ffdf00] rounded-full mt-1 shadow-[0_0_5px_#ffdf00]"></div>}
              </div>
            ))}
          </div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

          {/* Right Arrow */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => {
              const container = document.getElementById('category-scroll-container');
              if (container) container.scrollBy({ left: 100, behavior: 'smooth' });
            }} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">
              <ChevronRight className="w-4 h-4 -mr-0.5" />
            </button>
          </div>
        </div>

        {/* GLOBAL SEARCH BAR */}
        <div className="px-4 mb-6">
          <div className="relative w-full h-12 bg-[#141414] rounded-full border border-neutral-800 shadow-inner flex items-center px-4 overflow-hidden focus-within:border-[#cc0000] focus-within:shadow-[0_0_15px_rgba(204,0,0,0.3)] transition-all">
            <svg className="w-5 h-5 text-neutral-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search for any game..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-transparent text-white placeholder-neutral-600 text-sm focus:outline-none"
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch("")} className="ml-2 w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-white hover:bg-neutral-700">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {globalSearch ? (
          <div className="mb-8 px-4">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[20px]">🔍</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Search Results</h2>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {realGames.filter((g: any) => (g.title || g.name)?.toLowerCase().includes(globalSearch.toLowerCase())).map((game: any, gIdx: number) => (
                <motion.div 
                  key={gIdx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                  className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-[45px] drop-shadow-2xl">
                    {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                  </div>
                  <div className="w-full text-center mt-auto relative z-10 pb-2">
                    <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md bg-black/60 mx-1 rounded">{game.title || game.name}</div>
                  </div>
                </motion.div>
              ))}
              {realGames.filter((g: any) => (g.title || g.name)?.toLowerCase().includes(globalSearch.toLowerCase())).length === 0 && (
                <div className="col-span-3 text-center text-neutral-500 py-10">No games found matching "{globalSearch}"</div>
              )}
            </div>
          </div>
        ) : (
          <>

        {/* Single Main Grid Section (Hot) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,100,0,0.8)] -ml-1">🔥</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Hot</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => setPages((p: any) => ({ ...p, hot: Math.max(0, p.hot - 1) }))} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => setPages((p: any) => ({ ...p, hot: p.hot + 1 }))} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Unified Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(0 + pages.hot * 21, 0 + (pages.hot + 1) * 21).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                {/* Top Bar */}
                <div className="w-full flex justify-between items-start p-1.5 z-10 relative">
                  <div className="flex gap-1 items-center">
                    {game.hot && (
                      <span className="text-[8px] bg-[#cc0000] text-white font-black px-1 rounded-sm italic leading-tight shadow-md">HOT</span>
                    )}
                    <span className="text-[14px] font-black italic drop-shadow-md text-transparent bg-clip-text bg-gradient-to-b from-[#ffdf00] to-[#ffaa00]" style={{WebkitTextStroke: "0.5px white"}}>{game.logo}</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm">
                    <svg className="w-3 h-3 text-neutral-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                </div>

                {/* Main graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[45px] drop-shadow-2xl">
                  {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                </div>
                
                {/* Free to claim pill (Matches Screenshot) */}
                <div className="absolute bottom-7 w-[90%] left-[5%] bg-black border border-[#ffdf00] rounded-full py-0.5 text-center z-20 shadow-md">
                   <span className="text-white text-[9px] font-bold">Free to claim <span className="text-[#ffdf00]">Rs 888</span></span>
                </div>

                {/* Bottom Name Plate */}
                <div className="w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 pb-1.5 text-center mt-auto relative z-10">
                  <span className="text-[12px] font-black tracking-tight text-white drop-shadow-md">{game.title || game.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Mini Games Section (Pixel Perfect) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col items-center justify-center w-5 h-5 relative mr-1">
                 <div className="w-2 h-2 bg-[#00aaff] rounded-[1px] absolute top-0.5 transform rotate-45 shadow-[0_0_5px_#00aaff]"></div>
                 <div className="w-2 h-2 bg-[#00aaff] rounded-[1px] absolute bottom-0.5 left-0.5 transform rotate-45 shadow-[0_0_5px_#00aaff]"></div>
                 <div className="w-2 h-2 bg-[#00aaff] rounded-[1px] absolute bottom-0.5 right-0.5 transform rotate-45 shadow-[0_0_5px_#00aaff]"></div>
              </div>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Mini Games</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => toast("Previous page")} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => toast("Next page")} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Unified Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(21, 33).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                {/* Main graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[45px] drop-shadow-2xl -translate-y-4">
                  {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                </div>
                
                {/* Fake popups for specific games */}
                {game.popups?.includes("coin") && (
                  <div className="absolute bottom-2 left-0 w-12 h-12 bg-gradient-to-br from-[#ff0b0b] to-[#cc0000] rounded-full flex items-center justify-center shadow-lg border-2 border-[#ffdf00] -translate-x-3 z-20">
                     <span className="text-[8px] font-bold text-white">Rs600</span>
                  </div>
                )}

                {/* Bottom Name Plate */}
                <div className="w-full text-center mt-auto relative z-10 pb-2">
                  <div className="text-[14px] font-black italic drop-shadow-md text-white mb-0.5" style={{WebkitTextStroke: "0.5px white"}}>{game.logo}</div>
                  <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md">{game.title || game.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Slot Section (Pixel Perfect) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)] -ml-1">🎰</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Slot</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => setPages((p: any) => ({ ...p, slot: Math.max(0, p.slot - 1) }))} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => setPages((p: any) => ({ ...p, slot: p.slot + 1 }))} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Slot Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(33 + pages.slot * 9, 33 + (pages.slot + 1) * 9).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                
                {game.collage ? (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex w-full h-[55%]">
                       <div className={`w-1/2 h-full ${game.collage[0]} flex justify-center items-center text-3xl border-r border-b border-white/20`}>{game.graphic[0]}</div>
                       <div className={`w-1/2 h-full ${game.collage[1]} flex justify-center items-center text-3xl border-b border-white/20`}>{game.graphic[1]}</div>
                    </div>
                    <div className={`w-full h-[45%] ${game.collage[2]} flex justify-center items-center text-4xl`}>{game.graphic[2]}</div>
                    
                    {/* SVG overlay for the V shaped partition (simulated with standard borders above, but lets add a subtle inset shadow) */}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[45px] drop-shadow-2xl -translate-y-4">
                    {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                  </div>
                )}
                
                {/* Fake popups for specific games */}
                {game.popups?.includes("coin_top") && (
                  <div className="absolute top-2 left-0 w-12 h-12 bg-gradient-to-br from-[#ff0b0b] to-[#cc0000] rounded-full flex items-center justify-center shadow-lg border-2 border-[#ffdf00] -translate-x-3 z-20">
                     <span className="text-[8px] font-bold text-white">Rs600</span>
                  </div>
                )}
                {game.popups?.includes("wheel_bottom") && (
                  <div className="absolute bottom-6 left-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#ffdf00] -translate-x-2 z-20">
                     <div className="absolute bottom-0 w-full bg-[#cc0000] text-white text-[8px] font-bold text-center border-2 border-[#ffdf00] rounded">Rs 888</div>
                  </div>
                )}
                {game.popups?.includes("aviator_multiplier") && (
                  <div className="absolute top-1/2 right-0 w-14 h-12 bg-black/90 rounded-l flex flex-col items-center justify-center shadow-lg border border-neutral-700 z-20 overflow-hidden translate-x-1">
                     <span className="text-[20px] text-[#ff3366] -mt-1 leading-none drop-shadow-md">🛩️</span>
                     <span className="text-white text-[9px] font-black mt-1">354.77x</span>
                     {/* Green X Close button on popup */}
                     <div className="absolute -top-1.5 right-1 w-3 h-3 bg-neutral-800 rounded-full border border-neutral-600 flex items-center justify-center">
                        <span className="text-white text-[6px]">x</span>
                     </div>
                  </div>
                )}

                {/* Bottom Name Plate */}
                <div className="w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 pb-2 text-center mt-auto relative z-10">
                  <div className="text-[14px] font-black italic drop-shadow-md text-white mb-0.5" style={{WebkitTextStroke: "0.5px white"}}>{game.logo}</div>
                  <div className="text-[12px] font-medium tracking-tight text-white drop-shadow-md">{game.title || game.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Fishing Section (Pixel Perfect) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(0,100,255,0.6)] -ml-1 transform -scale-x-100">🦈</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Fishing</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => setPages((p: any) => ({ ...p, fishing: Math.max(0, p.fishing - 1) }))} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => setPages((p: any) => ({ ...p, fishing: p.fishing + 1 }))} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Unified Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(42 + pages.fishing * 6, 42 + (pages.fishing + 1) * 6).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                {/* Main graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[55px] drop-shadow-2xl -translate-y-4">
                  {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                </div>
                
                {/* Bottom Name Plate */}
                <div className="w-full text-center mt-auto relative z-10 pb-2">
                  <div className="font-black italic drop-shadow-md text-white mb-0.5" style={{WebkitTextStroke: "0.5px white"}}>{game.logo}</div>
                  <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md">{game.title || game.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cards Section (Pixel Perfect) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)] -ml-1">🃏</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Cards</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => setPages((p: any) => ({ ...p, cards: Math.max(0, p.cards - 1) }))} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => setPages((p: any) => ({ ...p, cards: p.cards + 1 }))} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Unified Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(48 + pages.cards * 6, 48 + (pages.cards + 1) * 6).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                {/* Main graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[55px] drop-shadow-2xl -translate-y-4">
                  {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                </div>
                
                {/* Fake popups for specific games */}
                {game.popups?.includes("coin_top") && (
                  <div className="absolute top-4 left-0 w-11 h-11 bg-gradient-to-br from-[#ff0b0b] to-[#cc0000] rounded-full flex items-center justify-center shadow-lg border-2 border-[#ffdf00] -translate-x-2 z-20">
                     <span className="text-[7px] font-bold text-white">Rs600</span>
                  </div>
                )}
                {game.popups?.includes("huge_bottom") && (
                  <div className="absolute bottom-6 -left-2 flex flex-col items-start z-20 transform scale-90">
                     <span className="text-3xl drop-shadow-xl translate-x-3 translate-y-2">🛩️</span>
                     <div className="bg-[#ffdf00] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-lg whitespace-nowrap">Rs 10000</div>
                  </div>
                )}
                {game.popups?.includes("trophies") && (
                  <div className="absolute bottom-6 -right-2 flex flex-col items-center z-20">
                     <span className="text-4xl drop-shadow-xl translate-y-2">🏆</span>
                     <span className="text-3xl drop-shadow-xl absolute right-5 top-2 scale-75 opacity-90">🏆</span>
                     <span className="text-3xl drop-shadow-xl absolute left-5 top-2 scale-75 opacity-90">🏆</span>
                  </div>
                )}

                {/* Bottom Name Plate */}
                <div className="w-full text-center mt-auto relative z-10 pb-2">
                  <div className="font-black italic drop-shadow-md text-white mb-0.5" style={{WebkitTextStroke: "0.5px white"}}>{game.logo}</div>
                  <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md">{game.title || game.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Live Section (Pixel Perfect) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)] -ml-1">👩‍💼</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Live</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => setPages((p: any) => ({ ...p, live: Math.max(0, p.live - 1) }))} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => setPages((p: any) => ({ ...p, live: p.live + 1 }))} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Unified Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(54 + pages.live * 6, 54 + (pages.live + 1) * 6).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                {/* Optional Star in Top Right */}
                {game.star && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm z-20">
                    <svg className="w-3.5 h-3.5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                )}
              
                {/* Main graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[55px] drop-shadow-2xl -translate-y-4">
                  {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                </div>
                
                {/* Bottom Name Plate */}
                <div className="w-full text-center mt-auto relative z-10 pb-2">
                  <div className="font-black italic drop-shadow-md text-white mb-0.5">{game.logo}</div>
                  <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md">{game.title || game.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sports Section (Pixel Perfect) */}
        <div className="mb-8 px-4">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)] -ml-1">⚽</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Sports</h2>
            </div>
            
            {/* Pill Navigation: <- | All | -> */}
            <div className="flex items-center text-[11px] text-white font-bold bg-[#141414] border border-neutral-800 rounded-full overflow-hidden h-7 shadow-sm">
              <button onClick={() => setPages((p: any) => ({ ...p, sports: Math.max(0, p.sports - 1) }))} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => setPages((p: any) => ({ ...p, sports: p.sports + 1 }))} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Unified Game Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {realGames.slice(60 + pages.sports * 6, 60 + (pages.sports + 1) * 6).map((game: any, gIdx: number) => (
              <motion.div 
                key={gIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                className={`aspect-[3/4] ${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]`}
              >
                {/* Optional Star in Top Right */}
                {game.star && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm z-20">
                    <svg className="w-3.5 h-3.5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                )}
              
                {/* Main graphic placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[55px] drop-shadow-2xl -translate-y-4">
                  {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                </div>

                {/* Fake popups for specific games */}
                {game.popups?.includes("coin_top") && (
                  <div className="absolute top-4 left-0 w-11 h-11 bg-gradient-to-br from-[#ff0b0b] to-[#cc0000] rounded-full flex items-center justify-center shadow-lg border-2 border-[#ffdf00] -translate-x-2 z-20">
                     <span className="text-[7px] font-bold text-white">Rs600</span>
                  </div>
                )}
                {game.popups?.includes("wheel_bottom") && (
                  <div className="absolute bottom-6 left-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#ffdf00] -translate-x-2 z-20">
                     <div className="absolute bottom-0 w-full bg-[#ffdf00] text-white text-[7px] font-bold text-center border-2 border-white rounded">Rs 888</div>
                  </div>
                )}
                {game.popups?.includes("deposit_rewards") && (
                  <div className="absolute bottom-6 right-0 flex flex-col items-center z-20 transform scale-90 translate-x-1">
                     <span className="text-2xl drop-shadow-xl absolute top-1 -left-2 z-10">🪙</span>
                     <span className="text-4xl drop-shadow-xl text-yellow-300 font-black italic z-0 -translate-y-2">10%</span>
                     <div className="text-white text-[8px] font-black leading-none drop-shadow-md z-20 -mt-2">Deposit rewards</div>
                     <div className="text-yellow-400 text-[10px] font-black leading-none drop-shadow-md z-20 mt-0.5">7 days</div>
                     {/* Green X Close button on popup */}
                     <div className="absolute top-2 left-2 w-4 h-4 bg-black/60 rounded-full border border-neutral-600 flex items-center justify-center z-30 shadow-md">
                        <span className="text-white text-[8px] font-bold">x</span>
                     </div>
                  </div>
                )}
                
                {/* Bottom Name Plate */}
                <div className="w-full text-center mt-auto relative z-10 pb-2">
                  <div className="font-black italic drop-shadow-md text-white mb-0.5 flex justify-center">{game.logo}</div>
                  <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md">{game.title || game.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Grand Prize Record */}
        <div className="mb-8 px-4 pb-4">
          <div className="bg-[#1c1c1c] rounded-xl py-3.5 overflow-hidden shadow-lg border border-neutral-800/50">
            {/* Title */}
            <h2 className="text-center text-[13px] text-white font-medium mb-3 flex items-center justify-center gap-1.5">
              <div className="flex gap-0.5 opacity-50">
                <div className="w-1.5 h-1.5 border border-white transform rotate-45"></div>
                <div className="w-1.5 h-1.5 bg-white transform rotate-45"></div>
              </div>
              Grand Prize Record
              <div className="flex gap-0.5 opacity-50">
                <div className="w-1.5 h-1.5 bg-white transform rotate-45"></div>
                <div className="w-1.5 h-1.5 border border-white transform rotate-45"></div>
              </div>
            </h2>
            
            {/* Left to Right Marquee Container */}
            <div className="w-full overflow-hidden relative">
              {/* Fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1c1c1c] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#1c1c1c] to-transparent z-10 pointer-events-none"></div>
              
              {/* Left-to-right animation */}
              <motion.div 
                animate={{ x: ["-50%", "0%"] }} 
                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                className="flex gap-4 w-max px-2"
              >
                {(dynamicWinners.length > 0 ? dynamicWinners : marqueeWinners).map((winner, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { if(winner.gameId) { const w = window as any; if(w.handleLaunchGame) w.handleLaunchGame(winner.gameId); else toast.error("Loading game..."); } else toast.error("Loading..."); }}
                    className="flex flex-col items-center w-[75px] shrink-0 cursor-pointer group"
                  >
                    {/* Game Icon */}
                    <div className={`w-[75px] h-[75px] rounded-[14px] ${winner.img && winner.img.startsWith('http') ? 'bg-neutral-900 border border-neutral-800' : winner.img || 'bg-gradient-to-br from-green-400 to-emerald-600'} flex flex-col items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,223,0,0.4)] transition-all`}>
                       {winner.img && winner.img.startsWith('http') ? (
                         <img src={winner.img} className="w-full h-full object-cover absolute inset-0 z-0" alt="game" />
                       ) : (
                         <span className="text-4xl drop-shadow-lg mt-2">{winner.icon || '🎰'}</span>
                       )}
                       <div className="absolute top-0 w-full bg-black/60 backdrop-blur-sm z-10 text-center py-[2px] border-b border-white/10">
                         <span className="text-white/90 text-[9px] font-black tracking-widest uppercase">{winner.provider ? winner.provider.substring(0, 8) : winner.game}</span>
                       </div>
                    </div>
                    {/* User */}
                    <div className="text-center w-full mt-0.5">
                       <span className="text-neutral-400 text-[10px] tracking-widest">{winner.user}</span>
                       <span className="text-[#ff3333] text-[10px] ml-1 font-bold">win</span>
                    </div>
                    {/* Amount */}
                    <div className="flex items-center justify-center gap-0.5 mt-0.5 bg-neutral-900/50 px-1.5 py-0.5 rounded-full border border-neutral-800">
                       <span className="text-yellow-500 text-[8px] font-black border border-yellow-500 rounded-full w-[13px] h-[13px] flex items-center justify-center pt-[1px]">Rs</span>
                       <span className="text-yellow-500 text-[12px] font-black tracking-tighter leading-none">{winner.amount}</span>
                       <span className="text-neutral-500 text-[10px] leading-none ml-0.5">›</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        
        </>
        )
        }

        {/* Fixed Left Global Popups */}
        <div className="fixed top-[45%] left-1 -translate-y-1/2 z-50 flex flex-col items-start pointer-events-none">
          
          {/* Top Coin Popup */}
          <div onClick={() => toast.success("Claimed bonus!")} className="relative mb-3 pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:translate-x-1">
            {/* Green arrow indicator */}
            <div className="absolute -left-1 z-20 w-4 h-4 bg-[#ffdf00] rounded-full flex items-center justify-center shadow-md">
               <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            </div>
            
            <div className="w-[42px] h-[42px] bg-gradient-to-br from-[#ff0b0b] to-[#cc0000] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,200,0,0.5)] border-2 border-[#ffdf00] relative z-10 ml-1.5">
               <span className="text-[9px] font-black text-white italic drop-shadow-sm">Rs600</span>
               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center shadow-lg border border-neutral-700 group-hover:bg-neutral-800 transition-colors">
                 <span className="text-white text-[7px] font-bold">x</span>
               </div>
            </div>
          </div>
          
          {/* Bottom Wheel Popup */}
          <div onClick={() => toast.success("Opening lucky wheel!")} className="relative pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:translate-x-1">
            <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center shadow-xl border-[2.5px] border-[#ffdf00] relative z-10">
               <div className="absolute -top-1.5 right-0 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center shadow-lg border border-neutral-700 group-hover:bg-neutral-800 transition-colors z-30">
                 <span className="text-white text-[7px] font-bold">x</span>
               </div>
               {/* Inner wheel mockup */}
               <div className="w-7 h-7 rounded-full border border-pink-400 flex items-center justify-center overflow-hidden shadow-inner">
                 <div className="w-3 h-3 bg-[#ffdf00] rounded-full absolute shadow-inner"></div>
               </div>
               <div className="absolute -bottom-1 w-[110%] bg-[#ffdf00] text-white text-[8px] font-black text-center rounded px-0.5 shadow-md">Rs 500</div>
               
               <div className="absolute -top-2 -left-1 text-[13px] drop-shadow-md z-20 pointer-events-none">🐔</div>
               <div className="absolute top-1 -right-3 text-[18px] drop-shadow-md z-0 pointer-events-none">💃</div>
            </div>
          </div>
        </div>

        {/* Fixed Right Global Popups */}
        <div className="fixed top-[35%] sm:top-[40%] right-1 -translate-y-1/2 z-50 flex flex-col items-end pointer-events-none">
          
          {/* Deposit Rewards Popup */}
          <div onClick={() => toast.success("Viewing deposit rewards!")} className="relative pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:-translate-x-1">
            <div className="flex flex-col items-center bg-black/95 p-1.5 rounded-xl border border-yellow-400/80 shadow-[0_0_12px_rgba(255,200,0,0.2)] relative z-10 w-[50px]">
              <div className="absolute top-0 right-1 w-3.5 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center shadow-lg z-30 border border-neutral-700 group-hover:bg-neutral-800 transition-colors">
                 <span className="text-white text-[7px] font-bold">x</span>
              </div>
              <span className="text-[14px] drop-shadow-xl absolute top-1.5 left-0 z-10">🪙</span>
              <span className="text-[28px] drop-shadow-xl text-yellow-300 font-black italic z-0 leading-none mt-1" style={{textShadow: "0 2px 6px rgba(0,0,0,0.8)"}}>15<span className="text-[12px]">%</span></span>
              <div className="text-white text-[6px] font-black leading-none drop-shadow-md z-20 mt-1 text-center">Deposit rewards</div>
              <div className="text-yellow-400 text-[7px] font-black leading-none drop-shadow-md z-20 mt-0.5 mb-0.5">15 days</div>
            </div>
          </div>
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

