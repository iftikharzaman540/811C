import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Lock, EyeOff, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPopup({ onClose, onLoginClick }: { onClose: () => void, onLoginClick: () => void }) {
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!identifier || !newPassword) return toast.error("Please fill in all fields");
    
    setIsLoading(true);
    try {
      const res = await fetch("https://8111c.com/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || data.error || "Failed to reset password");
      
      toast.success("Password reset successfully! Please login.");
      onClose();
      onLoginClick();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[340px] bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        <div className="p-6 flex flex-col items-center">
          <h2 className="text-white text-lg font-bold mb-1">Reset Password</h2>
          <p className="text-[12px] text-white/50 mb-6 text-center">Enter your registered phone number or email to reset your password.</p>
          
          <div className="w-full space-y-4">
            <div className="flex bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-11 px-3">
              <Phone className="w-4 h-4 text-neutral-500 mr-2 shrink-0 self-center" />
              <input 
                type="text" 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                placeholder="Phone number / Email" 
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder:text-neutral-600"
              />
            </div>

            <div className="flex bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-11 px-3">
              <Lock className="w-4 h-4 text-neutral-500 mr-2 shrink-0 self-center" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="New Password" 
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder:text-neutral-600"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="text-neutral-600 hover:text-neutral-400 self-center">
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-6 w-full bg-[#ffdf00] disabled:opacity-50 text-black font-bold text-[15px] py-3 rounded-lg shadow-[0_4px_15px_rgba(255,223,0,0.3)] transition-all active:scale-[0.98]"
            >
              {isLoading ? "Resetting..." : "Confirm Reset"}
            </button>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
