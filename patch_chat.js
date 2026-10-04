const fs = require('fs');
let content = fs.readFileSync('src/app/support/page.tsx', 'utf8');

if (!content.includes('LiveChatPopup')) {
    content = content.replace('import BottomNav from "@/components/BottomNav";', 'import BottomNav from "@/components/BottomNav";\nimport LiveChatPopup from "@/components/LiveChatPopup";');
}

// Add state
content = content.replace('const [selectedMessage, setSelectedMessage] = useState<any>(null);', 'const [selectedMessage, setSelectedMessage] = useState<any>(null);\n  const [showLiveChat, setShowLiveChat] = useState(false);');

// Replace first big button onClick
content = content.replace("onClick={() => window.open('https://t.me/Game8111c', '_blank')} className=\"flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]\">Customer Service", "onClick={() => setShowLiveChat(true)} className=\"flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]\">Customer Service");

// Replace the list item Customer Service Line
// It's wrapped in an <a> tag currently. I'll replace the <a> tag with a <button> tag to avoid href issues.
content = content.replace('<a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full">', '<button onClick={() => setShowLiveChat(true)} className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full text-left">');

// Replace the closing </a> for that specific block. The first </a> after 'Customer Service Line'
content = content.replace('shrink-0">Contact<br/>Now</div></a>', 'shrink-0">Contact<br/>Now</div></button>');

// Insert the popup render logic at the end of the main
content = content.replace('</main>', '  {showLiveChat && <LiveChatPopup onClose={() => setShowLiveChat(false)} />}\n    </main>');

fs.writeFileSync('src/app/support/page.tsx', content);
