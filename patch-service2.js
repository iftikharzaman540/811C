const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

const newMethod = `
  async getRecords(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 100
    });
    return payments.map(p => ({
      id: p.id,
      record_type: p.type,
      amount: Number(p.amount),
      status: p.status,
      created_at: p.created_at,
      provider: p.provider
    }));
  }
}
`;

code = code.replace(/}\s*$/, newMethod);
fs.writeFileSync('backend/src/payments/payments.service.ts', code);
