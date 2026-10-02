"use client";

import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LogOut, LayoutDashboard, Users, Wallet, CreditCard, ShieldCheck, 
  Gift, Ticket, LayoutTemplate, MessageSquare, Settings, Activity, 
  Menu, X, ChevronDown, ChevronRight, BarChart
} from "lucide-react";

const SIDEBAR_NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users Management", href: "/admin/users", icon: Users },
  {
    name: "Finances",
    icon: Wallet,
    children: [
      { name: "Deposits", href: "/admin/finances/deposits" },
      { name: "Withdrawals", href: "/admin/finances/withdrawals" },
      { name: "Wallet Adjustments", href: "/admin/finances/wallet-adjustments" },
      { name: "Payment Methods", href: "/admin/finances/payment-methods" },
    ]
  },
  { name: "KYC Management", href: "/admin/kyc", icon: ShieldCheck },
  {
    name: "Marketing",
    icon: Gift,
    children: [
      { name: "Bonuses", href: "/admin/marketing/bonuses" },
      { name: "Promo Codes", href: "/admin/marketing/promocodes" },
      { name: "Affiliates", href: "/admin/marketing/affiliates" },
    ]
  },
  {
    name: "CMS & Website",
    icon: LayoutTemplate,
    children: [
      { name: "Banners", href: "/admin/cms/banners" },
      { name: "Pages", href: "/admin/cms/pages" },
      { name: "Casino Settings", href: "/admin/cms/casino" },
      { name: "Sportsbook Settings", href: "/admin/cms/sportsbook" },
    ]
  },
  { name: "Support Tickets", href: "/admin/support/tickets", icon: MessageSquare },
  {
    name: "System Settings",
    icon: Settings,
    children: [
      { name: "Global Settings", href: "/admin/system/settings" },
      { name: "VIP Levels", href: "/admin/system/vip-levels" },
      { name: "VIP History", href: "/admin/system/vip-history" },
      { name: "Provider Status", href: "/admin/system/providers" },
      { name: "Admin Roles", href: "/admin/system/admins" },
      { name: "Audit Logs", href: "/admin/system/audit-logs" },
    ]
  },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN"))) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative">
      
      {/* Top Bar (Always Visible) */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#111] sticky top-0 z-40">
        <h2 className="text-[#ffdf00] font-bold text-lg leading-tight">Admin Portal</h2>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay (Always mobile style) */}
      <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} w-full max-w-[400px] bg-[#111] border-r border-neutral-800 flex-col shrink-0 fixed inset-y-0 left-1/2 -translate-x-1/2 z-50 overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <h2 className="text-[#ffdf00] font-bold text-lg leading-tight">Admin Menu</h2>
            <p className="text-xs text-neutral-400 mt-1">{user.email}</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-neutral-800 rounded text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {SIDEBAR_NAV.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button 
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors ${expandedMenus[item.name] ? 'bg-[#1a1a1a]' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-[#ffdf00]" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {expandedMenus[item.name] ? <ChevronDown className="w-4 h-4 text-neutral-500" /> : <ChevronRight className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {expandedMenus[item.name] && (
                    <div className="ml-9 mt-1 flex flex-col gap-1">
                      {item.children.map(child => (
                        <Link 
                          key={child.href} 
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${pathname === child.href ? 'text-[#ffdf00] bg-[#1a1a1a]' : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'}`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === item.href ? 'bg-[#1a1a1a] text-[#ffdf00]' : 'hover:bg-[#1a1a1a]'}`}
                >
                  <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-[#ffdf00]' : 'text-[#ffdf00]'}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800 mt-auto">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-[#cc0000] hover:bg-[#ff0b0b] transition-colors text-white font-bold text-sm">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden p-4 pt-6 bg-[#0a0a0a]">
        {children}
      </main>
    </div>
  );
}


