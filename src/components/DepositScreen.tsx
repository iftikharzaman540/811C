"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, HeadphonesIcon, FileText, ChevronDown, ChevronUp, RefreshCcw, Copy, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const depositAmounts = [100, 500, 1000, 5000, 10000, 20000, 30000, 50000];
const cryptoAmounts = [1, 5, 10, 30, 50, 100, 500, 1000];

import toast from "react-hot-toast";

export default function DepositScreen() {
  const router = useRouter();
  const { user, loading: userLoading, refreshUser } = useUser();
  useEffect(() => { if (!userLoading && !user) { router.push("/?login=true"); } }, [user, userLoading, router]);
  const [tab, setTab] = useState<"online" | "crypto">("online");
  const [method, setMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [fetchingMethods, setFetchingMethods] = useState(true);

  useEffect(() => {
    fetch('https://8111c.com/api/v1/payments/methods')
      .then(res => res.json())
      .then(data => {
        setPaymentMethods(data);
        if (data.length > 0) {
          // Find first active method to set as default
          let defaultMethod = data[0].id === 'easypaisa' ? 'EasyPaisa_0' : data[0].id === 'jazzcash' ? 'JazzCash_0' : 'Bank_0';
          setMethod(defaultMethod);
        }
        setFetchingMethods(false);
      })
      .catch(() => setFetchingMethods(false));
  }, []);
    const [channelsExpanded, setChannelsExpanded] = useState(false);
  const [amount, setAmount] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountNo, setAccountNo] = useState("");
    const [trxId, setTrxId] = useState("");
  const [pollingRef, setPollingRef] = useState<string | null>(null);
  const popupWindowRef = useRef<Window | null>(null);
useEffect(() => {
    if (!pollingRef) return;
    const token = localStorage.getItem("token");
    let interval: any;
    
    const checkStatus = async () => {
      try {
        const API_URL = "https://8111c.com/api/v1";
        const res = await fetch(API_URL + "/payments/status/" + pollingRef, {
          headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        
        if (data.status === 'COMPLETED' || data.status === 'PAID') {
          toast.success("Deposit Successful! Balance updated instantly.");
          setPollingRef(null);
          if (popupWindowRef.current) popupWindowRef.current.close();
          popupWindowRef.current = null;
          setAmount("");
          if (refreshUser) refreshUser();
          clearInterval(interval);
          router.push("/profile");
        } else if (data.status === 'REJECTED' || data.status === 'FAILED' || data.status === 'CANCELLED') {
          toast.error("Deposit failed or was rejected.");
          if (popupWindowRef.current) popupWindowRef.current.close();
          popupWindowRef.current = null;
          setPollingRef(null);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (e) {
        // silently fail and retry
      }
    };
    
    interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [pollingRef, refreshUser, router]);

  const handleDeposit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      
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
      
    }
    
    setLoading(true);
    
    const API_URL = "https://8111c.com/api/v1";
    
    try {
      
      let providerStr = method.split('_')[0].toUpperCase();
      if (providerStr === 'BANK') providerStr = 'BANK_TRANSFER';
      let res;
      
      if (tab === "online") {
        const payload = { amount: Number(amount), provider: providerStr, accountNo };
        res = await fetch(API_URL + '/payments/auto-deposit', {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(payload),
        });
      } else {
        const payload = { amount: Number(amount), provider: providerStr, accountNo, transactionId: trxId, autoApprove: false };
        res = await fetch(API_URL + '/payments/deposit', {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(payload),
        });
      }

      
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.message || "Deposit failed");
        setLoading(false);
        return;
      }

      if (tab === "online") {
        if (resData.reference) {
          setPollingRef(resData.reference);
          if (resData.payment_url) {
            const popup = window.open(resData.payment_url, 'XpressPay', 'width=500,height=700,left=200,top=100');
            popupWindowRef.current = popup;
          }
          toast.success("Deposit initiated! Please check the popup window.");
        } else {
          toast.error("Invalid response from server");
          setLoading(false);
        }
        return; // wait for polling
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
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-[#ffdf00] hover:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Deposit</h1>
        <div className="flex gap-4 text-[#ffdf00]">
          <HeadphonesIcon className="w-5 h-5 cursor-pointer" onClick={() => router.push("/support")} />
          <FileText className="w-5 h-5 cursor-pointer" onClick={() => router.push("/deposit-history")} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        
        {/* Balance */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-neutral-200">Balance</span>
          <div className="flex items-center bg-black border border-neutral-800 rounded-full px-3 py-1 gap-1.5">
             <div className="w-4 h-4 bg-[#332a00] rounded-full flex items-center justify-center text-[10px] text-[#ffdf00] border border-[#ffdf00]/50">
                C
             </div>
             <span className="text-[#ffdf00] font-bold text-sm">{(user?.balance || 0).toFixed(2)}</span>
             <button className="text-[#ffdf00]">
                <RefreshCcw className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Payment Method */}
        <h2 className="text-sm font-bold text-neutral-200 mb-2">Payment method</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {fetchingMethods ? (
             <div className="col-span-2 text-center text-xs text-neutral-500 py-4">Loading payment methods...</div>
          ) : paymentMethods.length === 0 ? (
             <div className="col-span-2 text-center text-xs text-[#ff4747] py-4">No payment methods available right now.</div>
          ) : (
            paymentMethods.map(pm => {
              const methodKey = pm.id === 'easypaisa' ? 'EasyPaisa' : pm.id === 'jazzcash' ? 'JazzCash' : 'Bank';
              return (
                <button 
                  key={pm.id}
                  onClick={() => setMethod(methodKey + "_0")} 
                  className={`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all ${method.includes(methodKey) ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}`}
                >
                  {pm.id === 'easypaisa' && <img src="/easypaisa.png" alt="EasyPaisa" className="w-6 h-6 object-contain rounded bg-white p-0.5" />}
                  {pm.id === 'jazzcash' && <img src="/jazzcash.png" alt="JazzCash" className="w-6 h-6 object-contain rounded" />}
                  {pm.id === 'bank_transfer' && <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>}
                  <span className="text-sm font-medium">{pm.name}</span>
                </button>
              )
            })
          )}
        </div>

        <div className="flex justify-center mb-4">
          <button onClick={() => setChannelsExpanded(!channelsExpanded)} className="flex items-center text-[#ffdf00] text-xs font-bold">
            {channelsExpanded ? "Collapse" : "Expand"} {channelsExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>

        {channelsExpanded && (
          <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3 relative mb-4">
            {["Fast", "Fast", "Fast", "Fast"].map((m, i) => {
              const baseMethod = method.split('_')[0];
              const subMethod = `${baseMethod}_${i}`;
              return (
              <button 
                key={i} 
                onClick={() => setMethod(subMethod)}
                className={`relative h-10 rounded-md border flex items-center justify-center text-xs ${method === subMethod || (method === baseMethod && i === 0) ? "border-[#ffdf00] text-[#ffdf00] bg-black/40" : "border-neutral-700 text-neutral-400 bg-[#1a1a1a]"}`}
              >
                {baseMethod}
                <span className="absolute -top-1.5 -right-1 bg-[#ff0b0b] text-white text-[8px] font-bold px-1 rounded-sm">Fast</span>
              </button>
            )})}
          </div>
        )}

        {/* Mobile Number */}
        <h2 className="text-sm font-bold text-neutral-200 mb-2">Account / Mobile Number</h2>
        <div className="flex bg-[#1a1a1a] border border-neutral-700 rounded-md items-center px-3 h-12 focus-within:border-[#ffdf00] mb-4">
          <span className="text-neutral-400 mr-2 text-sm">+92</span>
          <input 
            type="tel" 
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
            placeholder="e.g. 03001234567" 
            className="bg-transparent border-none outline-none w-full text-white text-sm"
          />
        </div>

        {/* Deposit Amount */}
        <h2 className="text-sm font-bold text-neutral-200 mb-2">Deposit amount</h2>
        <div className="flex bg-[#1a1a1a] border border-[#ff0b0b]/40 rounded-md items-center px-3 h-12 focus-within:border-[#ff0b0b] mb-4">
          <span className="text-white font-medium mr-2 text-sm">"Rs"</span>
          <input 
            type="number" 
            placeholder={"Min 100~Max 200,000"} 
            className="bg-transparent flex-1 text-white outline-none text-sm placeholder-neutral-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {depositAmounts.map((amt) => (
            <button 
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className={`h-12 rounded-md flex flex-col items-center justify-center border transition-all ${amount === amt.toString() ? "border-[#ffdf00] bg-black" : "border-neutral-800 bg-[#1a1a1a]"}`}
            >
              <span className="text-white font-bold text-xs">{amt.toLocaleString()}</span>
              <span className="text-[#ffdf00] font-bold text-[9px]">+{getBonus(amt)}</span>
            </button>
          ))}
        </div>

        {/* INLINE DEPOSIT BUTTON (moved from bottom fixed position) */}
        <button 
          onClick={handleDeposit} 
          disabled={loading} 
          className={`w-full h-12 rounded-lg font-bold text-[15px] mb-6 transition-all ${amount ? "bg-[#ffdf00] text-black shadow-[0_2px_15px_rgba(255,223,0,0.3)]" : "bg-[#444] text-neutral-300"} ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Processing..." : "Deposit Now"}
        </button>

        {/* INSTRUCTIONS ADDED AT THE BOTTOM */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-neutral-800 mb-8">
           <h3 className="text-[#ffdf00] font-bold text-sm mb-2">Recharge Instructions</h3>
           <p className="text-neutral-300 text-xs leading-relaxed mb-3">
             8111c.com ke recharge orders <span className="text-white font-bold">1-3 minutes</span> mein credit ho jayenge.<br/>
             Agar network mein masla hone ki wajah se payment na ho sake, to barah-e-karam <span className="text-white font-bold">recharge order dobara submit karein</span> aur phir recharge karein.
           </p>

           <h3 className="text-[#ffdf00] font-bold text-sm mb-2 mt-4">Important Tips</h3>
           <ul className="text-neutral-300 text-xs leading-relaxed space-y-2">
             <li>Payment karne se pehle <span className="text-white font-bold">payment amount change na karein</span>.</li>
             <li><span className="text-white font-bold">Saved account par baar baar payment na karein.</span> Barah-e-karam yaad rakhein ke har baar recharge karte waqt <span className="text-white font-bold">8111c.com se latest recharge method</span> hasil karna zaroori hai.</li>
           </ul>
        </div>
      </div>

      {/* Popup Overlay */}
      {pollingRef && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md">
            <div className="w-16 h-16 border-4 border-[#ffdf00] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-[#ffdf00] text-2xl font-black mb-3">Waiting for Payment</h2>
            <p className="text-neutral-300 text-[15px] mb-8 max-w-[280px]">
              A payment window has opened. Please complete the payment there and check your mobile phone for the MPIN prompt. Do not close this screen.
            </p>
            <button 
              onClick={() => { setPollingRef(null); if (popupWindowRef.current) popupWindowRef.current.close(); popupWindowRef.current = null; setLoading(false); }}
              className="text-neutral-400 text-sm hover:text-white underline mt-6"
            >
              Cancel
            </button>
        </div>
      )}
    </div>
  );
}