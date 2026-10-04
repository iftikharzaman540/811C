const fs = require('fs');
let content = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// The exact block to replace starts at '{subTab === "Other Support" && (' and ends before '{subTab === "Telegram Support" && ('
const startMarker = '{subTab === "Other Support" && (';
const endMarker = '{subTab === "Telegram Support" && (';

let startIndex = content.indexOf(startMarker);
let endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = \{subTab === "Other Support" && (
                  <div className="flex flex-col gap-2 p-2">
                    {/* Live Chat */}
                    <button onClick={() => setShowLiveChat(true)} className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors w-full text-left">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        <img src="/support/livechat.jpg" alt="Live Chat" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[13px] text-white font-bold mb-1">Customer Service Line</span>
                        <span className="text-[11px] text-neutral-400">24/7 Online Support</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div>
                    </button>

                    {/* WhatsApp */}
                    <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors w-full">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        <img src="/support/whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[13px] text-white font-bold mb-1">WhatsApp Channel</span>
                        <span className="text-[11px] text-neutral-400">Join our community</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div>
                    </a>

                    {/* Facebook */}
                    <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors w-full">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        <img src="/support/facebook.jpg" alt="Facebook" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[13px] text-white font-bold mb-1">Facebook Channel</span>
                        <span className="text-[11px] text-neutral-400">Follow for updates</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div>
                    </a>
                  </div>
                )}\n                \;

    content = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
    fs.writeFileSync('src/app/support/page.tsx', content);
    console.log('Successfully patched Other Support section.');
} else {
    console.log('Could not find markers.');
}
