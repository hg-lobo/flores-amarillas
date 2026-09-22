"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Pollen({ count = 70 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const sprite = useMemo(() => {
    const size = 32;
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
    gradient.addColorStop(0, "rgba(255, 230, 150, 1)");
    gradient.addColorStop(0.5, "rgba(255, 200, 80, 0.6)");
    gradient.addColorStop(1, "rgba(255, 180, 50, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const pollenData = useMemo(() => {
    const arr: { basePos: THREE.Vector3; speed: number; phase: number }[] = [];
    for (let i = 0; i < count; i++) {
      // Distribuidos muy cerca de la flor (radio 0.3 - 0.9)
      const radius = 0.3 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        basePos: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          (Math.random() - 0.2) * 0.8,
          Math.sin(phi) * Math.sin(theta) * radius
        ),
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    pollenData.forEach((p, i) => {
      arr[i * 3] = p.basePos.x;
      arr[i * 3 + 1] = p.basePos.y;
      arr[i * 3 + 2] = p.basePos.z;
    });
    return arr;
  }, [pollenData, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < pollenData.length; i++) {
      const p = pollenData[i];
      // Movimiento más rápido y errático que las luciérnagas
      posAttr.setX(i, p.basePos.x + Math.sin(t * p.speed + p.phase) * 0.12);
      posAttr.setY(
        i,
        p.basePos.y + Math.cos(t * p.speed * 1.3 + p.phase) * 0.1
      );
      posAttr.setZ(
        i,
        p.basePos.z + Math.sin(t * p.speed * 0.9 + p.phase) * 0.1
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
        size={0.04}
        map={sprite}
        color="#ffe088"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}