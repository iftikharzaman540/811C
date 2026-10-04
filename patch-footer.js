const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const oldLicensing = `<div className="text-[10px] text-neutral-500 text-center leading-snug mb-4 border-t border-neutral-800 pt-4">
        <p>NexusWin Group is one of the most famous international online casino operators, offering a variety of exciting games such as live dealer games, slots, fishing, lottery, sports and more. We are authorized and regulated by the Government of Curacao, operating under license number Antillephone issued to 998/JAZ. We complete all checks. Final profit is not guaranteed.</p>
      </div>

      <div className="flex justify-between text-xs text-neutral-600">
        <span>NexusWin.com</span>
        <span>AcCopyright 2026</span>
      </div>`;

const newLicensing = `<div className="text-[10px] text-[#888] text-center leading-relaxed mb-4 border-t border-neutral-800 pt-6">
        <p>8111c.com is one of the most trusted international online casino operators, offering a variety of exciting games such as live dealer games, slots, fishing, lottery, sports and more. We are authorized and regulated by the Government of Curacao, operating license number Antillephone issued to 999/JAZ. We complete all checks</p>
        <p className="mt-1">Final profit is not guaranteed.</p>
      </div>

      <div className="flex justify-center items-center gap-10 text-[11px] text-[#888] pb-4">
        <span>8111c.com</span>
        <span className="text-neutral-700">|</span>
        <span>©Copyright 2026</span>
      </div>`;

code = code.replace(oldLicensing, newLicensing);

fs.writeFileSync('src/components/Footer.tsx', code);
console.log("Replaced footer text!");
