"use client";

import { useState } from "react";
import { people, groupPhoto } from "@/data/people";
import { StickerHeart, StickerFlower, StickerStar } from "./Stickers";
import useDevice from "./useDevice";

export default function PhotoGarden({ visible }: { visible: boolean }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const device = useDevice();
  const isMobile = device === "mobile";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "1.5rem",
        zIndex: 20,
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 30}px)`,
        transition: "opacity 1.2s ease, transform 1.2s ease",
        pointerEvents: visible ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      {/* Collage */}
      <div
        style={{
          position: "relative",
          width: "min(95vw, 1100px)",
          height: isMobile ? "min(60vh, 500px)" : "min(72vh, 700px)",
          marginBottom: isMobile ? "1rem" : "1.5rem",
        }}
      >
        {/* FILA SUPERIOR: Mariángel - Juntos - Angélica */}

        <ScrapPhoto
          id="mariangel"
          photo={people[1].photo}
          name={people[1].name}
          style={{
            position: "absolute",
            top: "0%",
            left: "0%",
            transform: "rotate(-3deg)",
            width: isMobile ? "32%" : "30%",
            aspectRatio: "1 / 1",
          }}
          hovered={hoveredId === "mariangel"}
          onHover={setHoveredId}
          visible={visible}
          delay={0.2}
        />

        <ScrapPhoto
          id="juntos"
          photo={groupPhoto.photo}
          name={groupPhoto.name}
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%) rotate(1deg)",
            width: isMobile ? "34%" : "32%",
            aspectRatio: "1 / 1",
          }}
          hovered={hoveredId === "juntos"}
          onHover={setHoveredId}
          visible={visible}
          delay={0.35}
          big
        />

        <ScrapPhoto
          id="angelica"
          photo={people[0].photo}
          name={people[0].name}
          style={{
            position: "absolute",
            top: "0%",
            right: "0%",
            transform: "rotate(3deg)",
            width: isMobile ? "32%" : "30%",
            aspectRatio: "1 / 1",
          }}
          hovered={hoveredId === "angelica"}
          onHover={setHoveredId}
          visible={visible}
          delay={0.5}
        />

        {/* Stickers */}
        <StickerHeart
          style={{ position: "absolute", top: "0%", left: "31%", transform: "rotate(-15deg)" }}
          size={isMobile ? 20 : 30}
          color="#ff5577"
          delay={1.0}
          visible={visible}
        />
        <StickerHeart
          style={{ position: "absolute", top: "0%", right: "31%", transform: "rotate(15deg)" }}
          size={isMobile ? 18 : 28}
          color="#ff99aa"
          delay={1.1}
          visible={visible}
        />
        <StickerHeart
          style={{ position: "absolute", top: "55%", right: "3%", transform: "rotate(-20deg)" }}
          size={isMobile ? 20 : 30}
          color="#ff5577"
          delay={1.2}
          visible={visible}
        />

        <StickerFlower
          style={{ position: "absolute", top: "50%", left: "3%", transform: "rotate(15deg)" }}
          size={isMobile ? 24 : 36}
          delay={1.3}
          visible
        />
        <StickerFlower
          style={{ position: "absolute", bottom: "0%", right: "3%", transform: "rotate(-25deg)" }}
          size={isMobile ? 22 : 34}
          delay={1.4}
          visible
        />
        <StickerFlower
          style={{ position: "absolute", bottom: "0%", left: "3%", transform: "rotate(35deg)" }}
          size={isMobile ? 22 : 32}
          delay={1.5}
          visible
        />

        <StickerStar
          style={{ position: "absolute", top: "2%", left: "0%", transform: "rotate(10deg)" }}
          size={isMobile ? 14 : 20}
          delay={1.6}
          visible
        />
        <StickerStar
          style={{ position: "absolute", top: "2%", right: "0%", transform: "rotate(-15deg)" }}
          size={isMobile ? 14 : 20}
          delay={1.7}
          visible
        />
        <StickerStar
          style={{ position: "absolute", bottom: "2%", left: "0%", transform: "rotate(25deg)" }}
          size={isMobile ? 12 : 18}
          delay={1.8}
          visible
        />
        <StickerStar
          style={{ position: "absolute", bottom: "2%", right: "0%", transform: "rotate(-20deg)" }}
          size={isMobile ? 12 : 18}
          delay={1.9}
          visible
        />
      </div>

      {/* Mensaje final */}
      <div
        style={{
          maxWidth: isMobile ? "90%" : "600px",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : 20}px)`,
          transition: "opacity 1.4s ease 1.2s, transform 1.4s ease 1.2s",
        }}
      >
        <h2
          className="font-serif"
          style={{
            fontSize: isMobile
              ? "clamp(1rem, 4vw, 1.3rem)"
              : "clamp(1.2rem, 2vw, 1.6rem)",
            color: "#ffdd66",
            fontWeight: 400,
            letterSpacing: "0.06em",
            margin: "0 0 0.5rem",
            textShadow: "0 2px 24px rgba(255, 200, 80, 0.6)",
          }}
        >
          Las Amodoro
        </h2>
        <p
          className="font-serif"
          style={{
            fontSize: isMobile
              ? "clamp(0.75rem, 3vw, 0.9rem)"
              : "clamp(0.8rem, 1vw, 0.95rem)",
            color: "#fdf6e3",
            lineHeight: 1.6,
            margin: "0 0 0.75rem",
            opacity: 0.85,
          }}
        >
          Muchas gracias por siempre estar para mí.
        </p>
        <p
          className="font-serif"
          style={{
            fontSize: isMobile
              ? "clamp(0.7rem, 2.8vw, 0.8rem)"
              : "clamp(0.75rem, 0.9vw, 0.85rem)",
            color: "#ffdd66",
            lineHeight: 1.6,
            margin: 0,
            opacity: 0.75,
            fontStyle: "italic",
          }}
        >
          Esta flor es para ustedes.
        </p>
      </div>

      {/* Atribución */}
      <p
        style={{
          position: "absolute",
          bottom: "0.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.55rem",
          color: "#fdf6e3",
          opacity: 0.25,
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          maxWidth: "90vw",
          letterSpacing: "0.02em",
          pointerEvents: "auto",
        }}
      >
        <a
          href="https://skfb.ly/6BnnO"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#fdf6e3",
            textDecoration: "none",
          }}
        >
          "Rudbeckia Flower" by 3dhdscan (CC BY)
        </a>
      </p>
    </div>
  );
}

