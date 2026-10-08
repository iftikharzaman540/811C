const fs = require('fs');
const path = 'src/app/withdrawal-history/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-neutral-400">
                      <span>{formatDateString(record.created_at)}</span>
                      <span className="mx-2">?</span>
                      <span>{formatTime(record.created_at)}</span>
                    </div>
                    <div className="text-xs text-neutral-500 truncate max-w-[120px]" title={record.transaction_id || record.reference_id || record.id}>
                      ID: {record.transaction_id || record.reference_id || record.id.slice(0,8)}
                    </div>
                  </div>`;

const replaceStr = `                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-neutral-400">
                      <span>{formatDateString(record.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(record.created_at)}</span>
                    </div>
                    <div className="text-xs text-neutral-500 truncate max-w-[120px]" title={record.transaction_id || record.reference_id || record.id}>
                      ID: {record.transaction_id || record.reference_id || record.id.slice(0,8)}
                    </div>
                  </div>
                  
                  {record.status === 'PENDING' && (
                    <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-500/90 leading-tight">
                      Due to the high volume of withdrawal requests, processing may take 1–2 hours and, in some cases, up to approximately 24 hours. We appreciate your patience and understanding.
                    </div>
                  )}`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync(path, content);
console.log('Patched withdrawal history!');
