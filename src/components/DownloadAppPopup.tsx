"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DownloadAppPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user is already in the standalone app (PWA / TWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (!isStandalone) {
      const lastShown = localStorage.getItem('app_download_popup_shown');
      const now = new Date().getTime();
      
      // Show if never shown, or if it's been more than 24 hours
      if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
        // Delay popup by 1.5 seconds so it doesn't block immediate paint
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('app_download_popup_shown', new Date().getTime().toString());
  };

  const handleDownload = () => {
    window.location.href = '/8111c.apk?v=2';
    handleClose();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-b from-[#1a0000] to-[#0a0a0a] border-2 border-[#ff0b0b] rounded-2xl w-full max-w-[320px] overflow-hidden shadow-[0_0_40px_rgba(255,11,11,0.4)] relative flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black rounded-full p-1.5 text-neutral-300 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header Image / Pattern */}
            <div className="h-[140px] relative w-full bg-[#000] flex items-center justify-center overflow-hidden border-b border-[#ff0b0b]/30">
               {/* Animated glow */}
               <motion.div 
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffdf00]/30 via-transparent to-transparent"
               />
               <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
               >
                 <Image src="/icon-512x512.png" alt="8111C App" width={100} height={100} className="relative z-10 drop-shadow-[0_0_20px_rgba(255,223,0,0.6)] rounded-3xl border-2 border-[#ffdf00]" />
               </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center text-center">
              <h2 className="text-[22px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] via-[#fff] to-[#ffdf00] mb-2 leading-tight drop-shadow-sm">
                8111C OFFICIAL APP
              </h2>
              <p className="text-[13px] text-neutral-300 mb-6 leading-relaxed">
                Enjoy faster loading, smoother gameplay, and exclusive App-only bonuses!
              </p>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] hover:from-[#ff0b0b] hover:to-[#ff3333] text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(204,0,0,0.6)] border border-[#ff4444]"
              >
                <Download className="w-5 h-5" />
                <span className="text-[16px]">Download Now</span>
              </motion.button>
              
              <button onClick={handleClose} className="mt-4 text-[13px] text-neutral-400 hover:text-white transition-colors underline underline-offset-2 decoration-neutral-600 hover:decoration-white">
                Continue to website
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
