"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Firefly = {
  basePos: THREE.Vector3;
  speed: number;
  phase: number;
  size: number;
};

export default function Fireflies({ count = 150 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Textura circular suave generada por código
  const sprite = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255, 240, 180, 1)");
    gradient.addColorStop(0.3, "rgba(255, 210, 100, 0.8)");
    gradient.addColorStop(1, "rgba(255, 180, 50, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Distribuir en 3 capas: cerca, media, lejos
  const fireflies = useMemo<Firefly[]>(() => {
    const arr: Firefly[] = [];
    for (let i = 0; i < count; i++) {
      // 30% cerca, 40% media, 30% lejos
      const r = Math.random();
      let radius: number;
      let size: number;
      if (r < 0.3) {
        // Cerca
        radius = 0.6 + Math.random() * 0.8;
        size = 0.10 + Math.random() * 0.06;
      } else if (r < 0.7) {
        // Media
        radius = 1.4 + Math.random() * 1.2;
        size = 0.06 + Math.random() * 0.04;
      } else {
        // Lejos
        radius = 2.6 + Math.random() * 2.0;
        size = 0.03 + Math.random() * 0.02;
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      arr.push({
        basePos: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          (Math.random() - 0.3) * 2.2,
          Math.sin(phi) * Math.sin(theta) * radius
        ),
        speed: 0.1 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        size,
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    fireflies.forEach((f, i) => {
      arr[i * 3] = f.basePos.x;
      arr[i * 3 + 1] = f.basePos.y;
      arr[i * 3 + 2] = f.basePos.z;
    });
    return arr;
  }, [fireflies, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < fireflies.length; i++) {
      const f = fireflies[i];
      posAttr.setX(i, f.basePos.x + Math.sin(t * f.speed + f.phase) * 0.22);
      posAttr.setY(
        i,
        f.basePos.y + Math.cos(t * f.speed * 0.7 + f.phase) * 0.18
      );
      posAttr.setZ(
        i,
        f.basePos.z + Math.sin(t * f.speed * 0.5 + f.phase) * 0.16
      );
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        map={sprite}
        color="#ffdd88"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}