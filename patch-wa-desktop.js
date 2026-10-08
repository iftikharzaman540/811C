const fs = require('fs');
const path = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = '<div className="fixed bottom-[110px] right-4 z-50 flex flex-col items-center animate-[bounce_3s_infinite]">';
const replacementStr = '<div className="fixed bottom-[110px] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 pointer-events-none">\n          <div className="absolute right-4 flex flex-col items-center animate-[bounce_3s_infinite] pointer-events-auto">';

if(content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  
  // Close the extra div
  const endTarget = `        </div>
      )}

      <BottomNav />`;
  const endReplacement = `          </div>
        </div>
      )}

      <BottomNav />`;
  content = content.replace(endTarget, endReplacement);
  
  fs.writeFileSync(path, content);
  console.log("Patched fixed positioning for desktop view!");
} else {
  console.log("Could not find the target string.");
}
