const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /var/www/gaming-app/backend/src/app.module.ts', (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      // Remove GregmornModule from the bottom
      data = data.replace('    QueuesModule,\n    GregmornModule', '    QueuesModule');
      
      // Add GregmornModule to the top
      data = data.replace('    PrismaModule,', '    GregmornModule,\n    PrismaModule,');
      
      const remoteFile = '/var/www/gaming-app/backend/src/app.module.ts';
      
      conn.sftp((err, sftp) => {
        if (err) throw err;
        const localFile = 'patch-app-module.ts';
        require('fs').writeFileSync(localFile, data);
        sftp.fastPut(localFile, remoteFile, (err) => {
          if (err) throw err;
          conn.exec("cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err2, stream2) => {
            stream2.on('data', d => console.log(d.toString()));
            stream2.stderr.on('data', d => console.error(d.toString()));
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
