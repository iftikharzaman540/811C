import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and create their wallet' })
  @ApiResponse({ status: 201, description: 'User successfully registered with Wallet.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  async register(@Body() registerDto: RegisterDto) {
    if (!registerDto.email && !registerDto.phone && !registerDto.username) {
      throw new Error('Either username, email or phone is required');
    }
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login with email/phone/username and get JWT' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password without OTP (demo)' })
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.identifier, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT Access Token' })
  @ApiBody({ schema: { type: 'object', properties: { refresh_token: { type: 'string' } } } })
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current logged in user profile' })
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Logout user (Client should discard token)' })
  async logout() {
    return { message: 'Successfully logged out' };
  }
}
