# Balloon Animal Studio — Agent Guide

## Purpose and scope

Balloon Animal Studio is a school project: a single-page, interactive 3D configurator built with Vite, Three.js, HTML, CSS, and vanilla JavaScript ES modules. Users choose a procedural Balloon Dog or Balloon Rabbit and adjust its colour, surface, form, and optional flowers in real time.

Read `README.md` for setup and the current feature overview. `PLAN.md` records the original Dog-only design brief; it is historical context, not an accurate inventory of current features. In particular, its proposed matte finish, idle rotation, and initial exclusion of flowers do not describe the current implementation. Use the actual source as the authority when documentation differs.

## Rules for future agents

- Preserve the existing visual identity and design: prominent condensed headline, pink accents, sculptural balloon forms, studio reflections, light/dark themes, and spacious composition.
- Do not change the desktop layout when working on mobile. Scope mobile changes to the existing mobile breakpoint and navigation implementation; verify desktop and intermediate widths afterward.
- Keep the 3D model interactive, including drag rotation and wheel/pinch zoom. Preserve canvas pointer access, touch handling, OrbitControls, and responsive camera framing.
- Do not break existing configuration options or their selected states. Preserve separate animal colours and forms, shared surface/flower settings, and synchronization between desktop and mobile controls.
- Test changes with `npm run build`. For UI or scene changes, also perform the relevant browser checks below; a successful build does not validate appearance or interaction.
- Never commit, push, or deploy unless the user explicitly requests it. The live-site link in the README is not deployment authorization.
- Keep changes focused on the requested task. Do not introduce dependencies, redesigns, or unrelated cleanup without a task-related reason. Preserve existing user changes.

## Architecture and important files

| File or directory | Responsibility |
| --- | --- |
| `index.html` | HTML entry point, `#app` mount, metadata, and an early script restoring the saved theme before the app loads. |
| `src/main.js` | Generates the interface; owns configuration state, event handlers, procedural animal geometry, shared materials, Three.js scene, lighting, renderer, OrbitControls, resize handling, and render loop. |
| `src/flowers.js` | Creates instanced 3D interior flowers and adds shader-based flower patterns to opaque surface materials. |
| `src/framing.js` | Fits the camera to the current model bounds and canvas aspect, smooths transitions, and defers fitting during interaction. |
| `src/style.css` | Main visual system, themes, desktop/intermediate layouts, responsive rules, control illustrations, and CSS material previews. Later rules override earlier ones; inspect the full cascade before editing. |
| `src/mobile-navigation.js` | Builds Animal, Surface, Form, and Colour navigation with compact sheets that proxy existing configuration buttons. |
| `src/mobile-navigation.css` | Mobile navigation and layout rules, scoped to `max-width: 767px`, plus the desktop rule hiding the mobile interface. |
| `package.json`, `package-lock.json` | npm scripts and dependency declarations/lockfile. Declared dependencies are Three.js `^0.180.0` and Vite `^8.3.0`. |
| `README.md` | Current project overview, local setup, build/preview instructions, and live-site link. |
| `PLAN.md`, `Moodboard/` | Original design intentions and visual references, not additional implemented functionality. |
| `src/counter.js`, `src/assets/`, `public/` | Starter helper and assets; the active configurator does not import the counter or these image assets. Do not remove them merely as incidental cleanup. |
| `dist/`, `node_modules/` | Ignored build output and installed dependencies. Do not hand-edit them as source. |

There is no frontend framework, router, backend, or external animal-model loader. Animals are assembled from Three.js spheres, tori, capsules, and extrusions. Despite their Dog-oriented names, `dog`, `dogGeometry`, and `disposeDogGeometry()` serve both animals. Rebuilding disposes outgoing geometry and interior-flower resources while retaining reusable balloon materials.

One transparent WebGL canvas renders the animal over the page background, with a RoomEnvironment reflection map, studio lights, and a shadow-receiving floor. The render loop updates framing and OrbitControls before rendering. Panning is disabled; orbit angles and zoom are bounded. Resizing updates renderer size, camera aspect, model offset, and framing. There is no automatic idle rotation.

## Configurator behaviour

### State and animal selection

- Initial configuration: Dog, Jewel glass, no flowers, Classic loop ears, Classic body, and Upright tail. Rabbit starts with Classic ears and Round tail when first selected.
- `configuratorState` stores the active animal, shared finish and decoration, and Dog form choices. `rabbitFormState` stores Rabbit form choices. `solidColours` stores one colour per animal, initially pink for Dog and turquoise for Rabbit.
- Switching animals rebuilds the visible geometry, switches the form controls, updates the headline/document title, and refits the camera. Each animal retains its colour and form choices during the current page session. Surface and flower settings carry across animals.
- The Light/Dark theme is separate from animal configuration. Dark is the default; theme changes persist under localStorage key `balloon-animal-studio-theme`.

### Colours and surfaces

Whole-animal swatches apply a single colour across the selected animal's balloon segments:

| Label | State value | Colour |
| --- | --- | --- |
| Hot pink | `pink` | `#e21b82` |
| Purple | `violet` | `#713de2` |
| Turquoise | `turquoise` | `#19bfc7` |
| Soft yellow | `yellow` | `#f5de72` |

