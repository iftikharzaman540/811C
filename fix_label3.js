const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

content = content.replace('<label className="flex items-start gap-1.5 mt-1 cursor-pointer group">', '<div className="flex items-start gap-1.5 mt-1 group">');

content = content.replace('I am over 18 years old and have read and agreed to ', '<span className="cursor-pointer" onClick={() => setAgreed(!agreed)}>I am over 18 years old and have read and agreed to </span>');

content = content.replace('<div className="relative flex items-center justify-center mt-0.5 shrink-0">', '<div className="relative flex items-center justify-center mt-0.5 shrink-0 cursor-pointer" onClick={() => setAgreed(!agreed)}>');

// replace the FIRST </label> that appears after the checkbox
let idx = content.indexOf('I am over 18');
let nextLabelClose = content.indexOf('</label>', idx);
if (nextLabelClose !== -1) {
  content = content.substring(0, nextLabelClose) + '</div>' + content.substring(nextLabelClose + 8);
}

fs.writeFileSync('src/components/AuthScreen.tsx', content);
