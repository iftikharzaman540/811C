const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

code = code.replace(
  /data: \{ status: 'COMPLETED', metadata: data \},/g,
  "data: { status: 'COMPLETED', metadata: { ...(payment.metadata as any || {}), webhook_data: data } },"
);

code = code.replace(
  /data: \{ status: 'REJECTED', metadata: data \},/g,
  "data: { status: 'REJECTED', metadata: { ...(payment.metadata as any || {}), webhook_data: data } },"
);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
