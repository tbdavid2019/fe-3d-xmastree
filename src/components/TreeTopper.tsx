import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppMode } from '../types';

export const TreeTopper = ({ mode }: { mode: AppMode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Position transition
    const targetY = 8.5; // Top of tree (height 16, center 0 -> -8 to 8. Top is 8)
    const chaosPos = new THREE.Vector3(0, 20, 0); // High up
    const formedPos = new THREE.Vector3(0, targetY, 0);
    
    const targetPos = mode === 'FORMED' ? formedPos : chaosPos;
    groupRef.current.position.lerp(targetPos, 0.05);

    // Rotation
    if (ring1Ref.current) ring1Ref.current.rotation.x = time * 1.5;
    if (ring1Ref.current) ring1Ref.current.rotation.y = time * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.x = time * 1.0;
    if (ring2Ref.current) ring2Ref.current.rotation.z = time * 1.2;

    // Heartbeat
    const scale = 1 + Math.sin(time * 10) * 0.1;
    if (coreRef.current) coreRef.current.scale.set(scale, scale, scale);

    // Sparkles
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y -= 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>

      {/* Spikes (Cone instances or just a few manually placed) */}
      {/* Simplified: Just the core and rings for now to save code size, maybe add point light */}
      <pointLight color="#FFD700" intensity={2} distance={5} />

      {/* Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.05, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>

      {/* Sparkles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={80}
            array={new Float32Array(80 * 3).map(() => (Math.random() - 0.5) * 4)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#FFF" transparent opacity={0.8} />
      </points>
    </group>
  );
};
