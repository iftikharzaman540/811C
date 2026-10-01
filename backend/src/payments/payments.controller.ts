import { Controller, Post, Get, Body, Param, UseGuards, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentProvider } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('deposit')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Initiate a deposit' })
  async deposit(
    @CurrentUser() user: any,
    @Body() body: { amount: number; provider: PaymentProvider; transactionId?: string; autoApprove?: boolean }
  ) {
    return this.service.createDeposit(user.userId, body.amount, body.provider, body.transactionId, body.autoApprove);
  }

  @Post('auto-deposit')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Initiate an auto deposit via XpressPay' })
  async autoDeposit(
    @CurrentUser() user: any,
    @Body() body: { amount: number; provider: PaymentProvider; accountNo: string }
  ) {
    return this.service.createAutoDeposit(user.userId, body.amount, body.provider, body.accountNo);
  }

  @Get('status/:reference')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Check status of a payment' })
  async checkStatus(@Param('reference') reference: string) {
    return this.service.getPaymentStatus(reference);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Initiate a withdrawal' })
  async withdraw(
    @CurrentUser() user: any,
    @Body() body: { amount: number; provider: PaymentProvider; accountDetails: any }
  ) {
    return this.service.createWithdrawal(user.userId, body.amount, body.provider, body.accountDetails);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Provider Webhook (Public)' })
  async webhook(
    @Body() payload: any,
    @Res() res: Response
  ) {
    const result = await this.service.handleWebhook(payload);
    if (result.startsWith('FAIL')) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
}
