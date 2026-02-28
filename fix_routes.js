const fs = require('fs');
const path = require('path');
function walk(dir) {
  for (let f of fs.readdirSync(dir)) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) {
      let code = fs.readFileSync(p, 'utf8');
      let changed = false;
      if (code.includes('export default U;serRouter;')) {
         code = code.replace(/export default U;serRouter;/g, 'export default UserRouter;');
         changed = true;
      }
      if (code.includes('export default u;serrouter;')) {
         code = code.replace(/export default u;serrouter;/g, 'export default userrouter;');
         changed = true;
      }
      if (code.includes('export default r;outer;')) {
         code = code.replace(/export default r;outer;/g, 'export default router;');
         changed = true;
      }
      if (changed) fs.writeFileSync(p, code);
    }
  }
}
walk('route');
