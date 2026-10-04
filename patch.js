const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const newStates = `
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!identifier || !password) return alert("Please enter credentials");
    setIsLoading(true);
    try {
      const isLogin = activeTab === "login";
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { identifier, password } : { email: identifier, password };
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.50.184:4000/api/v1";
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      
      if (isLogin) {
        login(data.access_token, data.user);
        if (onLogin) onLogin();
      } else {
        alert("Registered successfully! Please login.");
        setActiveTab("login");
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };
`;

content = content.replace('  const [agreed, setAgreed] = useState(true);', '  const [agreed, setAgreed] = useState(true);' + newStates);

content = content.replace(
  '<input \n                  type="text" \n                  placeholder="*Please enter Phone number',
  '<input \n                  type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} \n                  placeholder="*Please enter Phone number'
);

content = content.replace(
  '<input \n                  type={showPassword ? "text" : "password"} \n                  placeholder="*Enter password"',
  '<input \n                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} \n                  placeholder="*Enter password"'
);

content = content.replace('{/* Sub-tabs for Registration type */}', '{activeTab === "register" && (<>\n              {/* Sub-tabs for Registration type */}');

content = content.replace('{/* Register Button */}', '</>)}\n              {/* Register Button */}');

content = content.replace('<button onClick={onLogin} className="w-full bg-[#ffdf00]', '<button onClick={handleSubmit} disabled={isLoading} className="w-full bg-[#ffdf00] disabled:opacity-50');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log("Patched!");

