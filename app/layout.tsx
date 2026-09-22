import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Feliz día de las flores amarillas",
  description: "Un pequeño viaje para tres personas especiales.",
  openGraph: {
    title: "Feliz día de las flores amarillas",
    description: "Un pequeño viaje para tres personas especiales.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flor amarilla con fondo dorado",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feliz día de las flores amarillas",
    description: "Un pequeño viaje para tres personas especiales.",
    images: ["/og-image.png"],
  },
  other: {
    attribution:
      '"Rudbeckia Flower" (https://skfb.ly/6BnnO) by 3dhdscan is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}