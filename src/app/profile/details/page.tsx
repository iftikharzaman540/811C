"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Copy, Edit2, Phone, Mail, Calendar, User, ChevronDown } from "lucide-react";
import { apiRequest } from "@/utils/api";

// Custom icons as SVGs
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.013 2.001C6.495 2.001 2.012 6.47 2.012 11.977C2.012 13.737 2.474 15.395 3.284 16.824L2 22L7.301 20.738C8.73 21.469 10.323 21.953 12.013 21.953C17.531 21.953 22.014 17.484 22.014 11.977C22.014 6.47 17.531 2.001 12.013 2.001ZM8.508 8.163C8.283 8.163 7.828 8.337 7.42 8.773C7.012 9.208 5.88 10.297 5.88 12.518C5.88 14.739 7.464 16.873 7.691 17.178C7.917 17.483 10.748 22.057 15.278 23.82C18.995 25.267 19.808 24.975 20.533 24.845C21.258 24.714 22.888 23.843 23.205 22.972C23.522 22.101 23.522 21.36 23.432 21.208C23.341 21.055 23.114 20.968 22.775 20.794C22.435 20.62 20.759 19.792 20.442 19.662C20.125 19.531 19.898 19.466 19.672 19.814C19.445 20.162 18.811 20.947 18.63 21.164C18.449 21.382 18.267 21.404 17.927 21.23C17.588 21.056 16.505 20.704 15.221 19.553C14.223 18.658 13.542 17.55 13.361 17.202C13.179 16.854 13.342 16.669 13.513 16.501C13.666 16.351 13.851 16.108 14.021 15.912C14.191 15.716 14.259 15.586 14.372 15.368C14.485 15.15 14.429 14.954 14.338 14.78C14.248 14.606 13.568 12.929 13.285 12.232C13.01 11.554 12.733 11.647 12.54 11.636C12.359 11.626 12.132 11.626 11.906 11.626C11.679 11.626 11.317 11.713 10.977 12.083C10.637 12.454 9.617 13.412 9.617 15.372C9.617 17.332 11.022 19.205 11.226 19.488C11.43 19.771 14.137 24.137 18.463 25.827C19.492 26.229 20.312 26.467 20.957 26.647C21.99 26.974 22.923 26.927 23.654 26.817C24.475 26.694 26.104 25.822 26.444 24.863C26.783 23.905 26.783 23.099 26.67 22.925C26.557 22.75 26.33 22.663 25.991 22.489C25.65 22.314 23.974 21.486 23.657 21.355C23.34 21.224 23.114 21.159 22.887 21.507C22.661 21.856 22.027 22.64 21.846 22.858C21.665 23.076 21.484 23.097 21.144 22.923C20.804 22.749 19.721 22.397 18.437 21.246C17.439 20.351 16.758 19.243 16.577 18.895C16.395 18.547 16.558 18.362 16.729 18.194C16.882 18.044 17.067 17.801 17.237 17.605C17.407 17.409 17.475 17.279 17.588 17.061C17.701 16.843 17.645 16.647 17.554 16.473C17.464 16.299 16.784 14.622 16.501 13.925C16.226 13.247 15.949 13.34 15.756 13.329C15.575 13.319 15.348 13.319 15.122 13.319C14.895 13.319 14.533 13.406 14.193 13.776C13.853 14.147 12.833 15.105 12.833 17.065C12.833 19.025 14.238 20.898 14.442 21.181C14.646 21.464 17.353 25.83 21.679 27.52C22.708 27.922 23.528 28.16 24.173 28.34C25.206 28.667 26.139 28.62 26.87 28.51C27.691 28.387 29.32 27.515 29.66 26.556C30 25.598 30 24.792 29.887 24.618C29.774 24.443 29.547 24.356 29.208 24.182L12.013 2.001Z" fill="#25D366" />
    <circle cx="12" cy="12" r="10" stroke="#25D366" strokeWidth="1.5" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0C5.373 0 0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.562H7.078V12.073H10.125V9.412C10.125 6.38 11.916 4.717 14.657 4.717C15.97 4.717 17.344 4.952 17.344 4.952V7.935H15.83C14.34 7.935 13.875 8.868 13.875 9.838V12.073H17.203L16.67 15.562H13.875V24C19.612 23.094 24 18.1 24 12.073Z"/>
  </svg>
);
const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0088cc" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0C5.344 0 0 5.344 0 11.944C0 18.544 5.344 23.888 11.944 23.888C18.544 23.888 23.888 18.544 23.888 11.944C23.888 5.344 18.544 0 11.944 0ZM17.377 7.781L14.733 20.258C14.536 21.12 13.987 21.365 13.238 20.941L9.103 17.893L7.106 19.816C6.885 20.037 6.697 20.225 6.255 20.225L6.553 16.02L14.218 9.09C14.551 8.793 14.146 8.627 13.7 8.924L4.225 14.896L0.165 13.626C-0.72 13.349 -0.735 12.74 0.35 12.316L16.297 6.166C17.035 5.889 17.683 6.326 17.377 7.781Z" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.083 4.126H5.117L17.083 19.77Z"/>
  </svg>
);

