import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromoService {
  async getEvents() {
    const setting = await this.prisma.systemSetting.findUnique({ where: { key: 'promo_events' } });
    if (!setting) return [];
    return JSON.parse(setting.value as string);
  }

  constructor(private prisma: PrismaService) {}

  async spinWheel(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { wallet: true },
      });

            if (!user) throw new BadRequestException('User not found');
      if (!user.bonuses_enabled) throw new BadRequestException('Bonuses are currently restricted for your account.');
      if (user.available_spins <= 0) {
        throw new BadRequestException('No free draws available');
      }

      let rewardAmount = 0;
      let isReg = false;

      // Registration spin logic (first spin gives EXACTLY 396)
      if (user.has_registration_spin) {
        rewardAmount = 396.00;
        isReg = true;
      } else {
        // Daily / Referral spin logic (between 0.50 and 30.00)
        // Ensure max is 30.00 and min is 0.50 exactly
        rewardAmount = Number((Math.random() * (30 - 0.5) + 0.5).toFixed(2));
      }

      // Deduct spin, and if it was the registration spin, turn the flag off
      await tx.user.update({
        where: { id: userId },
        data: {
          available_spins: { decrement: 1 },
          has_registration_spin: isReg ? false : user.has_registration_spin
        }
      });

      // Add to promotion balance (bonus_balance)
      const updatedWallet = await tx.wallet.update({
        where: { user_id: userId },
        data: { bonus_balance: { increment: rewardAmount } }
      });

      // Log transaction as BONUS
      await tx.walletTransaction.create({
        data: {
          wallet_id: updatedWallet.id,
          type: 'BONUS',
          amount: rewardAmount,
          balance_before: user.wallet.balance, // Note: this is main balance, but we use it as record
          balance_after: user.wallet.balance,  // Main balance doesn't change
          description: isReg ? 'Registration Free Draw Reward' : 'Daily/Referral Free Draw Reward'
        }
      });

      return {
        amount: rewardAmount,
        new_bonus_balance: updatedWallet.bonus_balance.toNumber(),
        remaining_spins: user.available_spins - 1
      };
    });
  }

  async claimPromotion(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { wallet: true }
      });

            if (!user) throw new BadRequestException('User not found');
      if (!user.bonuses_enabled) throw new BadRequestException('Bonuses are currently restricted for your account.');
      if (user.has_claimed_promotion) {
        throw new BadRequestException('Promotion has already been claimed');
      }
      
      const currentPromo = user.wallet.bonus_balance.toNumber();
      if (currentPromo < 500) {
        throw new BadRequestException(`Promotion balance must be at least Rs.500 to claim. Current: ${currentPromo}`);
      }

      // Transfer from bonus_balance to balance
      await tx.wallet.update({
        where: { user_id: userId },
        data: {
          bonus_balance: 0,
          balance: { increment: currentPromo }
        }
      });

      // Update wagering requirement by the claimed amount
      await tx.user.update({
        where: { id: userId },
        data: {
          has_claimed_promotion: true,
          current_wagering_requirement: { increment: currentPromo }
        }
      });

      // Log transaction
      await tx.walletTransaction.create({
        data: {
          wallet_id: user.wallet.id,
          type: 'BONUS', // Or ADJUSTMENT
          amount: currentPromo,
          balance_before: user.wallet.balance,
          balance_after: Number(user.wallet.balance) + currentPromo,
          description: 'Claimed Promotion Balance'
        }
      });

      return {
        success: true,
        claimed_amount: currentPromo,
        message: `Successfully claimed Rs.${currentPromo} to main wallet.`
      };
    });
  }
}

