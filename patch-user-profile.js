const fs = require('fs');
const path = 'src/app/admin/users/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add processing state and handleProcess function
const stateStr = "const [search, setSearch] = useState('');";
const newStateStr = "const [search, setSearch] = useState('');\n  const [processingId, setProcessingId] = useState<string | null>(null);";
content = content.replace(stateStr, newStateStr);

const handleProcessFunc = `
  const handleProcess = async (id: string, type: 'deposits' | 'withdrawals', action: 'approve' | 'reject') => {
    let reason = '';
    if (action === 'reject') {
      const input = prompt(\`Please enter a reason for rejecting this \${type.slice(0, -1)}:\`);
      if (input === null) return; // cancelled
      reason = input.trim();
      if (!reason) {
        toast.error('Reason is required for rejection');
        return;
      }
    } else {
      if (!confirm(\`Are you sure you want to approve this \${type.slice(0, -1)}?\`)) return;
    }
    
    setProcessingId(id);
    try {
      await apiRequest(\`/admin/finances/\${type}/\${id}/\${action}\`, { 
        method: 'PATCH',
        body: JSON.stringify(reason ? { reason } : {})
      });
      toast.success(\`\${type.slice(0, -1)} \${action}d successfully\`);
      fetchUser();
    } catch (error: any) {
      toast.error(error.message || \`Failed to \${action}\`);
    } finally {
      setProcessingId(null);
    }
  };
`;
content = content.replace("const handleUpdateBalance = async () => {", handleProcessFunc + "\n\n  const handleUpdateBalance = async () => {");

// 2. Add Actions column to Deposits
content = content.replace(
  '<th className="px-4 py-3 font-medium rounded-tr-lg">Date</th>',
  '<th className="px-4 py-3 font-medium">Date</th>\n                        <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>'
);

const oldDepositTd = `</td>
                            <td className="px-4 py-3 text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                          </tr>`;
const newDepositTd = `</td>
                            <td className="px-4 py-3 text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">
                              {tx.status === 'PENDING' && (
                                <div className="flex justify-end gap-2">
                                  <button disabled={processingId === tx.id} onClick={() => handleProcess(tx.id, 'deposits', 'approve')} className="p-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white" title="Approve"><Check className="w-3 h-3" /></button>
                                  <button disabled={processingId === tx.id} onClick={() => handleProcess(tx.id, 'deposits', 'reject')} className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white" title="Reject"><X className="w-3 h-3" /></button>
                                </div>
                              )}
                            </td>
                          </tr>`;
content = content.replace(oldDepositTd, newDepositTd);
content = content.replace('<td colSpan={6}', '<td colSpan={7}');

// 3. Add Actions column to Withdrawals
content = content.replace(
  '<th className="px-4 py-3 font-medium rounded-tr-lg">Date</th>',
  '<th className="px-4 py-3 font-medium">Date</th>\n                        <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>'
);

const oldWithdrawalTd = `</td>
                            <td className="px-4 py-3 text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                          </tr>`;
const newWithdrawalTd = `</td>
                            <td className="px-4 py-3 text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">
                              {tx.status === 'PENDING' && (
                                <div className="flex justify-end gap-2">
                                  <button disabled={processingId === tx.id} onClick={() => handleProcess(tx.id, 'withdrawals', 'approve')} className="p-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white" title="Approve"><Check className="w-3 h-3" /></button>
                                  <button disabled={processingId === tx.id} onClick={() => handleProcess(tx.id, 'withdrawals', 'reject')} className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white" title="Reject"><X className="w-3 h-3" /></button>
                                </div>
                              )}
                            </td>
                          </tr>`;
content = content.replace(oldWithdrawalTd, newWithdrawalTd);
content = content.replace('<td colSpan={5}', '<td colSpan={6}');

fs.writeFileSync(path, content);
console.log('Patched user profile page!');
