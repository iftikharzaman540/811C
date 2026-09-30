const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const sections = [
  { comment: 'Mini Games Section', id: 'section-mini' },
  { comment: 'Slot Section', id: 'section-slot' },
  { comment: 'Fishing Section', id: 'section-fishing' },
  { comment: 'Cards Section', id: 'section-cards' },
  { comment: 'Live Section', id: 'section-live' },
  { comment: 'Sports Section', id: 'section-sports' }
];

sections.forEach(({ comment, id }) => {
  const regex = new RegExp(\`(\\\\{\\\\/\\\\* \${comment} \\\\(Pixel Perfect\\\\) \\\\*\\\\/\\\\}\\\\s*<div )className="mb-8 px-4"\`, 'g');
  code = code.replace(regex, \`$1id="\${id}" className="mb-8 px-4 scroll-mt-[100px]"\`);
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Added IDs to sections!");
