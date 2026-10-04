const fs = require('fs');

let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// 1. Remove the bad `{activeTab === "register" && (<>`
content = content.replace('{activeTab === "register" && (<>\n              {/* Sub-tabs for Registration type */}', '{/* Sub-tabs for Registration type */}');

// 2. Remove the bad `</>)}\n              {/* Register Button */}`
content = content.replace('</>)}\n              {/* Register Button */}', '{/* Register Button */}');

// 3. Wrap Sub-tabs specifically
content = content.replace('{/* Sub-tabs for Registration type */}', '{activeTab === "register" && (<>\n              {/* Sub-tabs for Registration type */}');
content = content.replace('{/* Password Input */}', '</>)}\n\n              {/* Password Input */}');

// 4. Wrap the rest below password
content = content.replace('{/* Password Strength Indicator */}', '{activeTab === "register" && (<>\n              {/* Password Strength Indicator */}');
content = content.replace('{/* Register Button */}', '</>)}\n              {/* Register Button */}');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
