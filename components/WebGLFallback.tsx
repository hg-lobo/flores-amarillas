"use client";

export default function WebGLFallback() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at center, #2a1f1a 0%, #0a0404 100%)",
        zIndex: 5,
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#fdf6e3",
          padding: "2rem",
          maxWidth: "500px",
        }}
      >
        <h2
          className="font-serif"
          style={{
            fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
            color: "#ffdd66",
            fontWeight: 400,
            margin: "0 0 1rem",
            letterSpacing: "0.05em",
          }}
        >
          Feliz día de las flores amarillas
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            opacity: 0.7,
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.6,
          }}
        >
          Abrí este sitio en un dispositivo compatible para ver la experiencia
          completa.
        </p>
      </div>
    </div>
  );
}