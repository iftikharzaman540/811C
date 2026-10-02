import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export default function RegistrationSuccessPopup({ onClose, onNext }: { onClose: () => void, onNext: () => void }) {
  return (
    <div className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-[340px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mt-2">
          <div className="w-12 h-12 rounded-full border-2 border-[#1fdf1f] flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8 text-[#1fdf1f]" />
          </div>
          
          <h2 className="text-[#1fdf1f] text-xl font-bold mb-2 flex items-center gap-2">
            🎉 Registration Successful! 🎉
          </h2>
          
          <p className="text-[#1fdf1f] text-center text-xs font-medium leading-relaxed mb-5 max-w-[250px]">
            Congratulations on your successful registration ! Let's play a game!
          </p>

          {/* Banner */}
          <div className="w-full bg-gradient-to-r from-[#2a1c0d] to-[#3a2815] rounded-xl p-3 flex items-center justify-between mb-6 relative border-l-4 border-[#ffdf00]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black/20 rounded relative">
                <span className="absolute -top-1 -right-1 text-xl">🎁</span>
              </div>
              <div>
                <div className="text-white text-xs font-medium mb-1">First Deposit≥300</div>
                <div className="flex items-center gap-1">
                  <span className="bg-[#ff0b0b] text-white text-[9px] px-1 font-bold rounded flex items-center">
                    <span className="text-[#ffdf00] mr-0.5">⚡</span>LT
                  </span>
                  <span className="text-[#ff0b0b] text-[10px] font-mono border border-[#ff0b0b] px-1 rounded bg-[#ff0b0b]/10">08:26:46</span>
                </div>
              </div>
            </div>
            <div className="text-right flex items-center text-[10px] font-bold text-white">
              MAX <span className="text-[#ffdf00] ml-1 text-xs">Rs 30,000.00</span>
              <span className="text-neutral-400 ml-1">›</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex gap-3">
            <div className="relative flex-1">
              <div className="absolute -top-3 right-2 bg-[#1fdf1f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 z-10 shadow-lg">
                <span>🎁</span> HOT
              </div>
              <button 
                onClick={onNext}
                className="w-full h-[42px] border border-[#1fdf1f] rounded-lg text-[#1fdf1f] text-sm font-medium flex items-center justify-center gap-1 hover:bg-[#1fdf1f]/10 transition-colors"
              >
                <span>🎁</span> Invite friends
              </button>
            </div>
            
            <div className="relative flex-1">
              <div className="absolute -top-3 right-0 bg-[#1fdf1f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 z-10 shadow-lg">
                <span>🎁</span> Recharge Gift
              </div>
              <button 
                onClick={() => window.location.href = '/deposit'}
                className="w-full h-[42px] bg-[#66df2f] rounded-lg text-black text-sm font-medium flex items-center justify-center gap-1 hover:bg-[#55cc25] transition-colors shadow-[0_2px_10px_rgba(102,223,47,0.3)]"
              >
                <span>🐷</span> Deposit Now
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
