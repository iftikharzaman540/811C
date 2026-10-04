const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Remove Fades
const leftFade = '{/* Left Fade */}\n          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>';
code = code.replace(leftFade, '');

const rightFade = '{/* Right Fade */}\n          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>';
code = code.replace(rightFade, '');

// 2. Fix Marquee and add Voice
const oldMarqueeStart = code.indexOf('{/* Marquee Bar (Beautiful) */}');
const categoryNavStart = code.indexOf('{/* Category Navigation Slider (Beautiful) */}');

if (oldMarqueeStart !== -1 && categoryNavStart !== -1) {
  const newMarquee = `{/* Marquee Bar (Beautiful) */}
        <div className="px-3 mb-7">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] rounded-full border border-neutral-800 p-1.5 shadow-inner relative overflow-hidden">
            <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-[#141414] to-transparent z-10"></div>
            
            <div 
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const msg = new SpeechSynthesisUtterance("Welcome to 8 1 1 1 C dot com. We wish you a big win!");
                  msg.rate = 0.9;
                  msg.pitch = 1.1;
                  window.speechSynthesis.speak(msg);
                  toast.success("Playing welcome message!");
                }
              }}
              className="bg-gradient-to-br from-red-600 to-red-900 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,0,0.4)] z-20 cursor-pointer hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(255,0,0,0.8)]"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 overflow-hidden relative h-6 flex items-center">
               <motion.div 
                 animate={{ x: [0, -400] }}
                 transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                 className="whitespace-nowrap flex gap-4"
               >
                 <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[13px] font-medium pr-10">
                   Welcome to 8111C.com &nbsp;✨&nbsp; Bigger Rewards &nbsp;✨&nbsp; More Games &nbsp;✨&nbsp; Play & Win Big Today!
                 </p>
                 <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[13px] font-medium pr-10">
                   Welcome to 8111C.com &nbsp;✨&nbsp; Bigger Rewards &nbsp;✨&nbsp; More Games &nbsp;✨&nbsp; Play & Win Big Today!
                 </p>
               </motion.div>
            </div>
            
            <div className="absolute right-0 w-12 h-full bg-gradient-to-l from-[#141414] to-transparent z-10"></div>
            
            <div className="relative shrink-0 ml-1 mr-2 z-20 cursor-pointer hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-neutral-400 hover:text-white transition-colors" />
              <div className="absolute -top-1.5 -right-2 bg-[#ff0b0b] text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center shadow-[0_0_8px_rgba(255,11,11,0.6)] leading-tight border border-black animate-pulse">
                31
              </div>
            </div>
          </div>
        </div>\n\n        `;
        
  code = code.substring(0, oldMarqueeStart) + newMarquee + code.substring(categoryNavStart);
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Successfully fixed fades and marquee!");
} else {
  console.log("Could not find marquee section");
}
