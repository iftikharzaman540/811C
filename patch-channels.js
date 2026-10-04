const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// 1. Add channelsExpanded state
if (!code.includes('channelsExpanded')) {
  code = code.replace(
    /const \[method, setMethod\] = useState\("JazzCash"\);/,
    'const [method, setMethod] = useState("JazzCash_0");\n    const [channelsExpanded, setChannelsExpanded] = useState(false);'
  );
}

// 2. Update parent buttons to set method to JazzCash_0 and EasyPaisa_0
code = code.replace(
  /onClick=\{\(\) => setMethod\("JazzCash"\)\}/g,
  'onClick={() => setMethod("JazzCash_0")}'
);
code = code.replace(
  /onClick=\{\(\) => setMethod\("EasyPaisa"\)\}/g,
  'onClick={() => setMethod("EasyPaisa_0")}'
);

// 3. Replace Expand section and Sub-buttons grid
const expandRegex = /<div className="flex justify-center mb-3">[\s\S]*?<div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3 relative">[\s\S]*?<\/div>/;

const newExpandBlock = `<div className="flex justify-center mb-3">
                <button 
                  onClick={() => setChannelsExpanded(!channelsExpanded)}
                  className="flex items-center text-[#ffdf00] text-[13px]"
                >
                  {channelsExpanded ? "Collapse" : "Expand"} {channelsExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
              </div>

              {channelsExpanded && (
                <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3 relative">
                  {["Fast", "Fast", "Fast", "Fast"].map((m, i) => {
                    const baseMethod = method.split('_')[0];
                    const subMethod = \`\${baseMethod}_\${i}\`;
                    return (
                    <button 
                      key={i} 
                      onClick={() => setMethod(subMethod)}
                      className={\`relative h-[38px] rounded-md border flex items-center justify-center text-[13px] \${method === subMethod || (method === baseMethod && i === 0) ? "border-[#ffdf00] text-[#ffdf00] bg-black/40" : "border-neutral-700 text-white bg-[#1a1a1a]"}\`}
                    >
                      {baseMethod}
                      <span className="absolute -top-1.5 -right-1 bg-[#ff0b0b] text-white text-[8px] font-bold px-1 rounded-sm">Fast</span>
                    </button>
                  )})}
                </div>
              )}`;

code = code.replace(expandRegex, newExpandBlock);

// 4. Update payload provider to strip the _0, _1, etc.
code = code.replace(
  /provider: method\.toUpperCase\(\)/g,
  "provider: method.split('_')[0].toUpperCase()"
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx for sub-options");
