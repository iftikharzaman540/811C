const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/admin/admin-users/admin-users.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = \`    if (!user) throw new NotFoundException('User not found');
    return user;
  }\`;

const replaceStr = \`    if (!user) throw new NotFoundException('User not found');

    const withdrawals = await this.prisma.payment.aggregate({
      where: { user_id: id, type: 'WITHDRAWAL', status: 'COMPLETED' },
      _sum: { amount: true }
    });
    
    (user as any).total_withdrawn = Number(withdrawals._sum.amount || 0);

    return user;
  }\`;

if (content.includes("if (!user) throw new NotFoundException('User not found');\\n    return user;\\n  }")) {
  content = content.replace("if (!user) throw new NotFoundException('User not found');\\n    return user;\\n  }", replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched admin-users.service.ts successfully');
} else {
  console.log('Could not find target string in admin-users.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-admin-users.js\n${patchScript}\nEOF\nnode /tmp/patch-admin-users.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
