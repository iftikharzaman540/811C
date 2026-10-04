const fs = require('fs');

const path = 'src/components/DepositScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states
content = content.replace(
  'const [loading, setLoading] = useState(false);',
  'const [loading, setLoading] = useState(false);\n  const [accountNo, setAccountNo] = useState("");\n  const [showAutoPrompt, setShowAutoPrompt] = useState(false);'
);

// 2. Replace handleDeposit
const newHandleDeposit = `const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (tab === "online" && accountNo.length < 10) {
      toast.error("Please enter a valid 11-digit mobile number (e.g., 03001234567)");
      return;
    }
    
    setLoading(true);
    if (tab === "online") {
      setShowAutoPrompt(true);
    }
    
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.50.184:4000/api/v1";
    
    try {
      const endpoint = tab === "online" ? "auto-deposit" : "deposit";
      const payload = tab === "online"
        ? { amount: Number(amount), provider: method.toUpperCase(), accountNo }
        : { amount: Number(amount), provider: "MANUAL" };
        
      if (tab === "online") {
        await new Promise(r => setTimeout(r, 4000)); // Mock API delay
      }

      const res = await fetch(\`\${API_URL}/payments/\${endpoint}\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${token}\` },
        body: JSON.stringify(payload),
      });
      
      const resData = await res.json();
      if (res.ok) {
        toast.success(tab === "online" ? "Deposit Successful!" : "Deposit request sent!");
        setAmount("");
        setShowAutoPrompt(false);
        router.push("/profile");
      } else {
        toast.error(resData.message || "Deposit failed");
        setShowAutoPrompt(false);
      }
    } catch (e) {
      toast.error("Deposit request failed");
      setShowAutoPrompt(false);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(/const handleDeposit = async \(\) => \{[\s\S]*?\n  };\n/m, newHandleDeposit + '\n');

// 3. Add JazzCash Number Input
const phoneInput = `
        {tab === "online" && (
          <div className="mb-4">
            <h2 className="text-sm font-bold mb-3 mt-2">JazzCash / EasyPaisa Mobile Number</h2>
            <div className="bg-[#1a1a1a] border border-[#ff0b0b]/40 rounded-md flex items-center px-3 h-[46px] focus-within:border-[#1fdf1f]">
              <span className="text-neutral-400 mr-2 text-sm">+92</span>
              <input 
                type="tel" 
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="3001234567" 
                className="bg-transparent border-none outline-none w-full text-white text-[15px]"
              />
            </div>
          </div>
        )}
        {/* Predefined Amounts */}`;

content = content.replace('{/* Predefined Amounts */}', phoneInput);

// 4. Add Loading Modal safely BEFORE the last </div>
const loadingModal = `
      {showAutoPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm flex flex-col items-center text-center border border-[#1fdf1f]/30 shadow-[0_0_30px_rgba(31,223,31,0.15)]">
            <div className="w-16 h-16 border-4 border-[#1fdf1f]/20 border-t-[#1fdf1f] rounded-full animate-spin mb-4"></div>
            <h3 className="text-white text-lg font-bold mb-2">Awaiting Payment</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Please check your phone. A prompt has been sent to your <strong>{method}</strong> number. Enter your MPIN in your app to authorize the payment.
            </p>
            <div className="text-[#1fdf1f] font-bold text-2xl animate-pulse">Rs {amount}</div>
          </div>
        </div>
      )}
`;

content = content.replace(/<\/div>\s*<\/div>\s*\);\s*}\s*$/, loadingModal + '\n      </div>\n    </div>\n  );\n}');

fs.writeFileSync(path, content);
console.log("DepositScreen fixed and updated.");
