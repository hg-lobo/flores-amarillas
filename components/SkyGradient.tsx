"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SkyGradient() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color("#050208") },       // noche profunda
        midColor: { value: new THREE.Color("#1a0a10") },       // transición
        horizonColor: { value: new THREE.Color("#6a2a10") },   // horizonte oscuro
        bottomColor: { value: new THREE.Color("#0a0404") },    // suelo muy oscuro
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        uniform float time;
        varying vec3 vWorldPosition;

        void main() {
          float h = normalize(vWorldPosition).y;

          vec3 color;

          if (h > 0.25) {
            float t = smoothstep(0.25, 1.0, h);
            color = mix(midColor, topColor, t);
          } else if (h > -0.1) {
            float t = (h + 0.1) / 0.35;
            color = mix(horizonColor, midColor, smoothstep(0.0, 1.0, t));
          } else {
            float t = smoothstep(-1.0, -0.1, h);
            color = mix(bottomColor, horizonColor, t);
          }

          // Halo tenue del sol (más sutil que antes)
          float glow = exp(-abs(h - 0.15) * 12.0);
          color += vec3(0.15, 0.06, 0.02) * glow;

          color += vec3(0.01, 0.005, 0.0) * sin(time * 0.4);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (!material) return;
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} scale={50}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}