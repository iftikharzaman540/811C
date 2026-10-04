const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const replacement = `
  { name: "Support Tickets", href: "/admin/support/tickets", icon: MessageSquare },
  {
    name: "Notifications",
    icon: Activity,
    children: [
      { name: "Send Notification", href: "/admin/notifications" },
      { name: "History", href: "/admin/notifications/history" }
    ]
  },
  {
    name: "System Settings",
`;

code = code.replace(
  /\{\s*name: "Support Tickets", href: "\/admin\/support\/tickets", icon: MessageSquare\s*\},[\s]*\{\s*name: "System Settings",/m,
  replacement
);

fs.writeFileSync('src/app/admin/layout.tsx', code);
console.log("Updated Admin Sidebar Navigation");
