const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// 1. Force the tab state to always be "online" but remove it from the UI
code = code.replace(
  /<div className="flex border-b border-neutral-800 mb-4 relative">[\s\S]*?<\/div>/,
  ''
);

// 2. Remove the {tab === "online" ? (...) : (...)} logic around payment method to ONLY keep online options
code = code.replace(
  /\{\s*tab === "online" \? \([\s\S]*?(<div className="flex flex-wrap gap-2">[\s\S]*?<\/div>\s*<\/div>)\s*\)\s*:\s*\([\s\S]*?Click to switch[\s\S]*?<\/div>\s*\)\s*\}/,
  '$1'
);

// 3. Remove conditional tab logic for currency label
code = code.replace(
  /\{tab === "online" \? "Rs" : "USDT"\}/g,
  '"Rs"'
);

// 4. Remove placeholder condition
code = code.replace(
  /tab === "online" \? "Min 100~Max 200,000" : "Min 1~Max 50,000"/g,
  '"Min 100~Max 200,000"'
);

// 5. Remove Crypto refresh button
code = code.replace(
  /\{\s*tab === "crypto" && \([\s\S]*?RefreshCcw[\s\S]*?<\/button>\s*\)\s*\}/,
  ''
);

// 6. Remove Crypto exchange rate
code = code.replace(
  /\{\s*tab === "crypto" && \([\s\S]*?Exchange Rate[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// 7. Simplify amounts
code = code.replace(
  /\{\(tab === "online" \? depositAmounts : cryptoAmounts\)\.map/g,
  '{depositAmounts.map'
);

// 8. Fix payload provider
code = code.replace(
  /const payload = tab === "online"\s*\?\s*\{([^}]+)\}\s*:\s*\{[^}]+\};/,
  'const payload = { $1 };'
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx successfully");
