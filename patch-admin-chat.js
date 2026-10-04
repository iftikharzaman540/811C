const fs = require('fs');
let code = fs.readFileSync('src/app/admin/support/tickets/[id]/page.tsx', 'utf8');

const regex = /<p className="whitespace-pre-wrap text-sm">\{msg\.message\}<\/p>/;
const replacement = `<p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                  {msg.attachment && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={msg.attachment} alt="Attachment" className="max-w-full max-h-[300px] object-contain bg-neutral-900/50" />
                    </div>
                  )}`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/app/admin/support/tickets/[id]/page.tsx', code);
    console.log("Successfully patched admin ticket page to show attachments!");
} else {
    console.log("Could not find the target string.");
}
