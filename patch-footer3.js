const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const newLicensing = `{/* Licensing Info */}
      <div className="text-[11px] text-[#888] text-center leading-relaxed mb-4 border-t border-neutral-800 pt-6">
        <p>8111c.com is one of the most trusted international online casino operators, offering a variety of exciting games such as live dealer games, slots, fishing, lottery, sports and more. We are authorized and regulated by the Government of Curacao, operating license number Antillephone issued to 999/JAZ. We complete all checks</p>
        <p className="mt-2">Final profit is not guaranteed.</p>
      </div>

      <div className="flex justify-between text-[13px] text-[#888] pb-4 px-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3.5 bg-neutral-800"></div>
        <span>8111c.com</span>
        <span>\u00A9Copyright 2026</span>
      </div>`;

code = code.replace(/\{\/\* Licensing Info \*\/\}[\s\S]*<\/div>\s*<\/footer>/, newLicensing + '\n    </footer>');

fs.writeFileSync('src/components/Footer.tsx', code);
console.log("Replaced footer text!");
