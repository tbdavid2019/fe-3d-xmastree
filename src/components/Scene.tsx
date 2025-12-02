import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { TreeTopper } from './TreeTopper';
import { AppState } from '../types';

interface SceneProps {
  state: AppState;
}

export const Scene = ({ state }: SceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      {/* <color attach="background" args={['#050505']} /> */}
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      
      {/* Environment */}
      <Environment preset="lobby" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floor */}
      <Grid 
        position={[0, -8, 0]} 
        args={[30, 30]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#2E7D32" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#FFD700" 
        fadeDistance={20} 
        fadeStrength={1} 
      />

      {/* Content */}
      <group position={[0, 0, 0]}>
        <Foliage mode={state.mode} />
        <Ornaments mode={state.mode} />
        <TreeTopper mode={state.mode} />
      </group>

      {/* Post Processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={1.2} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      {/* Controls */}
      <OrbitControls 
        autoRotate={state.mode === 'FORMED' && !state.handDetected} 
        autoRotateSpeed={0.5}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};
