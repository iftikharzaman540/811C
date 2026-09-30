const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const categories = [
  { name: 'Hot', id: 'hot' },
  { name: 'Mini Game', id: 'mini' },
  { name: 'Slot', id: 'slot' },
  { name: 'Fishing', id: 'fishing' },
  { name: 'Cards', id: 'cards' },
  { name: 'Live', id: 'live' },
  { name: 'Sports', id: 'sports' }
];

for (const cat of categories) {
  let parts = code.split(` tracking-tight">${cat.name}</h2>`);
  if (parts.length > 1) {
    // Replace onClick for Pill Navigation
    parts[1] = parts[1].replace(
      'onClick={() => toast("Previous page")}',
      `onClick={() => document.getElementById('scroll-${cat.id}')?.scrollBy({ left: -(window.innerWidth - 30), behavior: 'smooth' })}`
    );
    parts[1] = parts[1].replace(
      'onClick={() => toast("Next page")}',
      `onClick={() => document.getElementById('scroll-${cat.id}')?.scrollBy({ left: (window.innerWidth - 30), behavior: 'smooth' })}`
    );
    
    // Replace grid div
    parts[1] = parts[1].replace(
      '<div className="grid grid-cols-3 gap-2.5">',
      `<div id="scroll-${cat.id}" className="flex overflow-x-auto no-scrollbar gap-2.5 snap-x snap-mandatory scroll-smooth pb-2">`
    );

    code = parts.join(` tracking-tight">${cat.name}</h2>`);
  }
}

// Add snap classes to all cards in the flex containers
code = code.replace(/className="\`aspect-\[3\/4\]/g, 'className={`w-[calc(33.333%-7px)] shrink-0 snap-start aspect-[3/4]');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log('Patched grids safely for smooth scrolling!');
