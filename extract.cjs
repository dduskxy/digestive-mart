const fs = require('fs');
const content = fs.readFileSync('src/data/foods.ts', 'utf-8');
const matches = [];
const regex = /nameTh:\s*["']([^"']+)["']/g;
let match;
while ((match = regex.exec(content)) !== null) {
  matches.push(match[1]);
}
fs.writeFileSync('items.json', JSON.stringify(matches, null, 2));
console.log(matches.length);
