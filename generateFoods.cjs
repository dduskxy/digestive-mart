const fs = require('fs');

const goodFoods = [
  { nameTh: 'แอปเปิล', nameEn: 'Apple', emoji: '🍎', cat: 'fruit', cals: 52, carbs: 14, p: 0.3, f: 0.2, fib: 2.4, sug: 10, gi: 36, w: 86 },
  { nameTh: 'กล้วย', nameEn: 'Banana', emoji: '🍌', cat: 'fruit', cals: 89, carbs: 23, p: 1.1, f: 0.3, fib: 2.6, sug: 12, gi: 51, w: 75 },
  { nameTh: 'บรอกโคลี', nameEn: 'Broccoli', emoji: '🥦', cat: 'vegetable', cals: 34, carbs: 6.6, p: 2.8, f: 0.4, fib: 2.6, sug: 1.7, gi: 15, w: 89 },
  { nameTh: 'แครอท', nameEn: 'Carrot', emoji: '🥕', cat: 'vegetable', cals: 41, carbs: 9.6, p: 0.9, f: 0.2, fib: 2.8, sug: 4.7, gi: 39, w: 88 },
  { nameTh: 'ข้าวกล้อง', nameEn: 'Brown Rice', emoji: '🍚', cat: 'carb', cals: 111, carbs: 23, p: 2.6, f: 0.9, fib: 1.8, sug: 0.4, gi: 50, w: 70 },
  { nameTh: 'อกไก่', nameEn: 'Chicken Breast', emoji: '🍗', cat: 'protein', cals: 165, carbs: 0, p: 31, f: 3.6, fib: 0, sug: 0, gi: 0, w: 65 },
  { nameTh: 'ไข่ต้ม', nameEn: 'Boiled Egg', emoji: '🥚', cat: 'protein', cals: 155, carbs: 1.1, p: 13, f: 11, fib: 0, sug: 1.1, gi: 0, w: 75 },
  { nameTh: 'ปลาแซลมอน', nameEn: 'Salmon', emoji: '🐟', cat: 'protein', cals: 208, carbs: 0, p: 20, f: 13, fib: 0, sug: 0, gi: 0, w: 65 },
  { nameTh: 'น้ำเปล่า', nameEn: 'Water', emoji: '💧', cat: 'drink', cals: 0, carbs: 0, p: 0, f: 0, fib: 0, sug: 0, gi: 0, w: 100 },
  { nameTh: 'สตรอว์เบอร์รี', nameEn: 'Strawberry', emoji: '🍓', cat: 'fruit', cals: 32, carbs: 7.7, p: 0.7, f: 0.3, fib: 2, sug: 4.9, gi: 40, w: 91 },
  { nameTh: 'มะเขือเทศ', nameEn: 'Tomato', emoji: '🍅', cat: 'vegetable', cals: 18, carbs: 3.9, p: 0.9, f: 0.2, fib: 1.2, sug: 2.6, gi: 15, w: 94 },
  { nameTh: 'ส้ม', nameEn: 'Orange', emoji: '🍊', cat: 'fruit', cals: 47, carbs: 12, p: 0.9, f: 0.1, fib: 2.4, sug: 9, gi: 40, w: 87 },
  { nameTh: 'องุ่น', nameEn: 'Grape', emoji: '🍇', cat: 'fruit', cals: 69, carbs: 18, p: 0.7, f: 0.2, fib: 0.9, sug: 15, gi: 46, w: 81 },
  { nameTh: 'อัลมอนด์', nameEn: 'Almond', emoji: '🌰', cat: 'fat', cals: 579, carbs: 21, p: 21, f: 49, fib: 12, sug: 4.4, gi: 15, w: 4 },
  { nameTh: 'กุ้ง', nameEn: 'Shrimp', emoji: '🦐', cat: 'protein', cals: 99, carbs: 0.2, p: 24, f: 0.3, fib: 0, sug: 0, gi: 0, w: 75 },
  { nameTh: 'นมจืด', nameEn: 'Plain Milk', emoji: '🥛', cat: 'drink', cals: 42, carbs: 5, p: 3.4, f: 1, fib: 0, sug: 5, gi: 27, w: 90 },
  { nameTh: 'คะน้า', nameEn: 'Kale', emoji: '🥬', cat: 'vegetable', cals: 22, carbs: 4, p: 2, f: 0.4, fib: 2, sug: 1, gi: 15, w: 92 },
  { nameTh: 'เห็ด', nameEn: 'Mushroom', emoji: '🍄', cat: 'vegetable', cals: 22, carbs: 3.3, p: 3.1, f: 0.3, fib: 1, sug: 2, gi: 10, w: 92 },
  { nameTh: 'อโวคาโด', nameEn: 'Avocado', emoji: '🥑', cat: 'fat', cals: 160, carbs: 8.5, p: 2, f: 15, fib: 6.7, sug: 0.7, gi: 15, w: 73 },
  { nameTh: 'เนื้อปลาทู', nameEn: 'Mackerel', emoji: '🐟', cat: 'protein', cals: 205, carbs: 0, p: 19, f: 14, fib: 0, sug: 0, gi: 0, w: 60 },
  { nameTh: 'มันเทศต้ม', nameEn: 'Boiled Sweet Potato', emoji: '🍠', cat: 'carb', cals: 86, carbs: 20, p: 1.6, f: 0.1, fib: 3, sug: 4.2, gi: 44, w: 77 },
  { nameTh: 'แคนตาลูป', nameEn: 'Cantaloupe', emoji: '🍈', cat: 'fruit', cals: 34, carbs: 8, p: 0.8, f: 0.2, fib: 0.9, sug: 8, gi: 65, w: 90 },
  { nameTh: 'เต้าหู้', nameEn: 'Tofu', emoji: '🧊', cat: 'protein', cals: 76, carbs: 1.9, p: 8, f: 4.8, fib: 0.3, sug: 0, gi: 15, w: 85 },
  { nameTh: 'แตงกวา', nameEn: 'Cucumber', emoji: '🥒', cat: 'vegetable', cals: 15, carbs: 3.6, p: 0.6, f: 0.1, fib: 0.5, sug: 1.7, gi: 15, w: 95 },
  { nameTh: 'ถั่วลันเตา', nameEn: 'Green Peas', emoji: '🫛', cat: 'vegetable', cals: 81, carbs: 14, p: 5, f: 0.4, fib: 5, sug: 5.7, gi: 48, w: 79 },
  { nameTh: 'ข้าวโอ๊ต', nameEn: 'Oats', emoji: '🥣', cat: 'carb', cals: 389, carbs: 66, p: 16.9, f: 6.9, fib: 10.6, sug: 0, gi: 55, w: 8 },
  { nameTh: 'เชอร์รี่', nameEn: 'Cherry', emoji: '🍒', cat: 'fruit', cals: 50, carbs: 12, p: 1, f: 0.3, fib: 1.6, sug: 8, gi: 22, w: 82 },
  { nameTh: 'ลูกพีช', nameEn: 'Peach', emoji: '🍑', cat: 'fruit', cals: 39, carbs: 9.5, p: 0.9, f: 0.3, fib: 1.5, sug: 8.4, gi: 28, w: 89 },
  { nameTh: 'หอมใหญ่', nameEn: 'Onion', emoji: '🧅', cat: 'vegetable', cals: 40, carbs: 9.3, p: 1.1, f: 0.1, fib: 1.7, sug: 4.2, gi: 10, w: 89 },
  { nameTh: 'กระเทียม', nameEn: 'Garlic', emoji: '🧄', cat: 'vegetable', cals: 149, carbs: 33, p: 6.4, f: 0.5, fib: 2.1, sug: 1, gi: 30, w: 59 },
  { nameTh: 'มะนาว', nameEn: 'Lemon', emoji: '🍋', cat: 'fruit', cals: 29, carbs: 9, p: 1.1, f: 0.3, fib: 2.8, sug: 2.5, gi: 20, w: 89 },
  { nameTh: 'สับปะรด', nameEn: 'Pineapple', emoji: '🍍', cat: 'fruit', cals: 50, carbs: 13, p: 0.5, f: 0.1, fib: 1.4, sug: 10, gi: 59, w: 86 },
  { nameTh: 'บลูเบอร์รี', nameEn: 'Blueberry', emoji: '🫐', cat: 'fruit', cals: 43, carbs: 10, p: 1.4, f: 0.5, fib: 5.3, sug: 4.9, gi: 25, w: 88 }
];

