# Story of History

An HTML5 historical narrative-adventure built with Phaser 3, TypeScript, and Vite.

## Run locally

```bash
npm install
npm run dev
```

The `predev` hook prepares the required runtime images from the tracked source artwork before Vite starts. Open the URL printed by Vite. Use **WASD** or the **arrow keys** to move and **E** or **Space** to interact. Touch-capable devices receive a virtual joystick and contextual action button. The game is landscape-first.

## Production

```bash
npm run typecheck
npm run build
npm run preview
```

The `prebuild` hook prepares the same curated asset set before Vite creates the static deployment output in `dist/`. The generated `public/runtime-assets/` directory is intentionally ignored by Git; the original tracked artwork remains the source of truth. The deployment requires no backend.
