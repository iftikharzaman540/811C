const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

// We'll replace the entire block from "Fixed Left Global Popups" to the end of "Fixed Right Global Popups"
// They are likely siblings inside some container.
content = content.replace(
  /\{\/\* Fixed Left Global Popups \*\/\}[\s\S]*?\{\/\* Back to top button \*\/\}|\{\/\* Fixed Left Global Popups \*\/\}[\s\S]*?\{\/\* End Global Popups \*\/\}/, 
  (match) => {
    // If we matched up to "Back to top button", we should put it back.
    if (match.includes("{/* Back to top button */}")) {
       return "{/* Back to top button */}";
    }
    return "";
  }
);

// In case my regex fails, let's do it manually with split/join
const lines = content.split("\n");
let inPopups = false;
let newLines = [];
for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes("{/* Fixed Left Global Popups */}")) {
      inPopups = true;
   }
   if (inPopups && (lines[i].includes("{/* Back to top button */}") || lines[i].includes("</motion.div>"))) {
      // We might have gone too far if we hit </motion.div>, wait. Let's just look for what comes after.
   }
   
}
