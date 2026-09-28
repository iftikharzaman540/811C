const fs = require('fs');
let code = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

// Add states
code = code.replace(
  'const [vip1Expanded, setVip1Expanded] = useState(true);',
  `const [vip1Expanded, setVip1Expanded] = useState(true);
  const [luckyPoints, setLuckyPoints] = useState(150000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;
    
    let cost = 10000;
    if (activeSpinWheel === "Gold") cost = 50000;
    if (activeSpinWheel === "Diamond") cost = 150000;
    
    const totalCost = cost * activeSpinTimes;
    
    if (luckyPoints < totalCost) {
      toast.error("Insufficient lucky points to spin");
      return;
    }

    setLuckyPoints(prev => prev - totalCost);
    setIsSpinning(true);
    
    const extraSpins = 5 * 360; // 5 full rotations
    const randomSegment = Math.floor(Math.random() * 10);
    const stopAngle = extraSpins + (randomSegment * 36) + 18; // point to middle of segment
    
    setSpinRotation(prev => prev + stopAngle);
    
    setTimeout(() => {
      setIsSpinning(false);
      const prizes = [7.00, 10.00, 15.00, 27.00, 77.00, 130.00, 200.00, 250.00, 300.00, 377.00];
      // Due to rotation backwards vs prize array
      const wonAmount = prizes[(10 - randomSegment % 10) % 10] * activeSpinTimes;
      toast.success(\`Congratulations! You won Rs \${wonAmount.toFixed(2)}\`, { duration: 4000 });
    }, 3000);
  };`
);

// Fix points display
code = code.replace(
  '<span className="text-white font-bold text-[16px]">0</span>',
  '<span className="text-white font-bold text-[16px]">{luckyPoints.toLocaleString()}</span>'
);

// Apply rotation to wheel wrapper
code = code.replace(
  '<div className="w-full h-full rounded-full border-[10px] border-neutral-300/20 bg-gradient-to-br from-[#cc0000] to-[#4a0000] relative overflow-hidden flex items-center justify-center shadow-2xl">',
  '<div className="w-full h-full rounded-full border-[10px] border-neutral-300/20 bg-gradient-to-br from-[#cc0000] to-[#4a0000] relative overflow-hidden flex items-center justify-center shadow-2xl" style={{ transform: `rotate(\${spinRotation}deg)`, transition: isSpinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>'
);

// Fix center button onClick and text rotation (since parent rotates, we must counter-rotate it or let it rotate)
// Actually, it's easier to rotate the inner gradient and texts, NOT the whole wheel base (which contains the Draw button).
// Wait, the Draw button is INSIDE the wheel base.
// If I rotate the wheel base, the Draw button rotates!
// Let me change the replacement to only rotate a new wrapper for segments/texts.
// But first, undo that change... let me replace exactly.

code = code.replace(
  '<div className="w-full h-full rounded-full border-[10px] border-neutral-300/20 bg-gradient-to-br from-[#cc0000] to-[#4a0000] relative overflow-hidden flex items-center justify-center shadow-2xl" style={{ transform: `rotate(\${spinRotation}deg)`, transition: isSpinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>',
  '<div className="w-full h-full rounded-full border-[10px] border-neutral-300/20 bg-gradient-to-br from-[#cc0000] to-[#4a0000] relative overflow-hidden flex items-center justify-center shadow-2xl">'
);

// Just wrap the segments and text inside a rotatable div
code = code.replace(
  '<div className="absolute inset-0 rounded-full" style={{ background: \'conic-gradient(#cc0000 0deg 36deg, #ff0b0b 36deg 72deg, #cc0000 72deg 108deg, #ff0b0b 108deg 144deg, #cc0000 144deg 180deg, #ff0b0b 180deg 216deg, #cc0000 216deg 252deg, #ff0b0b 252deg 288deg, #cc0000 288deg 324deg, #ff0b0b 324deg 360deg)\' }}></div>\n                  \n                  {/* Inner text (Simulated) */}\n                  <div className="absolute inset-0 flex items-center justify-center rotate-[-18deg]">',
  '<div className="absolute inset-0 w-full h-full" style={{ transform: `rotate(-${spinRotation}deg)`, transition: isSpinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>\n                    <div className="absolute inset-0 rounded-full" style={{ background: \'conic-gradient(#cc0000 0deg 36deg, #ff0b0b 36deg 72deg, #cc0000 72deg 108deg, #ff0b0b 108deg 144deg, #cc0000 144deg 180deg, #ff0b0b 180deg 216deg, #cc0000 216deg 252deg, #ff0b0b 252deg 288deg, #cc0000 288deg 324deg, #ff0b0b 324deg 360deg)\' }}></div>\n                  \n                  {/* Inner text (Simulated) */}\n                  <div className="absolute inset-0 flex items-center justify-center rotate-[-18deg]">'
);

// We need to close that rotatable div before the Center Draw Button
code = code.replace(
  '{/* Center Draw Button */}',
  '</div>\n                  {/* Center Draw Button */}'
);

// Fix Center Draw Button click and disabled visual state
code = code.replace(
  /<div onClick=\{\(\) => toast\.error\("Insufficient lucky points to spin"\)\} className="w-20 h-20 bg-gradient-to-br from-\[#2e0505\] to-\[#111\] rounded-full z-10 flex flex-col items-center justify-center border-4 border-\[#ffdf00\] shadow-\[0_0_20px_rgba\(255,223,0,0\.5\)\] cursor-pointer hover:scale-105 transition-transform">/,
  `<div onClick={handleSpin} className={\`w-20 h-20 bg-gradient-to-br from-[#2e0505] to-[#111] rounded-full z-10 flex flex-col items-center justify-center border-4 border-[#ffdf00] shadow-[0_0_20px_rgba(255,223,0,0.5)] transition-transform \${isSpinning ? 'opacity-70 scale-95' : 'cursor-pointer hover:scale-105'}\`}>`
);

fs.writeFileSync('src/app/promo/page.tsx', code);
