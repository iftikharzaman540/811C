const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`cat /var/www/gaming-app/backend/src/auth/auth.service.ts`, (err, stream) => { 
    let content = '';
    stream.on('data', d => content += d.toString()); 
    stream.on('close', () => {
       const newGenerateTokens = `
  private async generateTokens(userId: string, role: string) {
    // 1. Invalidate previous active sessions
    await this.prisma.session.updateMany({
      where: { user_id: userId, is_active: true },
      data: { is_active: false, status: 'CLOSED' }
    });

    // 2. Create new session
    const session = await this.prisma.session.create({
      data: {
        user_id: userId,
        session_token: require('crypto').randomUUID(),
        is_active: true,
        provider: 'LOCAL',
        status: 'ACTIVE'
      }
    });

    const payload = { sub: userId, role, sessionId: session.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }`;
       content = content.replace(/private async generateTokens\(userId: string, role: string\) \{[\s\S]*?expiresIn: '30d' \}\),\s*\};\s*\}/, newGenerateTokens.trim());
       
       const newLogout = `
  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.prisma.session.updateMany({
        where: { id: sessionId },
        data: { is_active: false, status: 'CLOSED' }
      });
    } else {
      await this.prisma.session.updateMany({
        where: { user_id: userId, is_active: true },
        data: { is_active: false, status: 'CLOSED' }
      });
    }
  }`;
       if (!content.includes('async logout(userId')) {
         content = content.replace(/async updateProfile\(/, newLogout + '\n\n  async updateProfile(');
       }
       
       conn.exec(`cat > /var/www/gaming-app/backend/src/auth/auth.service.ts`, (err2, stream2) => {
         stream2.write(content);
         stream2.end();
         console.log("auth.service.ts updated");
         conn.end();
       });
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
