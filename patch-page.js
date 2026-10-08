const fs = require('fs');
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace handleSplashComplete
const oldHandle = `  const handleSplashComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasSeenSplash", "true");
    }
    setView("home");
  };`;

const newHandle = `  const handleSplashComplete = () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("hasSeenSplash", "true");
      }
    } catch (e) {
      console.warn("sessionStorage failed", e);
    } finally {
      setView("home");
    }
  };`;

if (pageCode.includes(oldHandle)) {
  pageCode = pageCode.replace(oldHandle, newHandle);
} else {
  // Try regex if spacing differs
  pageCode = pageCode.replace(/const handleSplashComplete = \(\) => \{[\s\S]*?setView\("home"\);\s*\};/m, newHandle);
}

// Wrap it in useCallback? No, state setters are stable, but let's just make sure it's reliable.
// Wait, actually I will just write it securely.

fs.writeFileSync('src/app/page.tsx', pageCode);
console.log('Fixed handleSplashComplete');
