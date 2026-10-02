const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && node -e "const { NestFactory } = require(\\'@nestjs/core\\'); const { AppModule } = require(\\'./dist/app.module\\'); async function bootstrap() { const app = await NestFactory.createApplicationContext(AppModule); const service = app.get(\\'AdminUsersService\\'); try { await service.updateUser(\\'37102039-9251-434e-a443-54340c99e578\\', { casino_enabled: false }, \\'37102039-9251-434e-a443-54340c99e578\\'); console.log(\\'UPDATE SUCCESS\\'); } catch(e) { console.error(\\'UPDATE ERROR:\\', e); } process.exit(0); } bootstrap();"', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});