const badFoods = [
  { nameTh: 'เบอร์เกอร์', nameEn: 'Hamburger', emoji: '🍔', cat: 'carb', cals: 295, carbs: 24, p: 17, f: 14, fib: 1.5, sug: 5, gi: 66, w: 45 },
  { nameTh: 'เฟรนช์ฟรายส์', nameEn: 'French Fries', emoji: '🍟', cat: 'carb', cals: 312, carbs: 41, p: 3.4, f: 15, fib: 3.8, sug: 0.3, gi: 75, w: 39 },
  { nameTh: 'พิซซ่า', nameEn: 'Pizza', emoji: '🍕', cat: 'carb', cals: 266, carbs: 33, p: 11, f: 10, fib: 2.3, sug: 3.6, gi: 80, w: 48 },
  { nameTh: 'ไก่ทอด', nameEn: 'Fried Chicken', emoji: '🍗', cat: 'protein', cals: 320, carbs: 16, p: 18, f: 21, fib: 1, sug: 0, gi: 65, w: 42 },
  { nameTh: 'ฮอทดอก', nameEn: 'Hot Dog', emoji: '🌭', cat: 'protein', cals: 290, carbs: 18, p: 10, f: 20, fib: 0.8, sug: 4, gi: 68, w: 50 },
  { nameTh: 'ชานมไข่มุก', nameEn: 'Boba Tea', emoji: '🧋', cat: 'drink', cals: 350, carbs: 68, p: 1, f: 8, fib: 0, sug: 50, gi: 85, w: 80 },
  { nameTh: 'น้ำอัดลม', nameEn: 'Soda', emoji: '🥤', cat: 'drink', cals: 140, carbs: 39, p: 0, f: 0, fib: 0, sug: 39, gi: 65, w: 90 },
  { nameTh: 'ไอศกรีม', nameEn: 'Ice Cream', emoji: '🍦', cat: 'snack', cals: 207, carbs: 24, p: 3.5, f: 11, fib: 0.7, sug: 21, gi: 60, w: 61 },
  { nameTh: 'โดนัท', nameEn: 'Donut', emoji: '🍩', cat: 'snack', cals: 452, carbs: 51, p: 4.9, f: 25, fib: 1.5, sug: 27, gi: 76, w: 18 },
  { nameTh: 'เบคอน', nameEn: 'Bacon', emoji: '🥓', cat: 'fat', cals: 541, carbs: 1.4, p: 37, f: 42, fib: 0, sug: 0, gi: 0, w: 15 },
  { nameTh: 'ลูกอม', nameEn: 'Candy', emoji: '🍬', cat: 'snack', cals: 394, carbs: 98, p: 0, f: 0.2, fib: 0, sug: 63, gi: 70, w: 2 },
  { nameTh: 'ช็อกโกแลต', nameEn: 'Chocolate', emoji: '🍫', cat: 'snack', cals: 546, carbs: 61, p: 4.9, f: 31, fib: 7, sug: 48, gi: 45, w: 1 },
  { nameTh: 'อมยิ้ม', nameEn: 'Lollipop', emoji: '🍭', cat: 'snack', cals: 394, carbs: 98, p: 0, f: 0.2, fib: 0, sug: 63, gi: 70, w: 2 },
  { nameTh: 'คุกกี้', nameEn: 'Cookie', emoji: '🍪', cat: 'snack', cals: 502, carbs: 66, p: 5, f: 25, fib: 1.2, sug: 33, gi: 64, w: 3 },
  { nameTh: 'เค้ก', nameEn: 'Cake', emoji: '🍰', cat: 'snack', cals: 371, carbs: 53, p: 5.3, f: 15, fib: 0.9, sug: 38, gi: 68, w: 25 },
  { nameTh: 'พาย', nameEn: 'Pie', emoji: '🥧', cat: 'snack', cals: 237, carbs: 34, p: 2.4, f: 11, fib: 1, sug: 12, gi: 65, w: 45 },
  { nameTh: 'ครัวซองต์', nameEn: 'Croissant', emoji: '🥐', cat: 'carb', cals: 406, carbs: 46, p: 8.2, f: 21, fib: 2.6, sug: 11, gi: 74, w: 22 },
  { nameTh: 'ขนมปังขาว', nameEn: 'White Bread', emoji: '🍞', cat: 'carb', cals: 265, carbs: 49, p: 9, f: 3.2, fib: 2.7, sug: 5, gi: 71, w: 36 },
  { nameTh: 'ป็อปคอร์นโรงหนัง', nameEn: 'Cinema Popcorn', emoji: '🍿', cat: 'snack', cals: 500, carbs: 57, p: 6, f: 28, fib: 5, sug: 0, gi: 65, w: 4 },
  { nameTh: 'สเต็กติดมัน', nameEn: 'Fatty Steak', emoji: '🥩', cat: 'protein', cals: 271, carbs: 0, p: 25, f: 19, fib: 0, sug: 0, gi: 0, w: 55 },
  { nameTh: 'ไส้กรอกหมู', nameEn: 'Pork Sausage', emoji: '🌭', cat: 'protein', cals: 301, carbs: 1.5, p: 14, f: 26, fib: 0, sug: 0, gi: 0, w: 54 },
  { nameTh: 'น้ำผลไม้กล่อง', nameEn: 'Boxed Juice', emoji: '🧃', cat: 'drink', cals: 110, carbs: 26, p: 0.5, f: 0, fib: 0.2, sug: 24, gi: 50, w: 88 },
  { nameTh: 'เบียร์', nameEn: 'Beer', emoji: '🍺', cat: 'drink', cals: 153, carbs: 13, p: 1.6, f: 0, fib: 0, sug: 0, gi: 89, w: 92 },
  { nameTh: 'แพนเค้ก', nameEn: 'Pancakes', emoji: '🥞', cat: 'carb', cals: 227, carbs: 28, p: 6.4, f: 9.7, fib: 0, sug: 4.3, gi: 67, w: 43 },
  { nameTh: 'วาฟเฟิล', nameEn: 'Waffle', emoji: '🧇', cat: 'carb', cals: 291, carbs: 33, p: 6.9, f: 14, fib: 1.3, sug: 2, gi: 76, w: 43 },
  { nameTh: 'บะหมี่กึ่งสำเร็จรูป', nameEn: 'Instant Noodles', emoji: '🍜', cat: 'carb', cals: 380, carbs: 55, p: 8, f: 14, fib: 2, sug: 1, gi: 70, w: 5 },
  { nameTh: 'ข้าวเหนียวหมูทอด', nameEn: 'Sticky Rice with Fried Pork', emoji: '🍚', cat: 'carb', cals: 600, carbs: 70, p: 15, f: 25, fib: 2, sug: 2, gi: 80, w: 45 },
  { nameTh: 'ข้าวมันไก่', nameEn: 'Khao Man Gai', emoji: '🍛', cat: 'carb', cals: 500, carbs: 60, p: 20, f: 20, fib: 1, sug: 2, gi: 70, w: 60 },
  { nameTh: 'มันฝรั่งแผ่นทอด', nameEn: 'Potato Chips', emoji: '🥔', cat: 'snack', cals: 536, carbs: 53, p: 7, f: 35, fib: 3, sug: 0, gi: 56, w: 2 },
  { nameTh: 'ทาโก้', nameEn: 'Taco', emoji: '🌮', cat: 'carb', cals: 226, carbs: 20, p: 9, f: 12, fib: 3, sug: 1.5, gi: 60, w: 45 },
  { nameTh: 'เบอร์ริโต', nameEn: 'Burrito', emoji: '🌯', cat: 'carb', cals: 320, carbs: 35, p: 12, f: 14, fib: 4, sug: 2, gi: 65, w: 45 },
  { nameTh: 'เนยแข็ง', nameEn: 'Cheese', emoji: '🧀', cat: 'fat', cals: 402, carbs: 1.3, p: 25, f: 33, fib: 0, sug: 0.5, gi: 0, w: 37 },
  { nameTh: 'หมูกระทะ', nameEn: 'Thai BBQ Pork', emoji: '🥩', cat: 'protein', cals: 450, carbs: 5, p: 30, f: 35, fib: 0, sug: 5, gi: 0, w: 40 }
];

