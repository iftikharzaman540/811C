const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Replace deposit click
code = code.replace(
  /onClick=\{\(\) => window\.location\.href = '\/deposit'\}/g,
  `onClick={() => { if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); } else { window.location.href = '/deposit'; } }}`
);

// Replace withdraw click
code = code.replace(
  /onClick=\{\(\) => window\.location\.href = '\/withdraw'\}/g,
  `onClick={() => { if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); } else { window.location.href = '/withdraw'; } }}`
);

// Replace Fund in sidebar
code = code.replace(
  /onClick=\{\(\) => \{ setIsMenuOpen\(false\); router\.push\("\/deposit"\); \}\}/g,
  `onClick={() => { setIsMenuOpen(false); if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); } else { router.push("/deposit"); } }}`
);

// Replace Withdraw in sidebar
code = code.replace(
  /onClick=\{\(\) => \{ setIsMenuOpen\(false\); router\.push\("\/withdraw"\); \}\}/g,
  `onClick={() => { setIsMenuOpen(false); if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); } else { router.push("/withdraw"); } }}`
);

// Replace Vault in sidebar (just an alert for now, but needs login)
code = code.replace(
  /onClick=\{\(\) => \{ setIsMenuOpen\(false\); toast\.success\("Vault coming soon!"\); \}\}/g,
  `onClick={() => { setIsMenuOpen(false); if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); } else { toast.success("Vault coming soon!"); } }}`
);

// Replace VIP in sidebar
code = code.replace(
  /onClick=\{\(\) => \{ setIsMenuOpen\(false\); toast\.success\("VIP coming soon!"\); \}\}/g,
  `onClick={() => { setIsMenuOpen(false); if (!user) { toast.error("Please login first"); if (onLoginClick) onLoginClick(); } else { toast.success("VIP coming soon!"); } }}`
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
