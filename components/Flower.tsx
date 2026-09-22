"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Flower() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/modelos/flor.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          const m = mat as THREE.MeshStandardMaterial;
          const matName = m.name || "";

          m.transparent = false;
          m.alphaTest = 0.5;
          m.opacity = 1;
          m.side = THREE.FrontSide;
          m.depthWrite = true;
          m.metalness = 0.0;

          if (matName.includes("petal")) {
            m.color = new THREE.Color("#ffdd00");
            m.emissive = new THREE.Color("#ff7700");
            m.emissiveIntensity = 0.55;
            m.roughness = 0.55;
          } else if (matName.includes("kalisek")) {
            m.color = new THREE.Color("#7a8a3a");
            m.emissive = new THREE.Color("#5a2808");
            m.emissiveIntensity = 0.35;
            m.roughness = 0.7;
          } else if (matName.includes("pollen")) {
            m.color = new THREE.Color("#3a1a08");
            m.emissive = new THREE.Color("#aa5515");
            m.emissiveIntensity = 0.75;
            m.roughness = 0.85;
          } else if (matName.includes("stonek") || matName.includes("hairs")) {
            m.color = new THREE.Color("#88cc44");
            m.emissive = new THREE.Color("#3a6a15");
            m.emissiveIntensity = 0.25;
            m.roughness = 0.7;
          }

          m.needsUpdate = true;
        });
      }
    });

    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z =
      Math.sin(t * 0.5) * 0.045 + Math.sin(t * 0.9) * 0.02;
    groupRef.current.rotation.x =
      Math.cos(t * 0.4) * 0.03 + Math.cos(t * 0.8) * 0.012;
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, Math.PI, 0]}
      scale={2.5}
      position={[0, -0.30, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/modelos/flor.glb");