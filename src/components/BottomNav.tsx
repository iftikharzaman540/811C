import Link from "next/link";
import { Home, Gift, UserPlus, Headset, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function BottomNav({ activeTab = "home" }: { activeTab?: string }) {
  const { unreadNotifCount } = useUser();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[9999] pointer-events-none">
      <div className="w-full max-w-[400px] mx-auto bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-neutral-800 flex justify-between items-center px-6 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))] pointer-events-auto shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
        <Link href="/" className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${activeTab === 'home' ? 'text-[#ff0b0b]' : 'text-[#ffdf00] opacity-80 hover:opacity-100 hover:text-[#ff0b0b]'}`}>
          <Home className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </Link>
        <Link href="/promo" className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${activeTab === 'promo' ? 'text-[#ff0b0b]' : 'text-[#ffdf00] opacity-80 hover:opacity-100 hover:text-[#ff0b0b]'}`}>
          <Gift className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-bold mt-0.5">Promo</span>
        </Link>
        <Link href="/invite" className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${activeTab === 'invite' ? 'text-[#ff0b0b]' : 'text-[#ffdf00] opacity-80 hover:opacity-100 hover:text-[#ff0b0b]'}`}>
          <UserPlus className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-bold mt-0.5">Invite</span>
        </Link>
        <Link href="/support" className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${activeTab === 'support' ? 'text-[#ff0b0b]' : 'text-[#ffdf00] opacity-80 hover:opacity-100 hover:text-[#ff0b0b]'}`}>
          <Headset className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-bold mt-0.5">Support</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${activeTab === 'profile' ? 'text-[#ff0b0b]' : 'text-[#ffdf00] opacity-80 hover:opacity-100 hover:text-[#ff0b0b]'}`}>
          <div className="relative">
            <User className="w-[22px] h-[22px]" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#ff0b0b] text-white text-[9px] font-bold px-1 rounded-full shadow-md z-10 border border-black min-w-[14px] text-center">
                {unreadNotifCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </Link>
      </div>
    </div>
  );
}

