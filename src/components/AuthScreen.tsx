"use client";
import UserAgreementPopup from '@/components/UserAgreementPopup';
import ForgotPasswordPopup from '@/components/ForgotPasswordPopup';

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
  const [agreed, setAgreed] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async () => {
    if (!identifier || !password) return alert("Please enter credentials and password");
      if (activeTab === "register" && password !== confirmPassword) return alert("Passwords do not match");
    if (activeTab === "register" && !agreed) return alert("Please check the box to agree to the User Agreement before registering.");
    
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
      
      const API_URL = "https://8111c.com/api/v1";
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
          if (onLogin) onLogin();
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
        className="w-full max-w-[400px] px-4 mt-6 flex-1 flex flex-col"
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

              {activeTab === "login" && (
                <div className="flex justify-end mt-1">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[11px] text-[#ffdf00] hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}
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
                  type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="*Enter password again" 
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder:text-neutral-600"
                />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-neutral-600 hover:text-neutral-400">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-1.5 mt-1 group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0 cursor-pointer" onClick={() => setAgreed(!agreed)}>
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="appearance-none w-3.5 h-3.5 border border-neutral-600 rounded-sm bg-[#1a1a1a] checked:bg-[#ffdf00] checked:border-[#ffdf00] transition-colors" 
                  />
                  {agreed && <X className="w-2.5 h-2.5 text-black absolute pointer-events-none" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />}
                </div>
                <span className="text-[10px] text-white/70 leading-tight">
                  <span className="cursor-pointer" onClick={() => setAgreed(!agreed)}>I am over 18 years old and have read and agreed to </span><button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAgreement(true); }} className="text-[#ffdf00] hover:underline">�User Agreement�</button>
                </span>
              </div>

              </>)}
              {/* Register Button */}
              <div className="relative mt-2">
                {/* Floating bonus tag */}
                <div className="absolute -top-3 -right-2 bg-gradient-to-r from-[#ff0b0b] to-[#cc0000] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg z-10 flex items-center gap-0.5 transform rotate-6 border border-white/20">
                  <span className="text-[10px]">🎁</span>
                  10-666
                </div>
                
                <button onClick={handleSubmit} disabled={isLoading || (activeTab === "register" && !agreed)} className="w-full bg-[#ffdf00] disabled:opacity-50 text-black font-bold text-[15px] py-2.5 rounded-lg shadow-[0_4px_15px_rgba(255,223,0,0.3)] transition-all active:scale-[0.98]">
                  {activeTab === "register" ? "Register" : "Login"}
                </button>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="flex justify-between mt-3 px-1">
              <button onClick={() => window.location.href='/support'} className="text-[11px] text-[#ffdf00] hover:underline">Customer Service</button>
              <button className="text-[11px] text-[#ffdf00]">Demo</button>
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
          onClose={() => { setShowSuccessPopup(false); if (onLogin) onLogin(); }} 
          onNext={() => { setShowSuccessPopup(false); if (onLogin) onLogin(); }} 
        />
      )}
      {showAgreement && (
          <UserAgreementPopup 
            onClose={() => setShowAgreement(false)} 
            onAgree={() => { setShowAgreement(false); setAgreed(true); }}
          />
        )}
        {showForgotPassword && (
          <ForgotPasswordPopup onClose={() => setShowForgotPassword(false)} onLoginClick={() => { setShowForgotPassword(false); setActiveTab("login"); }} />
        )}
        {showLuckyDrawPopup && (
        <LuckyDrawPopup 
          onClose={() => { setShowLuckyDrawPopup(false); if (onLogin) onLogin(); }} 
        />
      )}
    </div>
  );
}















