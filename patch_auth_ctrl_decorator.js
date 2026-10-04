const fs = require('fs');
let code = fs.readFileSync('/var/www/gaming-app/backend/src/auth/auth.controller.ts', 'utf8');

// The file currently looks like:
/*
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login with email/phone/username and get JWT' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password without OTP (demo)' })
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.identifier, body.password);
  }

async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
*/

const badCode = `  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login with email/phone/username and get JWT' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password without OTP (demo)' })
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.identifier, body.password);
  }

async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }`;

const fixedCode = `  @HttpCode(HttpStatus.OK)
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
  }`;

code = code.replace(badCode, fixedCode);

fs.writeFileSync('/var/www/gaming-app/backend/src/auth/auth.controller.ts', code);
console.log("Patched auth.controller.ts successfully");