export default function ProfileDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [nickname, setNickname] = useState("");
  const [displayName, setDisplayName] = useState(""); // mapping to username
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiRequest("/auth/me");
      setUser(res);
      setNickname(res.nickname || "");
      setDisplayName(res.username || "");
      setWhatsapp(res.whatsapp || "");
      setFacebook(res.facebook || "");
      setTelegram(res.telegram || "");
      setTwitter(res.twitter || "");
      
      if (res.date_of_birth) {
        const d = new Date(res.date_of_birth);
        setDob(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        nickname,
        username: displayName,
        whatsapp,
        facebook,
        telegram,
        twitter
      };
      if (dob && !user.date_of_birth) {
         payload.date_of_birth = dob;
      }
      
      await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (e: any) {
      alert(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const copyId = () => {
    if (user?.player_id) {
      navigator.clipboard.writeText(user.player_id.toString());
      alert("ID copied!");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">Loading...</div>;
  }

  // Mask phone number logic
  const rawPhone = user?.phone || "";
  let maskedPhone = rawPhone;
  if (rawPhone.length > 5) {
    // e.g. +923001234540 -> +92 ***540
    // Simplified masking for demo
    maskedPhone = rawPhone.substring(0, 3) + " ***" + rawPhone.substring(rawPhone.length - 3);
  }

  return (
    <div className="min-h-screen bg-[#111] pb-24 text-gray-300 font-sans">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/5 relative bg-[#1a1a1a]">
        <button onClick={() => router.back()} className="text-gray-400 p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-normal absolute left-1/2 -translate-x-1/2">Profile</h1>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        
        {/* Top Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-transparent">
              <img src={user?.avatar || "/images/avatar.jpg"} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {/* Edit Avatar badge */}
            <div className="absolute top-0 right-0 bg-[#53f124] rounded-full p-0.5 cursor-pointer border border-[#111]">
              <Edit2 className="w-3 h-3 text-black" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-600 text-yellow-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#111] shadow-sm whitespace-nowrap">
              VIP {user?.vip_level_id || 0}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">ID: {user?.player_id || "N/A"}</span>
              <button onClick={copyId}>
                <Copy className="w-4 h-4 text-[#53f124]" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Nickname: </span>
              <input 
                type="text" 
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Please enter a nickname" 
                className="bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500 w-36"
              />
              <Edit2 className="w-4 h-4 text-[#53f124]" />
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-1 mt-6">
          <label className="text-sm text-gray-200">Display Name</label>
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3 relative">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-200 w-full" 
            />
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3" />
          </div>
        </div>

        {/* Linked Phone Number */}
        <div className="space-y-1">
          <label className="text-sm text-gray-200">Linked Phone Number</label>
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <Phone className="w-5 h-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-400">{maskedPhone || "No phone linked"}</span>
          </div>
        </div>

        {/* Linked Email Address */}
        <div className="space-y-1">
          <label className="text-sm text-gray-200">Linked Email Address</label>
          <div className="flex items-center justify-between bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-400">{user?.email || "Please link your email"}</span>
            </div>
            {!user?.email && <span className="text-[#53f124] text-sm cursor-pointer">Link</span>}
          </div>
        </div>

        {/* Third-Party Accounts */}
        <div className="space-y-3">
          <label className="text-sm text-gray-200">Third-Party Accounts</label>
          
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <div className="w-5 h-5 mr-3 flex items-center justify-center"><WhatsAppIcon /></div>
            <input type="text" placeholder="Enter WhatsApp account" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-600" />
          </div>
          
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <div className="w-5 h-5 mr-3 flex items-center justify-center"><FacebookIcon /></div>
            <input type="text" placeholder="Enter Facebook account" value={facebook} onChange={e=>setFacebook(e.target.value)} className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-600" />
          </div>
          
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <div className="w-5 h-5 mr-3 flex items-center justify-center"><TelegramIcon /></div>
            <input type="text" placeholder="Enter Telegram account, e.g. @xxxx" value={telegram} onChange={e=>setTelegram(e.target.value)} className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-600" />
          </div>
          
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <div className="w-5 h-5 mr-3 flex items-center justify-center bg-black rounded-full"><XIcon /></div>
            <input type="text" placeholder="Please enter X(Twitter) account" value={twitter} onChange={e=>setTwitter(e.target.value)} className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-600" />
          </div>
        </div>

        {/* Registration Date */}
        <div className="space-y-1">
          <label className="text-sm text-gray-200">Registration Date</label>
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-400">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : "N/A"}
            </span>
          </div>
        </div>

        {/* Date of birth */}
        <div className="space-y-1">
          <label className="text-sm text-gray-200">Date of birth <span className="text-gray-500 text-xs">(Unchangeable once set)</span></label>
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-md p-3">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="date" 
              value={dob} 
              onChange={e => setDob(e.target.value)}
              disabled={!!user?.date_of_birth} 
              className="bg-transparent border-none outline-none text-sm text-gray-200 w-full"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-4 max-w-lg mx-auto bg-[#111]">
        <button onClick={() => router.back()} className="flex-1 py-3.5 rounded-md border border-[#53f124] text-[#53f124] font-medium text-center hover:bg-[#53f124]/10 transition-colors">
          Back
        </button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-3.5 rounded-md bg-[#53f124] text-black font-semibold text-center hover:bg-[#4ade80] transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

    </div>
  );
}
