const fs = require('fs');
const path = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "<BottomNav />";
const waButton = `
      {/* Floating WhatsApp Button */}
      {showWhatsApp && (
        <div className="fixed bottom-[110px] right-4 z-50 flex flex-col items-center animate-[bounce_3s_infinite]">
          <button 
            onClick={() => setShowWhatsApp(false)}
            className="absolute -top-3 -left-3 bg-black border-[1.5px] border-white rounded-full p-0.5 text-white hover:text-red-500 hover:border-red-500 z-10 shadow-lg"
          >
            <X className="w-3 h-3" strokeWidth={3} />
          </button>
          
          <a 
            href="https://whatsapp.com/channel/0029ValN0e0CxoAx5w2Y0O0q"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-[#25D366] text-white p-2.5 rounded-2xl shadow-[0_0_15px_rgba(37,211,102,0.6)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.7c-32.5 0-64.4-8.8-92.4-25.3l-6.6-3.9-68.7 18 18.3-67-4.3-6.9c-18.1-28.8-27.7-62.3-27.7-96.6 0-101.4 82.5-183.9 184-183.9 54.2 0 105.1 21.1 143.4 59.4 38.3 38.3 59.4 89.2 59.4 143.4-.1 101.4-82.6 183.8-184.1 183.8zM324.9 276c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6 2.1-3.6 7.6-14.6 2.7-5.5 1.4-10.4-.2-13.2-1.6-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            
            <div className="absolute -top-2 -right-2 bg-[#89f5a8] border-2 border-black rounded-full flex flex-col items-center shadow-md pb-[1px]">
              <ChevronUp className="w-4 h-4 text-black -mb-2" strokeWidth={3} />
              <ChevronUp className="w-4 h-4 text-black" strokeWidth={3} />
            </div>
          </a>
          
          <div className="mt-1.5 text-center px-1 font-medium text-[#25D366] text-[9px] max-w-[70px] leading-[1.1] filter drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
            Click to follow WhatsApp channel
          </div>
        </div>
      )}

      <BottomNav />`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, waButton);
  fs.writeFileSync(path, content);
  console.log("Injected WhatsApp button");
} else {
  console.log("Could not find BottomNav string");
}
