const fs = require('fs');
let code = fs.readFileSync('src/app/admin/users/[id]/page.tsx', 'utf8');

// We need to add Wagering Requirements info in the Left Col or near Financial Summary.
// Let's add it as a new section below "Wallet Status".
const targetStr = `</div>
          </div>
        </div>

        {/* Right Col: Restrictions & Notes */}`;

const replacement = `</div>
          </div>

          <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[#ffdf00]" /> Wagering Status
            </h2>
            <div className="bg-black rounded-lg p-4 border border-neutral-800 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total Bonus</span>
                <span className="text-white font-medium">PKR {Number(user.wallet?.bonus_balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Required Valid Bet</span>
                <span className="text-white font-medium">PKR {Number(user.current_wagering_requirement || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Completed Valid Bet</span>
                <span className="text-green-500 font-medium">PKR {Number(user.current_wagering_completed || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Remaining Valid Bet</span>
                <span className="text-red-500 font-medium">PKR {Math.max(0, Number(user.current_wagering_requirement || 0) - Number(user.current_wagering_completed || 0)).toLocaleString()}</span>
              </div>
              
              <div className={\`mt-2 w-full py-2 rounded-lg text-center text-sm font-bold \${
                Number(user.current_wagering_completed || 0) >= Number(user.current_wagering_requirement || 0) 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-red-500/20 text-red-500'
              }\`}>
                Withdrawal: {Number(user.current_wagering_completed || 0) >= Number(user.current_wagering_requirement || 0) ? 'ELIGIBLE' : 'LOCKED'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Restrictions & Notes */}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/app/admin/users/[id]/page.tsx', code);
  console.log("Patched user profile page with Wagering Status");
} else {
  console.log("Could not find target in page.tsx");
}
