# Digestion Mart: The Body Quest (มินิมาร์ทนักย่อยผจญภัย)

An interactive, educational web game teaching digestion and food hygiene to students aged 9–12 (Thai primary school science curriculum Prathom 4-6).

## Features
- 🎮 **5 Interactive Learning Stages**: 
  1. Welcome (avatar selection & introduction)
  2. Hygiene Challenge (handwashing education)
  3. Supermarket (nutritional food choices)
  4. Digestion Journey (5 mini-games simulating digestive process)
  5. Health Verdict (personalized health report)
- 📚 **Science-Based Learning**: Each minigame teaches real digestive/nutritional science
- 🍎 **Food Education**: 50+ Thai foods with accurate nutritional data
- 🎨 **Engaging UI**: Glassmorphism design, colorful animations, kid-friendly interface
- 🔊 **Sound Effects**: Generated via Web Audio API (no external audio files)
- ⌨️ **Fully Keyboard Accessible**: 100% playable with mouse/keyboard only
- 💾 **Progress Tracking**: Scores saved locally, leaderboard support

## Tech Stack
- Vanilla TypeScript
- Vite
- Tailwind CSS v4 (with @theme design system)
- Canvas Confetti
- Web Audio API (all sound synthesis)
- Zero external asset files (no images, no audio files)

## Project Architecture

### Game Flow
```
Welcome (Avatar) → Hygiene Challenge → Supermarket → 
Digestion Journey (5 stages) → Health Verdict → Leaderboard
```

### Stage Details

**Stage 1: Epic Welcome**
- Avatar selection (8 characters)
- Player name entry
- Introduction animation
- Learning objectives overview

**Stage 2: Hygiene Challenge (15-20 seconds)**
- WHO-recommended handwashing steps tutorial
- Interactive step-by-step simulation
- Germ detection game mechanic
- Hygiene score affects Stage 4 difficulty
- Educational outcome: understanding importance of handwashing

**Stage 3: Supermarket Showcase**
- Browse 50+ Thai foods
- View nutritional information (calories, protein, carbs, fat, fiber, sugar)
- Add foods to cart (budget: 1000 coins)
- Learn about balanced meals
- Educational outcome: nutritional awareness, budget management

**Stage 4: Digestion Journey (5 sequential minigames)**
- **4a. Mouth – Chewing**: Click-based chewing mechanic (QTE), break down food
- **4b. Esophagus – Peristalsis**: Tilt/drag steering, simulate swallowing
- **4c. Stomach – Acid Balance**: Mix food with stomach acid to correct pH
- **4d. Small Intestine – Absorption**: Paddle/drag mechanics, collect nutrient orbs
- **4e. Large Intestine – Water Balance**: Time-based water reabsorption challenge
- Combined education: full digestive process understanding

**Stage 5: Health Verdict**
- Composite health score (average of all stages + nutrition quality)
- Radar chart: Digestion Knowledge, Hygiene, Nutrition, Speed, Accuracy
- Personalized tips based on weak areas
- Leaderboard: top 5 local scores
- Downloadable/shareable scorecard

### Educational Design Principles
- **Age-appropriate** (9-12 years): Simple mechanics, colorful visuals, engaging narratives
- **Science-accurate**: Real digestive biology, actual food nutritional data
- **Gamified learning**: Points, combos, levels, achievements
- **Multiple learning styles**: Visual, kinesthetic, reading/writing
- **Culturally relevant**: Thai foods, Thai language primary UI
- **Self-paced**: No timer pressure for learning phases

## Getting Started

### Local Development
```bash
git clone https://github.com/dduskxy/digestive-mart.git
cd digestive-mart
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Building for Production
```bash
npm run build
```

This generates a `dist` folder ready for deployment to GitHub Pages, Vercel, or Netlify.

## Deployment
- **No camera/microphone access required** ✓
- **No external assets to download** ✓
- **Works offline after first load** (if cached)
- **HTTPS not required** (works on HTTP, localhost, file://)
- **Mobile-friendly** (360px+)

## Content: Food Database

**Categories**: Proteins, Carbs, Vegetables, Fruits, Snacks, Drinks

**Sample Foods** (50+ total):
- ข้าวกล้อง (Brown rice) - 215 cal, 5g protein, 45g carbs
- ไข่ต้ม (Boiled egg) - 78 cal, 6g protein, 1g carbs
- ปลาทูน้อย (Sardine) - 208 cal, 25g protein, 0g carbs
- ผักบุ้ง (Water spinach) - 21 cal, 2g protein, 4g carbs
- กล้วยหอม (Thai banana) - 89 cal, 1g protein, 23g carbs
- น้ำแร่ (Mineral water) - 0 cal, 0g protein, 0g carbs
- น้ำอัดลม (Soda) - 140 cal, 0g protein, 39g carbs
- [+ 42 more]

## Development Notes

### State Management
- Centralized store with reactive updates
- Player progress saved to localStorage
- Stage scores tracked independently
- Leaderboard stored locally (top 5 runs)

### Audio
- All sounds synthesized at runtime via Web Audio API
- SoundManager singleton: background music, effects, speech synthesis (future)
- Mutable in Settings

### Educational Scoring
- Each stage: 0-100 points
- Final score: average across all stages
- Bonus points for: speed completion, hygiene, healthy choices
- Penalty for: high junk food purchases, slow digestion

### Responsive Design
- Mobile-first (360px minimum)
- Touch-friendly buttons (48px+)
- Tablet optimized (768px+)
- Desktop refined (1280px+)

## License
MIT - Free for educational use

## Future Enhancements
- Multilingual support (Thai, English, other SE Asian languages)
- Teacher dashboard for classroom deployment
- Student progress tracking/reporting
- More digestive scenarios (lactose intolerance, food allergies)
- AI-powered personalized learning paths
- Social leaderboards (opt-in, anonymous)
