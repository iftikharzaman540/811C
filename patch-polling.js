const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

code = code.replace(/const \[trxId, setTrxId\] = useState\(""\);\s*/, 'const [trxId, setTrxId] = useState("");\n  const [pollingRef, setPollingRef] = useState<string | null>(null);\n');

const pollingLogic = `
  useEffect(() => {
    if (!pollingRef) return;
    const token = localStorage.getItem("token");
    let interval: any;
    
    const checkStatus = async () => {
      try {
        const API_URL = "https://8111c.com/api/v1";
        const res = await fetch(API_URL + "/payments/status/" + pollingRef, {
          headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        
        if (data.status === 'COMPLETED' || data.status === 'PAID') {
          toast.success("Deposit Successful! Balance updated instantly.");
          setPollingRef(null);
          setAmount("");
          if (refreshUser) refreshUser();
          clearInterval(interval);
          router.push("/profile");
        } else if (data.status === 'REJECTED' || data.status === 'FAILED' || data.status === 'CANCELLED') {
          toast.error("Deposit failed or was rejected.");
          setPollingRef(null);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (e) {
        // silently fail and retry
      }
    };
    
    interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [pollingRef, refreshUser, router]);
`;

code = code.replace(/const handleDeposit = async \(\) => \{/, pollingLogic + '\n  const handleDeposit = async () => {');

code = code.replace(/if \(tab === "online"\) \{\s*toast\.success\("Deposit initiated! Redirecting to payment gateway\.\.\."\);\s*if \(resData\.payment_url\) \{\s*window\.location\.href = resData\.payment_url;\s*return;\s*\}\s*\}/, `if (tab === "online") {
        if (resData.reference) {
          setPollingRef(resData.reference);
          toast.success("Deposit initiated!");
        } else {
          toast.error("Invalid response from server");
          setLoading(false);
        }
        return; // wait for polling
      }`);

const overlayJSX = `
      {pollingRef && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-[#ffdf00] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-[#ffdf00] text-2xl font-black mb-3">Waiting for Payment</h2>
          <p className="text-neutral-300 text-[15px] mb-8 max-w-[280px]">
            Please check your mobile phone and enter your MPIN to authorize the deposit. Do not close this screen.
          </p>
          <button 
            onClick={() => { setPollingRef(null); setLoading(false); }}
            className="text-neutral-400 text-sm hover:text-white underline"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Bottom Button */}
`;

code = code.replace(/\{\/\* Bottom Button \*\/\}/, overlayJSX);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx for polling overlay");
