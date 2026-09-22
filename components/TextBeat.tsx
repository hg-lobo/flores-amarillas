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
  const mobileStyles: React.CSSProperties = {
    position: "absolute",
    bottom: "12%",
    left: "1.25rem",
    right: "1.25rem",
    top: "auto",
    maxWidth: "calc(100% - 2.5rem)",
    padding: 0,
    textAlign: "center",
    transform: `translateY(${visible ? 0 : 30}px)`,
  };

  const desktopStyles: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    [side === "right" ? "right" : "left"]: "6%",
    maxWidth: "38%",
    padding: "1.5rem",
    textAlign: side === "right" ? "left" : "right",
    transform: `translateY(calc(-50% + ${visible ? 0 : 30}px))`,
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <div
      style={{
        ...styles,
        color: "#fdf6e3",
        opacity: visible ? 1 : 0,
        transition:
          "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
        wordWrap: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      <p
        className="font-serif"
        style={{
          fontSize: isMobile
            ? "clamp(0.85rem, 3.5vw, 1.05rem)"
            : "clamp(0.95rem, 1.8vw, 1.4rem)",
          lineHeight: isMobile ? 1.5 : 1.6,
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