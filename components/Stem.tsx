"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================
// HOJA: geometría con forma real
// ============================================================
function useLeafGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12, 0.08, 0.15, 0.35, 0, 0.6);
    shape.bezierCurveTo(-0.15, 0.35, -0.12, 0.08, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 12);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      pos.setZ(i, Math.sin((v.y / 0.6) * Math.PI) * 0.05);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Leaf({
  curve,
  t,
  angle,
  scale = 1,
  phase = 0,
}: {
  curve: THREE.CatmullRomCurve3;
  t: number;
  angle: number;
  scale?: number;
  phase?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useLeafGeometry();

  const position = useMemo(() => curve.getPointAt(t), [curve, t]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.z = Math.sin(time * 1.2 + phase) * 0.15;
    meshRef.current.rotation.x = Math.cos(time * 0.9 + phase) * 0.1;
  });

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[0, angle, 0]}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={[0.015, 0, 0]}
        scale={scale}
      >
        <meshStandardMaterial
          color="#88cc44"
          emissive="#3a6a15"
          emissiveIntensity={0.3}
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// PELITOS: ultra densos, ultra finos, orientados hacia arriba
// ============================================================
function Hairs({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const hairs = useMemo(() => {
    const arr: {
      pos: THREE.Vector3;
      rotation: [number, number, number];
      length: number;
    }[] = [];
    const count = 1500;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const pos = curve.getPointAt(t);
      const angle = Math.random() * Math.PI * 2;
      const length = 0.006 + Math.random() * 0.008;

      arr.push({
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        rotation: [Math.PI * 0.75, 0, angle],
        length,
      });
    }
    return arr;
  }, [curve]);

  return (
    <group>
      {hairs.map((h, i) => (
        <mesh key={i} position={h.pos} rotation={h.rotation}>
          <cylinderGeometry args={[0.00015, 0.00008, h.length, 3]} />
          <meshStandardMaterial
            color="#a8e070"
            emissive="#5a9a20"
            emissiveIntensity={0.4}
            roughness={0.5}
            metalness={0.0}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
// TALLO PRINCIPAL
// ============================================================
export default function Stem() {
  const groupRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.025, -0.6, 0),
      new THREE.Vector3(-0.02, -1.2, 0.01),
      new THREE.Vector3(0.02, -1.8, -0.01),
      new THREE.Vector3(-0.015, -2.4, 0.01),
      new THREE.Vector3(0.015, -3.0, 0),
      new THREE.Vector3(0, -5.6, 0),
    ]);
  }, []);

  const coloredGeometry = useMemo(() => {
    const geo = new THREE.TubeGeometry(curve, 100, 0.0041, 12, false);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const green = new THREE.Color("#81a941");
    const greenMid = new THREE.Color("#77a139");
    const gold = new THREE.Color("#475218");

    let minY = Infinity;
    let maxY = -Infinity;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
    }

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const t = (maxY - v.y) / (maxY - minY);
      let color: THREE.Color;
      if (t < 0.5) {
        color = green.clone().lerp(greenMid, t * 2);
      } else {
        color = greenMid.clone().lerp(gold, (t - 0.5) * 2);
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [curve]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z =
      Math.sin(t * 0.4) * 0.018 + Math.sin(t * 0.75) * 0.01;
    groupRef.current.rotation.x =
      Math.cos(t * 0.35) * 0.014 + Math.cos(t * 0.65) * 0.008;
  });

  return (
    <group ref={groupRef} position={[0, 0.12, 0]}>
      {/* Tallo principal con brillo metálico */}
      <mesh geometry={coloredGeometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.4}
          metalness={0.6}
          emissive="#000000"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Pelitos finos alrededor del tallo */}
      <Hairs curve={curve} />

      {/* Hojas saliendo del tallo a distintas alturas */}
      <Leaf curve={curve} t={0.12} angle={0.8} scale={0.7} phase={0.5} />
      <Leaf curve={curve} t={0.25} angle={-0.8} scale={0.65} phase={1.2} />
      <Leaf curve={curve} t={0.38} angle={0.7} scale={0.6} phase={2.1} />
      <Leaf curve={curve} t={0.52} angle={-0.75} scale={0.55} phase={3.0} />
      <Leaf curve={curve} t={0.66} angle={0.65} scale={0.5} phase={4.0} />
      <Leaf curve={curve} t={0.8} angle={-0.6} scale={0.45} phase={5.0} />
    </group>
  );
}