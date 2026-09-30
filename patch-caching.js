const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts', (err, stream) => {
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      
      // Add cache properties
      data = data.replace(
        'private tokenExpiry: number = 0;',
        'private tokenExpiry: number = 0;\n  private cachedGames: any = null;\n  private cachedGamesExpiry: number = 0;'
      );

      // Modify getGames
      const getGamesStart = data.indexOf("async getGames(currency: string = 'PKR', retry: boolean = true) {");
      const tryBlockStart = data.indexOf("const token = await this.login();", getGamesStart);
      
      const newGetGames = `async getGames(currency: string = 'PKR', retry: boolean = true) {
    if (this.cachedGames && Date.now() < this.cachedGamesExpiry) {
      return this.cachedGames;
    }
    const token = await this.login();`;

      data = data.substring(0, getGamesStart) + newGetGames + data.substring(tryBlockStart + 33);
      
      // Cache the result
      data = data.replace(
        'return Array.isArray(data) ? data.filter((g: any) => g.isEnabled) : data;',
        `const result = Array.isArray(data) ? data.filter((g: any) => g.isEnabled) : data;
      this.cachedGames = result;
      this.cachedGamesExpiry = Date.now() + 60 * 60 * 1000; // 1 hour cache
      return result;`
      );

      require('fs').writeFileSync('patch-service.js', data);

      conn.sftp((err, sftp) => {
        sftp.fastPut('patch-service.js', '/var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts', () => {
          conn.exec('cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend', (err, stream2) => {
            stream2.on('data', d => console.log(d.toString()));
            stream2.on('close', () => conn.end());
          });
        });
      });
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
