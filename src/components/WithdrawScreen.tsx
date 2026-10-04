"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

export default function WithdrawScreen() {
  const router = useRouter();
  const { user, loading: userLoading, refreshUser } = useUser();
  useEffect(() => { if (!userLoading && !user) { toast.error("Please login first"); router.push("/"); } }, [user, userLoading, router]);
  const [amount, setAmount] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [cnic, setCnic] = useState("");
  const [bankName, setBankName] = useState("");
  const [provider, setProvider] = useState("JAZZCASH");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
      toast.error("Minimum withdrawal is 100");
      return;
    }
    if (!accountTitle || accountTitle.trim().length < 3) {
      toast.error("Please enter a valid account title");
      return;
    }
    if (!cnic || cnic.trim().length < 13) {
      toast.error("Please enter a valid CNIC (without dashes)");
      return;
    }
    if (provider === "BANK_TRANSFER") {
      if (!bankName || bankName.trim().length < 3) {
        toast.error("Please enter a valid Bank Name");
        return;
      }
      if (!accountNo || accountNo.length < 10) {
        toast.error("Please enter a valid bank account number");
        return;
      }
    } else {
      if (!accountNo || accountNo.length < 10) {
        toast.error("Please enter a valid mobile number");
        return;
      }
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Processing withdrawal...");
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://8111c.com/api/v1";
      
      const payload = {
        amount: Number(amount),
        provider,
        accountDetails: {
          accountNo,
          accountTitle,
          cnic,
          ...(provider === "BANK_TRANSFER" && { bankName })
        }
      };

      const res = await fetch(`${API_URL}/payments/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      toast.dismiss();
      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal request submitted!");
        setAmount("");
        setAccountNo("");
        if (refreshUser) refreshUser(); // Refresh balance
        router.push("/profile");
      } else {
        toast.error(data.message || "Failed to withdraw");
      }
    } catch (e) {
      toast.dismiss();
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const req = Number(user?.current_wagering_requirement || 0);
  const comp = Number(user?.current_wagering_completed || 0);
  const remaining = Math.max(0, req - comp);
  const progress = req > 0 ? Math.min(100, (comp / req) * 100).toFixed(0) : 100;
  const isEligible = comp >= req;
  const todayCount = Number(user?.today_withdrawals_count || 0);
  const remainingDaily = Math.max(0, 15 - todayCount);

  

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50 border-b border-neutral-800">
        <button onClick={() => router.back()} className="text-neutral-400 hover:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Withdraw Funds</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 px-4 pt-6 max-w-[400px] mx-auto w-full">
        {/* Real Withdraw UI */}
            
            <div className="bg-[#1a1a1a] rounded-lg p-3 mb-4 border border-neutral-800 shadow-sm">
              <p className="text-neutral-400 text-sm mb-1">Available Balance</p>
              <h2 className="text-2xl font-black text-[#ffdf00]">Rs {user?.balance || "0.00"}</h2>
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-400 block mb-1">Withdrawal Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setProvider("JAZZCASH")} 
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${provider === "JAZZCASH" ? "border-[#ffdf00] bg-[#1a1a1a]" : "border-neutral-700 bg-black"}`}
                >
                  <img src="/jazzcash.png" className="h-6 mb-1 object-contain rounded" alt="JazzCash" />
                  <span className="text-xs font-medium">JazzCash</span>
                </button>
                <button 
                  onClick={() => setProvider("EASYPAISA")} 
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${provider === "EASYPAISA" ? "border-[#ffdf00] bg-[#1a1a1a]" : "border-neutral-700 bg-black"}`}
                >
                  <img src="/easypaisa.png" className="h-6 mb-1 object-contain rounded" alt="Easypaisa" />
                  <span className="text-xs font-medium">Easypaisa</span>
                </button>
                <button 
                  onClick={() => setProvider("BANK_TRANSFER")} 
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${provider === "BANK_TRANSFER" ? "border-[#ffdf00] bg-[#1a1a1a]" : "border-neutral-700 bg-black"}`}
                >
                  <div className="h-5 mb-1 flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></div>
                  <span className="text-xs font-medium">Bank</span>
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-400 block mb-1">Amount (Rs)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Minimum 100"
                  className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm font-bold focus:outline-none focus:border-[#ffdf00] placeholder:text-neutral-600 placeholder:font-normal"
                />
              </div>
            </div>

            {provider === "BANK_TRANSFER" && (
              <div className="mb-3">
                <label className="text-xs font-medium text-neutral-400 block mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Meezan Bank, HBL"
                  className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#ffdf00]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-400 block mb-1">Account Title</label>
              <input 
                type="text" 
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder="Name on account"
                className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#ffdf00]"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-400 block mb-1">CNIC Number</label>
              <input 
                type="text" 
                value={cnic}
                onChange={(e) => setCnic(e.target.value.replace(/\D/g, '').slice(0, 13))}
                placeholder="13-digit CNIC (without dashes)"
                className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#ffdf00]"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-400 block mb-1">
                {provider === "BANK_TRANSFER" ? "Bank Account Number / IBAN" : "Mobile Account Number"}
              </label>
              <input 
                type="text" 
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder={provider === "BANK_TRANSFER" ? "e.g. PK00MEZN0001234..." : "e.g. 03001234567"}
                className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#ffdf00]"
              />
            </div>

            

            
            <div className="mb-4 text-[11px] space-y-1.5 font-medium">
              {req > 0 && !isEligible && (
                <div className="text-[#4a90e2] flex items-start gap-1.5">
                  <span className="mt-1.5 w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                  You still need {remaining.toLocaleString()} valid bets to withdraw money!
                </div>
              )}
              {req > 0 && isEligible && (
                <div className="text-green-500 flex items-start gap-1.5">
                  <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full shrink-0"></span>
                  You have completed the required valid bets.
                </div>
              )}
              <div className="text-[#4a90e2] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                Withdraw time 00:00-23:59
              </div>
              <div className="text-[#4a90e2] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                Inday Remaining Withdrawal Times: {remainingDaily}
              </div>
              <div className="text-[#4a90e2] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                Withdrawal amount range: 100-50,000
              </div>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={isSubmitting || !isEligible || !amount || !accountNo || !accountTitle || cnic.length !== 13 || (provider === "BANK_TRANSFER" && !bankName)}
              className={`w-full py-3 mt-2 rounded-lg font-bold text-[14px] text-black ${!isSubmitting && isEligible && amount && accountNo && accountTitle && cnic.length === 13 && (provider !== "BANK_TRANSFER" || bankName) ? "bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] shadow-[0_4px_15px_rgba(255,223,0,0.3)] hover:scale-[0.98]" : "bg-[#807000] text-neutral-400 cursor-not-allowed"} transition-all`}
            >
              {isSubmitting ? "Processing..." : "Submit Withdrawal"}
            </button>
      </div>
    </div>
  );
}



