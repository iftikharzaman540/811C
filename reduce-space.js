const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Reduce top space (space below banner)
code = code.replace(
  'className="px-3 mb-3 relative h-[140px] cursor-pointer"',
  'className="px-3 mb-1 relative h-[140px] cursor-pointer"'
);

// Reduce bottom space (space below category slider)
code = code.replace(
  '        {/* Category Navigation Slider (Beautiful) */}\n        <div className="relative px-0 mb-8">',
  '        {/* Category Navigation Slider (Beautiful) */}\n        <div className="relative px-0 mb-2">'
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
