const fs = require('fs');
let data = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

if (!data.includes('handleWithdraw')) {
  data = data.replace('export default function WithdrawScreen() {', 
`import toast from "react-hot-toast";\n\nexport default function WithdrawScreen() {`);

  data = data.replace('const [amount, setAmount] = useState("");', 
`const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    
    try {
      const res = await fetch(\`\${API_URL}/payments/withdraw\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${token}\` },
        body: JSON.stringify({
          amount: Number(amount),
          provider: "JAZZCASH",
          account_number: "03000000000" // Mock for now since UI doesn't have an input yet
        }),
      });
      
      const resData = await res.json();
      if (res.ok) {
        toast.success("Withdraw request sent! Pending admin approval.");
        setAmount("");
      } else {
        toast.error(resData.message || "Withdraw failed");
      }
    } catch (e) {
      toast.error("Withdraw request failed");
    } finally {
      setLoading(false);
    }
  };`);

  data = data.replace('<button className={`w-full py-3.5 rounded-lg font-bold text-[15px] ${amount ? "bg-[#ff0b0b] text-white shadow-[0_2px_15px_rgba(255,11,11,0.4)]" : "bg-[#444] text-neutral-300"}`}>',
    '<button onClick={handleWithdraw} disabled={loading} className={`w-full py-3.5 rounded-lg font-bold text-[15px] ${amount ? "bg-[#ff0b0b] text-white shadow-[0_2px_15px_rgba(255,11,11,0.4)]" : "bg-[#444] text-neutral-300"} ${loading ? "opacity-50" : ""}`}>'
  );
  
  data = data.replace('Withdraw\n        </button>', '{loading ? "Processing..." : "Withdraw"}\n        </button>');

  fs.writeFileSync('src/components/WithdrawScreen.tsx', data);
}
