const fs = require('fs');
let code = fs.readFileSync('src/app/admin/finances/withdrawals/page.tsx', 'utf8');

const approveTarget = `  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal?')) return;
    try {
      await apiRequest('/admin/finances/withdrawals/' + id + '/approve', { method: 'POST' });`;
const approveReplacement = `  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal?')) return;
    try {
      await apiRequest('/admin/finances/withdrawals/' + id + '/approve', { method: 'PATCH' });`;
code = code.replace(approveTarget, approveReplacement);

const rejectTarget = `  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this withdrawal? The amount will be refunded to the user.')) return;
    try {
      await apiRequest('/admin/finances/withdrawals/' + id + '/reject', { method: 'POST' });`;
const rejectReplacement = `  const handleReject = async (id: string) => {
    const reason = prompt('Please enter the reason for rejection (this will be sent to the user):\\nLeave blank if you do not want to specify a reason.');
    if (reason === null) return;
    try {
      await apiRequest('/admin/finances/withdrawals/' + id + '/reject', { method: 'PATCH', body: JSON.stringify({ reason }) });`;
code = code.replace(rejectTarget, rejectReplacement);

fs.writeFileSync('src/app/admin/finances/withdrawals/page.tsx', code);
