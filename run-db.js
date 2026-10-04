const { Client } = require('ssh2');
const conn = new Client();
const script = `
set -e

echo "1. Installing PostgreSQL..."
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib

echo "2. Configuring Database..."
sudo -u postgres psql -c "CREATE DATABASE gaming_db;" || true
sudo -u postgres psql -c "CREATE USER gaming_user WITH ENCRYPTED PASSWORD 'GamingSecure2026!';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gaming_db TO gaming_user;"
sudo -u postgres psql -c "ALTER DATABASE gaming_db OWNER TO gaming_user;"
sudo -u postgres psql -d gaming_db -c "GRANT ALL ON SCHEMA public TO gaming_user;"

echo "3. Updating Backend .env..."
cd /var/www/gaming-app/backend
if [ -f .env ]; then
  sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://gaming_user:GamingSecure2026!@localhost:5432/gaming_db?schema=public"|' .env
else
  echo 'DATABASE_URL="postgresql://gaming_user:GamingSecure2026!@localhost:5432/gaming_db?schema=public"' > .env
fi

echo "4. Pushing Prisma Schema to Local DB..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "5. Seeding Admin User (if any)..."
npm run seed || true

echo "6. Restarting Backend..."
pm2 restart gaming-backend
`;

conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
  });
}).connect({ host: '169.58.50.184', port: 22, username: 'root', password: 'Iftkharzaman' });