let nextId = 1;

function generateFoodString(item, isGood) {
  const healthTag = isGood ? 'excellent' : 'avoid';
  const desc = isGood ? item.nameTh + " อุดมไปด้วยสารอาหารที่มีประโยชน์ ช่วยให้ร่างกายแข็งแรง" : item.nameTh + " อร่อยแต่มีน้ำตาลหรือไขมันสูง ควรกินในปริมาณที่พอเหมาะ";
  const digestTip = isGood ? "กากใยช่วยทำความสะอาดลำไส้และดูดซึมได้ดี" : "อาจทำให้กระเพาะและลำไส้ทำงานหนัก หากกินเยอะเกินไป";

  return "  {\n" +
    "    id: \"f" + (nextId++) + "\",\n" +
    "    nameTh: \"" + item.nameTh + "\",\n" +
    "    nameEn: \"" + item.nameEn + "\",\n" +
    "    emoji: \"" + item.emoji + "\",\n" +
    "    category: \"" + item.cat + "\",\n" +
    "    calories: " + item.cals + ",\n" +
    "    carbsG: " + item.carbs + ",\n" +
    "    proteinG: " + item.p + ",\n" +
    "    fatG: " + item.f + ",\n" +
    "    fiberG: " + item.fib + ",\n" +
    "    sugarG: " + item.sug + ",\n" +
    "    giIndex: " + item.gi + ",\n" +
    "    waterContentPct: " + item.w + ",\n" +
    "    price: " + (Math.floor(Math.random() * 50) + 10) + ",\n" +
    "    healthTag: \"" + healthTag + "\",\n" +
    "    description: \"" + desc + "\",\n" +
    "    digestTip: \"" + digestTip + "\"\n" +
    "  }";
}

