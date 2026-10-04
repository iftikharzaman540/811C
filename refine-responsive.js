const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Category Navigation Slider - reduce horizontal padding
code = code.replace(
  'className="flex justify-between items-center overflow-x-auto [&::-webkit-scrollbar]:hidden px-8 gap-3"',
  'className="flex justify-between items-center overflow-x-auto [&::-webkit-scrollbar]:hidden px-4 gap-3"'
);

// Grand Prize Record padding
code = code.replace(
  'className="mb-4 px-4 pb-4"',
  'className="mb-2 px-4 pb-4"'
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
