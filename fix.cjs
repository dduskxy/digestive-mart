const fs = require('fs');
let c = fs.readFileSync('src/styles/main.css', 'utf8');
c = '@import "./backgrounds.css";\n' + c;
fs.writeFileSync('src/styles/main.css', c, 'utf8');
