const fs = require('fs');
const path = 'src/app/admin/support/tickets/[id]/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// The messages loop usually looks like ticket.messages.map(...)
code = code.replace(/<p className="whitespace-pre-wrap">\{msg\.message\}<\/p>/g, `{msg.attachment && (
                      <div className="mb-3">
                        <img src={msg.attachment} alt="Attachment" className="max-w-sm rounded-lg shadow-sm border border-neutral-700" />
                        <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 block">View Full Size</a>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.message}</p>`);

fs.writeFileSync(path, code);
console.log("Patched admin ticket details page to show attachments");
