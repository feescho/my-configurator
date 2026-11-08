# Balloon Animal Studio

Balloon Animal Studio is a school project built with Vite and Three.js. This interactive 3D configurator lets users create their own balloon animal by choosing its colour, material, shape, and decorations, with changes displayed in real time.

**Live website:** [Balloon Animal Studio on Vercel](https://my-configurator-iota.vercel.app)

## Features

- **Animals:** switch between Balloon Dog and Balloon Rabbit.
- **Colours:** choose hot pink, purple, turquoise, or soft yellow for the whole animal.
- **Surface materials:** Jewel glass, Glossy vinyl, and Chrome.
- **Shape customization:** adjust the Dog's ears, body, and tail, or the Rabbit's ear length and tail shape.
- **Optional flowers:** display 3D flowers inside the transparent Jewel glass balloon. With Glossy vinyl or Chrome, flowers appear as a surface pattern instead.
- **Interactive viewing:** drag to rotate and scroll or pinch to zoom.
- **Responsive interfaces:** desktop controls surround the viewer; mobile screens use Animal, Surface, Form, and Colour navigation with compact configuration panels.
- **Light and Dark themes:** the selected theme is saved locally in the browser.

## Technologies

- **Three.js:** 3D geometry, physical materials, lighting, and orbit controls.
- **Vite:** local development server and production build tooling.
- **JavaScript, HTML, and CSS:** application logic and responsive interface.
- **npm:** dependency management and project scripts.
- **Vercel:** live website hosting.

## Run locally

Install Node.js 22.12 or newer and npm. Use a browser with WebGL support to view the 3D scene.

Clone the repository and enter its folder:

```bash
git clone https://github.com/feescho/my-configurator.git
cd my-configurator
```

If you already have the project locally, open its folder instead (for example, `my-project`). Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. Stop the server with `Ctrl+C`.

## Production build

From the project folder, run:

```bash
npm run build
```

The production files are generated in `dist/`. To preview that build locally:

```bash
npm run preview
```

Open the preview URL printed in the terminal. This command serves the local build; it does not deploy the website.
