const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// Find and replace the big banners section
const oldPart = `<div className="flex flex-col p-2 space-y-3">
                      {/* Live Chat */}
                      <button onClick={() => setShowLiveChat(true)} className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                        <div className="w-full bg-black flex items-center justify-center p-2">
                          <img src="/support/livechat.jpg" alt="Live Chat" className="w-full h-[140px] object-cover rounded-lg" />
                        </div>
                        <div className="w-full bg-[#cc0000] py-2 text-center text-white font-bold text-[14px]">
                          Contact Live Support
                        </div>
                      </button>
  
                      {/* WhatsApp */}
                      <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                        <div className="w-full bg-black flex items-center justify-center p-2">
                          <img src="/support/whatsapp.jpg" alt="WhatsApp" className="w-full h-[140px] object-cover rounded-lg" />
                        </div>
                        <div className="w-full bg-[#25D366] py-2 text-center text-white font-bold text-[14px]">
                          WhatsApp Channel
                        </div>
                      </a>
  
                      {/* Facebook */}
                      <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                        <div className="w-full bg-black flex items-center justify-center p-2">
                          <img src="/support/facebook.jpg" alt="Facebook" className="w-full h-[140px] object-cover rounded-lg" />
                        </div>
                        <div className="w-full bg-[#1877F2] py-2 text-center text-white font-bold text-[14px]">
                          Facebook Channel
                        </div>
                      </a>
                    </div>`;

const newPart = `<div className="grid grid-cols-3 gap-3 p-4">
                      {/* Live Chat */}
                      <button onClick={() => setShowLiveChat(true)} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#cc0000] to-[#ff0b0b] flex items-center justify-center shadow-lg border-2 border-[#ff0b0b]/30">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <span className="text-[11px] font-medium text-white text-center leading-tight">Live Chat</span>
                      </button>
                      {/* WhatsApp */}
                      <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg border-2 border-[#25D366]/30">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </div>
                        <span className="text-[11px] font-medium text-white text-center leading-tight">WhatsApp</span>
                      </a>
                      {/* Facebook */}
                      <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1877F2] to-[#0C5DC7] flex items-center justify-center shadow-lg border-2 border-[#1877F2]/30">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </div>
                        <span className="text-[11px] font-medium text-white text-center leading-tight">Facebook</span>
                      </a>
                      {/* Telegram */}
                      <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] flex items-center justify-center shadow-lg border-2 border-[#2AABEE]/30">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                        </div>
                        <span className="text-[11px] font-medium text-white text-center leading-tight">Telegram</span>
                      </a>
                      {/* Bonus */}
                      <a href="/promo" className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg border-2 border-[#FFD700]/30">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                        </div>
                        <span className="text-[11px] font-medium text-white text-center leading-tight">Bonus</span>
                      </a>
                      {/* Download */}
                      <a href="/8111c.apk" className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff0b0b] to-[#cc0000] flex items-center justify-center shadow-lg border-2 border-[#ff0b0b]/30">
                          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </div>
                        <span className="text-[11px] font-medium text-white text-center leading-tight">Download</span>
                      </a>
                    </div>`;

if (code.includes(oldPart)) {
  code = code.replace(oldPart, newPart);
  fs.writeFileSync('src/app/support/page.tsx', code);
  console.log('Replaced successfully!');
} else {
  console.log('Could not find the old section. Trying simpler match...');
  // Try a simpler match
  const simpleOld = '<div className="flex flex-col p-2 space-y-3">';
  const simpleNew = '<div className="grid grid-cols-3 gap-3 p-4">';
  if (code.includes(simpleOld)) {
    code = code.replace(simpleOld, simpleNew);
    // Now replace banner items with circle icons
    // Remove image divs and replace with circle SVG icons
    code = code.replace(/<div className="w-full bg-black flex items-center justify-center p-2">\s*<img src="\/support\/livechat\.jpg"[^>]*\/>\s*<\/div>\s*<div className="w-full bg-\[#cc0000\][^"]*">\s*Contact Live Support\s*<\/div>/g, 
      '<div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#cc0000] to-[#ff0b0b] flex items-center justify-center shadow-lg mx-auto"><svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div><span className="text-[11px] font-medium text-white text-center">Live Chat</span>');
    fs.writeFileSync('src/app/support/page.tsx', code);
    console.log('Replaced with simple match!');
  } else {
    console.log('No match found at all');
  }
}