function ScrapPhoto({
  id,
  photo,
  name,
  style,
  hovered,
  onHover,
  visible,
  delay = 0,
  big = false,
}: {
  id: string;
  photo: string;
  name: string;
  style: React.CSSProperties;
  hovered: boolean;
  onHover: (id: string | null) => void;
  visible: boolean;
  delay?: number;
  big?: boolean;
}) {
  return (
    <div
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={() => onHover(id)}
      onTouchEnd={() => onHover(null)}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        cursor: "pointer",
        transform: `${style.transform} ${
          hovered ? "scale(1.06) rotate(0deg)" : ""
        }`,
        transition: `opacity 1s ease ${delay}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s ease`,
        filter: hovered
          ? "drop-shadow(0 8px 30px rgba(255, 200, 80, 0.7))"
          : "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45))",
        zIndex: hovered ? 10 : 1,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fdf6e3",
          padding: "8px 8px 28px 8px",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.05)",
          aspectRatio: "1 / 1",
        }}
      >
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            background: "#1a0a08",
            borderRadius: "2px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.6s ease, filter 0.4s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              filter: hovered ? "brightness(1.1) saturate(1.15)" : "brightness(1)",
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
            fontSize: big
              ? "clamp(0.75rem, 1.5vw, 1.2rem)"
              : "clamp(0.6rem, 1.1vw, 1rem)",
            color: "#6a3a1a",
            margin: 0,
            letterSpacing: "0.02em",
            fontWeight: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0 4px",
          }}
        >
          {name}
        </p>

        <div
          style={{
            position: "absolute",
            top: "-6px",
            left: "15%",
            width: "40%",
            height: "12px",
            background:
              "repeating-linear-gradient(45deg, rgba(255, 220, 100, 0.85) 0px, rgba(255, 220, 100, 0.85) 6px, rgba(255, 200, 80, 0.85) 6px, rgba(255, 200, 80, 0.85) 12px)",
            transform: "rotate(-3deg)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}