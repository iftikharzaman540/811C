const fs = require('fs');

const depPath = 'src/app/admin/finances/deposits/page.tsx';
let depContent = fs.readFileSync(depPath, 'utf8');

const oldDepProcess = `
  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(\`Are you sure you want to \${action} this deposit?\`)) return;
    setProcessingId(id);
    try {
      await apiRequest(\`/admin/finances/deposits/\${id}/\${action}\`, { method: 'PATCH' });
`;
const newDepProcess = `
  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    let reason = '';
    if (action === 'reject') {
      const input = prompt('Please enter a reason for rejecting this deposit:');
      if (input === null) return;
      reason = input.trim();
      if (!reason) {
        toast.error('Reason is required for rejection');
        return;
      }
    } else {
      if (!confirm(\`Are you sure you want to approve this deposit?\`)) return;
    }
    setProcessingId(id);
    try {
      await apiRequest(\`/admin/finances/deposits/\${id}/\${action}\`, { 
        method: 'PATCH',
        body: JSON.stringify(reason ? { reason } : {})
      });
`;
depContent = depContent.replace(oldDepProcess, newDepProcess);
fs.writeFileSync(depPath, depContent);


const withPath = 'src/app/admin/finances/withdrawals/page.tsx';
let withContent = fs.readFileSync(withPath, 'utf8');

const oldWithProcess = `
  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(\`Are you sure you want to \${action} this withdrawal?\`)) return;
    setProcessingId(id);
    try {
      await apiRequest(\`/admin/finances/withdrawals/\${id}/\${action}\`, { method: 'POST' });
`;
const newWithProcess = `
  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    let reason = '';
    if (action === 'reject') {
      const input = prompt('Please enter a reason for rejecting this withdrawal:');
      if (input === null) return;
      reason = input.trim();
      if (!reason) {
        toast.error('Reason is required for rejection');
        return;
      }
    } else {
      if (!confirm(\`Are you sure you want to approve this withdrawal?\`)) return;
    }
    setProcessingId(id);
    try {
      await apiRequest(\`/admin/finances/withdrawals/\${id}/\${action}\`, { 
        method: 'POST',
        body: JSON.stringify(reason ? { reason } : {})
      });
`;
withContent = withContent.replace(oldWithProcess, newWithProcess);
fs.writeFileSync(withPath, withContent);
console.log('Patched global deposit and withdrawal pages for reason prompt!');
