const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Remove the search state declaration
code = code.replace('const [globalSearch, setGlobalSearch] = useState("");\\n', '');
code = code.replace('const [globalSearch, setGlobalSearch] = useState("");\\r\\n', '');
code = code.replace('    const [globalSearch, setGlobalSearch] = useState("");\\n', '');
code = code.replace('    const [globalSearch, setGlobalSearch] = useState("");\\r\\n', '');

// 2. Remove the search bar UI block
const startBlock = '{/* GLOBAL SEARCH BAR */}';
const endBlockStr = '{/* Single Main Grid Section (Hot) */}';

let p1 = code.split(startBlock);
if (p1.length > 1) {
  let p2 = p1[1].split(endBlockStr);
  if (p2.length > 1) {
    code = p1[0] + endBlockStr + p2[1];
  }
}

// 3. Remove the specific closing tags of the search block
// Right before Fixed Left Global Popups, there is:
//         </>
//         )
//         }
const searchForClose1 = '        </>\\r\\n        )\\r\\n        }\\r\\n\\r\\n        {/* Fixed Left Global Popups */}';
const searchForClose2 = '        </>\\n        )\\n        }\\n\\n        {/* Fixed Left Global Popups */}';
const searchForClose3 = '        </>\\r\\n        )\\r\\n        }\\r\\n\\r\\n\\r\\n        {/* Fixed Left Global Popups */}';
const searchForClose4 = '        </>\\n        )\\n        }\\n\\n\\n        {/* Fixed Left Global Popups */}';

if (code.includes(searchForClose1)) {
  code = code.replace(searchForClose1, '        {/* Fixed Left Global Popups */}');
} else if (code.includes(searchForClose2)) {
  code = code.replace(searchForClose2, '        {/* Fixed Left Global Popups */}');
} else if (code.includes(searchForClose3)) {
  code = code.replace(searchForClose3, '        {/* Fixed Left Global Popups */}');
} else if (code.includes(searchForClose4)) {
  code = code.replace(searchForClose4, '        {/* Fixed Left Global Popups */}');
} else {
  console.log("Could not find the exact closing tags to remove before Fixed Left Global Popups!");
  // Find exactly what precedes Fixed Left Global Popups
  const popupsIdx = code.indexOf('{/* Fixed Left Global Popups */}');
  if (popupsIdx !== -1) {
    console.log("Characters preceding it:", JSON.stringify(code.substring(popupsIdx - 50, popupsIdx)));
  }
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Removed search bar logic carefully");
