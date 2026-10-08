const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

content = content.replace("import { useUser } from '@/context/UserContext';", "import { useUser } from '@/context/UserContext';\nimport { apiRequest } from '@/utils/api';");

content = content.replace("const [showNotifModal, setShowNotifModal] = useState(false);", "const [showNotifModal, setShowNotifModal] = useState(false);\n  const [vipStatus, setVipStatus] = useState<any>(null);");

content = content.replace(
  "setHasToken(!!localStorage.getItem(\"token\"));",
  `const token = localStorage.getItem("token");
      setHasToken(!!token);
      if (token) {
        apiRequest('/vip/status').then((res: any) => setVipStatus(res)).catch(() => {});
      }`
);

fs.writeFileSync('src/app/profile/page.tsx', content);
console.log('Patched profile page state.');
