const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// Add state for paymentMethods
code = code.replace(/const \[method, setMethod\] = useState\("JazzCash_0"\);/, `const [method, setMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [fetchingMethods, setFetchingMethods] = useState(true);

  useEffect(() => {
    fetch('https://8111c.com/api/v1/payments/methods')
      .then(res => res.json())
      .then(data => {
        setPaymentMethods(data);
        if (data.length > 0) {
          // Find first active method to set as default
          let defaultMethod = data[0].id === 'easypaisa' ? 'EasyPaisa_0' : data[0].id === 'jazzcash' ? 'JazzCash_0' : 'Bank_0';
          setMethod(defaultMethod);
        }
        setFetchingMethods(false);
      })
      .catch(() => setFetchingMethods(false));
  }, []);`);

// Replace the hardcoded payment methods grid
const oldMethodsBlock = `<div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setMethod("JazzCash_0")} className={\`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all \${method.includes("JazzCash") ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}\`}>
            <img src="/jazzcash.png" alt="JazzCash" className="w-6 h-6 object-contain rounded" />
            <span className="text-sm font-medium">JazzCash</span>
          </button>
          <button onClick={() => setMethod("EasyPaisa_0")} className={\`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all \${method.includes("EasyPaisa") ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}\`}>
            <img src="/easypaisa.png" alt="EasyPaisa" className="w-6 h-6 object-contain rounded bg-white p-0.5" />
            <span className="text-sm font-medium">EasyPaisa</span>
          </button>
        </div>`;

const newMethodsBlock = `<div className="grid grid-cols-2 gap-3 mb-4">
          {fetchingMethods ? (
             <div className="col-span-2 text-center text-xs text-neutral-500 py-4">Loading payment methods...</div>
          ) : paymentMethods.length === 0 ? (
             <div className="col-span-2 text-center text-xs text-[#ff4747] py-4">No payment methods available right now.</div>
          ) : (
            paymentMethods.map(pm => {
              const methodKey = pm.id === 'easypaisa' ? 'EasyPaisa' : pm.id === 'jazzcash' ? 'JazzCash' : 'Bank';
              return (
                <button 
                  key={pm.id}
                  onClick={() => setMethod(methodKey + "_0")} 
                  className={\`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all \${method.includes(methodKey) ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}\`}
                >
                  {pm.id === 'easypaisa' && <img src="/easypaisa.png" alt="EasyPaisa" className="w-6 h-6 object-contain rounded bg-white p-0.5" />}
                  {pm.id === 'jazzcash' && <img src="/jazzcash.png" alt="JazzCash" className="w-6 h-6 object-contain rounded" />}
                  {pm.id === 'bank_transfer' && <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>}
                  <span className="text-sm font-medium">{pm.name}</span>
                </button>
              )
            })
          )}
        </div>`;

// Add CreditCard import
if (!code.includes('CreditCard')) {
  code = code.replace(/Copy \} from "lucide-react";/, 'Copy, CreditCard } from "lucide-react";');
}

code = code.replace(oldMethodsBlock, newMethodsBlock);

// Replace Mobile Number label
code = code.replace(/Mobile Number \(JazzCash \/ EasyPaisa\)/, 'Account / Mobile Number');
code = code.replace(/placeholder="3001234567"/, 'placeholder="e.g. 03001234567"');

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen to dynamically render active payment methods");
