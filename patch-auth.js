const fs = require('fs');
const path = 'src/components/AuthScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldHandleSubmit = `  const handleSubmit = async () => {
    if (!identifier || !password) return alert("Please enter phone number and password");
    if (identifier.length !== 10) return alert("Please enter a valid 10-digit phone number without 0 (e.g. 3001234567)");
    setIsLoading(true);
    try {
      const isLogin = activeTab === "login";
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { identifier, password } : { phone: identifier, password };`;

const newHandleSubmit = `  const handleSubmit = async () => {
    if (!identifier || !password) return alert("Please enter credentials and password");
    
    const isEmail = identifier.includes('@');
    if (!isEmail && identifier.length !== 10) {
      return alert("Please enter a valid 10-digit phone number without 0 (e.g. 3001234567)");
    }
    if (activeTab === "register" && isEmail) {
      return alert("Registration is only allowed with a phone number.");
    }
    
    setIsLoading(true);
    try {
      const isLogin = activeTab === "login";
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { identifier, password } : { phone: identifier, password };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);

const oldInput = `              {/* Phone/Email Input */}
              <div className="flex bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-10">
                <div className="flex items-center gap-1.5 px-3 border-r border-neutral-800 shrink-0">
                  <img src="https://flagcdn.com/w20/pk.png" alt="PK" className="w-4 h-3 rounded-sm object-cover opacity-90" />
                  <span className="text-[13px] text-neutral-400">+92</span>
                </div>
                <input 
                  type="tel" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} 
                  placeholder="*Please enter 10-digit Phone number" 
                  className="flex-1 bg-transparent border-none outline-none px-3 text-[13px] text-white placeholder:text-neutral-600"
                />
              </div>`;

const newInput = `              {/* Phone/Email Input */}
              <div className="flex bg-[#0f0f0f] rounded-lg border border-neutral-800 transition-all overflow-hidden h-10">
                {!identifier.includes('@') && !/[a-zA-Z]/.test(identifier) && (
                  <div className="flex items-center gap-1.5 px-3 border-r border-neutral-800 shrink-0">
                    <img src="https://flagcdn.com/w20/pk.png" alt="PK" className="w-4 h-3 rounded-sm object-cover opacity-90" />
                    <span className="text-[13px] text-neutral-400">+92</span>
                  </div>
                )}
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={(e) => {
                    const val = e.target.value;
                    // If it contains letters or @, let them type freely (for Admin email login)
                    if (/[a-zA-Z@]/.test(val)) {
                      setIdentifier(val);
                    } else {
                      // Only numbers - force 10 digits
                      setIdentifier(val.replace(/[^0-9]/g, '').slice(0, 10));
                    }
                  }} 
                  placeholder="*Phone number (or Admin Email)" 
                  className="flex-1 bg-transparent border-none outline-none px-3 text-[13px] text-white placeholder:text-neutral-600"
                />
              </div>`;

content = content.replace(oldInput, newInput);
fs.writeFileSync(path, content);
console.log("SUCCESS");
