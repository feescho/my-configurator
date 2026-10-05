## Plan: Surreal Balloon Dog Configurator

Build a focused single-page Vite + Three.js configurator in `my-project`: a procedural classic balloon dog in a reflective gallery studio with a pale lilac/white atmosphere, chrome highlights, and controlled dark reflections. Users can orbit and zoom the object while configuration changes update the existing scene immediately.

**Steps**
1. Add `three` as a runtime dependency in `/Users/feschouteetens/Desktop/project folder/my-project/package.json`, preserving the existing Vite scripts.
2. Replace the starter markup and counter wiring in `src/main.js` with the configurator shell: a full-height viewer canvas, title/status treatment, and accessible controls for colour swatches, finish choices, and ear-shape choices.
3. Build the balloon dog procedurally from reusable Three.js primitives in `src/main.js`: rounded capsule/sphere-like balloon segments for torso, head, muzzle, legs, ears, tail, and joints. Keep references to the balloon meshes/material so colour and finish changes can be applied consistently; make ear geometry rebuild or update when the ear shape changes.
4. Set up the visual scene: perspective camera, `OrbitControls` with pan disabled and bounded zoom/orbit, reflective gallery background, floor, soft contact shadow, and layered key/rim/fill lighting. Use physical/standard materials as appropriate for glossy, metallic, and matte presets. Include resize handling and an animation loop, with subtle auto-rotation only if it does not interfere with direct inspection.
5. Replace `src/style.css` with a responsive art-direction layout: pale lilac gallery palette, expressive display typography, prominent stable canvas, compact labeled controls, swatches/segmented options, focus-visible states, and mobile stacking. Keep the 3D object visually primary and avoid nested card-heavy UI.
6. Update `index.html` title and metadata to describe the balloon dog configurator; remove starter-only references from the active app surface. Leave unused starter files/assets alone unless they cause build or lint issues.

**Relevant files**
- `/Users/feschouteetens/Desktop/project folder/my-project/package.json` — add the Three.js dependency.
- `/Users/feschouteetens/Desktop/project folder/my-project/src/main.js` — own UI markup, dog geometry, materials, lighting, controls, resize lifecycle, and configuration state updates. Use `/Users/feschouteetens/Desktop/project folder/my-first-project/src/main.js` as the local reference for Three.js setup and swatch interaction.
- `/Users/feschouteetens/Desktop/project folder/my-project/src/style.css` — replace Vite starter styling with the responsive configurator visual system; `/Users/feschouteetens/Desktop/project folder/my-first-project/src/style.css` is the local reference for dark responsive canvas layout.
- `/Users/feschouteetens/Desktop/project folder/my-project/index.html` — set meaningful document title and metadata.

**Verification**
1. Install dependencies and run `npm run build` in `my-project`.
2. Start Vite and inspect the page at desktop and mobile widths: the dog renders without a blank canvas, the studio lighting/floor/shadow read correctly, and controls remain visible without overlap.
3. Drag the canvas to orbit and use wheel/pinch to zoom; verify bounded camera behavior and responsive resize.
4. Change each colour swatch and verify every balloon segment updates while eyes/details remain separate.
5. Switch glossy, metallic, and matte finishes and verify visible roughness/metalness differences.
6. Switch ear shapes and verify both ears update symmetrically without leaving stale geometry or changing the overall layout.
7. Check keyboard operation and visible focus states for all controls, then run the workspace error checker on touched files.

**Visual brief**

**Overall visual style**
- Create a glossy chromatic balloon sculpture: a recognizable classic balloon dog presented as a playful, surreal, premium collectible object.
- Combine inflated bubble forms, chrome and transparent surfaces, saturated neon accents, and a pale lilac editorial presentation.
- Keep the colour expressive but the composition disciplined so the dog remains easy to inspect.
- Use `voorbeeld my project 2.jpg` as the primary reference for the balloon-dog silhouette, segmentation, gloss, transparency, and studio presentation.
- Use `kleur palette my project.jpg` for the energetic colour relationships and iridescent mood, without copying its busy marbled texture.

**Colour palette**
- Studio background: pale lilac `#F1EAF4`.
- Deep contrast: ink black `#11111A`.
- Electric blue: `#25A9F0`.
- Liquid cyan: `#16D7CF`.
- Electric violet: `#7845E8`.
- Hot magenta: `#D943B8`.
- Acid mint: `#A9F28E`.
- Soft signal yellow: `#F5DE72`.
- Cool chrome highlight: `#DDE4EA`.
- Use a transparent pearl body with magenta, violet, and cyan accents as the initial visual direction; expose blue, yellow, mint, magenta, and violet as curated colour options.
- These values are practical starting points sampled from the visual relationships in `kleur palette my project.jpg`, not a requirement to reproduce every colour at once.

