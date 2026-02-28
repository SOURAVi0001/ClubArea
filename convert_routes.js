const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace requires with imports
      content = content.replace(/const\s+(.+?)\s*=\s*require\((['"])(.*?)\2\);?/g, (match, vars, quote, modulePath) => {
        if (vars.includes('{')) {
          return `import ${vars} from '${modulePath}';`;
        }
        if (modulePath.includes('../controllers/')) {
          return `import * as ${vars} from '${modulePath}';`;
        }
        return `import ${vars} from '${modulePath}';`;
      });

      // Fix module.exports
      content = content.replace(/module\.exports\s*=\s*(.+?);?/g, 'export default $1;');

      // Fix req, res for inline callbacks
      content = content.replace(/async\s*\(\s*req\s*,\s*res\s*\)\s*=>/g, 'async (req: express.Request, res: express.Response) =>');
      content = content.replace(/\b\(\s*req\s*,\s*res\s*\)\s*=>/g, '(req: express.Request, res: express.Response) =>');

      // Check if `express` is imported when explicitly typing inline callbacks
      if (content.includes('express.Request') && !content.includes("from 'express'")) {
         content = `import express from 'express';\n` + content;
      }

      const newPath = fullPath.replace(/\.js$/, '.ts');
      fs.writeFileSync(newPath, content);
      fs.unlinkSync(fullPath);
      console.log(`Converted ${newPath}`);
    }
  }
}

try {
  processDir(path.join(__dirname, 'route'));
  console.log("Success");
} catch(e) {
  console.error(e);
}