const lines = [];
lines.push("export type FoodCategory = 'fruit' | 'vegetable' | 'protein' | 'carb' | 'fat' | 'drink' | 'snack' | 'dairy';");
lines.push("export type HealthTag = 'excellent' | 'good' | 'moderate' | 'avoid';\n");

lines.push("export interface FoodItem {\n" +
"  id: string;\n" +
"  nameTh: string;\n" +
"  nameEn: string;\n" +
"  emoji: string;\n" +
"  category: FoodCategory;\n" +
"  calories: number;\n" +
"  carbsG: number;\n" +
"  proteinG: number;\n" +
"  fatG: number;\n" +
"  fiberG: number;\n" +
"  sugarG: number;\n" +
"  giIndex: number;\n" +
"  waterContentPct: number;\n" +
"  price: number;\n" +
"  healthTag: HealthTag;\n" +
"  description: string;\n" +
"  digestTip: string;\n" +
"}\n");

lines.push("export const marketFoods: FoodItem[] = [");

const allFoodStrings = [];
goodFoods.forEach(f => allFoodStrings.push(generateFoodString(f, true)));
badFoods.forEach(f => allFoodStrings.push(generateFoodString(f, false)));

lines.push(allFoodStrings.join(',\n'));
lines.push("];\n");
lines.push("export const foods = marketFoods;\n");

fs.writeFileSync('./src/data/foods.ts', lines.join('\n'));
console.log('Successfully generated foods.ts with ' + allFoodStrings.length + ' items.');
