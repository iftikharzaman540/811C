const fs = require('fs');
let layout = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

layout = layout.replace(
  /\{ name: "Support Tickets", href: "\/admin\/support\/tickets", icon: MessageSquare \},/g,
  `{ name: "Live Chat", href: "/admin/support/live-chat", icon: MessageSquare },\n  { name: "Support Tickets", href: "/admin/support/tickets", icon: MessageSquare },`
);

fs.writeFileSync('src/app/admin/layout.tsx', layout);
console.log('Added Live Chat to sidebar');
