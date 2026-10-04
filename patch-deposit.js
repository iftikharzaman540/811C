const fs = require('fs');
let data = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

if (!data.includes('handleDeposit')) {
  data = data.replace('export default function DepositScreen() {', 
`import toast from "react-hot-toast";\n\nexport default function DepositScreen() {`);

  data = data.replace('const [promoExpanded, setPromoExpanded] = useState(false);', 
`const [promoExpanded, setPromoExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    
    try {
      const res = await fetch(\`\${API_URL}/payments/deposit\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${token}\` },
        body: JSON.stringify({
          amount: Number(amount),
          provider: tab === "online" ? method.toUpperCase() : "CRYPTO",
        }),
      });
      
      const resData = await res.json();
      if (res.ok) {
        toast.success("Deposit request sent! Pending admin approval.");
        setAmount("");
        if (resData.url) window.location.href = resData.url;
      } else {
        toast.error(resData.message || "Deposit failed");
      }
    } catch (e) {
      toast.error("Deposit request failed");
    } finally {
      setLoading(false);
    }
  };`);

  data = data.replace('<button className={`w-full py-3.5 rounded-lg font-bold text-[15px] ${amount ? "bg-[#1fdf1f] text-black shadow-[0_2px_15px_rgba(31,223,31,0.3)]" : "bg-[#444] text-neutral-300"}`}>',
    '<button onClick={handleDeposit} disabled={loading} className={`w-full py-3.5 rounded-lg font-bold text-[15px] ${amount ? "bg-[#1fdf1f] text-black shadow-[0_2px_15px_rgba(31,223,31,0.3)]" : "bg-[#444] text-neutral-300"} ${loading ? "opacity-50" : ""}`}>'
  );
  
  data = data.replace('Deposit Now', '{loading ? "Processing..." : "Deposit Now"}');

  fs.writeFileSync('src/components/DepositScreen.tsx', data);
}
