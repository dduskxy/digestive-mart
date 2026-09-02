import fs from 'fs';
const content = fs.readFileSync('src/data/foods.ts', 'utf-8');
const matches = [...content.matchAll(/nameTh:\s*['"]([^'"]+)['"],\s*nameEn:\s*['"]([^'"]+)['"],\s*emoji:\s*['"]([^'"]+)['"]/g)];
matches.forEach((m, i) => {
  console.log([]  () -> );
});
