const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// The array in the sidebar is:
/*
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { name: "Hot", icon: "🔥" },
                    { name: "Mini Games", icon: "🎲" },
                    { name: "Slot", icon: "🎰" },
                    { name: "Fishing", icon: "🦈" },
                    { name: "Cards", icon: "🃏" },
                    { name: "Live", icon: "👩‍💼" },
                    { name: "Sports", icon: "⚽" },
                    { name: "Recent", icon: "🕒" },
                  ].map((cat) => (
                    <button key={cat.name} onClick={() => { setIsMenuOpen(false); toast.success(`Viewing ${cat.name} games`); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
*/

const oldMap = `                  {[
                    { name: "Hot", icon: "🔥" },
                    { name: "Mini Games", icon: "🎲" },
                    { name: "Slot", icon: "🎰" },
                    { name: "Fishing", icon: "🦈" },
                    { name: "Cards", icon: "🃏" },
                    { name: "Live", icon: "👩‍💼" },
                    { name: "Sports", icon: "⚽" },
                    { name: "Recent", icon: "🕒" },
                  ].map((cat) => (
                    <button key={cat.name} onClick={() => { setIsMenuOpen(false); toast.success(\`Viewing \${cat.name} games\`); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors">`;

const newMap = `                  {[
                    { name: "Hot", id: "section-hot", icon: "🔥" },
                    { name: "Mini Games", id: "section-mini", icon: "🎲" },
                    { name: "Slot", id: "section-slot", icon: "🎰" },
                    { name: "Fishing", id: "section-fishing", icon: "🦈" },
                    { name: "Cards", id: "section-cards", icon: "🃏" },
                    { name: "Live", id: "section-live", icon: "👩‍💼" },
                    { name: "Sports", id: "section-sports", icon: "⚽" },
                    { name: "Recent", id: "section-hot", icon: "🕒" },
                  ].map((cat) => (
                    <button key={cat.name} onClick={() => { 
                      setIsMenuOpen(false); 
                      setTimeout(() => {
                        const el = document.getElementById(cat.id);
                        if (el) {
                          setActiveCategory(cat.id);
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                          toast.success(\`Viewing \${cat.name} games\`); 
                        }
                      }, 300); // Wait for menu to close before scrolling
                    }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors">`;

if (code.includes(oldMap)) {
  code = code.replace(oldMap, newMap);
  console.log("Replaced sidebar categories");
} else {
  console.log("Could not find the sidebar categories array!");
  // Let's try matching with generic whitespace
  console.log(code.includes('{ name: "Hot", icon: "🔥" }'));
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