Surface choices are **Jewel glass** (`jewel`, transmissive), **Glossy vinyl** (`vinyl`, opaque with clearcoat), and **Chrome** (`chrome`, reflective with high metalness). `updateMaterials()` applies the selected finish and each animal's colour. Material previews are CSS illustrations, not additional WebGL scenes. Colour changes update materials directly; surface changes also rebuild the model to select the appropriate flower/shell representation.

### Forms

| Animal | Control | Available choices |
| --- | --- | --- |
| Dog | Ears | Classic loop (`classic`), Tall loop (`tall`), Small loop (`small`) |
| Dog | Body | Classic (`classic`), Compact (`compact`), Long (`long`) |
| Dog | Tail | Upright (`upright`), Balloon tip (`balloon-tip`), Curved tip (`curved-tip`) |
| Rabbit | Ears | Classic ears (`classic`), Long ears (`long`), Short ears (`short`) |
| Rabbit | Tail | Round tail (`round`), Heart tail (`heart`), Curled tail (`curled`) |

Dog body profiles adjust several anatomical proportions together, including body/leg length, neck height, head scale, and tail lift. Rabbit ear presets change length from fixed head attachment points; there is no Rabbit body-size control. Form changes run through `rebuildFromConfigurator()`, regenerate geometry and any interior flowers, and refit the camera.

### Flower option

The **Add flowers** button toggles `decoration` between `none` and `flowers` for either animal:

- With Jewel glass, a more transmissive shell reveals dimensional flowers inside eligible balloon segments. Shell opacity stays at 1; visibility uses physical transmission rather than alpha blending.
- With Glossy vinyl, flowers appear as a tonal surface print.
- With Chrome, flowers form a subtler reflective surface pattern with roughness variation.
- The selection survives finish/animal switches, and the explanatory note changes with the finish. Turning flowers off removes the corresponding interior or surface effect.

Interior placement is deterministic and capped at 42 flowers. It supports eligible sphere and torus geometry, skips small knots/pinches and unsupported geometry such as extruded tails, and checks that flower vertices fit inside the segment. Not every part receives flowers.

## Desktop and mobile interaction

Desktop uses animal and colour/decoration controls around the viewer, with Surface/Form tabs below. The main stylesheet includes distinct layout rules at 1100px and intermediate widths.

At widths up to 767px, the mobile navigation opens one configuration sheet at a time. It clones existing control content, strips identifying attributes to avoid duplicate IDs and desktop selector collisions, and forwards button clicks to the original controls. A MutationObserver synchronizes selected states, visibility, and flower notes. There is still one scene and one configuration state; desktop nodes are not moved, and the desktop tab selection stays independent.

Preserve focus-visible styling, button labels and pressed states, desktop tab keyboard navigation, and mobile close/Escape focus restoration. Keep sufficient canvas space when a sheet opens. When editing shared selectors or resize logic, check both sides of the 767px boundary and the desktop layout at 1100px and above.

## Development and verification

Use the existing project root (`my-project`). The README specifies Node.js 22.12 or newer and npm; the browser must support WebGL.

```sh
npm install        # When dependencies are not installed
npm run dev        # Start Vite; use the local URL it prints
npm run build      # Required production-build validation; outputs dist/
npm run preview    # Serve the built dist/ locally; this does not deploy
```

Inspect `git status` before and after changes. Follow the existing ES-module style and data-attribute event wiring. Report what changed, which checks ran, and any failures or checks that could not be performed. Do not claim browser verification from a build alone.

For changes affecting the app, manually check:

1. Both animals render; every colour, surface, form preset, and flower on/off combination relevant to the change works.
2. Switching animals retains their independent colours/forms and shared finish/flower choice. Mobile and desktop controls remain synchronized.
3. Rotation and wheel/pinch zoom work before and after configuration changes and resizing; framing does not interrupt active dragging.
4. Desktop, intermediate, and mobile layouts retain usable controls and an unobscured interactive canvas, including with mobile sheets open.
5. Both themes work, the saved theme restores on reload, and keyboard/focus behaviour remains usable.

## Limitations and observed issues

- Only the theme is persisted. Animal configuration resets on page reload; saving configurations, sharing/export, model import, accounts, physics, and audio are not implemented.
- `package.json` has no test or lint scripts, and the project has no automated test suite. Build validation and manual browser checks are the available workflow.
- The WebGL renderer is created without an application-level fallback/error screen for unavailable WebGL. Modern browser features are also used, including ResizeObserver, MutationObserver, CSS subgrid, `:has()`, and dynamic viewport units; no compatibility layer is included.
- Fonts are loaded from Google Fonts in `src/style.css`; their availability depends on network access, with CSS fallback fonts provided.
- The visible headline and document title change for Rabbit, but the viewer/canvas accessible labels and HTML meta description still refer to a Dog. This is an existing inconsistency, not functionality to silently fix in an unrelated task.
- The surface flower effect patches Three.js shader chunks through `onBeforeCompile`. Changes to Three.js or material handling require checking both opaque finishes and the transmissive interior-flower mode.
- `PLAN.md` contains obsolete feature proposals and absolute paths to the original local workspace/reference project. Do not assume that reference project exists or implement planned features without a request.
