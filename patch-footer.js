const fs = require("fs");
let content = fs.readFileSync("src/components/Footer.tsx", "utf8");

// Casino
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Invite<\/a>/g,
  '<a href="/invite" onClick={(e) => { e.preventDefault(); window.location.href="/invite"; }} className="hover:text-white transition-colors">Invite</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Mission<\/a>/g,
  '<a href="/promo" onClick={(e) => { e.preventDefault(); window.location.href="/promo"; }} className="hover:text-white transition-colors">Mission</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Rebate<\/a>/g,
  '<a href="/records" onClick={(e) => { e.preventDefault(); window.location.href="/records"; }} className="hover:text-white transition-colors">Rebate</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Unsettled<\/a>/g,
  '<a href="/records" onClick={(e) => { e.preventDefault(); window.location.href="/records"; }} className="hover:text-white transition-colors">Unsettled</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">VIP<\/a>/g,
  '<a href="/profile" onClick={(e) => { e.preventDefault(); window.location.href="/profile"; }} className="hover:text-white transition-colors">VIP</a>'
);

// Games
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Hot<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Hot</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Mini Games<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Mini Games</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Slot<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Slot</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Fishing<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Fishing</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Cards<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Cards</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Live<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Live</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Sports<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Sports</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Demo<\/a>/g,
  '<a href="/" onClick={(e) => { e.preventDefault(); window.location.href="/"; }} className="hover:text-white transition-colors">Demo</a>'
);

// Support
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Online Support<\/a>/g,
  '<a href="/support" onClick={(e) => { e.preventDefault(); window.location.href="/support"; }} className="hover:text-white transition-colors">Online Support</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Help Center<\/a>/g,
  '<a href="/support" onClick={(e) => { e.preventDefault(); window.location.href="/support"; }} className="hover:text-white transition-colors">Help Center</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors">Reward Feedback<\/a>/g,
  '<a href="/support" onClick={(e) => { e.preventDefault(); window.location.href="/support"; }} className="hover:text-white transition-colors">Reward Feedback</a>'
);
content = content.replace(
  /<a href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); toast\("Navigating\.\.\."\); \}\} className="hover:text-white transition-colors whitespace-nowrap">Legal and compliant<\/a>/g,
  '<a href="/about" onClick={(e) => { e.preventDefault(); window.location.href="/about"; }} className="hover:text-white transition-colors whitespace-nowrap">Legal and compliant</a>'
);

// Social Icons
content = content.replace(
  /onClick=\{\(\) => toast\.success\("Opening link\.\.\."\)\}/g,
  'onClick={() => { window.location.href="/support"; }}'
);

fs.writeFileSync("src/components/Footer.tsx", content);
console.log("Footer links updated");
