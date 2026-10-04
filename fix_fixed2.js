const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('src', function(err, results) {
  if (err) throw err;
  const files = results.filter(f => f.endsWith('.tsx') && !f.includes('admin'));
  
  for (let file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      // Fix inset-0
      if (content.includes('fixed inset-0') && !content.includes('inset-y-0 left-1/2')) {
          content = content.replace(/fixed inset-0/g, 'fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[400px]');
          changed = true;
      }
      
      // Fix BottomNav
      if (file.includes('BottomNav.tsx')) {
          if (content.includes('left-0 right-0')) {
              content = content.replace('left-0 right-0 w-full', 'left-1/2 -translate-x-1/2 w-full max-w-[400px]');
              changed = true;
          }
      }

      // Fix other bottom/top fixed elements
      if (content.includes('fixed bottom-0') && !content.includes('left-1/2')) {
          content = content.replace(/fixed bottom-0/g, 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px]');
          changed = true;
      }

      if (content.includes('fixed top-[45%] left-1')) {
          content = content.replace('fixed top-[45%] left-1 -translate-y-1/2', 'absolute top-[45%] left-1 -translate-y-1/2');
          changed = true;
      }
      if (content.includes('fixed top-[35%] sm:top-[40%] right-1')) {
          content = content.replace('fixed top-[35%] sm:top-[40%] right-1 -translate-y-1/2', 'absolute top-[35%] sm:top-[40%] right-1 -translate-y-1/2');
          changed = true;
      }
      if (content.includes('fixed bottom-[85px] right-4')) {
          content = content.replace('fixed bottom-[85px] right-4', 'absolute bottom-[85px] right-4');
          changed = true;
      }

      if (changed) {
          fs.writeFileSync(file, content);
          console.log('Fixed', file);
      }
  }
});
