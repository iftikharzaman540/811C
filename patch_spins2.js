const fs = require('fs');
let code = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

// I'll replace everything between {/* Wheel Base */} and {/* Center Draw Button */}
const start = code.indexOf('{/* Wheel Base */}');
const end = code.indexOf('{/* Center Draw Button */}');

const before = code.substring(0, start);
const after = code.substring(end);

const newWheel = `{/* Wheel Base */}
                <div className="w-full h-full rounded-full border-[10px] border-neutral-300/20 bg-gradient-to-br from-[#cc0000] to-[#4a0000] relative overflow-hidden flex items-center justify-center shadow-2xl">
                  
                  {/* Rotatable Layer */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: \`rotate(-\${spinRotation}deg)\`, transition: isSpinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
                    {/* Wheel segments using CSS conic gradient */}
                    <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#cc0000 0deg 36deg, #ff0b0b 36deg 72deg, #cc0000 72deg 108deg, #ff0b0b 108deg 144deg, #cc0000 144deg 180deg, #ff0b0b 180deg 216deg, #cc0000 216deg 252deg, #ff0b0b 252deg 288deg, #cc0000 288deg 324deg, #ff0b0b 324deg 360deg)' }}></div>
                    
                    {/* Inner text (Simulated) */}
                    <div className="absolute inset-0 flex items-center justify-center rotate-[-18deg]">
                      {[7.00, 10.00, 15.00, 27.00, 77.00, 130.00, 200.00, 250.00, 300.00, 377.00].map((amt, i) => (
                        <div key={i} className="absolute w-full h-full flex justify-center pt-4" style={{ transform: \`rotate(\${i * 36}deg)\` }}>
                          <span className="text-[#ffdf00] font-bold text-[11px] drop-shadow-md">{amt.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  `;

code = before + newWheel + after;
fs.writeFileSync('src/app/promo/page.tsx', code);
