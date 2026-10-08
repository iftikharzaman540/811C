const fs = require('fs');
let splashCode = fs.readFileSync('src/components/SplashScreen.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Wait a bit before completing
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);`;

const newEffect = `  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let newProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 100);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);`;

if (splashCode.includes('return prev + 2;')) {
  // Regex replace the useEffect block
  splashCode = splashCode.replace(/useEffect\(\(\) => \{\s*\/\/\s*Simulate loading progress[\s\S]*?\}, \[onComplete\]\);/m, newEffect);
  fs.writeFileSync('src/components/SplashScreen.tsx', splashCode);
  console.log("Patched SplashScreen.tsx");
} else {
  console.log("Could not find the target code in SplashScreen.tsx");
}
