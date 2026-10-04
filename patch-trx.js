const fs = require("fs");
let content = fs.readFileSync("src/components/DepositScreen.tsx", "utf8");

// Remove validation
content = content.replace(
  /if \(trxId\.length < 5\) \{\s*toast\.error\("Please enter a valid Payment Code \/ Trx ID"\);\s*return;\s*\}/,
  ""
);

// Replace payload to use a generated ID
content = content.replace(
  /transactionId: trxId/g,
  `transactionId: "TX-" + Date.now()`
);

// Remove the UI block completely
// It looks like:
// <h2 className="text-sm font-bold mb-3 text-[#ffdf00]">Payment Code (Trx ID)</h2>
// <div className="flex bg-[#1a1a1a] border border-neutral-700 rounded-md items-center px-3 h-[46px] focus-within:border-[#ffdf00]">
//   <input ... />
// </div>
content = content.replace(
  /<h2 className="text-sm font-bold mb-3 text-\[\#ffdf00\]">Payment Code \(Trx ID\)<\/h2>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `</div>` // Re-add the closing div of the parent
);

fs.writeFileSync("src/components/DepositScreen.tsx", content);
console.log("Removed Trx ID field from DepositScreen");
