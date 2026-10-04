const fs = require('fs');
let content = fs.readFileSync('src/auth/auth.service.ts', 'utf8');
if (!content.includes('async resetPassword')) {
  let insertIdx = content.indexOf('async register');
  let newFunc = '  async resetPassword(identifier: string, newPassword: string) {\\n' +
                '    const user = await this.prisma.user.findFirst({\\n' +
                '      where: {\\n' +
                '        OR: [\\n' +
                '          { phone: identifier },\\n' +
                '          { email: identifier },\\n' +
                '          { username: identifier }\\n' +
                '        ]\\n' +
                '      }\\n' +
                '    });\\n' +
                '    if (!user) throw new NotFoundException(\\'User not found\\');\\n' +
                '    const hashedPassword = await bcrypt.hash(newPassword, 10);\\n' +
                '    await this.prisma.user.update({\\n' +
                '      where: { id: user.id },\\n' +
                '      data: { password_hash: hashedPassword }\\n' +
                '    });\\n' +
                '    return { success: true, message: \\'Password updated successfully\\' };\\n' +
                '  }\\n\\n';
  content = content.substring(0, insertIdx) + newFunc + content.substring(insertIdx);
  fs.writeFileSync('src/auth/auth.service.ts', content);
}
