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

sectionsToWrap.forEach(({ id, category, comment }) => {
  // Use regex to match the comment followed by optional whitespace and the div
  const regex = new RegExp('\\\\{\\\\/\\\\* ' + comment.replace(/\\(/g, '\\\\(').replace(/\\)/g, '\\\\)') + ' \\\\*\\\\/\\\\}\\\\r?\\\\n\\\\s*<div className="mb-8 px-4">');
  const replacement = '{/* ' + comment + ' */}\\n          <div id="' + id + '" className="mb-8 px-4" style={{ display: (activeCategory === "All" || activeCategory === "' + category + '") ? "block" : "none" }}>';
  code = code.replace(regex, replacement);
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Applied Tab Filtering Logic Successfully with Regex!");
