const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const targetStr = `                {/* Free to claim pill (Matches Screenshot) */}
                <div className="absolute bottom-7 w-[90%] left-[5%] bg-black border border-[#ffdf00] rounded-full py-0.5 text-center z-20 shadow-md">
                   <span className="text-white text-[9px] font-bold">Free to claim <span className="text-[#ffdf00]">Rs 888</span></span>
                </div>`;

code = code.replace(targetStr, '');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
