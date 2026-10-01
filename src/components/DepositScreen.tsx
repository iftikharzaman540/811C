"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, HeadphonesIcon, FileText, ChevronDown, ChevronUp, RefreshCcw, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const depositAmounts = [100, 500, 1000, 5000, 10000, 20000, 30000, 50000];
const cryptoAmounts = [1, 5, 10, 30, 50, 100, 500, 1000];

import toast from "react-hot-toast";

export default function DepositScreen() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  useEffect(() => { if (!userLoading && !user) { toast.error("Please login first"); router.push("/"); } }, [user, userLoading, router]);
  const [tab, setTab] = useState<"online" | "crypto">("online");
  const [method, setMethod] = useState("JazzCash");
  const [amount, setAmount] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountNo, setAccountNo] = useState("");
    const [trxId, setTrxId] = useState("");

  const handleDeposit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to make a deposit");
      router.push("/");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (tab === "online") {
      if (accountNo.length < 10) {
        toast.error("Please enter a valid mobile number (e.g., 03001234567)");
        return;
      }
      if (trxId.length < 5) {
        toast.error("Please enter a valid Payment Code / Trx ID");
        return;
      }
    }
    
    setLoading(true);
    
    const API_URL = "https://8111c.com/api/v1";
    
    try {
      const payload = tab === "online"
        ? { amount: Number(amount), provider: method.toUpperCase(), accountNo, transactionId: trxId, autoApprove: true }
        : { amount: Number(amount), provider: "MANUAL" };

      const res = await fetch(API_URL + '/payments/deposit', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(payload),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.message || "Deposit failed");
        setLoading(false);
        return;
      }

      if (tab === "online") {
        toast.success("Deposit Successful! Balance updated instantly.");
      } else {
        toast.success("Deposit request sent!");
      }

      setAmount("");
      setTrxId("");
      router.push("/profile");
      
    } catch (e) {
      toast.error("Deposit request failed");
    } finally {
      setLoading(false);
    }
  };  // Computed bonuses
  const getBonus = (amt: number) => {
    if (tab === "crypto") {
      return (amt * 0.06).toFixed(2);
    }
    return (amt * 0.07).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-neutral-400 hover:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Deposit</h1>
        <div className="flex gap-4 text-[#1fdf1f]">
          <HeadphonesIcon className="w-5 h-5" />
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        
        {/* Balance */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium">Balance</span>
          <div className="flex items-center bg-black border border-neutral-800 rounded-full px-2 py-0.5 gap-1.5 shadow-inner">
             <div className="w-4 h-4 bg-[#0d4026] rounded-full flex items-center justify-center text-[10px] text-[#1fdf1f] border border-[#1fdf1f]/50">
                ☪
             </div>
             <span className="text-[#ffdf00] font-bold text-sm">{(user?.balance || 0).toFixed(2)}</span>
             <button className="text-[#1fdf1f]">
                <RefreshCcw className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 mb-4 relative">
          <button 
            onClick={() => setTab("online")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-[3px] transition-colors ${tab === "online" ? "border-[#1fdf1f] text-[#1fdf1f]" : "border-transparent text-neutral-400"}`}
          >
            <span className="text-xl leading-none -mt-1">📱</span> Online deposit
          </button>
          
          <button 
            onClick={() => setTab("crypto")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-[3px] transition-colors relative ${tab === "crypto" ? "border-[#1fdf1f] text-[#1fdf1f]" : "border-transparent text-neutral-400"}`}
          >
            <span className="text-xl leading-none -mt-1 text-[#1fdf1f]">₿</span> Crypto
            <div className="absolute top-1 right-8 bg-[#ff0b0b] text-white text-[9px] px-1 rounded-sm shadow-md flex items-center gap-0.5 rotate-[10deg]">
              <span className="text-[10px]">🎁</span>+3%
            </div>
          </button>
        </div>

        {/* Payment Method */}
        <h2 className="text-sm font-bold mb-3">Payment method</h2>
        
        {tab === "online" ? (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button onClick={() => setMethod("JazzCash")} className={`h-[46px] rounded-lg border flex items-center justify-center gap-2 ${method.includes("JazzCash") ? "border-[#1fdf1f] bg-black/40 text-[#1fdf1f]" : "border-neutral-700 bg-[#1a1a1a] text-white"}`}>
                <div className="bg-white w-6 h-6 rounded flex items-center justify-center"><span className="text-red-500 font-bold text-xs italic">JC</span></div>
                <span className="text-sm font-medium">JazzCash</span>
              </button>
              <button onClick={() => setMethod("EasyPaisa")} className={`h-[46px] rounded-lg border flex items-center justify-center gap-2 ${method.includes("EasyPaisa") ? "border-[#1fdf1f] bg-black/40 text-[#1fdf1f]" : "border-neutral-700 bg-[#1a1a1a] text-white"}`}>
                <div className="bg-white w-6 h-6 rounded flex items-center justify-center"><span className="text-green-500 font-bold text-xs italic">EP</span></div>
                <span className="text-sm font-medium">EasyPaisa</span>
              </button>
            </div>
            
            <div className="flex justify-center mb-3">
              <button className="flex items-center text-[#1fdf1f] text-[13px]">
                Expand <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3 relative">
              {["Fast", "Fast", "Fast", "Fast"].map((m, i) => (
                <button key={i} className={`relative h-[38px] rounded-md border flex items-center justify-center text-[13px] ${i === 0 ? "border-[#1fdf1f] text-[#1fdf1f]" : "border-neutral-700 text-white"}`}>
                  {method}
                  <span className="absolute -top-1.5 -right-1 bg-[#ff0b0b] text-white text-[8px] font-bold px-1 rounded-sm">Fast</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <button className={`h-[46px] w-[48%] rounded-lg border flex items-center justify-center gap-2 border-[#1fdf1f] bg-black/40 text-[#1fdf1f] relative`}>
              <div className="bg-[#26a17b] w-6 h-6 rounded-full flex items-center justify-center"><span className="text-white font-bold text-xs">₮</span></div>
              <span className="text-sm font-medium">Cryptocurrency</span>
              <div className="absolute -top-2 right-4 bg-[#ff0b0b] text-white text-[9px] px-1 rounded-sm shadow-md flex items-center gap-0.5">
                <span className="text-[10px]">🎁</span>+3%
              </div>
            </button>

            <div className="mt-4 bg-white text-black p-3 rounded text-sm relative">
               Click to switch, enter the amount/Deposit amount
               <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45"></div>
            </div>
          </div>
        )}

                {tab === "online" && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3">Mobile Number (JazzCash / EasyPaisa)</h2>
            <div className="flex bg-[#1a1a1a] border border-neutral-700 rounded-md items-center px-3 h-[46px] focus-within:border-[#1fdf1f]">
              <span className="text-neutral-400 mr-2 text-sm">+92</span>
              <input 
                type="tel" 
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="3001234567" 
                className="bg-transparent border-none outline-none w-full text-white text-[15px]"
              />
            </div>
          </div>
        )}

        {tab === "online" && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3 text-[#ffdf00]">Payment Code (Trx ID)</h2>
            <div className="flex bg-[#1a1a1a] border border-neutral-700 rounded-md items-center px-3 h-[46px] focus-within:border-[#ffdf00]">
              <input 
                type="text" 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="Enter 11-digit Trx ID from SMS" 
                className="bg-transparent border-none outline-none w-full text-white text-[15px]"
              />
            </div>
          </div>
        )}

        {/* Deposit Amount */}
        <h2 className="text-sm font-bold mb-3">Deposit amount</h2>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-[#1a1a1a] border border-[#ff0b0b]/40 rounded-md flex items-center px-3 h-[46px] focus-within:border-[#ff0b0b]">
            <span className="text-white font-medium mr-2">{tab === "online" ? "Rs" : "USDT"}</span>
            <input 
              type="number" 
              placeholder={tab === "online" ? "Min 100~Max 200,000" : "Min 1~Max 50,000"} 
              className="bg-transparent flex-1 text-white outline-none text-sm placeholder-neutral-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {tab === "crypto" && (
            <button className="w-[46px] h-[46px] bg-[#1a1a1a] border border-neutral-700 rounded-md flex items-center justify-center text-[#1fdf1f]">
              <RefreshCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {tab === "crypto" && (
          <div className="text-neutral-400 text-xs mb-3 flex items-center gap-1">
            Exchange Rate <span className="text-white font-medium">277.1235664845</span> <RefreshCcw className="w-3 h-3 text-[#1fdf1f]" />
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-6">
          {(tab === "online" ? depositAmounts : cryptoAmounts).map((amt) => (
            <button 
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className={`h-[42px] rounded-md flex flex-col items-center justify-center border ${amount === amt.toString() ? "border-[#ffdf00] bg-black" : "border-transparent bg-[#1a1a1a]"}`}
            >
              <span className="text-white font-bold text-[13px]">{amt.toLocaleString()}</span>
              <span className="text-[#ffdf00] font-bold text-[10px]">+{getBonus(amt)}</span>
            </button>
          ))}
        </div>

        {/* Deposit Promotion */}
        <div className="border border-neutral-700 rounded-lg bg-[#151515] overflow-hidden mb-6">
          <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">🎁</span>
              <span className="text-white font-bold text-sm">Deposit promotion</span>
            </div>
            <div className="flex items-center bg-[#2a1010] text-[#ff0b0b] text-[10px] px-1.5 py-0.5 rounded border border-[#ff0b0b]/30 gap-1 font-mono">
              <span className="text-[#ffdf00] font-bold">⚡LT</span> 07:43:11.6
            </div>
          </div>
          
          <div className="p-3">
            <div className="text-center text-[10px] text-neutral-500 mb-3">
               ----- Automatically participated in the following activities -----
            </div>

            <div className="flex flex-col gap-2">
              {[
                { bonus: "7.00", tag: "Deposit again 100 to receive", condition: "Total deposit ≥ 100" },
                { bonus: "20.00", condition: "First Deposit ≥ 300" },
                { bonus: "17.00", tag: "Deposit again 500 to receive", condition: "Total deposit ≥ 500" },
                { bonus: "30.00", condition: "First Deposit ≥ 600", hidden: true },
                { bonus: "50.00", condition: "First Deposit ≥ 1,000", hidden: true },
              ].map((item, i) => (
                (!item.hidden || promoExpanded) && (
                  <div key={i} className="flex items-center justify-between bg-[#1f1f1f] rounded-lg p-2.5 relative">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 opacity-70 flex items-center justify-center text-xl">🎁</div>
                      <span className="text-neutral-400 text-xs font-medium">Bonus {item.bonus}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      {item.tag && (
                         <div className="absolute -top-2 right-2 bg-[#ff5555] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md z-10">
                           {item.tag}
                         </div>
                      )}
                      <span className="text-neutral-500 text-[10px] mt-1">{item.condition}</span>
                    </div>
                  </div>
                )
              ))}
            </div>

            <button 
              onClick={() => setPromoExpanded(!promoExpanded)} 
              className="w-full flex items-center justify-center text-[#1fdf1f] text-xs font-bold mt-4"
            >
              {promoExpanded ? "Fold" : "Expand"} {promoExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4 bg-[#111] fixed bottom-0 w-full max-w-md mx-auto border-t border-neutral-800 z-50">
        <button onClick={handleDeposit} disabled={loading} className={`w-full py-3.5 rounded-lg font-bold text-[15px] ${amount ? "bg-[#1fdf1f] text-black shadow-[0_2px_15px_rgba(31,223,31,0.3)]" : "bg-[#444] text-neutral-300"} ${loading ? "opacity-50" : ""}`}>
          {loading ? "Processing..." : "Deposit Now"}
        </button>
      
      {showAutoPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm flex flex-col items-center text-center border border-[#1fdf1f]/30 shadow-[0_0_30px_rgba(31,223,31,0.15)]">
            <div className="w-16 h-16 border-4 border-[#1fdf1f]/20 border-t-[#1fdf1f] rounded-full animate-spin mb-4"></div>
            <h3 className="text-white text-lg font-bold mb-2">Awaiting Payment</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Please check your phone. A prompt has been sent to your <strong>{method}</strong> number. Enter your MPIN in your app to authorize the payment.
            </p>
            <div className="text-[#1fdf1f] font-bold text-2xl animate-pulse">Rs {amount}</div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}


