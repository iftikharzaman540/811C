"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, Gift, AlertCircle, Info, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const PRIZES = [
  { value: 0.50, label: "Rs 0.50" },
  { value: 2.00, label: "Rs 2.00" },
  { value: 5.00, label: "Rs 5.00" },
  { value: 10.00, label: "Rs 10.00" },
  { value: 20.00, label: "Rs 20.00" },
  { value: 30.00, label: "Rs 30.00" },
  { value: 396.00, label: "Rs 396.00" },
  { value: 1.00, label: "Rs 1.00" },
];

export default function PromoPage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  const availableSpins = user?.available_spins || 0;
  const promoBalance = user?.bonus_balance || 0;
  const hasClaimed = user?.has_claimed_promotion || false;

  const req = Number(user?.current_wagering_requirement || 0);
  const comp = Number(user?.current_wagering_completed || 0);
  const wagerRemaining = Math.max(0, req - comp);
  const wagerProgress = req > 0 ? Math.min(100, (comp / req) * 100).toFixed(0) : 100;
  const wagerCompleted = req > 0 && comp >= req;

  const handleSpin = async () => {
    if (!user) {
      toast.error("Please login to play");
      return;
    }
    if (availableSpins <= 0) {
      toast.error("No free draws available! Come back tomorrow or invite friends.");
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);

    try {
      const res = await fetch("/api/v1/promo/spin", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to spin");
        setIsSpinning(false);
        return;
      }

      // Determine which prize segment to land on based on backend result
      const wonAmount = data.amount;
      // Find closest visual prize segment (if backend generates an exact random decimal, just land on a generic slice or the closest)
      let segmentIndex = PRIZES.findIndex(p => p.value === wonAmount);
      if (segmentIndex === -1) {
        // Just pick a random one between 0.50 and 30 for the visual
        segmentIndex = Math.floor(Math.random() * 5); // 0 to 4
      }

      // Calculate rotation
      const sliceAngle = 360 / PRIZES.length;
      // We want the chosen segment to end up at the top (0 degrees).
      // If segment is at index, its angle is index * sliceAngle.
      // So we rotate by (360 - index * sliceAngle) + multiple of 360.
      const extraSpins = 5 * 360; // 5 full rotations
      const targetRotation = rotation + extraSpins + (360 - (segmentIndex * sliceAngle)) - (rotation % 360);

      setRotation(targetRotation);

      // Wait for animation
      setTimeout(async () => {
        setIsSpinning(false);
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold text-lg">Congratulations!</span>
            <span>You won Rs {Number(wonAmount).toFixed(2)}</span>
          </div>,
          { duration: 4000 }
        );
        await refreshUser();
      }, 3000); // match transition duration

    } catch (err) {
      toast.error("An error occurred");
      setIsSpinning(false);
    }
  };

  const handleClaim = async () => {
    if (promoBalance < 500) {
      toast.error("You need at least Rs 500 to claim!");
      return;
    }
    setIsClaiming(true);
    try {
      const res = await fetch("/api/v1/promo/claim", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to claim");
      } else {
        toast.success(`Successfully claimed Rs ${data.claimed_amount} to your main wallet!`);
        await refreshUser();
      }
    } catch (err) {
      toast.error("Error claiming promotion");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-24 overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50 border-b border-neutral-800 shadow-md">
        <button onClick={() => router.back()} className="text-neutral-400 hover:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-[#ffdf00] tracking-wide">Lucky Wheel Promo</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto relative px-4 pt-6">
        
        {/* Balances Section */}
        <div className="flex justify-between gap-3 mb-8">
          <div className="flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#222] p-4 rounded-xl border border-neutral-700 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">Promo Balance</p>
            <p className="text-[#ffdf00] text-2xl font-black">Rs {promoBalance.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#222] p-4 rounded-xl border border-neutral-700 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-end">
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">Free Draws</p>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#ffdf00]" />
              <p className="text-white text-2xl font-black">{availableSpins}</p>
            </div>
          </div>
        </div>

        {/* Wheel Section */}
        <div className="relative w-full aspect-square max-w-[320px] mx-auto mb-10 mt-4">
          {/* Wheel Background/Border */}
          <div className="absolute inset-0 rounded-full border-[8px] border-[#333] shadow-[0_0_30px_rgba(255,223,0,0.2)] bg-[#111]">
            <motion.div 
              className="w-full h-full rounded-full relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {PRIZES.map((prize, i) => {
                const angle = (360 / PRIZES.length) * i;
                return (
                  <div 
                    key={i}
                    className="absolute inset-0 origin-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 top-0 h-1/2 w-full flex items-start justify-center pt-6 text-[13px] font-bold"
                      style={{ 
                        transformOrigin: 'bottom center',
                        background: i % 2 === 0 ? '#ffdf00' : '#1a1a1a',
                        color: i % 2 === 0 ? '#000' : '#fff',
                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                      }}
                    >
                      <span className="-rotate-90 mt-8 whitespace-nowrap">{prize.label}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#cc0000] drop-shadow-md z-10"></div>
          
          {/* Center Button */}
          <button 
            onClick={handleSpin}
            disabled={isSpinning || availableSpins <= 0}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] rounded-full border-4 border-white shadow-[0_4px_15px_rgba(204,0,0,0.5)] flex items-center justify-center text-white font-black text-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 z-10"
          >
            SPIN
          </button>
        </div>

        {/* Claim Action */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-neutral-700 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Claim Promotion</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${promoBalance >= 500 ? "bg-[#1fdf1f]/20 text-[#1fdf1f]" : "bg-neutral-800 text-neutral-400"}`}>
              Min: Rs 500
            </div>
          </div>
          
          {hasClaimed ? (
             <div className="flex items-center justify-center gap-2 text-[#1fdf1f] p-3 bg-[#1fdf1f]/10 rounded-lg font-medium">
               <CheckCircle2 className="w-5 h-5" />
               Promotion Already Claimed
             </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={promoBalance < 500 || isClaiming}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${promoBalance >= 500 ? "bg-[#ffdf00] text-black hover:bg-[#ffdf00]/90 shadow-[0_0_20px_rgba(255,223,0,0.3)]" : "bg-neutral-800 text-neutral-500"}`}
            >
              {promoBalance < 500 ? <Lock className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
              {isClaiming ? "Processing..." : "Receive Bonus"}
            </button>
          )}
          
          <div className="mt-4 flex items-start gap-2 text-xs text-neutral-400">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#ffdf00]" />
            <p>You can claim your promotion balance into your main wallet once it reaches exactly Rs 500 or more. Claiming is a one-time event.</p>
          </div>
        </div>

        {/* Wagering Tracker */}
        {req > 0 && (
          <div className="bg-[#1a1a1a] rounded-xl p-5 border border-neutral-700 mb-8 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              Withdrawal Wagering
              {wagerCompleted && <CheckCircle2 className="w-5 h-5 text-[#1fdf1f]" />}
            </h3>
            
            <div className="space-y-2 text-sm text-neutral-300 mb-4">
              <div className="flex justify-between"><span>Total Required:</span> <span className="font-medium text-white">Rs {req.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Completed:</span> <span className="font-medium text-white">Rs {comp.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-neutral-800 pt-2">
                <span>Remaining:</span> 
                <span className={`font-bold ${wagerCompleted ? 'text-[#1fdf1f]' : 'text-[#ffdf00]'}`}>Rs {wagerRemaining.toFixed(2)}</span>
              </div>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] h-full rounded-full transition-all duration-500" style={{ width: `${wagerProgress}%` }}></div>
            </div>
            <p className="text-right text-xs font-bold text-neutral-400">{wagerProgress}% Completed</p>
          </div>
        )}

        {/* Rules Section */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-neutral-800 shadow-md">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#cc0000]" />
            Promotion Rules
          </h3>
          <ul className="space-y-3 text-sm text-neutral-400 list-disc pl-4">
            <li><strong className="text-neutral-200">Registration Reward:</strong> Your very first draw is guaranteed to win Rs 396.00 towards your Promotion Balance.</li>
            <li><strong className="text-neutral-200">Daily Login:</strong> Get +1 Free Draw every day you log in. Prizes range from Rs 0.50 to Rs 30.00.</li>
            <li><strong className="text-neutral-200">Referrals:</strong> Invite friends to get +2 Free Draws per successful referral.</li>
            <li><strong className="text-[#ffdf00]">Minimum Claim Rs 500:</strong> You cannot claim the promotion balance until it reaches at least Rs 500.</li>
            <li><strong className="text-[#ffdf00]">Wagering Requirement:</strong> After claiming, the amount is added to your main wallet and locked by a 1x Wagering Requirement. You must place valid bets equal to the claimed amount before you can withdraw it.</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
