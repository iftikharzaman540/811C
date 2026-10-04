const fs = require('fs');

let service = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

const searchWithdraw = `
  async createWithdrawal(userId: string, amount: number, providerName: PaymentProvider, accountDetails: any) {
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    if (wallet.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    if (amount < 500) {
      throw new BadRequestException('Minimum withdrawal is 500');
    }
`;

const replaceWithdraw = `
  async createWithdrawal(userId: string, amount: number, providerName: PaymentProvider, accountDetails: any) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId }, 
      include: { wallet: true } 
    });
    
    if (!user || !user.wallet) {
      throw new BadRequestException('User or wallet not found');
    }
    
    const wallet = user.wallet;

    // Check 1: Minimum amount
    if (amount < 100) {
      throw new BadRequestException('Minimum withdrawal amount is PKR 100');
    }

    // Check 2: Maximum amount
    if (amount > 50000) {
      throw new BadRequestException('Maximum withdrawal amount is PKR 50,000');
    }

    // Check 3: Available balance
    if (wallet.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Check 4: Wagering Requirement
    const req = Number(user.current_wagering_requirement || 0);
    const comp = Number(user.current_wagering_completed || 0);
    if (comp < req) {
      throw new BadRequestException(\`Wagering requirement incomplete. Play PKR \${req - comp} more to withdraw.\`);
    }

    // Check 5: Daily Limit (15)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.prisma.payment.count({
      where: {
        user_id: userId,
        type: 'WITHDRAWAL',
        created_at: { gte: today }
      }
    });
    
    if (todayCount >= 15) {
      throw new BadRequestException('Daily withdrawal limit reached. You can make withdrawals again tomorrow.');
    }
`;

// regex because of exact whitespace mapping
const regex = /async createWithdrawal\(userId: string, amount: number, providerName: PaymentProvider, accountDetails: any\) \{[\s\S]*?if \(amount < 500\) \{\s*throw new BadRequestException\('Minimum withdrawal is 500'\);\s*\}/m;

service = service.replace(regex, replaceWithdraw.trim());

fs.writeFileSync('backend/src/payments/payments.service.ts', service);
console.log("Payments service patched with new withdrawal rules.");
