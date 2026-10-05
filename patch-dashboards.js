const fs = require('fs');

function patch(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /this\.prisma\.deposit\.aggregate\(\{\s*_sum: \{ amount: true \},\s*where: \{ status: 'COMPLETED' \}\s*\}\)/,
    "this.prisma.payment.aggregate({ _sum: { amount: true }, where: { type: 'DEPOSIT', status: 'COMPLETED' } })"
  );
  code = code.replace(
    /this\.prisma\.deposit\.findMany\(\{\s*where: \{ status: 'COMPLETED', created_at: \{ gte: start, lte: end \} \},\s*\}\)/,
    "this.prisma.payment.findMany({ where: { type: 'DEPOSIT', status: 'COMPLETED', created_at: { gte: start, lte: end } } })"
  );
  code = code.replace(
    /this\.prisma\.withdrawal\.aggregate\(\{\s*_sum: \{ amount: true \},\s*where: \{ status: 'COMPLETED' \}\s*\}\)/,
    "this.prisma.payment.aggregate({ _sum: { amount: true }, where: { type: 'WITHDRAWAL', status: 'COMPLETED' } })"
  );
  code = code.replace(
    /this\.prisma\.withdrawal\.findMany\(\{\s*where: \{ status: 'COMPLETED', created_at: \{ gte: start, lte: end \} \},\s*\}\)/,
    "this.prisma.payment.findMany({ where: { type: 'WITHDRAWAL', status: 'COMPLETED', created_at: { gte: start, lte: end } } })"
  );
  fs.writeFileSync(file, code);
}

patch('backend/src/admin/admin-dashboard/admin-dashboard.service.ts');
patch('backend/src/admin-dashboard/admin-dashboard.service.ts');
