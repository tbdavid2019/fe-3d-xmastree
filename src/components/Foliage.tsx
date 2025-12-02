import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppMode } from '../types';

const vertexShader = `
  uniform float time;
  uniform float mode; // 0 = CHAOS, 1 = FORMED
  attribute vec3 targetPos;
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;

  // Simplex noise function or similar for wind
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vColor = color;
    
    // Chaos position (using position attribute as chaos start)
    vec3 chaosPos = position;
    
    // Formed position (targetPos)
    // Add wind sway
    float wind = snoise(vec3(targetPos.x * 0.5, targetPos.y * 0.5, time * 0.5)) * 0.2;
    vec3 formedPos = targetPos + vec3(wind, 0.0, wind);

    vec3 finalPos = mix(chaosPos, formedPos, mode);
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

interface FoliageProps {
  mode: AppMode;
}

export const Foliage = ({ mode }: FoliageProps) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const count = 2500; // Increased from 250 for better look

  const { positions, targetPos, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targetPos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const greenPalette = [
      new THREE.Color('#2E7D32'),
      new THREE.Color('#1B5E20'),
      new THREE.Color('#43A047'),
      new THREE.Color('#66BB6A'),
    ];

    for (let i = 0; i < count; i++) {
      // Chaos positions (Sphere)
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Target positions (Cone)
      // Height 16, Radius 5.5
      const h = Math.random() * 16;
      const y = h - 8; // Center vertically
      const radiusAtH = 5.5 * (1 - h / 16);
      const angle = Math.random() * 2 * Math.PI;
      const rCone = Math.sqrt(Math.random()) * radiusAtH; // Uniform distribution in circle
      
      targetPos[i * 3] = rCone * Math.cos(angle);
      targetPos[i * 3 + 1] = y;
      targetPos[i * 3 + 2] = rCone * Math.sin(angle);

      // Colors
      const color = greenPalette[Math.floor(Math.random() * greenPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.5 + 0.2;
    }

    return { positions, targetPos, colors, sizes };
  }, []);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = state.clock.elapsedTime;
      // Lerp mode
      const targetMode = mode === 'FORMED' ? 1.0 : 0.0;
      shaderRef.current.uniforms.mode.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.mode.value,
        targetMode,
        0.05 // Speed factor
      );
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-targetPos"
          args={[targetPos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          mode: { value: 0 },
        }}
        transparent
        depthWrite={false}
      />
    </points>
  );
};
