import { MessageCircle, Send } from "lucide-react";

import toast from "react-hot-toast";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111] border-t border-neutral-800 pt-6 pb-[80px] px-4 text-neutral-400">
      
      {/* Footer Links */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-[12px] text-[#888] font-medium leading-relaxed">
        {/* Casino Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-[#555] mb-1">Casino</h4>
          <a href="/invite" onClick={(e) => { e.preventDefault(); window.location.href="/invite"; }} className="hover:text-white transition-colors">Invite</a>
          <a href="/promo" onClick={(e) => { e.preventDefault(); window.location.href="/promo"; }} className="hover:text-white transition-colors">Mission</a>
          <a href="/records" onClick={(e) => { e.preventDefault(); window.location.href="/records"; }} className="hover:text-white transition-colors">Rebate</a>
          <a href="/records" onClick={(e) => { e.preventDefault(); window.location.href="/records"; }} className="hover:text-white transition-colors">Unsettled</a>
          <a href="/profile" onClick={(e) => { e.preventDefault(); window.location.href="/profile"; }} className="hover:text-white transition-colors">VIP</a>
        </div>
        
        {/* Games Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-[#555] mb-1">Games</h4>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Hot</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Mini Games</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Slot</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Fishing</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Cards</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Live</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Sports</a>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Demo</a>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-[#555] mb-1">Support</h4>
          <a href="/support" onClick={(e) => { e.preventDefault(); window.location.href="/support"; }} className="hover:text-white transition-colors">Online Support</a>
          <a href="/support" onClick={(e) => { e.preventDefault(); window.location.href="/support"; }} className="hover:text-white transition-colors">Help Center</a>
          <a href="/support" onClick={(e) => { e.preventDefault(); window.location.href="/support"; }} className="hover:text-white transition-colors">Reward Feedback</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); window.location.href="/about"; }} className="hover:text-white transition-colors whitespace-nowrap">Legal and compliant</a>
        </div>
      </div>

      {/* Social Links section */}
      <div className="mb-5 border-t border-neutral-800 pt-4">
        <h4 className="text-white text-[13px] mb-3 font-semibold">Contact us</h4>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-opacity">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-5">
        <h4 className="text-white text-[13px] mb-3 font-semibold">Official Channel</h4>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-opacity">
            <Send className="w-4 h-4" />
          </button>
          <button onClick={() => { window.location.href="/support"; }} className="w-[34px] h-[34px] rounded-full bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white flex items-center justify-center  transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </button>
        </div>
      </div>

      {/* Licensing Info */}
      <div className="text-[11px] text-[#888] text-center leading-relaxed mb-4 border-t border-neutral-800 pt-6">
        <p>8111c.com is one of the most trusted international online casino operators, offering a variety of exciting games such as live dealer games, slots, fishing, lottery, sports and more. We are authorized and regulated by the Government of Curacao, operating license number Antillephone issued to 999/JAZ. We complete all checks</p>
        <p className="mt-2">Final profit is not guaranteed.</p>
      </div>

      <div className="flex justify-between text-[13px] text-[#888] pb-4 px-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3.5 bg-neutral-800"></div>
        <span>8111c.com</span>
        <span>©Copyright 2026</span>
      </div>
    </footer>
  );
}
