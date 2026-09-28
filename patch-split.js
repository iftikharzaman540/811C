const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.split('</>}</motion.div>').join('</>)}</motion.div>');

fs.writeFileSync(file, code);
console.log("Fixed JSX closing tag with split/join");
