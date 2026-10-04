const fs = require('fs');
let code = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

// Add state for events
code = code.replace(/const \[showRedeemModal, setShowRedeemModal\] = useState\(false\);/, 
`const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [promoEvents, setPromoEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    apiRequest('/promo/events').then(res => {
      setPromoEvents(res || []);
      setEventsLoading(false);
    }).catch(() => setEventsLoading(false));
  }, []);`);

// Update renderEventBanners
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

// We need to replace the entire renderEventBanners function
// The easiest way is regex since it goes up to the end of the switch block
code = code.replace(/const renderEventBanners = \(\) => \{[\s\S]*?case "Fishing":[\s\S]*?return \([\s\S]*?<\/div>;[\s\S]*?\}[\s\S]*?\};/, newRenderEventBanners);

fs.writeFileSync('src/app/promo/page.tsx', code);
console.log("Updated Promo page!");
