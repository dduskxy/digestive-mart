# Digestion Mart: The Body Quest (มินิมาร์ทนักย่อยผจญภัย)

A fully-featured, production-ready educational web game demonstrating the human digestive system, built with Vanilla JavaScript (ES6+), Vite, and Tailwind CSS v4.

## Features
1. **Hygiene Prep**: Interactive minigames emphasizing clean hands and health.
2. **Supermarket (Mart UI)**: Shop for groceries with real nutritional facts, macros, and search filters.
3. **Digestion Engine**: Interactive mechanics simulating the mouth (chewing QTE), esophagus, stomach acid, and intestinal nutrient absorption.
4. **Summary & Scorecard**: A personalized radar chart mapping macronutrients, final health verdict, and a local leaderboard.

## Tech Stack
- Vanilla ES6 Modules (No framework overhead)
- [Vite](https://vitejs.dev/) (Build tool)
- [Tailwind CSS v4](https://tailwindcss.com/) (Styling)
- [Chart.js](https://www.chartjs.org/) (Radar charts)
- Web Audio API (Synthesized SFX)
- Canvas-Confetti (Celebrations)

## How to Run Locally

1. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open the provided local URL (usually `http://localhost:5173/`) in your browser to play the game!

## How to Deploy (GitHub Pages or Vercel)

1. **Build for Production**
   ```bash
   npm run build
   ```
   This will generate a `dist/` folder containing the optimized assets.

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel.
   - Vercel will automatically detect Vite and run `npm run build`.
   - Your game is live!

3. **Deploy to GitHub Pages**
   - Commit the changes and push to GitHub.
   - Go to Repository Settings > Pages.
   - Select "GitHub Actions" as the source.
   - Use the standard Node.js workflow to run `npm run build` and upload the `dist` folder artifact.
   - Note: The `vite.config.js` is already configured with `base: './'` to support relative paths on GitHub Pages.
