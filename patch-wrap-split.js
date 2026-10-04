const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const sectionsToWrap = [
  { id: 'section-mini', category: 'Mini Games', comment: '{/* Mini Games Section (Pixel Perfect) */}\\n          <div className="mb-8 px-4">' },
  { id: 'section-slot', category: 'Slot', comment: '{/* Slot Section (Pixel Perfect) */}\\n          <div className="mb-8 px-4">' },
  { id: 'section-fishing', category: 'Fishing', comment: '{/* Fishing Section (Pixel Perfect) */}\\n          <div className="mb-8 px-4">' },
  { id: 'section-cards', category: 'Cards', comment: '{/* Cards Section (Pixel Perfect) */}\\n          <div className="mb-8 px-4">' },
  { id: 'section-live', category: 'Live', comment: '{/* Live Section (Pixel Perfect) */}\\n          <div className="mb-8 px-4">' },
  { id: 'section-sports', category: 'Sports', comment: '{/* Sports Section (Pixel Perfect) */}\\n          <div className="mb-8 px-4">' },
  { id: 'section-hot', category: 'Hot', comment: '{/* Single Main Grid Section (Hot) */}\\n          <div className="mb-8 px-4">' },
  
  // also add CRLF versions
  { id: 'section-mini', category: 'Mini Games', comment: '{/* Mini Games Section (Pixel Perfect) */}\\r\\n          <div className="mb-8 px-4">' },
  { id: 'section-slot', category: 'Slot', comment: '{/* Slot Section (Pixel Perfect) */}\\r\\n          <div className="mb-8 px-4">' },
  { id: 'section-fishing', category: 'Fishing', comment: '{/* Fishing Section (Pixel Perfect) */}\\r\\n          <div className="mb-8 px-4">' },
  { id: 'section-cards', category: 'Cards', comment: '{/* Cards Section (Pixel Perfect) */}\\r\\n          <div className="mb-8 px-4">' },
  { id: 'section-live', category: 'Live', comment: '{/* Live Section (Pixel Perfect) */}\\r\\n          <div className="mb-8 px-4">' },
  { id: 'section-sports', category: 'Sports', comment: '{/* Sports Section (Pixel Perfect) */}\\r\\n          <div className="mb-8 px-4">' },
  { id: 'section-hot', category: 'Hot', comment: '{/* Single Main Grid Section (Hot) */}\\r\\n          <div className="mb-8 px-4">' },
];

sectionsToWrap.forEach(({ id, category, comment }) => {
  const parts = code.split(comment);
  if (parts.length > 1) {
    // Only replace the FIRST occurrence in case there's somehow duplicates
    const replacement = comment.split('<div className="mb-8 px-4">')[0] + '<div id="' + id + '" className="mb-8 px-4" style={{ display: (activeCategory === "All" || activeCategory === "' + category + '") ? "block" : "none" }}>';
    code = parts[0] + replacement + parts.slice(1).join(comment);
  }
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Applied Tab Filtering Logic Successfully with Split!");
