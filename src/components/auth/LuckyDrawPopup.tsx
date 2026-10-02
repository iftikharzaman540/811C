import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function LuckyDrawPopup({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"wheel" | "chests" | "reminder">("wheel");

  return (
    <div className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {step === "wheel" && (
          <motion.div
            key="wheel"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-[360px] relative p-4 flex flex-col items-center"
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center bg-[#0a2e1d] rounded-t-xl p-2 border border-[#1a4a2f] border-b-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs">🔊 9482****8664 Lucky draw Win bonus <span className="text-[#ffdf00]">496.95</span></span>
              </div>
            </div>
            
            <div className="w-full bg-[#0d4026] rounded-b-xl border border-[#1a4a2f] p-4 flex flex-col items-center">
              <h2 className="text-[#ffdf00] text-3xl font-bold mb-1">494.06</h2>
              <div className="w-3/4 h-1 bg-black/30 rounded-full mb-6 overflow-hidden">
                <div className="h-full w-[80%] bg-[#1fdf1f]"></div>
              </div>

              {/* Wheel Area */}
              <div className="relative w-64 h-64 mb-6">
                {/* Simplified Wheel using CSS */}
                <div className="w-full h-full rounded-full border-4 border-[#ffdf00] bg-[#145a35] relative overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,223,0,0.3)]">
                  {/* Slices (abstracted with background conic gradient) */}
                  <div className="absolute inset-0 bg-[conic-gradient(#145a35_0deg_60deg,#1c7a48_60deg_120deg,#145a35_120deg_180deg,#1c7a48_180deg_240deg,#145a35_240deg_300deg,#1c7a48_300deg_360deg)] opacity-80" />
                  
                  {/* Center Button */}
                  <button 
                    onClick={() => setStep("chests")}
                    className="z-10 w-20 h-20 bg-gradient-to-b from-[#4cd991] to-[#147b46] rounded-full border-[3px] border-[#ffdf00] shadow-xl flex flex-col items-center justify-center relative hover:scale-105 transition-transform"
                  >
                    <div className="absolute -top-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-transparent border-b-[#ffdf00]"></div>
                    <span className="text-white font-bold text-xl leading-none shadow-black drop-shadow-md">x1</span>
                    <span className="text-white text-[10px] font-medium shadow-black drop-shadow-md">Free draw</span>
                  </button>
                </div>
              </div>

              {/* Buttons Area */}
              <div className="w-full relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff0b0b] text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap z-10 shadow-lg border border-white/20">
                  Only 5.94 is needed to claim the bonus ...
                </div>
                <button 
                  onClick={() => setStep("reminder")}
                  className="w-full bg-gradient-to-b from-[#ffdf00] to-[#d4b700] rounded-lg text-black font-medium py-3 text-sm shadow-lg mb-4"
                >
                  Invite friend, Win bonus
                </button>
              </div>

              <div className="w-full flex justify-between items-center text-[#ffdf00] text-xs px-2 mb-4">
                <span>Invitation code <span className="font-bold text-white">738887603</span> 📋</span>
                <span>My subordinates</span>
              </div>

              {/* Tasks */}
              <div className="w-full bg-[#0a2e1d] rounded-lg p-3">
                <h3 className="text-white text-xs font-bold text-center mb-3 flex items-center justify-center gap-2">
                  <span>✦</span> Complete tasks for free draws <span>✦</span>
                </h3>
                <div className="flex items-center justify-between text-white text-xs bg-[#0d4026] p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span>⏱</span> Daily online 2 hours
                  </div>
                  <span className="text-neutral-400">0/120</span>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="mt-6 w-10 h-10 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === "chests" && (
          <motion.div
            key="chests"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-[360px] relative p-4 flex flex-col items-center"
          >
             <h2 className="text-[#ffdf00] text-3xl font-bold mb-1 drop-shadow-lg">0.00</h2>
             
             <div className="flex items-center gap-4 my-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#ffdf00]"></div>
                <h3 className="text-[#ffdf00] text-lg font-bold">Lucky draw</h3>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#ffdf00]"></div>
             </div>
             
             <p className="text-white font-bold text-lg mb-8">Select reward, max<span className="text-[#ffdf00]">500.00</span></p>

             <div className="grid grid-cols-2 gap-x-8 gap-y-10 w-full px-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <button 
                    key={i} 
                    onClick={() => setStep("reminder")}
                    className="flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                  >
                    <div className="w-24 h-20 bg-gradient-to-b from-[#1c7a48] to-[#145a35] border-2 border-[#ffdf00] rounded-xl flex items-center justify-center relative shadow-[0_4px_15px_rgba(255,223,0,0.2)]">
                        <span className="text-2xl">💎</span>
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                    </div>
                    <span className="text-white text-sm font-medium">Enable</span>
                  </button>
                ))}
             </div>
          </motion.div>
        )}

        {step === "reminder" && (
          <motion.div
            key="reminder"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-[300px] flex flex-col items-center"
          >
            <div className="w-full bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center border border-[#2a2a2a] relative mb-6">
              <h2 className="text-white text-lg font-medium mb-6">Reminder</h2>
              <p className="text-white text-sm mb-8 text-center">Deposit 1 times AGAIN to claim</p>
              
              <div className="w-full relative">
                <div className="absolute -top-2 -right-2 bg-[#ff0b0b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                  +3%
                </div>
                <button 
                  onClick={() => window.location.href = '/deposit'}
                  className="w-full bg-[#66df2f] rounded-lg text-black font-medium py-2.5 hover:bg-[#55cc25] transition-colors"
                >
                  Deposit
                </button>
              </div>
            </div>

            <button onClick={onClose} className="w-10 h-10 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
