# 🌻 Feliz Día de las Flores Amarillas

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React Three Fiber](https://img.shields.io/badge/R3F-9-orange)
![License](https://img.shields.io/badge/license-CC%20BY-green)

Una experiencia web inmersiva y narrativa creada para tres personas especiales: **María**, **Mariángel** y **Angélica**.

Cinco secciones, una flor 3D, y un mensaje que se despliega a medida que bajás por el tallo.

---

## ✨ ¿Qué es esto?

Una one-page experience con scroll narrativo donde:

- **Sección 0 (Hero)**: una flor 3D gira suavemente con luciérnagas, polen y pétalos flotando.
- **Secciones 1, 2, 3 (Tallo)**: mientras bajás por el tallo, aparecen mensajes personales junto a fotos artesanales tipo polaroid.
- **Sección 4 (Raíz)**: un collage scrapbook con fotos reales y el mensaje final.

Todo con estética cálida de atardecer, animaciones suaves, y un mood que mezcla lo cute con lo cinematográfico.

---

## 🛠️ Stack técnico

- **[Next.js 16](https://nextjs.org/)** (App Router)
- **[TypeScript](https://www.typescriptlang.org/)**
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** + **[Drei](https://github.com/pmndrs/drei)** — para la flor 3D
- **[Postprocessing](https://github.com/pmndrs/postprocessing)** — bloom, vignette, chromatic aberration, noise
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Vercel](https://vercel.com/)** — deploy

---

## 🚀 Correr en local

```bash
# Clonar el repo
git clone https://github.com/TU-USUARIO/flores-amarillas.git

# Entrar a la carpeta
cd flores-amarillas

# Instalar dependencias
npm install

# Correr el servidor de desarrollo
npm run dev
Abrí http://localhost:3000 en tu navegador.

📁 Estructura del proyecto
text
flores-amarillas/
├── app/
│   ├── layout.tsx          # Fuentes y metadata
│   ├── page.tsx            # Página principal (maneja las secciones)
│   └── globals.css         # Estilos globales
├── components/
│   ├── Flower.tsx          # La flor 3D + tallo
│   ├── Stem.tsx            # Tallo procedural con pelitos y hojas
│   ├── SkyGradient.tsx     # Cielo con degradado cálido
│   ├── Fireflies.tsx       # Luciérnagas doradas
│   ├── Pollen.tsx          # Polen flotante
│   ├── FallingPetals.tsx   # Pétalos cayendo
│   ├── TextBeat.tsx        # Los mensajes narrativos
│   ├── PhotoGarden.tsx     # Collage final de fotos
│   ├── SectionIndicator.tsx # Puntos de navegación
│   ├── Stickers.tsx        # SVGs decorativos (corazones, flores, estrellas)
│   └── useSections.ts      # Hook para cambiar de sección
├── data/
│   ├── messages.ts         # Textos narrativos (editables)
│   └── people.ts           # Nombres y rutas de fotos (editables)
└── public/
    ├── modelos/
    │   └── flor.glb        # Modelo 3D de la flor
    └── fotos/              # Fotos de las personas
🎨 Cómo personalizar
Cambiar los textos
Editá data/messages.ts:

ts
export const heroTitle = "Feliz día de las flores amarillas";

export const stemMessages = [
  { id: "beat-1", text: "..." },
  { id: "beat-2", text: "..." },
  { id: "beat-3", text: "..." },
];
Cambiar las fotos
Reemplazá las imágenes en public/fotos/:

maria.jpg

mariangel.jpg

YoyA.jpg

juntos.jpg

Y editá los nombres en data/people.ts.

Cambiar los colores
Los colores principales están en:

app/globals.css (variables CSS)

Cada componente tiene sus colores en línea.

📸 Créditos
Modelo 3D: "Rudbeckia Flower" (https://skfb.ly/6BnnO) by 3dhdscan is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

💛 Dedicatoria
Esta experiencia fue creada con mucho cariño para María, Mariángel y Angélica.

Gracias por siempre estar.