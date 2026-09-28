const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx', { cwd: 'd:/Gaming app/app-client', absolute: true });

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('169.58.50.184')) {
    code = code.replace(
      /const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/169\.58\.50\.184:4000\/api\/v1";/g,
      'const API_URL = "/api/v1";'
    );
    fs.writeFileSync(file, code);
    console.log("Patched " + file);
  }
});
