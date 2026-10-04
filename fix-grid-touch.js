const fs = require('fs');

let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const touchReplacements = [
  { id: 'hot', offset: 0, size: 21 },
  { id: 'mini', offset: 21, size: 12 },
  { id: 'slot', offset: 33, size: 9 },
  { id: 'fishing', offset: 42, size: 6 },
  { id: 'cards', offset: 48, size: 6 },
  { id: 'live', offset: 54, size: 6 },
  { id: 'sports', offset: 60, size: 6 },
];

let currentIndex = 0;
code = code.replace(/className="grid grid-cols-3 gap-2\.5"/g, (match) => {
  if (currentIndex < touchReplacements.length) {
    const sec = touchReplacements[currentIndex];
    currentIndex++;
    return 'className="grid grid-cols-3 gap-2.5" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd("' + sec.id + '", getMaxPage(' + sec.offset + ', ' + sec.size + '))}';
  }
  return match;
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Done", currentIndex);
