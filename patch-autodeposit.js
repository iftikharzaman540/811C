const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

const newLogic = `
    try {
      const providerStr = method.split('_')[0].toUpperCase();
      let res;
      
      if (tab === "online") {
        const payload = { amount: Number(amount), provider: providerStr, accountNo };
        res = await fetch(API_URL + '/payments/auto-deposit', {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(payload),
        });
      } else {
        const payload = { amount: Number(amount), provider: providerStr, accountNo, transactionId: trxId, autoApprove: false };
        res = await fetch(API_URL + '/payments/deposit', {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(payload),
        });
      }
`;

// Replace everything between "const API_URL = ...;" and "const resData = await res.json();"
code = code.replace(/const payload = \{  amount: Number\(amount\), provider: method\.split\('_'\)\[0\]\.toUpperCase\(\), accountNo, autoApprove: true  \};\s*const res = await fetch\(API_URL \+ '\/payments\/deposit', \{\s*method: "POST",\s*headers: \{ "Content-Type": "application\/json", "Authorization": "Bearer " \+ token \},\s*body: JSON\.stringify\(payload\),\s*\}\);/, `
      const providerStr = method.split('_')[0].toUpperCase();
      let res;
      
      if (tab === "online") {
        const payload = { amount: Number(amount), provider: providerStr, accountNo };
        res = await fetch(API_URL + '/payments/auto-deposit', {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(payload),
        });
      } else {
        const payload = { amount: Number(amount), provider: providerStr, accountNo, transactionId: trxId, autoApprove: false };
        res = await fetch(API_URL + '/payments/deposit', {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(payload),
        });
      }
`);

// Also change the success message for auto deposit
code = code.replace(/toast\.success\("Deposit Successful! Balance updated instantly\."\);/, `toast.success("Deposit initiated! Please check your phone for the PIN prompt.");`);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx for auto-deposit");
