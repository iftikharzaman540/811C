const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

const startStr = '{subTab === "Other Support" && (';
const endStr = '{subTab === "Telegram Support" && (';

let startIndex = code.indexOf(startStr);
let endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    let before = code.substring(0, startIndex);
    let after = code.substring(endIndex);

    let replacement = `{subTab === "Other Support" && (
                  <div className="flex flex-col p-2 space-y-3">
                    {/* Live Chat */}
                    <button onClick={() => setShowLiveChat(true)} className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                      <div className="w-full h-auto bg-black flex items-center justify-center p-2">
                        <img src="/support/livechat.jpg" alt="Live Chat" className="w-full h-auto object-contain rounded-lg max-h-[160px]" />
                      </div>
                      <div className="w-full bg-[#cc0000] py-2 text-center text-white font-bold text-[14px]">
                        Contact Live Support
                      </div>
                    </button>

                    {/* WhatsApp */}
                    <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col block">
                      <div className="w-full h-auto bg-black flex items-center justify-center p-2">
                        <img src="/support/whatsapp.jpg" alt="WhatsApp" className="w-full h-auto object-contain rounded-lg max-h-[160px]" />
                      </div>
                      <div className="w-full bg-[#25D366] py-2 text-center text-white font-bold text-[14px]">
                        WhatsApp Channel
                      </div>
                    </a>

                    {/* Facebook */}
                    <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col block">
                      <div className="w-full h-auto bg-black flex items-center justify-center p-2">
                        <img src="/support/facebook.jpg" alt="Facebook" className="w-full h-auto object-contain rounded-lg max-h-[160px]" />
                      </div>
                      <div className="w-full bg-[#1877F2] py-2 text-center text-white font-bold text-[14px]">
                        Facebook Channel
                      </div>
                    </a>
                  </div>
                )}
                `;

    fs.writeFileSync('src/app/support/page.tsx', before + replacement + after);
    console.log("Success");
} else {
    console.log("Failed");
}
