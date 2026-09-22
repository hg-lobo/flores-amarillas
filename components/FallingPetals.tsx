"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Petal = {
  basePos: THREE.Vector3;
  speed: number;
  phase: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  size: number;
  drift: number;
};

export default function FallingPetals({ count = 25 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Geometría de pétalo con forma real y curvatura
  const petalGeometry = useMemo(() => {
    // Forma del pétalo: alargada, con punta fina
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.5); // base
    shape.bezierCurveTo(0.25, -0.3, 0.3, 0.3, 0, 0.5); // lado derecho
    shape.bezierCurveTo(-0.3, 0.3, -0.25, -0.3, 0, -0.5); // lado izquierdo

    const geo = new THREE.ShapeGeometry(shape, 16);

    // Curvatura 3D: doblamos el pétalo
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      // Curvatura hacia arriba en el centro (efecto cuchara)
      const curve = Math.sin((v.y + 0.5) * Math.PI) * 0.15;
      pos.setZ(i, curve);
    }
    geo.computeVertexNormals();

    return geo;
  }, []);

  const petals = useMemo<Petal[]>(() => {
    const arr: Petal[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        basePos: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          0,
          (Math.random() - 0.5) * 3 - 0.5
        ),
        speed: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        rotSpeedX: 0.3 + Math.random() * 0.8,
        rotSpeedY: 0.4 + Math.random() * 0.9,
        rotSpeedZ: 0.2 + Math.random() * 0.5,
        size: 0.15 + Math.random() * 0.15,
        drift: 0.3 + Math.random() * 0.4,
      });
    }
    return arr;
  }, [count]);

  const petalRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    petals.forEach((p, i) => {
      const mesh = petalRefs.current[i];
      if (!mesh) return;

      // Caída: bucle de arriba hacia abajo
      const totalFall = 7;
      const y = 3.5 - ((t * p.speed + p.phase) % totalFall);

      // Deriva lateral con zigzag (más orgánico)
      const zigzagX =
        Math.sin(t * 0.6 + p.phase) * p.drift +
        Math.sin(t * 1.2 + p.phase * 2) * p.drift * 0.3;
      const zigzagZ = Math.cos(t * 0.5 + p.phase) * p.drift * 0.8;

      mesh.position.set(
        p.basePos.x + zigzagX,
        y,
        p.basePos.z + zigzagZ
      );

      // Rotación 3D en 3 ejes, velocidades distintas
      mesh.rotation.x = t * p.rotSpeedX + p.phase;
      mesh.rotation.y = t * p.rotSpeedY + p.phase * 1.5;
      mesh.rotation.z = t * p.rotSpeedZ + p.phase * 0.7;
    });
  });

  return (
    <group ref={groupRef}>
      {petals.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            petalRefs.current[i] = el;
          }}
          geometry={petalGeometry}
          scale={p.size}
        >
          <meshStandardMaterial
            color="#ffdd22"
            emissive="#ff9900"
            emissiveIntensity={0.6}
            roughness={0.5}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}