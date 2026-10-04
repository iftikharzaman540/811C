const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("  const [realGames, setRealGames] = useState<any[]>([]);\n  const [realGames, setRealGames] = useState<any[]>([]);", "  const [realGames, setRealGames] = useState<any[]>([]);");

fs.writeFileSync(file, code);
console.log("Fixed duplicate state declaration");
