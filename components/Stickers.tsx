"use client";

// ============================================================
// STICKER: corazón
// ============================================================
export function StickerHeart({
  style,
  size = 30,
  color = "#ff5577",
  delay = 0,
  visible = true,
}: {
  style?: React.CSSProperties;
  size?: number;
  color?: string;
  delay?: number;
  visible?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{
        ...style,
        opacity: visible ? 0.95 : 0,
        transition: `opacity 0.8s ease ${delay}s`,
        filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ============================================================
// STICKER: flor amarilla
// ============================================================
export function StickerFlower({
  style,
  size = 40,
  delay = 0,
  visible = true,
}: {
  style?: React.CSSProperties;
  size?: number;
  delay?: number;
  visible?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      style={{
        ...style,
        opacity: visible ? 0.95 : 0,
        transition: `opacity 0.8s ease ${delay}s`,
        filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rot, i) => (
        <ellipse
          key={i}
          cx="20"
          cy="14"
          rx="4"
          ry="8"
          fill="#ffdd33"
          stroke="#e8a020"
          strokeWidth="0.6"
          transform={`rotate(${rot} 20 20)`}
        />
      ))}
      <circle
        cx="20"
        cy="20"
        r="5"
        fill="#8a5a1a"
        stroke="#5a3a08"
        strokeWidth="0.8"
      />
    </svg>
  );
}

// ============================================================
// STICKER: estrella
// ============================================================
export function StickerStar({
  style,
  size = 26,
  color = "#ffdd66",
  delay = 0,
  visible = true,
}: {
  style?: React.CSSProperties;
  size?: number;
  color?: string;
  delay?: number;
  visible?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{
        ...style,
        opacity: visible ? 0.95 : 0,
        transition: `opacity 0.8s ease ${delay}s`,
        filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <path
        d="M12 2l2.8 6.9L22 9.5l-5.4 4.9 1.7 7.1L12 17.7 5.7 21.5l1.7-7.1L2 9.5l7.2-.6L12 2z"
        fill={color}
        stroke="#fff"
        strokeWidth="1"
      />
    </svg>
  );
}