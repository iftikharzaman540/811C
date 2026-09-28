const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!code.includes('import toast from')) {
  code = code.replace('export default function Footer() {', 'import toast from "react-hot-toast";\n\nexport default function Footer() {');
}

// 1. Social links
code = code.replace(
  /<button className="w-10 h-10 rounded-full/g,
  '<button onClick={() => toast.success("Opening link...")} className="w-10 h-10 rounded-full'
);

// 2. Text links
code = code.replace(
  /<a href="#" className="hover:text-white transition-colors/g,
  '<a href="#" onClick={(e) => { e.preventDefault(); toast("Navigating..."); }} className="hover:text-white transition-colors'
);

fs.writeFileSync('src/components/Footer.tsx', code);
