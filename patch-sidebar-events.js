const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = `{/* Sidebar Overlay (JJwin Style) */}`;
const endStr = `</motion.div>
        </div>
      )}`;

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);
if (startIdx !== -1 && endIdx !== -1) {
    let block = content.substring(startIdx, endIdx + endStr.length);
    
    // Replace Game Categories buttons
    block = block.replace(
      /<button key=\{cat\.name\} className="bg-\[#242424\] hover:bg-\[#2a2a2a\]/g,
      '<button key={cat.name} onClick={() => { setIsMenuOpen(false); toast.success(`Viewing ${cat.name} games`); }} className="bg-[#242424] hover:bg-[#2a2a2a]'
    );
    block = block.replace(
      /<button className="bg-\[#242424\] hover:bg-\[#2a2a2a\] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1">/g,
      '<button onClick={() => { setIsMenuOpen(false); toast.success("Viewing Favorites"); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1">'
    );

    // List Actions
    block = block.replace(
      /<button className="bg-\[#242424\] hover:bg-\[#2a2a2a\] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">\s*<FileText className="w-5 h-5 text-neutral-400 shrink-0" \/>\s*<span className="text-\[14px\]">Bet Record<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); router.push('/profile'); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">\n                  <FileText className="w-5 h-5 text-neutral-400 shrink-0" />\n                  <span className="text-[14px]">Bet Record</span>\n                </button>`
    );
    block = block.replace(
      /<button className="bg-\[#242424\] hover:bg-\[#2a2a2a\] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">\s*<Share2 className="w-5 h-5 text-neutral-400 shrink-0" \/>\s*<span className="text-\[14px\]">Share<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); router.push('/invite'); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">\n                  <Share2 className="w-5 h-5 text-neutral-400 shrink-0" />\n                  <span className="text-[14px]">Share</span>\n                </button>`
    );
    block = block.replace(
      /<button className="bg-\[#242424\] hover:bg-\[#2a2a2a\] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">\s*<Users className="w-5 h-5 text-neutral-400 shrink-0" \/>\s*<span className="text-\[14px\]">Invite<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); router.push('/invite'); }} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">\n                  <Users className="w-5 h-5 text-neutral-400 shrink-0" />\n                  <span className="text-[14px]">Invite</span>\n                </button>`
    );

    // Offer Center
    block = block.replace(/<div className="relative bg-gradient-to-br from-blue-400 to-blue-600/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-blue-400 to-blue-600');
    block = block.replace(/<div className="relative bg-gradient-to-br from-green-400 to-green-600/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-green-400 to-green-600');
    block = block.replace(/<div className="relative bg-gradient-to-br from-red-400 to-red-500/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-red-400 to-red-500');
    block = block.replace(/<div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-yellow-400 to-yellow-500');
    block = block.replace(/<div className="relative bg-gradient-to-br from-blue-400 to-blue-500/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-blue-400 to-blue-500');
    block = block.replace(/<div className="relative bg-gradient-to-br from-pink-400 to-pink-600/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/deposit"); }} className="relative bg-gradient-to-br from-pink-400 to-pink-600');
    block = block.replace(/<div className="relative bg-gradient-to-br from-purple-400 to-purple-600/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/promo"); }} className="relative bg-gradient-to-br from-purple-400 to-purple-600');
    block = block.replace(/<div className="relative bg-gradient-to-br from-orange-400 to-orange-500/g, '<div onClick={() => { setIsMenuOpen(false); router.push("/profile"); }} className="relative bg-gradient-to-br from-orange-400 to-orange-500');

    // Text Links
    block = block.replace(
      /<button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\s*<Download className="w-5 h-5 shrink-0" \/> <span className="text-\[14px\]">APP Download<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); toast.success("Downloading app..."); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\n                  <Download className="w-5 h-5 shrink-0" /> <span className="text-[14px]">APP Download</span>\n                </button>`
    );

    block = block.replace(
      /<button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\s*<Headset className="w-5 h-5 shrink-0" \/> <span className="text-\[14px\]">Customer Service<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\n                  <Headset className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Customer Service</span>\n                </button>`
    );

    block = block.replace(
      /<button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\s*<HelpCircle className="w-5 h-5 shrink-0" \/> <span className="text-\[14px\]">FAQ<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\n                  <HelpCircle className="w-5 h-5 shrink-0" /> <span className="text-[14px]">FAQ</span>\n                </button>`
    );

    block = block.replace(
      /<button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\s*<Info className="w-5 h-5 shrink-0" \/> <span className="text-\[14px\]">About 8111c.com<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); toast.success("About 8111c.com V1.0"); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\n                  <Info className="w-5 h-5 shrink-0" /> <span className="text-[14px]">About 8111c.com</span>\n                </button>`
    );

    block = block.replace(
      /<button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\s*<MapPin className="w-5 h-5 shrink-0" \/> <span className="text-\[14px\]">Find us<\/span>\s*<\/button>/g,
      `<button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\n                  <MapPin className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Find us</span>\n                </button>`
    );

    block = block.replace(
      /<button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\s*<Moon className="w-5 h-5 shrink-0" \/> <span className="text-\[14px\]">Night mode<\/span>\s*<\/button>/g,
      `<button onClick={() => toast.success("Night mode toggled!")} className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">\n                  <Moon className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Night mode</span>\n                </button>`
    );

    // Social Links
    block = block.replace(/<button className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-\[#242424\]/g, `<button onClick={() => { setIsMenuOpen(false); router.push('/support'); }} className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424]`);


    const newContent = content.substring(0, startIdx) + block + content.substring(endIdx + endStr.length);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log("EVENTS BOUND SUCCESSFULLY");
} else {
    console.log("NOT FOUND");
}
