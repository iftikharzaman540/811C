import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentProvider } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

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
    @Body() body: { amount: number; provider: PaymentProvider }
  ) {
    return this.service.createDeposit(user.userId, body.amount, body.provider);
  }

  @Post('auto-deposit')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Initiate an auto deposit (Mock for Direct API)' })
  async autoDeposit(
    @CurrentUser() user: any,
    @Body() body: { amount: number; provider: PaymentProvider; accountNo: string }
  ) {
    return this.service.createAutoDeposit(user.userId, body.amount, body.provider, body.accountNo);
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
  @ApiHeader({ name: 'x-signature', description: 'Provider Signature' })
  async webhook(
    @Headers('x-signature') signature: string,
    @Body() payload: any
  ) {
    return this.service.handleWebhook(payload, signature || 'mock-valid-signature');
  }
}
