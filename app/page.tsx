"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Flower from "@/components/Flower";
import Fireflies from "@/components/Fireflies";
import FallingPetals from "@/components/FallingPetals";
import Pollen from "@/components/Pollen";
import SkyGradient from "@/components/SkyGradient";
import TextBeat from "@/components/TextBeat";
import SectionIndicator from "@/components/SectionIndicator";
import PhotoGarden from "@/components/PhotoGarden";
import useSections from "@/components/useSections";
import SceneErrorBoundary from "@/components/SceneErrorBoundary";
import WebGLFallback from "@/components/WebGLFallback";
import { heroTitle, stemMessages } from "@/data/messages";
import {
  StickerHeart,
  StickerFlower,
  StickerStar,
} from "@/components/Stickers";

const TOTAL_SECTIONS = 5;

const SECTION_CAMERA_Y = [0, -0.2, -0.4, -0.6, -0.8];
const SECTION_LOOK_AT_Y = [0, -0.2, -0.4, -0.6, -0.8];

// ============================================================
// HOOK: detecta móvil y tablet
// ============================================================
function useDevice() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w <= 768) setDevice("mobile");
      else if (w <= 1024) setDevice("tablet");
      else setDevice("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return device;
}

// ============================================================
// CÁMARA
// ============================================================
function SectionCamera({ section }: { section: number }) {
  const { camera } = useThree();
  const targetY = useRef(SECTION_CAMERA_Y[0]);
  const lookAtY = useRef(SECTION_LOOK_AT_Y[0]);
  const currentLookAt = useRef(new THREE.Vector3(0, SECTION_LOOK_AT_Y[0], 0));
  const hasInit = useRef(false);

  useEffect(() => {
    targetY.current = SECTION_CAMERA_Y[section] ?? 0;
    lookAtY.current = SECTION_LOOK_AT_Y[section] ?? 0;
  }, [section]);

  useFrame((_, delta) => {
    if (!hasInit.current) {
      camera.position.set(0, targetY.current, 0.6);
      camera.lookAt(0, lookAtY.current, 0);
      currentLookAt.current.set(0, lookAtY.current, 0);
      hasInit.current = true;
      return;
    }

    const smoothness = 1 - Math.pow(0.001, delta);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, smoothness);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY.current,
      smoothness
    );
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 0.6, smoothness);

    currentLookAt.current.y = THREE.MathUtils.lerp(
      currentLookAt.current.y,
      lookAtY.current,
      smoothness
    );
    camera.lookAt(0, currentLookAt.current.y, 0);
  });

  return null;
}

