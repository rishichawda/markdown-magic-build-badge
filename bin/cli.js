#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function generateHook(dest) {
    const hook = require('./hooks').postCheckout;
    fs.writeFileSync(path.join(path.resolve(dest),'post-checkout'), hook.trim());
    return path.join(path.resolve(dest),'post-checkout');
 }

 function attachHook(src) {
     const dest = path.resolve(`.git/hooks/post-checkout`);
     if (fs.existsSync(dest)) {
       console.err(`A post-checkout hook already exists!`);
       return;
     }
     try {
       fs.copyFileSync(src, dest);
       fs.access(dest, fs.constants.X_OK, function(err) {
         err && fs.chmodSync(dest, 0755);
       });
       console.log(`post-checkout hook successfully installed!`);
       return 0;
     } catch (err) {
       console.error(`error installing post-checkout hook!`);
       console.error(err);
     }
 }

const [,, ...args] = process.argv

switch (args[0]) {
    case '-h':
        generateHook();
        break;
    case '-ah':
        const src = generateHook();
        attachHook(src);
        break;
    default:
        break;
}