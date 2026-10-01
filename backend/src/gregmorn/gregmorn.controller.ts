import { Controller, Get, Post, Body, UseGuards, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { GregmornService } from './gregmorn.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/games/gregmorn')
export class GregmornController {
  constructor(
    private readonly gregmornService: GregmornService,
    private readonly prisma: PrismaService
  ) {}

  @Get('list')
  async getGames(@Query('currency') currency: string) {
    return this.gregmornService.getGames(currency || 'PKR');
  }

  @Post('launch')
  @UseGuards(AuthGuard('jwt'))
  async launchGame(
    @CurrentUser() user: any,
    @Body('gameId') gameId: string,
    @Body('demo') demo: boolean,
  ) {
    if (!demo) {
      const dbUser = await this.prisma.user.findUnique({ where: { id: user.userId } });
      if (!dbUser) throw new NotFoundException('User not found');
      if (!dbUser.casino_enabled) throw new BadRequestException('Casino Games are restricted for your account.');
    }
    const playerLogin = user.userId;
    const url = await this.gregmornService.openGame(playerLogin, gameId, 'PKR', demo);
    return { url };
  }
}
