const fs = require('fs');
let code = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

const newRenderEventBanners = `const renderEventBanners = () => {
    if (eventsLoading) return <div className="text-center text-neutral-500 py-10">Loading events...</div>;
    
    let filtered = promoEvents;
    if (activeSideTab !== "All") {
      filtered = promoEvents.filter(ev => ev.category === activeSideTab || ev.category === "All");
    }

    if (filtered.length === 0) {
      return <div className="text-center text-neutral-500 py-10">No events found for {activeSideTab}</div>;
    }

    return (
      <>
        {filtered.map((ev, i) => (
          <Banner 
            key={i} 
            title={ev.title} 
            desc={ev.desc} 
            highlight={ev.highlight} 
            icon={ev.icon} 
            sub={ev.sub} 
            badge={ev.badge} 
          />
        ))}
      </>
    );
  };`;

// Use string splitting to safely extract and replace the function
const startToken = "const renderEventBanners = () => {";
const endToken = "return <div className=\"flex items-center justify-center h-40 text-neutral-500 text-[13px]\">No events available for this category yet.</div>;\n      }\n  };";

const startIndex = code.indexOf(startToken);
const endIndex = code.indexOf(endToken) + endToken.length;

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + newRenderEventBanners + code.substring(endIndex);
    fs.writeFileSync('src/app/promo/page.tsx', code);
    console.log("Successfully replaced renderEventBanners!");
} else {
    console.log("Failed to find tokens!", startIndex, endIndex);
}
