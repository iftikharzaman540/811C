const fs = require("fs");
let authService = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", "utf8");

if (!authService.includes("async changePassword(userId")) {
  const newMethod = `
  async changePassword(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    
    const isMatch = await bcrypt.compare(data.oldPassword, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Incorrect old password');
    
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedPassword }
    });
    
    return { success: true, message: 'Password changed successfully' };
  }
`;
  authService = authService.replace(/  async updateProfile\(/, newMethod + "\n  async updateProfile(");
  fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", authService);
  console.log("Added changePassword to auth.service.ts");
} else {
  console.log("changePassword already exists in auth.service.ts");
}

let authCtrl = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", "utf8");
if (!authCtrl.includes("@Patch('password')")) {
  const newEndpoint = `
  @Patch('password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(@CurrentUser() user: any, @Body() body: any) {
    if (!body.oldPassword || !body.newPassword) throw new Error('oldPassword and newPassword are required');
    return this.authService.changePassword(user.userId, body);
  }
`;
  authCtrl = authCtrl.replace(/  @Patch\('profile'\)/, newEndpoint + "\n  @Patch('profile')");
  fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", authCtrl);
  console.log("Added password patch endpoint to auth.controller.ts");
} else {
  console.log("Password endpoint already exists in auth.controller.ts");
}
