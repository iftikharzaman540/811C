const fs = require('fs');
let authService = fs.readFileSync('backend/src/auth/auth.service.ts', 'utf8');

const searchRegister = `
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          password_hash: hashedPassword,
        },
      });

      await tx.wallet.create({
        data: { user_id: newUser.id },
      });

      return newUser;
    });
`;

const replaceRegister = `
    const user = await this.prisma.$transaction(async (tx) => {
      const refCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newUser = await tx.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          password_hash: hashedPassword,
          referral_code: refCode,
          available_spins: 1,
          has_registration_spin: true,
        },
      });

      await tx.wallet.create({
        data: { user_id: newUser.id },
      });

      if (dto.referralCode) {
        const referrer = await tx.user.findUnique({ where: { referral_code: dto.referralCode } });
        if (referrer) {
          await tx.user.update({
             where: { id: referrer.id },
             data: { available_spins: { increment: 2 } }
          });
          await tx.referral.create({
             data: { user_id: referrer.id, referred_user_id: newUser.id }
          });
        }
      }

      return newUser;
    });
`;
authService = authService.replace(searchRegister.trim(), replaceRegister.trim());

// Also update getMe to handle Daily Login +1 Free Draw
const searchGetMe = `
    // Count today's withdrawals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
`;
const replaceGetMe = `
    // Count today's withdrawals
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check Daily Login Draw
    let grantedDailySpin = false;
    let newSpins = user.available_spins;
    if (!user.last_login_spin_date || user.last_login_spin_date < today) {
      // Grant +1 daily spin
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          available_spins: { increment: 1 },
          last_login_spin_date: new Date()
        }
      });
      grantedDailySpin = true;
      newSpins += 1;
    }
`;
authService = authService.replace(searchGetMe.trim(), replaceGetMe.trim());

// Add available_spins to the response
authService = authService.replace(
   /balance: wallet \? wallet\.balance\.toNumber\(\) : 0,\s*today_withdrawals_count: todayWithdrawalsCount/g,
   `balance: wallet ? wallet.balance.toNumber() : 0,
      bonus_balance: wallet ? wallet.bonus_balance.toNumber() : 0,
      today_withdrawals_count: todayWithdrawalsCount,
      available_spins: newSpins`
);

fs.writeFileSync('backend/src/auth/auth.service.ts', authService);
console.log("Auth service patched with promos");
