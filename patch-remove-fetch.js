const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const toRemove = `    useEffect(() => {
      fetch('https://8111c.com/api/v1/games/gregmorn/list?t=' + Date.now())
        .then(r => r.json())
        .then(data => {
          if(Array.isArray(data)) setRealGames(data.slice(0, 30));
        })
        .catch(e => console.error("Error fetching games", e));
    }, []);`;

code = code.replace(toRemove, "");

fs.writeFileSync(file, code);
console.log("Removed duplicate fetch");
