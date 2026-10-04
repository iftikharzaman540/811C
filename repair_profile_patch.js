const fs = require("fs");
let authCtrl = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", "utf8");

if (!authCtrl.includes("@Patch('profile')")) {
  const patchCode = `
  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.authService.updateProfile(user.userId, body);
  }
`;
  authCtrl = authCtrl.replace("import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards", "import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Patch");
  authCtrl = authCtrl.replace(/  @HttpCode\(HttpStatus\.OK\)\n  @Post\('logout'\)/, patchCode + "\n  @HttpCode(HttpStatus.OK)\n  @Post('logout')");
  fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", authCtrl);
  console.log("Profile patch added back");
}
