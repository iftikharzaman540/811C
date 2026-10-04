const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Replace exact string matches
            content = content.replace(/"\/api\/v1"/g, '"https://8111c.com/api/v1"');
            content = content.replace(/'\/api\/v1\//g, "'https://8111c.com/api/v1/");
            
            // For WithdrawScreen which still has localhost fallback
            content = content.replace(/"http:\/\/localhost:4000\/api\/v1"/g, '"https://8111c.com/api/v1"');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

replaceInDir('src');
console.log('Global API URL patch complete.');
