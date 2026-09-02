import fs from 'fs';
let content = fs.readFileSync('src/data/foods.ts', 'utf-8');

content = content.replace(/nameTh: "มันฝรั่งแผ่นทอด",\s*nameEn: "Potato Chips",\s*emoji: "🥔"/, 'nameTh: "มันฝรั่งแผ่นทอด",\n    nameEn: "Potato Chips",\n    emoji: "🍘"');
content = content.replace(/nameTh: "ข้าวเหนียวหมูทอด",\s*nameEn: "Sticky Rice with Fried Pork",\s*emoji: "🍚"/, 'nameTh: "ข้าวเหนียวหมูทอด",\n    nameEn: "Sticky Rice with Fried Pork",\n    emoji: "🍢"');
content = content.replace(/nameTh: "ข้าวมันไก่",\s*nameEn: "Khao Man Gai",\s*emoji: "🍛"/, 'nameTh: "ข้าวมันไก่",\n    nameEn: "Khao Man Gai",\n    emoji: "🥡"');

fs.writeFileSync('src/data/foods.ts', content);
