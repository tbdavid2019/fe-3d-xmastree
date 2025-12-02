import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppMode } from '../types';

interface OrnamentGroupProps {
  mode: AppMode;
  count: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  type: 'ball' | 'gift' | 'light' | 'gem' | 'bell' | 'cascade';
}

const OrnamentGroup = ({ mode, count, geometry, material, type }: OrnamentGroupProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const data = useMemo(() => {
    const chaosPos = new Float32Array(count * 3);
    const targetPos = new Float32Array(count * 3);
    const targetRot = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Chaos
      const r = 25 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      chaosPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      chaosPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      chaosPos[i * 3 + 2] = r * Math.cos(phi);

      // Target
      let tx = 0, ty = 0, tz = 0;
      
      if (type === 'gift') {
        // Base of tree
        const angle = Math.random() * 2 * Math.PI;
        const rad = 3 + Math.random() * 4;
        tx = rad * Math.cos(angle);
        ty = -8 + Math.random() * 1; // Floor level
        tz = rad * Math.sin(angle);
      } else if (type === 'cascade') {
        // Flowing down
        const h = Math.random() * 16;
        const y = h - 8;
        const rad = 5.5 * (1 - h / 16) + 0.2;
        const angle = Math.random() * 2 * Math.PI;
        tx = rad * Math.cos(angle);
        ty = y;
        tz = rad * Math.sin(angle);
      } else {
        // Random on tree surface
        const h = Math.random() * 16;
        const y = h - 8;
        const rad = 5.5 * (1 - h / 16);
        const angle = Math.random() * 2 * Math.PI;
        tx = rad * Math.cos(angle);
        ty = y;
        tz = rad * Math.sin(angle);
      }

      targetPos[i * 3] = tx;
      targetPos[i * 3 + 1] = ty;
      targetPos[i * 3 + 2] = tz;

      targetRot[i * 3] = Math.random() * Math.PI;
      targetRot[i * 3 + 1] = Math.random() * Math.PI;
      targetRot[i * 3 + 2] = Math.random() * Math.PI;

      speeds[i] = 0.5 + Math.random() * 1.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { chaosPos, targetPos, targetRot, speeds, phases };
  }, [count, type]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const isFormed = mode === 'FORMED';
    const lerpFactor = 0.05; // Smooth transition

    for (let i = 0; i < count; i++) {
      // Current interpolated position logic could be complex if we store state.
      // Instead, let's just lerp the matrix directly? No, we need to lerp the position.
      // We need to store current pos to lerp properly? 
      // For simplicity, we'll calculate "current target" based on mode and lerp towards it.
      // Actually, to do smooth transition, we need persistent state.
      // But we can just use the mesh's current matrix to get position, and lerp to target.
      
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      const cx = data.chaosPos[i * 3];
      const cy = data.chaosPos[i * 3 + 1];
      const cz = data.chaosPos[i * 3 + 2];

      let tx = data.targetPos[i * 3];
      let ty = data.targetPos[i * 3 + 1];
      let tz = data.targetPos[i * 3 + 2];

      // Animations
      if (type === 'cascade') {
        // Flow effect
        const speed = data.speeds[i];
        const yOffset = (time * speed) % 16;
        let newY = ty - yOffset;
        if (newY < -8) newY += 16;
        // Recalculate radius for new Y
        const h = newY + 8;
        const rad = 5.5 * (1 - h / 16) + 0.2;
        const angle = Math.atan2(tz, tx); // Keep angle
        tx = rad * Math.cos(angle);
        ty = newY;
        tz = rad * Math.sin(angle);
      } else if (type === 'bell') {
        // Swing
        dummy.rotation.z = Math.sin(time * 3 + data.phases[i]) * 0.2;
      } else if (type === 'gem') {
        // Rotate
        dummy.rotation.y += 0.02;
      } else if (type === 'light') {
        // Pulse scale
        const s = 1 + Math.sin(time * 5 + data.phases[i]) * 0.3;
        dummy.scale.set(s, s, s);
      }

      const targetX = isFormed ? tx : cx;
      const targetY = isFormed ? ty : cy;
      const targetZ = isFormed ? tz : cz;

      dummy.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), lerpFactor);
      
      if (type !== 'gem' && type !== 'bell') {
         // Random rotation for others
         // dummy.rotation.set(data.targetRot[i*3], data.targetRot[i*3+1], data.targetRot[i*3+2]);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

export const Ornaments = ({ mode }: { mode: AppMode }) => {
  const materials = useMemo(() => ({
    gold: new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 0.8, roughness: 0.2 }),
    red: new THREE.MeshStandardMaterial({ color: '#DC143C', metalness: 0.6, roughness: 0.3 }),
    gift: new THREE.MeshStandardMaterial({ color: '#4CAF50' }),
    light: new THREE.MeshBasicMaterial({ color: '#FFFFE0' }),
    gem: new THREE.MeshPhysicalMaterial({ color: '#00FFFF', transmission: 0.9, roughness: 0.0, thickness: 1 }),
    bell: new THREE.MeshStandardMaterial({ color: '#FFA500', metalness: 0.9 }),
  }), []);

  const geometries = useMemo(() => ({
    sphere: new THREE.SphereGeometry(0.2, 16, 16),
    box: new THREE.BoxGeometry(0.6, 0.6, 0.6),
    smallSphere: new THREE.SphereGeometry(0.08, 8, 8),
    octahedron: new THREE.OctahedronGeometry(0.2),
    cone: new THREE.ConeGeometry(0.15, 0.3, 16),
  }), []);

  return (
    <group>
      {/* Balls - Gold */}
      <OrnamentGroup mode={mode} count={200} geometry={geometries.sphere} material={materials.gold} type="ball" />
      {/* Balls - Red */}
      <OrnamentGroup mode={mode} count={200} geometry={geometries.sphere} material={materials.red} type="ball" />
      {/* Gifts */}
      <OrnamentGroup mode={mode} count={150} geometry={geometries.box} material={materials.gift} type="gift" />
      {/* Lights */}
      <OrnamentGroup mode={mode} count={600} geometry={geometries.smallSphere} material={materials.light} type="light" />
      {/* Cascade Lights */}
      <OrnamentGroup mode={mode} count={300} geometry={geometries.smallSphere} material={materials.light} type="cascade" />
      {/* Gems */}
      <OrnamentGroup mode={mode} count={200} geometry={geometries.octahedron} material={materials.gem} type="gem" />
      {/* Bells */}
      <OrnamentGroup mode={mode} count={150} geometry={geometries.cone} material={materials.bell} type="bell" />
    </group>
  );
};
