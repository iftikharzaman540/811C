const fs = require('fs');

// Patch AuthService
let content = fs.readFileSync('src/auth/auth.service.ts', 'utf8');
if (!content.includes('resetPassword')) {
  let insertIdx = content.indexOf('async register');
  let newFunc = `
  async resetPassword(identifier: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
          { username: identifier }
        ]
      }
    });
    if (!user) throw new Error('User not found');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword }
    });
    return { success: true, message: 'Password updated successfully' };
  }\n
`;
  content = content.substring(0, insertIdx) + newFunc + content.substring(insertIdx);
  fs.writeFileSync('src/auth/auth.service.ts', content);
}

// Patch AuthController
let ctrl = fs.readFileSync('src/auth/auth.controller.ts', 'utf8');
if (!ctrl.includes('reset-password')) {
  let insertIdxCtrl = ctrl.indexOf('async login');
  let newCtrlFunc = `
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password without OTP (demo)' })
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.identifier, body.password);
  }\n
`;
  ctrl = ctrl.substring(0, insertIdxCtrl) + newCtrlFunc + ctrl.substring(insertIdxCtrl);
  fs.writeFileSync('src/auth/auth.controller.ts', ctrl);
}
console.log("Patch applied");
