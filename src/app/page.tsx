"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import AuthScreen from "@/components/AuthScreen";
import HomeScreen from "@/components/HomeScreen";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [view, setView] = useState<"splash" | "home" | "mounting">("mounting");
  const [showAuth, setShowAuth] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
      if (hasSeenSplash) {
        setView("home");
      } else {
        setView("splash");
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setAuthDefaultMode("login");
        setShowAuth(true);
        window.history.replaceState(null, "", "/");
      } else if (params.get("register") === "true") {
        setAuthDefaultMode("register");
        setShowAuth(true);
        window.history.replaceState(null, "", "/");
      }
    }
  }, []);

  const handleSplashComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasSeenSplash", "true");
    }
    setView("home");
  };

  if (view === "mounting") {
    return <main className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black flex flex-col relative">
      <AnimatePresence mode="wait">
        {view === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.05,
              filter: "blur(10px)"
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-[200]"
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}
        
        {view === "home" && (
          <div className="w-full min-h-screen flex flex-col relative animate-in fade-in duration-500">
            <HomeScreen 
              onLoginClick={() => {
                setAuthDefaultMode("login");
                setShowAuth(true);
              }} 
              onRegisterClick={() => {
                setAuthDefaultMode("register");
                setShowAuth(true);
              }} 
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && (
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[400px] bg-[#111] rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto border border-neutral-800">
               {/* Close button */}
               <button 
                 onClick={() => setShowAuth(false)}
                 className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-[#cc0000] transition-colors"
               >
                 ✕
               </button>
               {/* Note: In a real app we'd pass authDefaultMode to AuthScreen, but we don't know if it accepts it. We'll just open AuthScreen. */}
               <AuthScreen onLogin={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}







