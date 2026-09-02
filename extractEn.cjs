const fs = require('fs');
const content = fs.readFileSync('src/data/foods.ts', 'utf-8');
const matches = [];
const regex = /nameEn:\s*["']([^"']+)["']/g;
let match;
while ((match = regex.exec(content)) !== null) {
  matches.push(match[1]);
}
console.log(JSON.stringify(matches, null, 2));