**Typography**
- Use a rounded, heavy display treatment for the configurator title, inspired by the inflated pink forms in `lettertype my project 2.jpg`.
- Use clean geometric sans-serif typography for controls, labels, and supporting text so the interface remains legible.
- Reserve chrome or bubble effects for the title or small brand moments; do not use balloon typography for body copy or dense controls.
- Use `lettertype my project.jpg` as a reference for tubular chrome construction, specular highlights, and premium material language, not as a literal alphabet or full interface font.

**UI and layout**
- Make the 3D dog the primary visual focus in a spacious single-page viewer.
- Place a compact art-direction panel beside the canvas on desktop and stack it below the canvas on mobile.
- Organize controls into colour, finish, and ear-shape groups.
- Use circular colour swatches, segmented finish controls, and small visual ear-shape previews with clear active states.
- Use pale lilac space, restrained borders, soft shadows, and generous whitespace rather than dense cards or a traditional ecommerce layout.
- Use `lettertype my project 2.jpg` for the soft, bold display language and `voorbeeld my project 2.jpg` for the spacious product-visualization composition.

**Balloon dog materials**
- The default material is glossy inflated latex or vinyl: smooth surface, strong clearcoat, saturated colour, and elongated white studio reflections.
- Selected sections such as ears or muzzle may use subtle transparency or transmission, inspired by the transparent forms in `voorbeeld my project.jpg` and `voorbeeld my project 2.jpg`.
- The chrome finish uses high metalness and cool silver reflections, informed by the balloon letters in `lettertype my project.jpg`.
- The matte finish reduces clearcoat and softens the highlights while retaining the inflated geometry.
- Preserve rounded balloon segments, connector knots, seams, and subtle overlaps so the object reads as physically assembled.
- Do not add the flowers, butterfly decoration, or other internal ornaments from `voorbeeld my project.jpg` in the first version.

**Lighting and background**
- Use a pale lilac-white reflective gallery studio rather than a fully dark environment.
- Add a large soft key light, vertical strip highlights, cyan and magenta rim accents, lavender ambient light, and a subtle oval ground shadow.
- Use a faint reflective floor and bright elongated specular highlights to make the balloon surfaces luminous.
- Avoid flat ambient lighting, harsh shadows, and an overly black cinematic background.
- Take the soft studio atmosphere and shadow from both example images; take the high-contrast neon energy from `kleur palette my project.jpg` without using its artwork as the background.

**Moodboard image responsibilities**
- `kleur palette my project.jpg`: colour relationships, neon accents, iridescent energy, and controlled use of black contrast. Ignore its cosmic marbling and busy texture as a literal layout.
- `lettertype my project.jpg`: chrome balloon material, tubular construction, and premium specular highlights. Ignore the alphabet grid as UI structure and avoid using it for all text.
- `lettertype my project 2.jpg`: inflated bubble typography, rounded display forms, and glossy pink treatment. Ignore the fixed `LOVE` composition and use a readable sans-serif for controls.
- `voorbeeld my project.jpg`: transparent shell material, internal visibility, whimsical collectible mood, and soft pale studio lighting. Ignore the flowers, butterfly decoration, watermarks, and extra internal detail.
- `voorbeeld my project 2.jpg`: classic balloon-dog silhouette, glossy segmentation, transparent and saturated sections, pale lilac background, and soft floor shadow. Ignore its exact colour arrangement, watermarks, and editorial crop.

**Decisions**
- Form: classic balloon dog.
- First controls: balloon colour, material/finish, and ear shape.
- Interaction layout: art-direction panel with larger visual controls and labels.
- Use procedural primitives instead of external model assets so the first version is self-contained and easy to tune.

**Assumptions**
- `my-project` is the intended target; `my-first-project` is reference material only.
- The first version can use a small curated set of preset colours and finish/ear choices rather than freeform authoring.
- Three.js primitives are sufficient for a stylized, recognizable balloon dog at this stage.

**Open decisions**
- Proposed ear choices: small folded, tall folded, and oversized loop.
- Proposed camera behavior: user-controlled orbit/zoom with very subtle auto-rotation when idle; disable auto-rotation if inspection should feel completely static.

**Scope boundaries**
- Include orbit/zoom inspection, live configuration, responsive layout, and accessible control states.
- Exclude persistence, sharing/export, model import, authentication, physics, audio, and a multi-page workflow.
