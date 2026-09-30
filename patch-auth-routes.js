const fs = require('fs');

// Patch Deposit
let depCode = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');
depCode = depCode.replace(
  `  const { user } = useUser();`,
  `  const { user, loading } = useUser();
  useEffect(() => { if (!loading && !user) { toast.error("Please login first"); router.push("/"); } }, [user, loading, router]);`
);
if (!depCode.includes('useEffect')) {
  depCode = depCode.replace(`import { useState } from "react";`, `import { useState, useEffect } from "react";`);
}
fs.writeFileSync('src/components/DepositScreen.tsx', depCode);

// Patch Withdraw
let wdCode = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');
wdCode = wdCode.replace(
  `  const { user, refreshUser } = useUser();`,
  `  const { user, loading, refreshUser } = useUser();
  useEffect(() => { if (!loading && !user) { toast.error("Please login first"); router.push("/"); } }, [user, loading, router]);`
);
fs.writeFileSync('src/components/WithdrawScreen.tsx', wdCode);
