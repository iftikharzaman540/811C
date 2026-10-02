const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Find the block
let blockStart = content.indexOf('<label className="flex items-start gap-2 mt-1 cursor-pointer">');
if (blockStart === -1) {
  console.log("Block not found");
  process.exit(1);
}

// Just replace the label with a div
content = content.replace('<label className="flex items-start gap-2 mt-1 cursor-pointer">', '<div className="flex items-start gap-2 mt-1">');

// Find the corresponding closing label before "{/* Register Button */}"
content = content.replace(/<\/label>\s*\{\/\* Register Button \*\/\}/, '</div>\n\n                {/* Register Button */}');

// Make the text clickable to toggle the checkbox, except the button
let oldSpan = '<span className="text-[10px] text-white/70 leading-tight">';
let newSpan = '<span className="text-[10px] text-white/70 leading-tight"><span className="cursor-pointer" onClick={() => setAgreed(!agreed)}>I am over 18 years old and have read and agreed to </span>';
content = content.replace('I am over 18 years old and have read and agreed to ', '');
content = content.replace(oldSpan, newSpan);

// Also make the checkbox div clickable since it's no longer a label
content = content.replace('<div className="relative flex items-center justify-center mt-0.5 shrink-0">', '<div className="relative flex items-center justify-center mt-0.5 shrink-0 cursor-pointer" onClick={() => setAgreed(!agreed)}>');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log("Fixed!");
