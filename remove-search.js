const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Remove search state
code = code.replace('const [globalSearch, setGlobalSearch] = useState("");\\n', '');
code = code.replace('const [globalSearch, setGlobalSearch] = useState("");\\r\\n', '');
code = code.replace('    const [globalSearch, setGlobalSearch] = useState("");\\n', '');
code = code.replace('    const [globalSearch, setGlobalSearch] = useState("");\\r\\n', '');

// Using robust split to remove the search bar UI block
const startBlock = '{/* GLOBAL SEARCH BAR */}';
const endBlockStr = '{/* Single Main Grid Section (Hot) */}';

let p1 = code.split(startBlock);
if (p1.length > 1) {
  let p2 = p1[1].split(endBlockStr);
  if (p2.length > 1) {
    // p1[0] is everything before search bar
    // p2[1] is everything after the search bar (including the comment Single Main Grid Section)
    code = p1[0] + endBlockStr + p2[1];
    
    // Now we must also remove the closing tags for the globalSearch ternary
    // It should be just before Grand Prize Record
    const grandPrizeStart = '{/* Grand Prize Record */}';
    let p3 = code.split(grandPrizeStart);
    if (p3.length > 1) {
      // The closing tags are something like:
      //         </>
      //       )
      //       }
      const textBeforeGrandPrize = p3[0];
      // Regex to remove the closing tags of the ternary that was at the end of the sections block
      const updatedTextBefore = textBeforeGrandPrize.replace(/<\/>\s*\)\s*\}\s*$/, '');
      code = updatedTextBefore + grandPrizeStart + p3[1];
    }
    
    console.log("Removed search bar successfully!");
  } else {
    console.log("Could not find end block");
  }
} else {
  console.log("Could not find start block");
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
