const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Remove the old pushState logic and replace with hash logic
const oldScrollEffect = `  useEffect(() => {
    if (gameUrl) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ gameOpen: true }, '');
    } else {
      document.body.style.overflow = '';
    }

    const handlePopState = (e: any) => {
      if (gameUrl) setGameUrl(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameUrl]);`;

const newHashEffect = `  useEffect(() => {
    if (gameUrl) {
      document.body.style.overflow = 'hidden';
      if (window.location.hash !== '#game') {
        window.location.hash = 'game';
      }
    } else {
      document.body.style.overflow = '';
      if (window.location.hash === '#game') {
        window.history.back();
      }
    }

    const handleHashChange = () => {
      if (window.location.hash !== '#game' && gameUrl) {
        setGameUrl(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [gameUrl]);`;

code = code.replace(oldScrollEffect, newHashEffect);

// 2. Remove the Close Game header completely!
const closeHeaderRegex = /<div className="h-12 bg-neutral-900 flex items-center justify-between px-4 border-b border-neutral-800 shrink-0">.*?<\/div>/s;
code = code.replace(closeHeaderRegex, "");

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Updated HomeScreen with Hash logic and removed Close button!");
