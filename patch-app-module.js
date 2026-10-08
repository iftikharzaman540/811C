const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i 's/import { GregmornModule } from .\\/gregmorn\\/gregmorn.module.;/import { GregmornModule } from \".\\/gregmorn\\/gregmorn.module\";\\nimport { SlotegratorModule } from \".\\/slotegrator\\/slotegrator.module\";/g' /var/www/gaming-app/backend/src/app.module.ts && sed -i 's/GregmornModule,/GregmornModule,\\n    SlotegratorModule,/g' /var/www/gaming-app/backend/src/app.module.ts", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
