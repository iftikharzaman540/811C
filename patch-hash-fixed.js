const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Insert the Hash and Scroll Lock Effect
const hashEffect = `
  useEffect(() => {
    if (gameUrl) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = \`-\${window.scrollY}px\`; // Prevent jumping

      if (window.location.hash !== '#game') {
        window.history.pushState(null, '', '#game');
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
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
  }, [gameUrl]);
`;

code = code.replace(
  "const router = useRouter();",
  "const router = useRouter();\n" + hashEffect
);

// 2. Remove overflow-y-auto from the iframe wrapper to prevent double scrolling
const oldIframeWrapper = `<div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>`;
const newIframeWrapper = `<div className="flex-1 w-full relative bg-black" style={{ overscrollBehavior: 'none', touchAction: 'none' }}>`;

code = code.replace(oldIframeWrapper, newIframeWrapper);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Applied fixed scroll lock and hash navigation!");
