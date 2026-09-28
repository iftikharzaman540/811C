const fs = require('fs');
const path = 'src/components/DepositScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldHandleDeposit = `  const handleDeposit = async () => {
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
          provider: tab === "online" ? method.toUpperCase() : "MANUAL",
        }),
      });
      
      const resData = await res.json();
      if (res.ok) {
        toast.success("Deposit request sent! Pending admin approval.");
        setAmount("");
        // No redirect to fake payment url
        router.push("/profile");
      } else {
        toast.error(resData.message || "Deposit failed");
      }
    } catch (e) {
      toast.error("Deposit request failed");
    } finally {
      setLoading(false);
    }
  };`;

const newHandleDeposit = `  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (tab === "online" && accountNo.length < 10) {
      toast.error("Please enter a valid mobile number (e.g., 03001234567)");
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

// Use simple string replace after normalizing newlines
content = content.replace(/\r\n/g, '\n');
const oldNormalized = oldHandleDeposit.replace(/\r\n/g, '\n');

if (content.includes(oldNormalized)) {
  content = content.replace(oldNormalized, newHandleDeposit);
  fs.writeFileSync(path, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED TO FIND BLOCK");
}
