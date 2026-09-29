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
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [amount, setAmount] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [provider, setProvider] = useState("EASYPAISA");
  const [withdrawPwd, setWithdrawPwd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("withdraw_pwd");
      setHasPassword(!!stored);
    }
  }, []);

  const handleInput = (val: string, setter: (v: string) => void) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setter(clean);
  };

  const handleSetPassword = () => {
    if (password.length !== 6 || confirmPassword.length !== 6) {
      toast.error("Password must be 6 digits");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    localStorage.setItem("withdraw_pwd", password);
    toast.success("Withdrawal password set successfully!");
    setHasPassword(true);
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) < 500) {
      toast.error("Minimum withdrawal is 500");
      return;
    }
    if (!accountNo || accountNo.length < 10) {
      toast.error("Please enter a valid account number");
      return;
    }
    if (withdrawPwd !== localStorage.getItem("withdraw_pwd")) {
      toast.error("Incorrect withdrawal password");
      return;
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
      const res = await fetch(`${API_URL}/payments/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          provider: provider,
          accountDetails: { accountNo }
        })
      });

      toast.dismiss();
      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal request submitted!");
        setAmount("");
        setAccountNo("");
        setWithdrawPwd("");
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

  const renderBoxes = (value: string) => {
    return (
      <div className="flex w-full border border-neutral-700 rounded-md overflow-hidden bg-[#151515]">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-[46px] flex items-center justify-center text-xl font-bold border-r border-neutral-700 last:border-r-0 ${value[i] ? "text-white" : "text-transparent"}`}
          >
            {value[i] ? "●" : ""}
          </div>
        ))}
      </div>
    );
  };

  if (hasPassword === null) return <div className="min-h-screen bg-[#111]"></div>;

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50 border-b border-neutral-800">
        <button onClick={() => router.back()} className="text-neutral-400 hover:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{!hasPassword ? "Withdrawal Password" : "Withdraw Funds"}</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 px-4 pt-6 max-w-md mx-auto w-full">
        {!hasPassword ? (
          <>
            <p className="text-[#1fdf1f] text-center text-sm font-medium mb-8 leading-tight">
              For the safety of your funds, you need to set a withdrawal password first!
            </p>

            <div className="mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[15px] font-medium">Set up Withdrawal Password</span>
                <EyeOff className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="relative">
                {renderBoxes(password)}
                <input 
                  type="text" 
                  inputMode="numeric" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                  value={password}
                  onChange={(e) => handleInput(e.target.value, setPassword)}
                />
              </div>
            </div>

            <div className="mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[15px] font-medium">Confirm new Withdrawal Password</span>
                <EyeOff className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="relative">
                {renderBoxes(confirmPassword)}
                <input 
                  type="text" 
                  inputMode="numeric" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                  value={confirmPassword}
                  onChange={(e) => handleInput(e.target.value, setConfirmPassword)}
                />
              </div>
            </div>

            <div className="flex items-start gap-1.5 text-[#ff5555] text-xs leading-tight">
              <div className="bg-[#ff5555] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold">!</span>
              </div>
              <p>
                Attention: The withdrawal password protects your funds and is extremely important. Keep it to yourself to prevent any financial loss
              </p>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSetPassword}
                className={`w-full py-3.5 rounded-lg font-bold text-[15px] text-black ${password.length === 6 && confirmPassword.length === 6 ? "bg-[#66df2f] hover:bg-[#55cc25] shadow-[0_2px_15px_rgba(31,223,31,0.3)]" : "bg-[#80e550] opacity-80"}`}
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Real Withdraw UI */}
            <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-4 mb-6 border border-neutral-700 shadow-lg">
              <p className="text-neutral-400 text-sm mb-1">Available Balance</p>
              <h2 className="text-3xl font-black text-[#ffdf00]">Rs {user?.balance || "0.00"}</h2>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Withdrawal Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setProvider("EASYPAISA")} 
                  className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-all ${provider === "EASYPAISA" ? "border-[#ffdf00] bg-[#1a1a1a]" : "border-neutral-700 bg-black"}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Easypaisa_logo.svg" className="h-6 mb-1 object-contain bg-white px-2 py-1 rounded" alt="Easypaisa" />
                  <span className="text-xs font-medium">Easypaisa</span>
                </button>
                <button 
                  onClick={() => setProvider("JAZZCASH")} 
                  className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-all ${provider === "JAZZCASH" ? "border-[#ffdf00] bg-[#1a1a1a]" : "border-neutral-700 bg-black"}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jazzcash.png/1200px-Jazzcash.png" className="h-6 mb-1 object-contain bg-white px-2 py-1 rounded" alt="JazzCash" />
                  <span className="text-xs font-medium">JazzCash</span>
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Amount (Rs)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Minimum 500"
                  className="w-full bg-black border border-neutral-700 rounded-lg py-3 px-4 text-white font-bold text-lg focus:outline-none focus:border-[#ffdf00] placeholder:text-neutral-600 placeholder:font-normal"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Account Number (Phone)</label>
              <input 
                type="text" 
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full bg-black border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#ffdf00]"
              />
            </div>

            <div className="mb-8 relative">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Withdrawal Password</label>
              <div className="relative">
                {renderBoxes(withdrawPwd)}
                <input 
                  type="text" 
                  inputMode="numeric" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                  value={withdrawPwd}
                  onChange={(e) => handleInput(e.target.value, setWithdrawPwd)}
                />
              </div>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={isSubmitting || withdrawPwd.length !== 6 || !amount || !accountNo}
              className={`w-full py-4 rounded-lg font-bold text-[16px] text-black ${!isSubmitting && withdrawPwd.length === 6 && amount && accountNo ? "bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] shadow-[0_4px_15px_rgba(255,223,0,0.3)] hover:scale-[0.98]" : "bg-[#807000] text-neutral-400 cursor-not-allowed"} transition-all`}
            >
              {isSubmitting ? "Processing..." : "Submit Withdrawal"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
