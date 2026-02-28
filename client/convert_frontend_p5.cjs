const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (let f of fs.readdirSync(dir)) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else {
      let isJsx = false;
      if (p.endsWith('.jsx')) {
        fs.renameSync(p, p.replace('.jsx', '.tsx'));
      } else if (p.endsWith('.js') && !p.includes('vite.config')) {
        const content = fs.readFileSync(p, 'utf-8');
        if (content.includes('from "react"') || content.includes("from 'react'") || (content.includes('</') && content.includes('>'))) {
          isJsx = true;
        }
        fs.renameSync(p, p.replace('.js', isJsx ? '.tsx' : '.ts'));
      }
    }
  }
}

// Convert Phase 5 folders:
const foldersToConvert = ['src/utils', 'src/lib', 'src/hooks', 'src/queries', 'src/services', 'src/stores'];
for (const folder of foldersToConvert) {
  if (fs.existsSync(folder)) {
    walk(folder);
  }
}
console.log('Phase 5 directories renamed');
