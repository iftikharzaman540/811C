const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

const regex = /      if \(tab === "online"\) \{\s*toast\.success\("Deposit initiated! Please check your phone for the PIN prompt\."\);\s*\}/;

const replacement = `      if (tab === "online") {
        toast.success("Deposit initiated! Redirecting to payment gateway...");
        if (resData.payment_url) {
          window.location.href = resData.payment_url;
          return;
        }
      }`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx to redirect");
