const fs = require('fs');
const path = 'src/components/DepositScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldHandleDeposit = `  const handleDeposit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to make a deposit");
      router.push("/");
      return;
    }

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

const newHandleDeposit = `  const handleDeposit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to make a deposit");
      router.push("/");
      return;
    }

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
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.50.184:4000/api/v1";
    
    try {
      const endpoint = tab === "online" ? "auto-deposit" : "deposit";
      const payload = tab === "online"
        ? { amount: Number(amount), provider: method.toUpperCase(), accountNo }
        : { amount: Number(amount), provider: "MANUAL" };

      const res = await fetch(\`\${API_URL}/payments/\${endpoint}\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${token}\` },
        body: JSON.stringify(payload),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.message || "Deposit failed");
        setShowAutoPrompt(false);
        setLoading(false);
        return;
      }

      if (tab === "online") {
        // Start polling the status
        const ref = resData.reference;
        let attempts = 0;
        let success = false;
        
        while (attempts < 30) {
          await new Promise(r => setTimeout(r, 2000));
          const statusRes = await fetch(\`\${API_URL}/payments/status/\${ref}\`, {
            headers: { "Authorization": \`Bearer \${token}\` }
          });
          const statusData = await statusRes.json();
          if (statusData.status === 'COMPLETED') {
            success = true;
            break;
          } else if (statusData.status === 'REJECTED') {
            toast.error("Payment failed or cancelled on phone.");
            setShowAutoPrompt(false);
            setLoading(false);
            return;
          }
          attempts++;
        }
        
        if (success) {
          toast.success("Deposit Successful! Balance updated.");
        } else {
          toast.success("Deposit pending. Please check your balance shortly.");
        }
        
      } else {
        toast.success("Deposit request sent!");
      }

      setAmount("");
      setShowAutoPrompt(false);
      router.push("/profile");
      
    } catch (e) {
      toast.error("Deposit request failed");
      setShowAutoPrompt(false);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(/\r\n/g, '\n');
const oldNorm = oldHandleDeposit.replace(/\r\n/g, '\n');

if (content.includes(oldNorm)) {
  content = content.replace(oldNorm, newHandleDeposit);
  fs.writeFileSync(path, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to find block. Dumping content to check.");
}
