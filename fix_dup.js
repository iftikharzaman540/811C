const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Find the first occurrence and remove it
let target = '{activeTab === "login" && (\n                <div className="flex justify-end mt-1">\n                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[11px] text-[#ffdf00] hover:underline">\n                    Forgot Password?\n                  </button>\n                </div>\n              )}';
let target2 = '{activeTab === "login" && (\r\n                <div className="flex justify-end mt-1">\r\n                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[11px] text-[#ffdf00] hover:underline">\r\n                    Forgot Password?\r\n                  </button>\r\n                </div>\r\n              )}';

content = content.replace(target, '');
content = content.replace(target2, '');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
