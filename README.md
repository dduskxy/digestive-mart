# Digestion Mart: The Body Quest (มินิมาร์ทนักย่อยผจญภัย)

An interactive, educational web game teaching digestion and food hygiene to students aged 9–12.
Built with modern Web Technologies and AI Computer Vision!

## Features
- 🎮 **5 Interactive Stages**: Welcome, Hygiene, Supermarket, Digestion Journey (5 sub-games), Summary.
- 📸 **AI Motion Controls**: Powered by `@mediapipe/tasks-vision`! Play with your face and hands using your webcam!
- ⌨️ **Accessible Fallbacks**: Fully playable using mouse/keyboard if the camera is disabled.
- 🎨 **Glassmorphism UI**: Beautiful, fully responsive design using Tailwind CSS v4.
- 🔊 **Synthesized Audio**: Sound effects generated purely via Web Audio API (no external MP3/OGG files!).

## Tech Stack
- Vanilla TypeScript
- Vite
- Tailwind CSS v4
- MediaPipe Tasks Vision (FaceLandmarker, HandLandmarker)
- Chart.js (Summary radar chart)
- Canvas Confetti

## Getting Started

### Local Development
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

### Building for Production
To build the game for deployment (e.g., GitHub Pages, Vercel, Netlify):

```bash
npm run build
```

This will generate a `dist` folder containing the compiled, minified, and optimized assets ready for hosting.

## Deployment Notes
- **Vite & Rollup**: The project uses Vite. All assets are statically bundled.
- **Camera Permissions**: The browser will only allow `getUserMedia` (webcam access) on `localhost` or via **HTTPS**. You MUST host the game on a secure HTTPS server for the AI mechanics to work.

## License
MIT
