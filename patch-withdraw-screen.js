const fs = require('fs');
const path = 'src/components/WithdrawScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `        if (res.ok) {
          toast.success("Withdrawal request submitted!");
          setAmount("");
          setAccountNo("");
          if (refreshUser) refreshUser(); // Refresh balance
          router.push("/profile");
        } else {`;

const replaceStr = `        if (res.ok) {
          toast.success("Withdrawal request submitted!");
          setAmount("");
          setAccountNo("");
          if (refreshUser) refreshUser(); // Refresh balance
          router.push("/withdrawal-history");
        } else {`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched WithdrawScreen router push');
} else {
  console.log('Not found in WithdrawScreen!');
}
