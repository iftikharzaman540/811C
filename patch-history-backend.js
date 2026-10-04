const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

const historyMethods = `
  async getDepositHistory(userId: string, range: string) {
    let dateFilter = new Date();
    if (range === '1d') dateFilter.setDate(dateFilter.getDate() - 1);
    else if (range === '7d') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (range === '30d') dateFilter.setDate(dateFilter.getDate() - 30);
    else dateFilter.setDate(dateFilter.getDate() - 1);

    const records = await this.prisma.payment.findMany({
      where: {
        user_id: userId,
        type: 'DEPOSIT',
        created_at: { gte: dateFilter }
      },
      orderBy: { created_at: 'desc' }
    });

    const total = records.filter(r => r.status === 'COMPLETED' || r.status === 'APPROVED' || r.status === 'SUCCESS').reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      range_start: dateFilter.toISOString(),
      range_end: new Date().toISOString(),
      total,
      records: records.map(r => ({
        id: r.id,
        amount: r.amount,
        status: r.status,
        created_at: r.created_at.toISOString(),
        provider: r.provider,
        transaction_id: r.transaction_reference
      }))
    };
  }

  async getWithdrawalHistory(userId: string, range: string) {
    let dateFilter = new Date();
    if (range === '1d') dateFilter.setDate(dateFilter.getDate() - 1);
    else if (range === '7d') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (range === '30d') dateFilter.setDate(dateFilter.getDate() - 30);
    else dateFilter.setDate(dateFilter.getDate() - 1);

    const records = await this.prisma.payment.findMany({
      where: {
        user_id: userId,
        type: 'WITHDRAWAL',
        created_at: { gte: dateFilter }
      },
      orderBy: { created_at: 'desc' }
    });

    const total = records.filter(r => r.status === 'COMPLETED' || r.status === 'APPROVED' || r.status === 'SUCCESS').reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      range_start: dateFilter.toISOString(),
      range_end: new Date().toISOString(),
      total,
      records: records.map(r => ({
        id: r.id,
        amount: r.amount,
        status: r.status,
        created_at: r.created_at.toISOString(),
        provider: r.provider,
        transaction_id: r.transaction_reference
      }))
    };
  }
`;

code = code.replace(/export class PaymentsService \{[\s\S]*?constructor\([\s\S]*?\) \{\}/, match => match + historyMethods);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
console.log("Added history APIs to PaymentsService");
