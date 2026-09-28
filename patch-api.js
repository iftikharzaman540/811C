const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const fetchReplacement = `
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.50.184:4000/api/v1";
    
    useEffect(() => {
      fetch(\`\${API_URL}/games/gregmorn/list?t=\` + Date.now())
`;

code = code.replace(
  "    useEffect(() => {\n      fetch('/api/v1/games/gregmorn/list?t=' + Date.now())",
  fetchReplacement
);

// Also fix the launch endpoint
const launchReplacement = `
      try {
        toast.loading("Launching game...", { id: 'launch' });
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.50.184:4000/api/v1";
        const res = await fetch(\`\${API_URL}/games/gregmorn/launch\`, {
`;

code = code.replace(
  "      try {\n        toast.loading(\"Launching game...\", { id: 'launch' });\n        const res = await fetch('/api/v1/games/gregmorn/launch', {",
  launchReplacement
);

fs.writeFileSync(file, code);
console.log("Patched API endpoints to use correct URL in HomeScreen");
