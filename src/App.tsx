import { useEffect, useRef } from 'react';
import { GameEngine } from './GameEngine';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      engineRef.current = new GameEngine(canvasRef.current);
      engineRef.current.init();
      engineRef.current.start();
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, color: '#f39c12' }}>🛒 Digestive Minimart Tycoon</h1>
        <p style={{ margin: '10px 0 0 0', color: '#bdc3c7' }}>Living World Prototype: 50+ Autonomous Agents</p>
      </header>
      
      <main style={{ padding: '20px' }}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          style={{ border: '2px solid #34495e', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
        />
      </main>

      <footer style={{ padding: '20px', display: 'flex', gap: '20px', color: '#7f8c8d' }}>
        <div><span style={{ color: '#3498db' }}>●</span> Shopper Agents</div>
        <div><span style={{ color: '#e74c3c' }}>○</span> Amylase (Mouth)</div>
        <div><span style={{ color: '#f1c40f' }}>○</span> Pepsin (Stomach)</div>
        <div><span style={{ color: '#2ecc71' }}>○</span> Lipase (Intestines)</div>
      </footer>
    </div>
  );
}

export default App;
