import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Support')
@Controller('api/v1/support')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('chat')
  @ApiOperation({ summary: 'Get active live chat history' })
  getChat(@Req() req: any) {
    return this.supportService.getChatHistory(req.user.userId);
  }

  @Post('chat/message')
  @ApiOperation({ summary: 'Send a message in live chat' })
  sendMessage(@Req() req: any, @Body() body: { message: string, attachment?: string }) {
    return this.supportService.sendMessage(req.user.userId, body.message, body.attachment);
  }
}
