const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

code = code.replace(
  /if \(item\.name === "Invite"\) window\.location\.href = "\/invite";/,
  `if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); return; }\n    if (item.name === "Invite") window.location.href = "/invite";`
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
