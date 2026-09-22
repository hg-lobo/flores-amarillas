"use client";

export default function SectionIndicator({
  total,
  current,
  onDotClick,
}: {
  total: number;
  current: number;
  onDotClick?: (n: number) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: "1.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        zIndex: 100,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick?.(i)}
          aria-label={`Ir a sección ${i + 1}`}
          style={{
            width: i === current ? "10px" : "6px",
            height: i === current ? "10px" : "6px",
            borderRadius: "50%",
            background: i === current ? "#ffdd66" : "rgba(253, 246, 227, 0.35)",
            border: "none",
            padding: 0,
            cursor: "pointer",
            transition: "all 0.4s ease",
            boxShadow:
              i === current
                ? "0 0 12px rgba(255, 220, 80, 0.8)"
                : "none",
          }}
        />
      ))}
    </div>
  );
}