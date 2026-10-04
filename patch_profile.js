const fs = require('fs');

// Patch auth.service.ts
const servicePath = '/var/www/gaming-app/backend/src/auth/auth.service.ts';
let serviceCode = fs.readFileSync(servicePath, 'utf8');

if (!serviceCode.includes('updateProfile')) {
    const insertIdx = serviceCode.lastIndexOf('}');
    const fn = `
  async updateProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.facebook !== undefined) updateData.facebook = data.facebook;
    if (data.telegram !== undefined) updateData.telegram = data.telegram;
    if (data.twitter !== undefined) updateData.twitter = data.twitter;
    if (data.date_of_birth !== undefined) updateData.date_of_birth = new Date(data.date_of_birth);
    
    if (data.username) {
       const existing = await this.prisma.user.findFirst({ where: { username: data.username, id: { not: userId } } });
       if (existing) throw new ConflictException('Display name (username) already taken');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    
    return user;
  }
`;
    serviceCode = serviceCode.substring(0, insertIdx) + fn + serviceCode.substring(insertIdx);
    fs.writeFileSync(servicePath, serviceCode);
    console.log("Patched service");
}

// Patch auth.controller.ts
const controllerPath = '/var/www/gaming-app/backend/src/auth/auth.controller.ts';
let controllerCode = fs.readFileSync(controllerPath, 'utf8');

if (!controllerCode.includes('updateProfile')) {
    const insertIdx = controllerCode.lastIndexOf('}');
    const fn = `
  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update user profile details' })
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.authService.updateProfile(user.userId, body);
  }
`;
    // also import Patch
    if (!controllerCode.includes('Patch,')) {
       controllerCode = controllerCode.replace(/import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards }/, "import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Patch }");
    }
    
    controllerCode = controllerCode.substring(0, insertIdx) + fn + controllerCode.substring(insertIdx);
    fs.writeFileSync(controllerPath, controllerCode);
    console.log("Patched controller");
}
