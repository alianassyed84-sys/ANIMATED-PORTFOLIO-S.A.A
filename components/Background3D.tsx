// @ts-nocheck
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Premium WebGL Aurora Shader
 * Creates a cinematic, fluid aurora effect using noise and color layering.
 */
const AuroraShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#00E5FF") }, // Cyan
    uColor2: { value: new THREE.Color("#3B82F6") }, // Blue
    uColor3: { value: new THREE.Color("#7C3AED") }, // Purple
    uResolution: { value: new THREE.Vector2() },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec4(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw), 0.0), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      vec4 gr = vec4(a0.xy, h.xy);
      vec3 g0 = vec3(gr.xz, a0.z);
      vec4 g1 = vec4(gr.yw, h.z, 0.0); // Dummy 4th component
      vec3 g1_3 = g1.xyz;
      vec3 norm0 = 1.79284291400159 - 0.85373472095314 * ( g0*g0 + g1_3*g1_3 );
      g0 *= norm0;
      g1_3 *= norm0;
      vec3 m_3 = m.xyz;
      float n = 130.0 * dot(m_3, vec3(dot(g0,x0), dot(g1_3,x12.xy), dot(g1_3,x12.zw)));
      return n;
    }

    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.2;
      
      // Layered noise for aurora waves
      float n1 = snoise(uv * 2.0 + time * 0.5);
      float n2 = snoise(uv * 4.0 - time * 0.3 + n1 * 0.5);
      float n3 = snoise(uv * 1.5 + time * 0.1 + n2 * 0.2);
      
      float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      // Color mixing based on noise
      vec3 color = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
      color = mix(color, uColor3, n2 * 0.5 + 0.5);
      
      // Create wave shapes
      float wave = smoothstep(0.4, 0.6, abs(uv.y - 0.5 + finalNoise * 0.3));
      
      // Dark background blending
      vec3 backgroundColor = vec3(0.039, 0.098, 0.184); // #0A192F
      vec3 finalColor = mix(color, backgroundColor, wave * 0.95 + 0.05);
      
      // Add a touch of brightness
      finalColor += color * (1.0 - wave) * 0.15;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

function AuroraMesh() {
  const meshRef = useRef();
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#00E5FF") },
      uColor2: { value: new THREE.Color("#3B82F6") },
      uColor3: { value: new THREE.Color("#7C3AED") },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={AuroraShader.fragmentShader}
        vertexShader={AuroraShader.vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function ParticleCloud() {
  const ref = useRef();
  
  const sphere = useMemo(() => {
    const numPoints = 1500;
    const positions = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      const r = 2.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sphere.length / 3}
            array={sphere}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#64FFDA"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas
        gl={{ antialias: false, stencil: false, depth: false }}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // Performance optimization
      >
        <AuroraMesh />
        <ParticleCloud />
      </Canvas>
      {/* Cinematic overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
    </div>
  );
}
