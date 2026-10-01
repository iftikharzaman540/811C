const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.controller.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('backend/src/admin');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /import \{ JwtAuthGuard \} from '..\/..\/auth\/jwt-auth.guard';/g,
    "import { AuthGuard } from '@nestjs/passport';"
  );
  
  content = content.replace(
    /import \{ RolesGuard \} from '..\/..\/auth\/roles.guard';/g,
    "import { RolesGuard } from '../../auth/guards/roles.guard';"
  );

  content = content.replace(
    /import \{ Roles \} from '..\/..\/auth\/roles.decorator';/g,
    "import { Roles } from '../../auth/decorators/roles.decorator';"
  );
  
  content = content.replace(/JwtAuthGuard/g, "AuthGuard('jwt')");
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
