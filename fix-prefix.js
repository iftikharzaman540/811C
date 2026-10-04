const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

walk('backend/src/admin').forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes("@Controller('admin")) {
    c = c.replace(/@Controller\('admin/g, "@Controller('api/v1/admin");
    fs.writeFileSync(f, c);
    console.log('Fixed', f);
  }
});
