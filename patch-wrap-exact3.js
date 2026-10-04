const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const sectionsToWrap = [
  { id: 'section-mini', category: 'Mini Games', comment: 'Mini Games Section (Pixel Perfect)' },
  { id: 'section-slot', category: 'Slot', comment: 'Slot Section (Pixel Perfect)' },
  { id: 'section-fishing', category: 'Fishing', comment: 'Fishing Section (Pixel Perfect)' },
  { id: 'section-cards', category: 'Cards', comment: 'Cards Section (Pixel Perfect)' },
  { id: 'section-live', category: 'Live', comment: 'Live Section (Pixel Perfect)' },
  { id: 'section-sports', category: 'Sports', comment: 'Sports Section (Pixel Perfect)' },
  { id: 'section-hot', category: 'Hot', comment: 'Single Main Grid Section (Hot)' }
];

let replacedCount = 0;

sectionsToWrap.forEach(({ id, category, comment }) => {
  const findLF = '{/* ' + comment + ' */}\n        <div className="mb-8 px-4">';
  const findCRLF = '{/* ' + comment + ' */}\r\n        <div className="mb-8 px-4">';
  
  const replaceStr = '{/* ' + comment + ' */}\n        <div id="' + id + '" className="mb-8 px-4" style={{ display: (activeCategory === "All" || activeCategory === "' + category + '") ? "block" : "none" }}>';

  if (code.includes(findCRLF)) {
    code = code.replace(findCRLF, replaceStr);
    replacedCount++;
  } else if (code.includes(findLF)) {
    code = code.replace(findLF, replaceStr);
    replacedCount++;
  } else {
    // If we have 10 spaces instead of 8:
    const findLF10 = '{/* ' + comment + ' */}\n          <div className="mb-8 px-4">';
    const findCRLF10 = '{/* ' + comment + ' */}\r\n          <div className="mb-8 px-4">';
    if (code.includes(findCRLF10)) {
      code = code.replace(findCRLF10, replaceStr);
      replacedCount++;
    } else if (code.includes(findLF10)) {
      code = code.replace(findLF10, replaceStr);
      replacedCount++;
    }
  }
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Replaced", replacedCount, "sections");
