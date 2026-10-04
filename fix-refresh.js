const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

code = code.replace(
  /const \{ user, loading: userLoading \} = useUser\(\);/,
  "const { user, loading: userLoading, refreshUser } = useUser();"
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Fixed refreshUser error");
