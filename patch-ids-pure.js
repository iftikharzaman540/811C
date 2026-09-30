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
  const searchStrLF = '{/* ' + comment + ' (Pixel Perfect) */}\n          <div className="mb-8 px-4">';
  const searchStrCRLF = '{/* ' + comment + ' (Pixel Perfect) */}\r\n          <div className="mb-8 px-4">';
  const replaceStr = '{/* ' + comment + ' (Pixel Perfect) */}\n          <div id="' + id + '" className="mb-8 px-4 scroll-mt-[100px]">';
  
  if (code.includes(searchStrCRLF)) {
    code = code.replace(searchStrCRLF, replaceStr);
  } else if (code.includes(searchStrLF)) {
    code = code.replace(searchStrLF, replaceStr);
  }
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Added IDs to sections successfully!");