// ============================================================
// ESCENA 3D (optimizada por dispositivo)
// ============================================================
function Scene({ section, device }: { section: number; device: string }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";

  // Partículas adaptadas al dispositivo
  const fireflyCount = isMobile ? 20 : isTablet ? 80 : 150;
  const pollenCount = isMobile ? 12 : isTablet ? 45 : 70;
  const petalCount = isMobile ? 4 : isTablet ? 15 : 25;

  return (
    <Canvas
      camera={{ position: [0, 0, 0.6], fov: 38 }}
      gl={{
        antialias: !isMobile,
        powerPreference: "high-performance",
        alpha: false,
      }}
      dpr={isMobile ? 1 : [1, 2]}
      shadows={isMobile ? false : "soft"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
    >
      <fog attach="fog" args={["#0a0404", 3, 7]} />

      <SkyGradient />

      <ambientLight intensity={0.35} color="#ffffff" />

      <directionalLight
        position={[3, 4, 2]}
        intensity={3.0}
        color="#ffe0a0"
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0001}
        shadow-radius={4}
      />

      <directionalLight position={[-3, 2, 2]} intensity={0.8} color="#ffbb77" />
      <directionalLight position={[-1, 2, -4]} intensity={2.2} color="#ff8844" />

      <pointLight position={[0, -1, 0.5]} intensity={0.7} color="#ffaa55" />

      {/* Environment: solo en desktop/tablet */}
      {!isMobile && (
        <Environment preset="sunset" environmentIntensity={0.3} />
      )}

      <Fireflies count={fireflyCount} />
      <Pollen count={pollenCount} />
      <FallingPetals count={petalCount} />

      <Suspense fallback={null}>
        <Flower />
      </Suspense>

      <SectionCamera section={section} />

      {/* Post-processing: SOLO en desktop y tablet */}
      {!isMobile && (
        <EffectComposer multisampling={isTablet ? 0 : 4}>
          <Bloom
            intensity={isTablet ? 0.5 : 0.8}
            luminanceThreshold={0.65}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
          {!isTablet && (
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0006, 0.0006)}
              radialModulation={false}
              modulationOffset={0}
            />
          )}
          {!isTablet && (
            <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
          )}
          <Vignette eskil={false} offset={0.3} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

// ============================================================
// FOTO ARTESANAL
// ============================================================
function CraftPhoto({
  src,
  caption,
  style,
  rotation = 0,
  visible,
  delay = 0,
}: {
  src: string;
  caption: string;
  style: React.CSSProperties;
  rotation?: number;
  visible: boolean;
  delay?: number;
}) {
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        opacity: visible ? 1 : 0,
        transform: `translateY(-50%) rotate(${rotation}deg) translateY(${
          visible ? 0 : 20
        }px)`,
        transition: `opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        pointerEvents: "none",
        filter: "drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5))",
        zIndex: 12,
      }}
    >
      <div
        style={{
          background: "#fdf6e3",
          padding: "10px 10px 32px 10px",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.08)",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: "#1a0a08",
            borderRadius: "2px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={caption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <p
          style={{
            position: "absolute",
            bottom: "6px",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Brush Script MT', 'Caveat', cursive",
            fontSize: "clamp(0.7rem, 1vw, 1rem)",
            color: "#6a3a1a",
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          {caption}
        </p>

        <div
          style={{
            position: "absolute",
            top: "-8px",
            left: "20%",
            width: "45%",
            height: "14px",
            background:
              "repeating-linear-gradient(45deg, rgba(255, 220, 100, 0.85) 0px, rgba(255, 220, 100, 0.85) 6px, rgba(255, 200, 80, 0.85) 6px, rgba(255, 200, 80, 0.85) 12px)",
            transform: "rotate(-4deg)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// PÁGINA
// ============================================================
export default function Home() {
  const { section, goTo } = useSections(TOTAL_SECTIONS);
  const device = useDevice();
  const isMobile = device === "mobile";

  const sectionPhotos = [
    { src: "/fotos/YoyA.jpg", caption: "Angélica & Me" },
    { src: "/fotos/mariangel.jpg", caption: "Angélica, Mariángel & Me" },
    { src: "/fotos/maria.jpg", caption: "María & Me" },
  ];

  const photoStyles = isMobile
    ? {
        section1: {
          top: "24%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(120px, 45vw, 180px)",
        } as React.CSSProperties,
        section2: {
          top: "24%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(120px, 45vw, 180px)",
        } as React.CSSProperties,
        section3: {
          top: "24%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(120px, 45vw, 180px)",
        } as React.CSSProperties,
        rotation: 0,
      }
    : {
        section1: {
          top: "50%",
          left: "15%",
          width: "clamp(200px, 22vw, 320px)",
        } as React.CSSProperties,
        section2: {
          top: "50%",
          right: "15%",
          width: "clamp(200px, 22vw, 320px)",
        } as React.CSSProperties,
        section3: {
          top: "50%",
          left: "15%",
          width: "clamp(200px, 22vw, 320px)",
        } as React.CSSProperties,
        rotation: -4,
      };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#0a0404",
        overflow: "hidden",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Escena 3D con ErrorBoundary */}
      <SceneErrorBoundary fallback={<WebGLFallback />}>
        <Scene section={section} device={device} />
      </SceneErrorBoundary>

      {/* Overlay oscuro sección 4 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, transparent 15%, rgba(0, 0, 0, 0.95) 70%)",
          opacity: section === 4 ? 1 : 0,
          transition: "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      {/* Hero */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "5%" : "7%",
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
          color: "#fdf6e3",
          padding: isMobile ? "0 1rem" : "0 1.5rem",
          zIndex: 10,
          opacity: section === 0 ? 1 : 0,
          transform: `translateY(${section === 0 ? 0 : -20}px)`,
          transition:
            "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <h1
          className="font-serif"
          style={{
            fontSize: isMobile
              ? "clamp(1rem, 5vw, 1.5rem)"
              : "clamp(1.4rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.06em",
            margin: 0,
            textShadow:
              "0 2px 32px rgba(255, 220, 80, 0.9), 0 0 80px rgba(255, 200, 60, 0.5)",
          }}
        >
          {heroTitle}
        </h1>
      </div>

      {/* Mensajes del tallo */}
      {stemMessages.map((msg, i) => (
        <TextBeat
          key={msg.id}
          text={msg.text}
          visible={section === i + 1}
          side={isMobile ? "right" : i % 2 === 0 ? "right" : "left"}
          isMobile={isMobile}
        />
      ))}

      {/* Fotos artesanales */}
      <CraftPhoto
        src={sectionPhotos[0].src}
        caption={sectionPhotos[0].caption}
        style={photoStyles.section1}
        rotation={photoStyles.rotation}
        visible={section === 1}
        delay={0.5}
      />
      <CraftPhoto
        src={sectionPhotos[1].src}
        caption={sectionPhotos[1].caption}
        style={photoStyles.section2}
        rotation={photoStyles.rotation * -1}
        visible={section === 2}
        delay={0.5}
      />
      <CraftPhoto
        src={sectionPhotos[2].src}
        caption={sectionPhotos[2].caption}
        style={photoStyles.section3}
        rotation={photoStyles.rotation}
        visible={section === 3}
        delay={0.5}
      />

      {/* Fotos finales */}
      <PhotoGarden visible={section === 4} />

      {/* Indicador */}
      <SectionIndicator
        total={TOTAL_SECTIONS}
        current={section}
        onDotClick={goTo}
      />

      {/* Hint scroll */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#fdf6e3",
          opacity: section === 0 ? 0.55 : 0,
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "none",
          zIndex: 10,
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        scroll ↓
      </div>

      {/* ============ STICKERS ============ */}

      {/* Sección 0 (Hero) */}
      {section === 0 && (
        <>
          <StickerHeart
            style={{ position: "absolute", top: "5%", left: "6%", transform: "rotate(-15deg)" }}
            size={isMobile ? 18 : 28}
            color="#ff5577"
            delay={0.3}
            visible
          />
          <StickerHeart
            style={{ position: "absolute", top: "12%", right: "8%", transform: "rotate(20deg)" }}
            size={isMobile ? 20 : 34}
            color="#ff99aa"
            delay={0.5}
            visible
          />
          <StickerFlower
            style={{ position: "absolute", bottom: "15%", left: "8%", transform: "rotate(15deg)" }}
            size={isMobile ? 24 : 40}
            delay={0.6}
            visible
          />
          <StickerFlower
            style={{ position: "absolute", bottom: "20%", right: "6%", transform: "rotate(-25deg)" }}
            size={isMobile ? 22 : 36}
            delay={0.7}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "35%", left: "4%", transform: "rotate(10deg)" }}
            size={isMobile ? 14 : 22}
            delay={0.9}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "25%", right: "5%", transform: "rotate(-10deg)" }}
            size={isMobile ? 12 : 18}
            delay={1.0}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "55%", left: "3%", transform: "rotate(-20deg)" }}
            size={isMobile ? 12 : 16}
            delay={1.1}
            visible
          />
          <StickerStar
            style={{ position: "absolute", bottom: "35%", right: "4%", transform: "rotate(15deg)" }}
            size={isMobile ? 14 : 20}
            delay={1.2}
            visible
          />
        </>
      )}

      {/* Sección 1 */}
      {section === 1 && (
        <>
          <StickerHeart
            style={{ position: "absolute", top: "45%", left: "3%", transform: "rotate(-20deg)" }}
            size={isMobile ? 18 : 26}
            color="#ff5577"
            delay={0.4}
            visible
          />
          <StickerFlower
            style={{ position: "absolute", bottom: "12%", left: "6%", transform: "rotate(15deg)" }}
            size={isMobile ? 22 : 34}
            delay={0.6}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "12%", left: "5%", transform: "rotate(10deg)" }}
            size={isMobile ? 14 : 22}
            delay={0.8}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "8%", left: "16%", transform: "rotate(-15deg)" }}
            size={isMobile ? 12 : 18}
            delay={0.9}
            visible
          />
          <StickerStar
            style={{ position: "absolute", bottom: "15%", left: "18%", transform: "rotate(20deg)" }}
            size={isMobile ? 14 : 20}
            delay={1.0}
            visible
          />
        </>
      )}

      {/* Sección 2 */}
      {section === 2 && (
        <>
          <StickerHeart
            style={{ position: "absolute", top: "45%", right: "3%", transform: "rotate(20deg)" }}
            size={isMobile ? 18 : 28}
            color="#ff5577"
            delay={0.4}
            visible
          />
          <StickerFlower
            style={{ position: "absolute", bottom: "12%", right: "6%", transform: "rotate(-15deg)" }}
            size={isMobile ? 22 : 36}
            delay={0.6}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "12%", right: "5%", transform: "rotate(-10deg)" }}
            size={isMobile ? 14 : 22}
            delay={0.8}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "8%", right: "16%", transform: "rotate(15deg)" }}
            size={isMobile ? 12 : 18}
            delay={0.9}
            visible
          />
          <StickerStar
            style={{ position: "absolute", bottom: "15%", right: "18%", transform: "rotate(-20deg)" }}
            size={isMobile ? 14 : 20}
            delay={1.0}
            visible
          />
        </>
      )}

      {/* Sección 3 */}
      {section === 3 && (
        <>
          <StickerHeart
            style={{ position: "absolute", top: "45%", left: "3%", transform: "rotate(-18deg)" }}
            size={isMobile ? 20 : 30}
            color="#ff99aa"
            delay={0.4}
            visible
          />
          <StickerFlower
            style={{ position: "absolute", bottom: "12%", left: "6%", transform: "rotate(20deg)" }}
            size={isMobile ? 24 : 38}
            delay={0.6}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "12%", left: "5%", transform: "rotate(10deg)" }}
            size={isMobile ? 14 : 22}
            delay={0.8}
            visible
          />
          <StickerStar
            style={{ position: "absolute", top: "8%", left: "16%", transform: "rotate(-15deg)" }}
            size={isMobile ? 12 : 18}
            delay={0.9}
            visible
          />
          <StickerStar
            style={{ position: "absolute", bottom: "15%", left: "18%", transform: "rotate(18deg)" }}
            size={isMobile ? 14 : 20}
            delay={1.0}
            visible
          />
        </>
      )}
    </main>
  );
}