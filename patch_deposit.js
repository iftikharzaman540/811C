const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// 1. Fix Crypto enum bypass so it doesn't crash backend
code = code.replace(
  /provider: tab === "online" \? method\.toUpperCase\(\) : "CRYPTO",/g,
  'provider: tab === "online" ? method.toUpperCase() : "MANUAL",'
);

// 2. Fix handling of payment_url and redirect on success
code = code.replace(
  /if \(resData\.url\) window\.location\.href = resData\.url;/g,
  'if (resData.payment_url) {\n          window.open(resData.payment_url, "_blank");\n        }\n        router.push("/profile");'
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
