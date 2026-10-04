const fs = require('fs');

let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Inject Touch State and Handlers
const touchLogic = `
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = (category: string, maxPage: number) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setPages((p: any) => ({ ...p, [category]: Math.min(p[category] + 1, maxPage) }));
    }
    if (isRightSwipe) {
      setPages((p: any) => ({ ...p, [category]: Math.max(p[category] - 1, 0) }));
    }
  };

  const getMaxPage = (offset: number, pageSize: number) => {
    return Math.max(0, Math.ceil((realGames.length - offset) / pageSize) - 1);
  };
`;

code = code.replace(
  'const [pages, setPages] = useState<any>({ hot: 0, mini: 0, slot: 0, fishing: 0, cards: 0, live: 0, sports: 0 });',
  'const [pages, setPages] = useState<any>({ hot: 0, mini: 0, slot: 0, fishing: 0, cards: 0, live: 0, sports: 0 });\n' + touchLogic
);

// 2. Fix each section
const sections = [
  { id: 'hot', offset: 0, size: 21, origSlice: '0 + pages.hot * 21, 0 + (pages.hot + 1) * 21', oldNav: /setPages\(\(p: any\) => \(\{ \.\.\.p, hot: p\.hot \+ 1 \}\)\)/, newNav: 'setPages((p: any) => ({ ...p, hot: Math.min(p.hot + 1, getMaxPage(0, 21)) }))' },
  { id: 'mini', offset: 21, size: 12, origSlice: '21, 33', oldNav: /toast\("Next page"\)/, newNav: 'setPages((p: any) => ({ ...p, mini: Math.min(p.mini + 1, getMaxPage(21, 12)) }))', oldPrev: /toast\("Previous page"\)/, newPrev: 'setPages((p: any) => ({ ...p, mini: Math.max(0, p.mini - 1) }))', newSlice: '21 + pages.mini * 12, 21 + (pages.mini + 1) * 12' },
  { id: 'slot', offset: 33, size: 9, origSlice: '33 + pages.slot * 9, 33 + (pages.slot + 1) * 9', oldNav: /setPages\(\(p: any\) => \(\{ \.\.\.p, slot: p\.slot \+ 1 \}\)\)/, newNav: 'setPages((p: any) => ({ ...p, slot: Math.min(p.slot + 1, getMaxPage(33, 9)) }))' },
  { id: 'fishing', offset: 42, size: 6, origSlice: '42 + pages.fishing * 6, 42 + (pages.fishing + 1) * 6', oldNav: /setPages\(\(p: any\) => \(\{ \.\.\.p, fishing: p\.fishing \+ 1 \}\)\)/, newNav: 'setPages((p: any) => ({ ...p, fishing: Math.min(p.fishing + 1, getMaxPage(42, 6)) }))' },
  { id: 'cards', offset: 48, size: 6, origSlice: '48 + pages.cards * 6, 48 + (pages.cards + 1) * 6', oldNav: /setPages\(\(p: any\) => \(\{ \.\.\.p, cards: p\.cards \+ 1 \}\)\)/, newNav: 'setPages((p: any) => ({ ...p, cards: Math.min(p.cards + 1, getMaxPage(48, 6)) }))' },
  { id: 'live', offset: 54, size: 6, origSlice: '54 + pages.live * 6, 54 + (pages.live + 1) * 6', oldNav: /setPages\(\(p: any\) => \(\{ \.\.\.p, live: p\.live \+ 1 \}\)\)/, newNav: 'setPages((p: any) => ({ ...p, live: Math.min(p.live + 1, getMaxPage(54, 6)) }))' },
  { id: 'sports', offset: 60, size: 6, origSlice: '60 + pages.sports * 6, 60 + (pages.sports + 1) * 6', oldNav: /setPages\(\(p: any\) => \(\{ \.\.\.p, sports: p\.sports \+ 1 \}\)\)/, newNav: 'setPages((p: any) => ({ ...p, sports: Math.min(p.sports + 1, getMaxPage(60, 6)) }))' },
];

sections.forEach(sec => {
  // Update "Next" button logic
  code = code.replace(sec.oldNav, sec.newNav);
  
  // Update "Prev" button if needed (only for mini)
  if (sec.oldPrev) {
    code = code.replace(sec.oldPrev, sec.newPrev);
  }

  // Update slice if needed (only for mini)
  if (sec.newSlice) {
    code = code.replace(`realGames.slice(${sec.origSlice})`, `realGames.slice(${sec.newSlice})`);
  }

  const sliceStr = sec.newSlice || sec.origSlice;
  
  // Let's use string concatenation instead of backticks just to be safe
  const gridSearchStr = 'className="grid grid-cols-3 gap-2.5"\\n            {realGames.slice(' + sliceStr + ')';
  const gridReplaceStr = 'className="grid grid-cols-3 gap-2.5"\\n            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd("' + sec.id + '", getMaxPage(' + sec.offset + ', ' + sec.size + '))}\\n            {realGames.slice(' + sliceStr + ')';
  
  // Actually, replacing with \n is tricky in plain string replace unless we know exact whitespace.
  // We can just regex replace the grid container.
  const regex = new RegExp('className="grid grid-cols-3 gap-2.5"\\\\s*\\\\{realGames\\\\.slice\\\\(' + sliceStr.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&') + '\\\\)');
  
  code = code.replace(regex, 'className="grid grid-cols-3 gap-2.5" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd("' + sec.id + '", getMaxPage(' + sec.offset + ', ' + sec.size + '))} {realGames.slice(' + sliceStr + ')');
});

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Done");
