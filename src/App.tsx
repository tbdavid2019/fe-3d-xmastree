import { useState, useEffect } from 'react';
import { Scene } from './components/Scene';
import { ControlPanel } from './components/ControlPanel';
import { useHandTracking } from './hooks/useHandTracking';
import { AppState, AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>('FORMED');
  const { videoRef, canvasRef, gesture, handPos, results } = useHandTracking(true);
  
  // Stats (mock for now, or use drei Stats)
  const [stats, setStats] = useState({ fps: 60, particles: 2500, uptime: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(s => ({ ...s, uptime: s.uptime + 1, fps: Math.floor(55 + Math.random() * 5) }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Gesture Control
  useEffect(() => {
    if (gesture === 'OPEN') {
      setMode('CHAOS');
    } else if (gesture === 'PINCH' || gesture === 'FIST') {
      setMode('FORMED');
    }
  }, [gesture]);

  const appState: AppState = {
    mode,
    handDetected: !!results && results.multiHandLandmarks.length > 0,
    gesture,
    handPosition: handPos,
    stats,
    settings: {
      spin: 0.2,
      scale: 1.1,
      density: 4.298,
      distortion: 0.008,
      fieldRadius: 22.59,
      showSkeleton: true,
      handTrackingEnabled: true
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Video Feed */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover transform -scale-x-100" 
          playsInline 
          muted 
        />
      </div>

      {/* Skeleton Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover transform -scale-x-100" 
        />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-1">
        <Scene state={appState} />
      </div>

      {/* HUD */}
      <ControlPanel 
        state={appState} 
        onToggleMode={() => setMode(m => m === 'FORMED' ? 'CHAOS' : 'FORMED')} 
      />
    </div>
  );
}

export default App;
