"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

export default function SecurityCenter() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = "https://8111c.com/api/v1";
      
      const res = await fetch(`${API_URL}/auth/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Optionally redirect back after a delay
      setTimeout(() => router.back(), 1500);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111] text-white flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-neutral-800">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-bold text-white tracking-wide">Security Center</h1>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      <div className="p-4 flex-1">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-neutral-800/50 shadow-xl">
          <h2 className="text-[15px] font-semibold text-[#ffdf00] mb-5 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Change Login Password
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-neutral-400 font-medium ml-1">Old Password</label>
              <input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full bg-[#111] border border-neutral-800 text-white rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-[#ffdf00]/50 focus:bg-[#1a1a1a] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-neutral-400 font-medium ml-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-[#111] border border-neutral-800 text-white rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-[#ff0000]/50 focus:bg-[#1a1a1a] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-neutral-400 font-medium ml-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#111] border border-neutral-800 text-white rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-[#ff0000]/50 focus:bg-[#1a1a1a] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-[#cc0000] to-[#ff3300] text-white font-bold py-4 rounded-xl text-[16px] shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
