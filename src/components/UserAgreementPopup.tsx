import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function UserAgreementPopup({ onClose, onAgree }: { onClose: () => void, onAgree: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[340px] bg-[#222] border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        <div className="p-5 flex flex-col items-center">
          <h2 className="text-white text-lg font-bold mb-4">User Agreement</h2>
          
          <div className="text-[12px] text-neutral-300 space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar text-left leading-relaxed">
            <p>1. In order to avoid disputes in the company's betting, members must read the company's customized rules before entering the app. Once the customer clicks 'I agree' to enter the company to bet, it is deemed to have accepted the company.</p>
            <p>2. It is the member's responsibility to ensure the confidentiality of his account and login information, and any online bets made with the member's account number and password will be deemed valid. Please change your password from time to time. If the account password is stolen, the company will not be responsible for the betting.</p>
            <p>3. The company reserves the right to change this agreement or the rules of the game or the confidentiality regulations from time to time, and the changed terms will take effect from the date specified after the change occurs, and reserves all disputed matters and the final decision-making right.</p>
            <p>4. Users must be of legal age as stipulated by the laws of the country of residence to use the online casino or app. Online bets that are unsuccessfully submitted will be considered void.</p>
            <p>5. If the player is automatically or forcibly disconnected from the game before the result is reached, the result of the game will not be affected.</p>
          </div>

          <button 
            onClick={() => {
              onAgree();
            }}
            className="mt-6 w-full bg-[#ffdf00] text-black font-bold py-3 rounded-lg shadow-[0_4px_15px_rgba(255,223,0,0.3)] hover:brightness-110 transition-all active:scale-95"
          >
            I have read
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <button onClick={onClose} className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:scale-105 transition-transform bg-black/40">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


