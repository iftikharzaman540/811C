const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/var/www/gaming-app/backend/patch_auth.js');
    writeStream.write(`
const fs = require('fs');
let code = fs.readFileSync('/var/www/gaming-app/backend/src/auth/auth.controller.ts', 'utf8');

const badRegex = /@HttpCode\\(HttpStatus\\.OK\\)\\s*@Post\\('login'\\)[\\s\\S]*?async login\\(@Body\\(\\) loginDto: LoginDto\\) \\{\\s*return this\\.authService\\.login\\(loginDto\\);\\s*\\}/;

const fixedCode = \`  @HttpCode(HttpStatus.OK)
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
  }\`;

code = code.replace(badRegex, fixedCode);

fs.writeFileSync('/var/www/gaming-app/backend/src/auth/auth.controller.ts', code);
console.log("Patched auth.controller.ts successfully");
`);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('cd /var/www/gaming-app/backend && node patch_auth.js && npm run build && pm2 restart gaming-backend', (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
