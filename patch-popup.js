const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// Replace iframe logic with popup window logic
code = code.replace(/const \[iframeUrl, setIframeUrl\] = useState<string \| null>\(null\);\s*/, 'const [popupWindow, setPopupWindow] = useState<Window | null>(null);\n');

// When response is successful, open popup
code = code.replace(/if \(resData\.reference\) \{\s*setPollingRef\(resData\.reference\);\s*setIframeUrl\(resData\.payment_url \|\| null\);\s*toast\.success\("Deposit initiated!"\);\s*\}/, `if (resData.reference) {
          setPollingRef(resData.reference);
          if (resData.payment_url) {
            const popup = window.open(resData.payment_url, 'XpressPay', 'width=500,height=700,left=200,top=100');
            setPopupWindow(popup);
          }
          toast.success("Deposit initiated! Please check the popup window.");
        }`);

// Clear state on success or error
code = code.replace(/setPollingRef\(null\);\s*setIframeUrl\(null\);\s*setAmount\(""\);/g, 'setPollingRef(null);\n          if (popupWindow) popupWindow.close();\n          setPopupWindow(null);\n          setAmount("");');
code = code.replace(/toast\.error\("Deposit failed or was rejected\."\);\s*setPollingRef\(null\);\s*setIframeUrl\(null\);/g, 'toast.error("Deposit failed or was rejected.");\n          if (popupWindow) popupWindow.close();\n          setPopupWindow(null);\n          setPollingRef(null);');

// Change the Cancel button to also clear popup
code = code.replace(/onClick=\{\(\) => \{ setPollingRef\(null\); setIframeUrl\(null\); setLoading\(false\); \}\}/g, 'onClick={() => { setPollingRef(null); if (popupWindow) popupWindow.close(); setPopupWindow(null); setLoading(false); }}');

// Update the overlay to just show the spinner and tell them to check the popup
const newOverlay = `
      {pollingRef && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md">
            <div className="w-16 h-16 border-4 border-[#ffdf00] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-[#ffdf00] text-2xl font-black mb-3">Waiting for Payment</h2>
            <p className="text-neutral-300 text-[15px] mb-8 max-w-[280px]">
              A payment window has opened. Please complete the payment there and check your mobile phone for the MPIN prompt. Do not close this screen.
            </p>
            <button 
              onClick={() => { setPollingRef(null); if (popupWindow) popupWindow.close(); setPopupWindow(null); setLoading(false); }}
              className="text-neutral-400 text-sm hover:text-white underline mt-6"
            >
              Cancel
            </button>
        </div>
      )}
`;

// Replace the iframe overlay
code = code.replace(/\{pollingRef && \([\s\S]*?Cancel\s*<\/button>\s*<\/div>\s*\)\}/, newOverlay);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx to use window.open popup");
