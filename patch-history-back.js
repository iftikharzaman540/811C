const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const newScrollLockEffect = `
  useEffect(() => {
    if (gameUrl) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ gameOpen: true }, '');
    } else {
      document.body.style.overflow = '';
    }

    const handlePopState = (e: any) => {
      if (gameUrl) {
        setGameUrl(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameUrl]);
`;

code = code.replace(
  /useEffect\(\(\) => \{\s*if \(gameUrl\) \{\s*document\.body\.style\.overflow = 'hidden';\s*\} else \{\s*document\.body\.style\.overflow = '';\s*\}\s*return \(\) => \{\s*document\.body\.style\.overflow = '';\s*\};\s*\}, \[gameUrl\]\);/s,
  newScrollLockEffect
);

// Update Close Game button
code = code.replace(
  /onClick=\{\(\) => setGameUrl\(null\)\}/,
  `onClick={() => {
                  if (window.history.state && window.history.state.gameOpen) {
                    window.history.back();
                  } else {
                    setGameUrl(null);
                  }
                }}`
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Patched gameUrl back button handling!");
