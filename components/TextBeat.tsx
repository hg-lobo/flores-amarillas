"use client";

export default function TextBeat({
  text,
  visible,
  side = "right",
  isMobile = false,
}: {
  text: string;
  visible: boolean;
  side?: "left" | "right";
  isMobile?: boolean;
}) {
  // En móvil: texto abajo, ancho completo, centrado
  // En desktop: texto al costado según "side"
  const styles: React.CSSProperties = isMobile
    ? {
        position: "absolute",
        bottom: "10%",
        left: 0,
        right: 0,
        top: "auto",
        maxWidth: "100%",
        padding: "0 1.5rem",
        textAlign: "center",
      }
    : {
        position: "absolute",
        top: "50%",
        [side === "right" ? "right" : "left"]: "6%",
        maxWidth: "38%",
        padding: "1.5rem",
        textAlign: side === "right" ? "left" : "right",
        transform: `translateY(calc(-50% + ${visible ? 0 : 30}px))`,
      };

  return (
    <div
      style={{
        ...styles,
        color: "#fdf6e3",
        opacity: visible ? 1 : 0,
        transform: isMobile
          ? `translateY(${visible ? 0 : 30}px)`
          : styles.transform,
        transition:
          "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      <p
        className="font-serif"
        style={{
          fontSize: isMobile
            ? "clamp(0.9rem, 3.8vw, 1.15rem)"
            : "clamp(0.95rem, 1.8vw, 1.4rem)",
          lineHeight: 1.6,
          fontWeight: 400,
          letterSpacing: "0.02em",
          margin: 0,
          whiteSpace: "pre-line",
          textShadow: "0 2px 24px rgba(255, 180, 80, 0.5)",
        }}
      >
        {text}
      </p>
    </div>
  );
}