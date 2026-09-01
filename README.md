# Digestion Mart: The Body Quest (มินิมาร์ทนักย่อยผจญภัย)

An interactive, educational web game teaching digestion and food hygiene to students aged 9–12.
Built with modern Web Technologies and AI Computer Vision!

## Features
- 🎮 **5 Interactive Stages**: Welcome, Hygiene, Supermarket, Digestion Journey (5 sub-games), Summary.
- 📸 **AI Motion Controls**: Powered by `@mediapipe/tasks-vision`! Play with your face and hands using your webcam!
- ⌨️ **Accessible Fallbacks**: Fully playable using mouse/keyboard if the camera is disabled.
- 🎨 **Glassmorphism UI**: Beautiful, fully responsive design using Tailwind CSS v4.
- 🔊 **Synthesized Audio**: Sound effects generated purely via Web Audio API (no external MP3/OGG files!).
- 🎬 **Camera Consent**: Clear, privacy-first camera permission flow. Everything stays on your device!

## Tech Stack
- Vanilla TypeScript
- Vite
- Tailwind CSS v4 (with @theme design system)
- MediaPipe Tasks Vision (FaceLandmarker, HandLandmarker) — lazy-loaded on demand
- Chart.js (Summary radar chart)
- Canvas Confetti
- Web Audio API (all sound synthesis)

## Project Architecture

### Phase 1: Project Scaffold & Design System ✅
- **Global State Store** (`src/state/store.ts`): Centralized game state with reactive updates
  - Player stats, progress, settings, camera permissions
  - Persistent localStorage for consent & preferences
- **Design System** (`src/styles/main.css`): 
  - Warm, kid-friendly palette (#FFF8F0, #FF8A65, #4DB6AC, #FFD54F, #EF5350, #4E342E)
  - Rich animations (float, pulse-glow, shake, fade, spin, heartbeat, wiggle, confetti, etc.)
  - Glassmorphism utilities, 3D buttons, glow effects
- **CameraInputProvider** (`src/services/CameraInputProvider.ts`): Singleton service for camera management
  - Lazy-loads MediaPipe models on demand (only when stages actually need them)
  - Event-driven landmark data delivery
  - Automatic pause/resume on tab visibility change
  - Throttled inference loop to balance accuracy & performance
  - **HARD CONSTRAINT**: Every camera feature has an equally-scorable non-camera fallback
- **ConsentModal** (`src/components/ConsentModal.ts`): One-time camera permission request
  - Thai UI explaining camera usage across all stages
  - Players can opt for non-camera gameplay at any time without losing progress
  - Settings toggle in Navbar to revisit consent decision
  - No camera = no data upload, only local avatar/victory images stored

### Phase 2: Stage 1 (Welcome) + Stage 2 (Hygiene) + Shared Components [TODO]
### Phase 3: Stage 3 (Supermarket) + Food Database [TODO]
### Phase 4: Stage 4 (5 Digestion Sub-Minigames) [TODO]
### Phase 5: Stage 5 (Health Verdict) + Polish [TODO]

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
- **No External Assets**: All visuals (emoji, CSS gradients, SVG), audio (Web Audio API synthesis), and data are bundled. Zero external image/audio files.

## Development Notes

### Camera Workflow
1. Player enters name in Stage 1 (Welcome)
2. ConsentModal appears asking for camera permission
3. If granted: CameraInputProvider requests camera, models lazy-load on first use
4. If denied: Game is fully playable with keyboard/mouse fallbacks
5. Players can toggle camera on/off in Settings mid-game without losing progress

### State Persistence
- Player name, avatar, best score → localStorage
- Camera consent decision → localStorage
- All game progress → ephemeral (resets on new game, not persisted between sessions)

### MediaPipe Model Loading
- **HandLandmarker**: Loaded on Stage 2 (Hygiene) first use, reused across all subsequent stages
- **FaceLandmarker**: Loaded on Stage 1 (Welcome selfie) or Stage 4a (Mouth detection) first use
- Models are unloaded when no longer needed to save memory
- Inference runs at ~30fps but throttled to every Nth frame for performance

## License
MIT
