const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`cat /var/www/gaming-app/backend/src/auth/auth.controller.ts`, (err, stream) => { 
    let content = '';
    stream.on('data', d => content += d.toString()); 
    stream.on('close', () => {
       const newLogout = `
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Logout user (Invalidate session)' })
  async logout(@CurrentUser() user: any) {
    await this.service.logout(user.userId, user.sessionId);
    return { message: 'Successfully logged out' };
  }`;
       content = content.replace(/@Post\('logout'\)[\s\S]*?\{[\s\S]*?message: 'Successfully logged out' \};\s*\}/, newLogout.trim());
       
       conn.exec(`cat > /var/www/gaming-app/backend/src/auth/auth.controller.ts`, (err2, stream2) => {
         stream2.write(content);
         stream2.end();
         console.log("auth.controller.ts updated");
         conn.end();
       });
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
