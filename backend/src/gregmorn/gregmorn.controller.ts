import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { GregmornService } from './gregmorn.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/v1/games/gregmorn')
export class GregmornController {
  constructor(private readonly gregmornService: GregmornService) {}

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
    // Generate a unique player login based on user ID to avoid collisions
    const playerLogin = user.userId;
    const url = await this.gregmornService.openGame(playerLogin, gameId, 'PKR', demo);
    return { url };
  }
}
