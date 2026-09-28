"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Gamepad2, ShieldCheck, Lock, Smartphone, Gift, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import RegistrationSuccessPopup from "./auth/RegistrationSuccessPopup";
import LuckyDrawPopup from "./auth/LuckyDrawPopup";

export default function AuthScreen({ onLogin, onClose }: { onLogin?: () => void, onClose?: () => void }) {
  const { login } = useUser();
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false);

  const handleSubmit = async () => {
    if (!identifier || !password) return alert("Please enter credentials and password");
    
    const isEmail = identifier.includes('@');
    if (!isEmail && identifier.length !== 10) {
      return alert("Please enter a valid 10-digit phone number without 0 (e.g. 3001234567)");
    }
    if (activeTab === "register" && isEmail) {
      return alert("Registration is only allowed with a phone number.");
    }
    
    setIsLoading(true);
    try {
      const isLogin = activeTab === "login";
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { identifier, password } : { phone: identifier, password };
      
      const API_URL = "/api/v1";
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      
      if (isLogin) {
        login(data.access_token, data.user);
        if (data.user && (data.user.role === "SUPER_ADMIN" || data.user.role === "ADMIN")) {
          window.location.href = "/admin";
        } else {
          setShowLuckyDrawPopup(true);
        }
      } else {
        // Log them in immediately after register
        // Note: data.user might not exist in register response, but token does
        login(data.access_token, data.user || null);
        setShowSuccessPopup(true);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[500px] w-full bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-black text-white font-sans overflow-x-hidden pb-12 flex flex-col items-center">
      
      {/* No Top Banner - Auth is a pure modal overlay */}

      {/* Main Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-md px-4 mt-6 flex-1 flex flex-col"
      >
        {/* Auth Card */}
        <div className="bg-[#111111] rounded-[24px] border border-neutral-800 shadow-2xl overflow-hidden relative">
          
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0b0b]/50 to-transparent" />

          {/* Logo Header Inside Card */}
          <div className="pt-8 pb-3 flex justify-center items-center">
            <img src="/header-logo.jpg" alt="8111C" className="h-[44px] w-auto object-contain mix-blend-screen" />
          </div>

          <div className="px-5 pb-5 pt-1 text-center border-b border-neutral-800">
            <p className="text-[13px] text-white/90">Invite friends to receive <span className="text-[#ffdf00] font-bold">Rs 600</span> bonus</p>
            <p className="text-[13px] text-white/90 mt-0.5">Download the app and receive <span className="text-[#ffdf00] font-bold">Rs 888</span></p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-800">
            <button 
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${activeTab === "register" ? "text-[#ffdf00]" : "text-white"}`}
            >
              Register
              {activeTab === "register" && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-10 right-10 h-[2.5px] bg-[#ff0b0b]" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${activeTab === "login" ? "text-[#ffdf00]" : "text-white"}`}
            >
              Login
              {activeTab === "login" && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-10 right-10 h-[2.5px] bg-[#ff0b0b]" />
              )}
            </button>
          </div>
          {/* Form Area */}
          <div className="p-4">
            {/* Autofill Style Fix */}
            <style dangerouslySetInnerHTML={{__html: `
              input:-webkit-autofill,
              input:-webkit-autofill:hover, 
              input:-webkit-autofill:focus, 
              input:-webkit-autofill:active {
                  -webkit-box-shadow: 0 0 0 30px #0f0f0f inset !important;
                  -webkit-text-fill-color: white !important;
                  transition: background-color 5000s ease-in-out 0s;
              }
            `}} />
            
            <p className="text-[11px] text-white/70 mb-2">Login or Register with Phone Number</p>
            
            <div className="flex flex-col gap-3">
              
              {/* Phone/Email Input */}
              <div className="flex bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-10">
                {!identifier.includes('@') && !/[a-zA-Z]/.test(identifier) && (
                  <div className="flex items-center gap-1.5 px-3 border-r border-neutral-800 shrink-0">
                    <img src="https://flagcdn.com/w20/pk.png" alt="PK" className="w-4 h-3 rounded-sm object-cover opacity-90" />
                    <span className="text-[13px] text-neutral-400">+92</span>
                  </div>
                )}
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[a-zA-Z@]/.test(val)) {
                      setIdentifier(val);
                    } else {
                      setIdentifier(val.replace(/[^0-9]/g, '').slice(0, 10));
                    }
                  }} 
                  placeholder="*Phone number (or Admin Email)" 
                  className="flex-1 bg-transparent border-none outline-none px-3 text-[13px] text-white placeholder:text-neutral-600"
                />
              </div>

              {activeTab === "register" && (<>
              {/* Sub-tabs for Registration type */}
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-[#ffdf00] text-[11px] font-medium">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#ffdf00] flex items-center justify-center">
                    <Lock className="w-2 h-2" />
                  </div>
                  Password registration
                </button>
                <button className="flex items-center gap-1 text-white text-[11px] font-medium">
                  <div className="w-3.5 h-3.5 rounded-full border border-neutral-500 flex items-center justify-center text-[7px] text-neutral-400">
                    123
                  </div>
                  Code register
                </button>
              </div>

              </>)}

              {/* Password Input */}
              <div className="flex items-center bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-10 px-3">
                <Lock className="w-3.5 h-3.5 text-neutral-500 mr-2 shrink-0" />
                <input 
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="*Enter password" 
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder:text-neutral-600"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="text-neutral-600 hover:text-neutral-400">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>

              {activeTab === "register" && (<>
              {/* Password Strength Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/80">Strength</span>
                <div className="w-[100px] flex gap-1 h-1.5">
                  <div className="flex-1 bg-neutral-700/60 rounded-full" />
                  <div className="flex-1 bg-neutral-700/60 rounded-full" />
                  <div className="flex-1 bg-neutral-700/60 rounded-full" />
                  <div className="flex-1 bg-neutral-700/60 rounded-full" />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="flex items-center bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-10 px-3">
                <Lock className="w-3.5 h-3.5 text-neutral-500 mr-2 shrink-0" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="*Enter password again" 
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder:text-neutral-600"
                />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-neutral-600 hover:text-neutral-400">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-1.5 mt-1 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="appearance-none w-3.5 h-3.5 border border-neutral-600 rounded-sm bg-[#1a1a1a] checked:bg-[#ffdf00] checked:border-[#ffdf00] transition-colors" 
                  />
                  {agreed && <X className="w-2.5 h-2.5 text-black absolute pointer-events-none" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />}
                </div>
                <span className="text-[10px] text-white/70 leading-tight">
                  I am over 18 years old and have read and agreed to <span className="text-[#ffdf00]">《User Agreement》</span>
                </span>
              </label>

              </>)}
              {/* Register Button */}
              <div className="relative mt-2">
                {/* Floating bonus tag */}
                <div className="absolute -top-3 -right-2 bg-gradient-to-r from-[#ff0b0b] to-[#cc0000] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg z-10 flex items-center gap-0.5 transform rotate-6 border border-white/20">
                  <span className="text-[10px]">🎁</span>
                  10-666
                </div>
                
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-[#ffdf00] disabled:opacity-50 text-black font-bold text-[15px] py-2.5 rounded-lg shadow-[0_4px_15px_rgba(255,223,0,0.3)] transition-all active:scale-[0.98]">
                  {activeTab === "register" ? "Register" : "Login"}
                </button>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="flex justify-between mt-3 px-1">
              <button className="text-[11px] text-[#ffdf00]">Customer Service</button>
              <button className="text-[11px] text-[#ffdf00]">Demo</button>
            </div>
            
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink-0 mx-4 text-neutral-600 text-[11px]">Binding registration</span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            {/* Social Logins */}
            <div className="flex justify-center gap-6 pb-1">
              <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg hover:scale-105 transition-transform text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-[#229ED9] flex items-center justify-center shadow-lg hover:scale-105 transition-transform text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Close button at bottom */}
        <div className="flex justify-center mt-5 mb-8">
          <button onClick={onClose} className="w-8 h-8 rounded-full border-[1.5px] border-white flex items-center justify-center text-white hover:scale-105 transition-transform bg-black/40">
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      {showSuccessPopup && (
        <RegistrationSuccessPopup 
          onClose={() => { setShowSuccessPopup(false); setShowLuckyDrawPopup(true); }} 
          onNext={() => { setShowSuccessPopup(false); setShowLuckyDrawPopup(true); }} 
        />
      )}
      {showLuckyDrawPopup && (
        <LuckyDrawPopup 
          onClose={() => { setShowLuckyDrawPopup(false); if (onLogin) onLogin(); }} 
        />
      )}
    </div>
  );
}


