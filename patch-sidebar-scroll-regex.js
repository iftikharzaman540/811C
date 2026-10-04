const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const regex = /\{\[\s*\{\s*name:\s*"Hot",\s*icon:\s*"🔥"\s*\},\s*\{\s*name:\s*"Mini Games",\s*icon:\s*"🎲"\s*\},\s*\{\s*name:\s*"Slot",\s*icon:\s*"🎰"\s*\},\s*\{\s*name:\s*"Fishing",\s*icon:\s*"🦈"\s*\},\s*\{\s*name:\s*"Cards",\s*icon:\s*"🃏"\s*\},\s*\{\s*name:\s*"Live",\s*icon:\s*"👩‍💼"\s*\},\s*\{\s*name:\s*"Sports",\s*icon:\s*"⚽"\s*\},\s*\{\s*name:\s*"Recent",\s*icon:\s*"🕒"\s*\}\s*,?\s*\]\.map\(\(cat\)\s*=>\s*\(\s*<button key=\{cat\.name\} onClick=\{\(\)\s*=>\s*\{\s*setIsMenuOpen\(false\);\s*toast\.success\(`Viewing \$\{cat\.name\} games`\);\s*\}\}/;

const newMap = `{[
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
                    }}`;

code = code.replace(regex, newMap);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Replaced sidebar categories with regex");
