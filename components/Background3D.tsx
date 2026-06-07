// @ts-nocheck
"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── INSANE PLASMA WAVE SHADER ───────────────────────────────────────────────
const PlasmaShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
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
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    #define PI 3.14159265358979

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.10, 0.20);
      return a + b * cos(6.28318 * (c * t + d));
    }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 6; i++) {
        val += amp * noise(p * freq);
        amp *= 0.5;
        freq *= 2.0;
        p = mat2(0.8, -0.6, 0.6, 0.8) * p;
      }
      return val;
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 uva = uv * aspect;
      vec2 mouseA = uMouse * aspect;

      float t = uTime * 0.18;

      // Mouse reactive distortion
      float mouseDist = length(uva - mouseA);
      float mouseWave = sin(mouseDist * 12.0 - uTime * 3.0) * (0.04 / (mouseDist + 0.1));

      // Domain warp — makes it look like plasma/lava
      vec2 q = vec2(
        fbm(uva + t * 0.5 + mouseWave),
        fbm(uva + vec2(5.2, 1.3) + t * 0.4)
      );
      vec2 r = vec2(
        fbm(uva + 4.0 * q + vec2(1.7, 9.2) + t * 0.3),
        fbm(uva + 4.0 * q + vec2(8.3, 2.8) + t * 0.25)
      );
      float f = fbm(uva + 4.0 * r);

      // Base dark background (#0A192F)
      vec3 bg = vec3(0.039, 0.098, 0.184);

      // Rich color palette based on noise
      float colorT = clamp((f * f) * 4.0 + 2.0 * f + 0.5, 0.0, 1.0);
      vec3 aurora = palette(colorT + t * 0.1 + mouseDist * 0.3);

      // Mix aurora over background — keep it dark but vibrant
      float mixAmt = smoothstep(0.3, 0.85, f) * 0.45;
      vec3 color = mix(bg, aurora, mixAmt);

      // Add cyan edge glow
      float edgeGlow = smoothstep(0.6, 1.0, f);
      color += vec3(0.0, 0.9, 1.0) * edgeGlow * 0.08;

      // Add mouse proximity glow
      float mGlow = smoothstep(0.4, 0.0, mouseDist);
      color += vec3(0.1, 0.9, 0.8) * mGlow * 0.12;

      // Vignette
      float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5));
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// ─── HYPERSPACE PARTICLE SYSTEM ──────────────────────────────────────────────
function HyperspaceParticles() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 4000;

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);
    const palette = [
      [0.39, 1.0, 0.85], // #64FFDA cyan
      [0.23, 0.51, 0.96], // #3b82f6 blue
      [0.72, 0.4, 0.96],  // #b794f6 purple
      [1.0, 0.85, 0.27],  // gold
      [0.0, 0.9, 1.0],    // electric cyan
    ];
    for (let i = 0; i < COUNT; i++) {
      const r = 2.5 + Math.random() * 2.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      velocities[i] = 0.3 + Math.random() * 0.7;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { positions, velocities, colors };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.012;
    // Subtle pulsing scale
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    ref.current.scale.setScalar(s);
  });

  return (
    <points ref={ref}>
      <primitive object={geo} />
      <pointsMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ─── FLOATING ENERGY RINGS ────────────────────────────────────────────────────
function EnergyRings() {
  const rings = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      radius: 0.8 + i * 0.5,
      speed: 0.15 + i * 0.07,
      tilt: (i * 37 * Math.PI) / 180,
      color: [
        "#64FFDA", "#3b82f6", "#b794f6", "#00E5FF", "#D4AF37"
      ][i],
    }));
  }, []);

  return (
    <>
      {rings.map((ring, i) => (
        <RingMesh key={i} {...ring} />
      ))}
    </>
  );
}

function RingMesh({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    // Pulsing opacity
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 0.8 + tilt) * 0.04;
  });

  const geo = useMemo(() => new THREE.TorusGeometry(radius, 0.004, 8, 100), [radius]);

  return (
    <mesh ref={ref} geometry={geo}>
      <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// ─── PLASMA MESH ─────────────────────────────────────────────────────────────
function PlasmaMesh({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * 0.05;
    uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={PlasmaShader.fragmentShader}
        vertexShader={PlasmaShader.vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function Background3D() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas
        gl={{ antialias: false, stencil: false, depth: false, alpha: false }}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
      >
        {/* Plasma background */}
        <PlasmaMesh mouse={mouse} />
        {/* Hyperspace color particles */}
        <HyperspaceParticles />
        {/* Glowing energy rings */}
        <EnergyRings />
      </Canvas>
      {/* Top vignette so content sections blend well */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A192F]/60 pointer-events-none" />
      {/* Scanline pass */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}
