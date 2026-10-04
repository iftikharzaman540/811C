const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const scrollLockEffect = `
  useEffect(() => {
    if (gameUrl || showNotifModal) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ modalOpen: true }, '');
    } else {
      document.body.style.overflow = '';
    }

    const handlePopState = (e: any) => {
      if (gameUrl) {
        setGameUrl(null);
      } else if (showNotifModal) {
        setShowNotifModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameUrl, showNotifModal]);
`;

code = code.replace(scrollLockEffect, "");

code = code.replace(
  "const [showNotifModal, setShowNotifModal] = useState(false);",
  "const [showNotifModal, setShowNotifModal] = useState(false);\n" + scrollLockEffect
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Moved useEffect below showNotifModal declaration!");
