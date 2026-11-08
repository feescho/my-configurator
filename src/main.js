import './style.css'
import { setupMobileNavigation } from './mobile-navigation.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createFlowerInterior, addFlowerSurfacePattern } from './flowers.js'
import { createAnimalFraming } from './framing.js'

const themeStorageKey = 'balloon-animal-studio-theme'
const initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
document.body.classList.toggle('theme-dark', initialTheme === 'dark')

// Segment illustrations follow the current models: loop-eared standing dog,
// and seated rabbit with long inflated ears, compact forelegs and round tail.
function animalThumbnail(animal) {
  const dog = `<ellipse cx="42" cy="66" rx="7" ry="17"/><ellipse cx="77" cy="66" rx="7" ry="17"/>
    <ellipse cx="86" cy="43" rx="5" ry="18" transform="rotate(28 86 43)"/>
    <ellipse cx="58" cy="49" rx="24" ry="10"/>
    <ellipse cx="34" cy="40" rx="8" ry="17" transform="rotate(-25 34 40)"/>
    <ellipse cx="25" cy="29" rx="16" ry="8"/>
    <ellipse cx="37" cy="16" rx="8" ry="14"/><ellipse cx="37" cy="16" rx="2" ry="8"/>
    <ellipse cx="28" cy="15" rx="8" ry="14"/><ellipse cx="28" cy="15" rx="2" ry="8"/>
    <ellipse cx="33" cy="67" rx="8" ry="18" transform="rotate(12 33 67)"/>
    <ellipse cx="70" cy="67" rx="8" ry="18" transform="rotate(-12 70 67)"/>`;
  const rabbit = `<circle cx="76" cy="65" r="8"/>
    <ellipse cx="55" cy="61" rx="22" ry="23"/>
    <ellipse cx="43" cy="39" rx="16" ry="15"/><ellipse cx="29" cy="43" rx="11" ry="7"/>
    <ellipse cx="39" cy="19" rx="6" ry="18" transform="rotate(-10 39 19)"/>
    <ellipse cx="53" cy="19" rx="6" ry="18" transform="rotate(12 53 19)"/>
    <ellipse cx="43" cy="74" rx="6" ry="11"/><ellipse cx="32" cy="74" rx="6" ry="11"/>
    <ellipse cx="62" cy="74" rx="10" ry="15" transform="rotate(30 62 74)"/>`;
  return `<svg class="animal-thumbnail" viewBox="0 0 104 94" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${animal === 'dog' ? dog : rabbit}</g></svg>`
}

// Form previews mirror the loop sizes, body lengths and closed tail shapes.
function formIcon(group, value) {
  let shapes
  if (group === 'ears') {
    const height = { classic: 17, tall: 21, small: 13 }[value]
    shapes = [25, 40].map(x => `<ellipse cx="${x}" cy="${47 - height}" rx="8" ry="${height}"/><ellipse cx="${x}" cy="${47 - height}" rx="3" ry="${height - 5}"/>`).join('')
  } else if (group === 'body') {
    const length = { classic: 21, compact: 15, long: 28 }[value]
    shapes = `<ellipse cx="32" cy="25" rx="${length}" ry="9"/>` + [-1, 1].map(side => `<ellipse cx="${32 + side * (length - 5)}" cy="40" rx="5" ry="12" transform="rotate(${side * -10} ${32 + side * (length - 5)} 40)"/>`).join('')
  } else {
    shapes = value === 'upright'
      ? '<ellipse cx="34" cy="27" rx="6" ry="18" transform="rotate(22 34 27)"/><ellipse cx="42" cy="9" rx="2" ry="5" transform="rotate(22 42 9)"/>'
      : value === 'balloon-tip'
        ? '<path d="M25 46L35 19M29 47L39 20"/><ellipse cx="39" cy="12" rx="7" ry="9"/>'
        : '<path d="M25 46C23 32 42 33 39 20M29 47C27 35 46 34 43 19"/><ellipse cx="41" cy="12" rx="7" ry="9"/>'
    shapes += '<ellipse cx="26" cy="49" rx="9" ry="3"/>'
  }
  return `<svg class="form-icon" viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes}</svg>`
}

function rabbitFormIcon(group, value) {
  let shapes
  if (group === 'ears') {
    const height = { classic: 17, long: 21, short: 12 }[value]
    shapes = [-1, 1].map(side => `<ellipse cx="${32 + side * 8}" cy="${48 - height}" rx="5" ry="${height}" transform="rotate(${side * 9} ${32 + side * 8} 48)"/>`).join('')
  } else {
    shapes = value === 'heart'
      ? '<path d="M32 46C26 40 12 30 12 21C12 8 27 8 32 18C37 8 52 8 52 21C52 30 38 40 32 46ZM32 36C27 31 20 25 20 21C20 16 26 17 28 24Q32 29 36 24C38 17 44 16 44 21C44 25 37 31 32 36Z"/><ellipse cx="32" cy="44" rx="3" ry="2"/>'
      : value === 'curled'
      ? '<ellipse cx="32" cy="29" rx="14" ry="16"/><ellipse cx="32" cy="29" rx="6" ry="8"/>'
      : '<circle cx="32" cy="30" r="12"/>'
    shapes += '<path d="M22 48q10-5 20 0"/>'
  }
  return `<svg class="form-icon" viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes}</svg>`
}

// Small interface illustrations; independent of the Three.js models.
function controlIcon(name) {
  const paths = {
    dog: 'M5 10H3a2 2 0 0 1 0-4h3V3a1 1 0 0 1 2 0v4l2 5h8l3-5a1 1 0 0 1 2 1l-3 6v6a1 1 0 0 1-2 0v-4h-7v4a1 1 0 0 1-2 0v-6Z',
    rabbit: 'M8 9 6 3a1.5 1.5 0 0 1 3-1l2 6 1-6a1.5 1.5 0 0 1 3 1l-1 7c4 1 6 4 5 7 4-2 5 3 1 3H8c-3 0-4-2-3-4l1-3c-4 0-4-4 0-4Zm6 7c-3-1-5 2-3 4',
    jewel: 'm3 8 4-5h10l4 5-9 13Zm0 0h18M7 3l2 5 3 13 3-13 2-5',
    vinyl: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM7 9a6 6 0 0 1 4-3',
    chrome: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM6 18 18 6M5 14l9-9m-3 14 8-8',
    none: 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM7 17 17 7',
    flowers: 'M12 9c-6-9 6-9 0 0 9-6 9 6 0 0 6 9-6 9 0 0-9 6-9-6 0 0Zm0 3v9m0-3c3 0 5-2 5-4-3 0-5 2-5 4',
  }
  return `<svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"/></svg>`
}

document.querySelector('#app').innerHTML = `
  <main class="prototype">
    <div class="content-column">
      <header class="masthead">
        <h1 data-animal-title>Balloon <em>Dog</em></h1>
      </header>
      <div class="config-dock">
      <aside class="config-panel" aria-label="Balloon animal configurator">
        <div class="theme-toggle" role="group" aria-label="Colour theme">
          <button class="theme-option ${initialTheme === 'light' ? 'is-active' : ''}" type="button" data-theme="light" aria-pressed="${initialTheme === 'light'}">Light</button>
          <button class="theme-option ${initialTheme === 'dark' ? 'is-active' : ''}" type="button" data-theme="dark" aria-pressed="${initialTheme === 'dark'}">Dark</button>
        </div>
        <div class="side-controls">
        <section class="animal-section" aria-label="Animal selection">
          <fieldset class="config-group">
            <legend>Animal</legend>
          <div class="animal-switch" role="group" aria-label="Balloon animal">
            <button class="option is-active animal-preview" type="button" data-control="animal" data-value="dog" aria-pressed="true" aria-label="Balloon Dog">${animalThumbnail('dog')}<span>Dog</span></button>
            <button class="option animal-preview" type="button" data-control="animal" data-value="rabbit" aria-pressed="false" aria-label="Balloon Rabbit">${animalThumbnail('rabbit')}<span>Rabbit</span></button>
          </div>
          </fieldset>
        </section>
        <section class="colour-rail" aria-label="Colour and decoration">
          <fieldset class="config-group">
            <legend>Balloon colour</legend>
              <div class="swatches" role="group" aria-label="Whole animal colour">
                ${[['pink', 'Hot pink'], ['violet', 'Purple'], ['turquoise', 'Turquoise'], ['yellow', 'Soft yellow']].map(([colour, label]) => `<button class="swatch swatch-${colour}" type="button" data-control="solid-colour" data-value="${colour}" aria-pressed="false" aria-label="${label}"></button>`).join('')}
              </div>
          </fieldset>
          <fieldset class="config-group">
            <legend>Inside the balloon</legend>
            <div class="option-grid option-grid--two decoration-toggle" role="group" aria-label="Inside the balloon">
              <button class="option flower-toggle" type="button" data-control="decoration" data-value="flowers" aria-pressed="false">${controlIcon('flowers')}<span>Add flowers</span><span class="toggle-track" aria-hidden="true"></span></button>
            </div>
            <p class="composition-label" data-flower-note hidden></p>
          </fieldset>
        </section>
        </div>
        <div class="bottom-controls">
        <div class="bottom-tabs" role="tablist" aria-label="Surface and form">
          <button type="button" id="surface-tab" role="tab" aria-selected="true" aria-controls="tray-panel-surface" data-bottom-tab="surface">Surface</button>
          <button type="button" id="form-tab" role="tab" aria-selected="false" aria-controls="tray-panel-form" tabindex="-1" data-bottom-tab="form">Form</button>
        </div>
        <section class="tray-panel" id="tray-panel-surface" role="tabpanel" aria-labelledby="surface-tab" data-bottom-panel="surface">
          <fieldset class="config-group">
            <legend>Surface</legend>
            <div class="option-grid option-grid--three">
              <button class="option is-active" type="button" data-control="finish" data-value="jewel" aria-pressed="true"><span class="material-sphere material-sphere--jewel" aria-hidden="true"></span><span>Jewel glass</span></button>
              <button class="option" type="button" data-control="finish" data-value="vinyl" aria-pressed="false"><span class="material-sphere material-sphere--vinyl" aria-hidden="true"></span><span>Glossy vinyl</span></button>
              <button class="option" type="button" data-control="finish" data-value="chrome" aria-pressed="false"><span class="material-sphere material-sphere--chrome" aria-hidden="true"></span><span>Chrome</span></button>
            </div>
          </fieldset>
        </section>
        <section id="tray-panel-form" role="tabpanel" aria-labelledby="form-tab" data-bottom-panel="form" hidden>
          <div class="form-options">
          <fieldset class="config-group" data-animal-controls="dog">
            <legend>Ears</legend>
            <div class="option-grid">
              <button class="option is-active" type="button" data-control="ears" data-value="classic" aria-pressed="true">${formIcon('ears', 'classic')}<span>Classic loop</span></button>
              <button class="option" type="button" data-control="ears" data-value="tall" aria-pressed="false">${formIcon('ears', 'tall')}<span>Tall loop</span></button>
              <button class="option" type="button" data-control="ears" data-value="small" aria-pressed="false">${formIcon('ears', 'small')}<span>Small loop</span></button>
            </div>
          </fieldset>
          <fieldset class="config-group" data-animal-controls="dog">
            <legend>Body</legend>
            <div class="option-grid">
              <button class="option is-active" type="button" data-control="body" data-value="classic" aria-pressed="true">${formIcon('body', 'classic')}<span>Classic</span></button>
              <button class="option" type="button" data-control="body" data-value="compact" aria-pressed="false">${formIcon('body', 'compact')}<span>Compact</span></button>
              <button class="option" type="button" data-control="body" data-value="long" aria-pressed="false">${formIcon('body', 'long')}<span>Long</span></button>
            </div>
          </fieldset>
          <fieldset class="config-group" data-animal-controls="dog">
            <legend>Tail</legend>
            <div class="option-grid">
              <button class="option is-active" type="button" data-control="tail" data-value="upright" aria-pressed="true">${formIcon('tail', 'upright')}<span>Upright</span></button>
              <button class="option" type="button" data-control="tail" data-value="balloon-tip" aria-pressed="false">${formIcon('tail', 'balloon-tip')}<span>Balloon tip</span></button>
              <button class="option" type="button" data-control="tail" data-value="curved-tip" aria-pressed="false">${formIcon('tail', 'curved-tip')}<span>Curved tip</span></button>
            </div>
          </fieldset>
          ${[
            ['ears', 'Ears', [['classic', 'Classic ears'], ['long', 'Long ears'], ['short', 'Short ears']]],
            ['tail', 'Tail', [['round', 'Round tail'], ['heart', 'Heart tail'], ['curled', 'Curled tail']]],
          ].map(([group, label, options]) => `<fieldset class="config-group" data-animal-controls="rabbit" hidden>
            <legend>${label}</legend><div class="option-grid">
            ${options.map(([value, text], index) => `<button class="option${index === 0 ? ' is-active' : ''}" type="button" data-control="rabbit-${group}" data-value="${value}" aria-pressed="${index === 0}">${rabbitFormIcon(group, value)}<span>${text}</span></button>`).join('')}
            </div></fieldset>`).join('')}
          </div>
        </section>
        </div>
      </aside>
      </div>
    </div>
    <section class="viewer" aria-label="Interactive 3D balloon dog viewer">
      <canvas id="dog-canvas" aria-label="A rotatable 3D balloon dog"></canvas>
      <p class="edition">ANIMAL OBJECT / 01</p>
    </section>
  </main>
  <footer class="interaction-hint">DRAG TO ROTATE · SCROLL TO ZOOM</footer>
`

const canvas = document.querySelector('#dog-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.88

const scene = new THREE.Scene()

// A neutral studio environment supplies the long, controlled reflections that
// make the physical pink latex read as inflated rather than as plain plastic.
const pmremGenerator = new THREE.PMREMGenerator(renderer)
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.8
pmremGenerator.dispose()

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
camera.position.set(7.5, 4.6, 8.7)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1.8, 0)
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.minDistance = 6.2
controls.maxDistance = 12
controls.minPolarAngle = 0.7
controls.maxPolarAngle = 1.48
controls.update()

scene.add(new THREE.HemisphereLight(0xfffaff, 0x282034, 0.85))

const keyLight = new THREE.DirectionalLight(0xffffff, 2.35)
keyLight.position.set(-4, 8, 6)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.camera.left = -6
keyLight.shadow.camera.right = 6
keyLight.shadow.camera.top = 7
keyLight.shadow.camera.bottom = -3
scene.add(keyLight)

const softboxLight = new THREE.RectAreaLight(0xffffff, 4.15, 3.4, 5.5)
softboxLight.position.set(-2.8, 5.8, 4.6)
softboxLight.lookAt(0, 1.9, 0)
scene.add(softboxLight)

const rimLight = new THREE.RectAreaLight(0xf3dcff, 1.4, 2.2, 4.2)
rimLight.position.set(4.2, 3.7, -3.8)
rimLight.lookAt(0.2, 2, 0)
scene.add(rimLight)

const cyanLight = new THREE.PointLight(0x16d7cf, 6, 10)
cyanLight.position.set(-4, 3, 3)
scene.add(cyanLight)

const magentaLight = new THREE.PointLight(0xd943b8, 5, 9)
magentaLight.position.set(4, 3.5, -3)
scene.add(magentaLight)

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(7.5, 64),
  new THREE.ShadowMaterial({ color: 0x2f2530, transparent: true, opacity: 0.14, depthWrite: false }),
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.08
floor.receiveShadow = true
scene.add(floor)

function applyTheme(theme, persist = false) {
  const isDark = theme === 'dark'
  document.body.classList.toggle('theme-dark', isDark)
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#101014' : '#f1eaf4')
  floor.material.color.set(isDark ? 0x2c2632 : 0x2f2530)
  floor.material.opacity = isDark ? 0.15 : 0.14

  if (persist) {
    try {
      localStorage.setItem(themeStorageKey, theme)
    } catch (_) {}
  }

  document.querySelectorAll('[data-theme]').forEach((button) => {
    const selected = button.dataset.theme === theme
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })
}

document.querySelectorAll('[data-theme]').forEach((button) => {
  button.addEventListener('click', () => applyTheme(button.dataset.theme, true))
})

applyTheme(initialTheme)

// Each animal shares one colour material across all of its balloon segments.
function createJewelMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.1,
    metalness: 0.035,
    transmission: 0.3,
    thickness: 0.95,
    ior: 1.42,
    attenuationColor: new THREE.Color(color),
    attenuationDistance: 1.9,
    clearcoat: 1,
    clearcoatRoughness: 0.035,
    iridescence: 0.14,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [120, 360],
  })
}

function createFlowerShellMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color, roughness: 0.09, metalness: 0,
    // Transmission reveals the interior while the diffuse component retains
    // the balloon colour. Keep opacity at 1 to avoid alpha-sorting artifacts.
    transmission: 0.72, opacity: 1, thickness: 0.22, ior: 1.33,
    attenuationColor: new THREE.Color('#ffffff').lerp(new THREE.Color(color), 0.25),
    attenuationDistance: 3,
    clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.85,
  })
}
const flowerShellMaterials = {
  dog: createFlowerShellMaterial('#e21b82'),
  rabbit: createFlowerShellMaterial('#16d7cf'),
}
const solidColours = { dog: 'pink', rabbit: 'turquoise' }
const solidMaterials = {
  dog: createJewelMaterial('#e21b82'), rabbit: createJewelMaterial('#16d7cf'),
}
const flowerSurfacePatterns = Object.fromEntries(
  Object.entries(solidMaterials).map(([animal, material]) => [animal, addFlowerSurfacePattern(material)]),
)

const balloonDogSpec = {
  bodyLength: 1,
  legLength: 1,
  neckHeight: 1,
  headScale: 1,
  tailLift: 1,
  tailStyle: 'upright',
  earStyle: 'classic',
}

// Rabbit settings are isolated from the dog profiles so this addition cannot
// mutate the established dog anatomy or its selected controls.
const balloonRabbitSpec = {
  bodyScale: 1,
  earLength: 1,
  tailStyle: 'round',
}

const rabbitFormState = { ears: 'classic', tail: 'round' }

const configuratorState = {
  animal: 'dog',
  decoration: 'none',
  finish: 'jewel',
  ears: 'classic',
  body: 'classic',
  tail: 'upright',
}

const colourOptions = {
  pink: '#e21b82',
  violet: '#713de2',
  turquoise: '#19bfc7',
  yellow: '#f5de72',
}

function animalMaterial(animal) {
  return configuratorState.decoration === 'flowers' && configuratorState.finish === 'jewel'
    ? flowerShellMaterials[animal] : solidMaterials[animal]
}

const bodyProfiles = {
  classic: { bodyLength: 1, legLength: 1, neckHeight: 1, headScale: 1, tailLift: 1 },
  compact: { bodyLength: 0.72, legLength: 0.86, neckHeight: 0.84, headScale: 0.88, tailLift: 0.78 },
  long: { bodyLength: 1.36, legLength: 1.12, neckHeight: 1.14, headScale: 1.08, tailLift: 1.2 },
}

const earProfiles = {
  classic: { radius: 0.43, tube: 0.28, scale: [0.64, 1.12, 1] },
  tall: { radius: 0.45, tube: 0.28, scale: [0.62, 1.32, 1] },
  small: { radius: 0.35, tube: 0.25, scale: [0.68, 0.94, 1] },
}

const dog = new THREE.Group()
dog.position.set(0.72, 0.03, 0)
dog.rotation.y = -0.25
scene.add(dog)

const balloonParts = []
const dogGeometry = new THREE.Group()
dog.add(dogGeometry)
const animalFraming = createAnimalFraming(camera, controls, dogGeometry)

function disposeDogGeometry() {
  dogGeometry.traverse((part) => {
    if (part.isMesh) {
      part.geometry.dispose()
      if (part.isInstancedMesh) {
        part.dispose()
        part.material.dispose()
      }
    }
  })
  dogGeometry.clear()
  balloonParts.length = 0
}

function updateFlowerInterior() {
  if (configuratorState.decoration !== 'flowers' || configuratorState.finish !== 'jewel') return
  // Keep the shell's contact and self shadows. Only the interior flowers skip
  // shadow receiving, so the enclosing shell cannot black out the bouquet.
  // Physical transmission (not alpha blending) reveals them through the shell.
  dogGeometry.add(createFlowerInterior(balloonParts, dogGeometry))
}

function createPartGroup(name) {
  const group = new THREE.Group()
  group.name = name
  dogGeometry.add(group)
  return group
}

function addMesh(group, geometry, material, name) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = name
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)
  balloonParts.push(mesh)
  return mesh
}

function addCapsule(group, start, end, radius, material, name) {
  const from = start.isVector3 ? start.clone() : new THREE.Vector3(...start)
  const to = end.isVector3 ? end.clone() : new THREE.Vector3(...end)
  const direction = to.clone().sub(from)
  const mesh = addMesh(
    group,
    new THREE.CapsuleGeometry(radius, Math.max(0.02, direction.length() - radius * 2), 12, 32),
    material,
    name,
  )
  mesh.position.copy(from).add(to).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  return mesh
}

function addBulb(group, position, scale, material, name, rotation = [0, 0, 0]) {
  const mesh = addMesh(group, new THREE.SphereGeometry(1, 40, 28), material, name)
  mesh.position.copy(position.isVector3 ? position : new THREE.Vector3(...position))
  mesh.scale.set(...scale)
  mesh.rotation.set(...rotation)
  return mesh
}

function createDogAnchors(spec) {
  const body = spec.bodyLength
  const legLength = spec.legLength
  const neckHeight = spec.neckHeight
  const headScale = spec.headScale
  const tailLift = spec.tailLift
  const point = (x, y, z = 0) => new THREE.Vector3(x, y, z)
  const torsoStart = point(-1.05 * body, 1.76 * legLength)
  const torsoEnd = point(1.15 * body, torsoStart.y)
  const neckRoot = torsoStart.clone().add(point(0.04, 0.02))
  const neckTop = neckRoot.clone().add(point(-0.34, 1.34 * neckHeight))
  const muzzleStart = neckTop.clone().add(point(0.1 * headScale, 0.08))
  const muzzleEnd = muzzleStart.clone().add(point(-1.28 * headScale, 0.06))
  const earRoot = neckTop.clone().add(point(0.08, 0.19))
  const frontLegRoot = torsoStart.clone().add(point(0.1, -0.02))
  const rearLegRoot = torsoEnd.clone().add(point(-0.1, -0.02))
  const tailRoot = torsoEnd.clone().add(point(-0.04, 0.09))
  const tailTip = tailRoot.clone().add(point(0.43, 1.12 * tailLift))

  return {
    torso: { start: torsoStart, end: torsoEnd },
    neck: { root: neckRoot, top: neckTop },
    head: { muzzleStart, muzzleEnd, earRoot },
    legs: {
      frontNear: { root: frontLegRoot.clone().setZ(0.27), end: point(frontLegRoot.x - 0.4, -0.09, 0.48) },
      frontFar: { root: frontLegRoot.clone().setZ(-0.27), end: point(frontLegRoot.x - 0.4, -0.09, -0.48) },
      rearNear: { root: rearLegRoot.clone().setZ(0.27), end: point(rearLegRoot.x + 0.34, -0.09, 0.48) },
      rearFar: { root: rearLegRoot.clone().setZ(-0.27), end: point(rearLegRoot.x + 0.34, -0.09, -0.48) },
    },
    tail: { root: tailRoot, tip: tailTip },
  }
}

// Dog-only inflated bubbles: Three.js supplies the closed topology and normals.
// Ellipsoidal shoulders narrow into overlapping ends instead of straight tube walls.
function addDogBubble(group, start, end, radius, material, name, depth = 1) {
  const direction = end.clone().sub(start)
  const bubble = addBulb(group, start.clone().add(end).multiplyScalar(0.5),
    [radius, direction.length() / 2 + 0.1, radius * depth], material, name)
  bubble.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  return bubble
}

function buildBalloonDog(spec) {
  disposeDogGeometry()

  const anchors = createDogAnchors(spec)
  const torso = createPartGroup('torso')
  const head = createPartGroup('head')
  const ears = createPartGroup('ears')
  const legs = createPartGroup('legs')
  const tail = createPartGroup('tail')
  const twists = createPartGroup('twist joints')
  const earProfile = earProfiles[spec.earStyle] || earProfiles.classic

  addDogBubble(torso, anchors.torso.start, anchors.torso.end, 0.55, animalMaterial('dog'), 'magenta torso')
  addDogBubble(torso, anchors.neck.root, anchors.neck.top, 0.4, animalMaterial('dog'), 'amber neck')
  addDogBubble(head, anchors.head.muzzleStart, anchors.head.muzzleEnd, 0.41 * spec.headScale, animalMaterial('dog'), 'pearl muzzle', 1.06)
  addBulb(head, anchors.head.muzzleEnd.clone().add(new THREE.Vector3(-0.1, 0, 0)), [0.12, 0.105, 0.105], animalMaterial('dog'), 'muzzle tied tip')

  ;[1, -1].forEach((side) => {
    const material = animalMaterial('dog')
    const ear = addMesh(ears, new THREE.TorusGeometry(earProfile.radius, earProfile.tube, 24, 64), material, `${side > 0 ? 'near' : 'far'} sculptural loop ear`)
    ear.scale.set(...earProfile.scale)
    ear.rotation.set(side * 0.1, side * 0.16, -0.15)
    // Place the bottom of every preset at the same attachment, even when tilted.
    const lowerEnd = new THREE.Vector3(0, -(earProfile.radius + earProfile.tube) * earProfile.scale[1], 0).applyEuler(ear.rotation)
    ear.position.copy(anchors.head.earRoot).add(new THREE.Vector3(0, -0.18, side * 0.28)).sub(lowerEnd)
  })

  const legParts = [
    { anchor: anchors.legs.frontNear, material: animalMaterial('dog'), name: 'front near' },
    { anchor: anchors.legs.frontFar, material: animalMaterial('dog'), name: 'front far' },
    { anchor: anchors.legs.rearNear, material: animalMaterial('dog'), name: 'rear near' },
    { anchor: anchors.legs.rearFar, material: animalMaterial('dog'), name: 'rear far' },
  ]
  legParts.forEach(({ anchor, material, name }) => {
    addDogBubble(legs, anchor.root, anchor.end, 0.43, material, `${name} inflated leg`, 0.94)
    addBulb(twists, anchor.root, [0.22, 0.17, 0.2], material, `${name} compressed twist`)
  })

  const tailMaterial = animalMaterial('dog')
  if (spec.tailStyle === 'upright') {
    addDogBubble(tail, anchors.tail.root, anchors.tail.tip, 0.3, tailMaterial, 'inflated upright tail')
    const tipEnd = anchors.tail.tip.clone().add(new THREE.Vector3(0.1, 0.26, 0))
    addDogBubble(tail, anchors.tail.tip, tipEnd, 0.09, animalMaterial('dog'), 'slender tail tip')
  } else {
    const root = anchors.tail.root
    const tip = anchors.tail.tip.clone()
    if (spec.tailStyle === 'balloon-tip') {
      addCapsule(tail, root, tip, 0.065, tailMaterial, 'thin balloon tail stem')
    } else {
      // Standard capped extrusion: a gentle bend, with no custom tube mesh.
      const curve = new THREE.CubicBezierCurve3(
        root.clone(),
        root.clone().add(new THREE.Vector3(0.03, 0.55 * spec.tailLift, 0)),
        tip.clone().add(new THREE.Vector3(0.18, -0.48 * spec.tailLift, 0)),
        tip.clone(),
      )
      const section = new THREE.Shape()
      section.absarc(0, 0, 0.065, 0, Math.PI * 2, false)
      addMesh(tail, new THREE.ExtrudeGeometry(section, {
        extrudePath: curve, steps: 48, curveSegments: 16, bevelEnabled: false,
      }), tailMaterial, 'gently curved balloon tail stem')
    }
    addBulb(tail, tip, [0.18, 0.21, 0.18], tailMaterial, 'inflated balloon tail tip')
  }
  addBulb(twists, anchors.neck.root, [0.24, 0.18, 0.24], animalMaterial('dog'), 'neck body twist')
  addBulb(twists, anchors.neck.top, [0.25, 0.18, 0.27], animalMaterial('dog'), 'head twist')
  addBulb(twists, anchors.tail.root, [0.22, 0.19, 0.22], tailMaterial, 'tail root twist')
}

function createRabbitAnchors(spec) {
  const scale = spec.bodyScale
  const point = (x, y, z = 0) => new THREE.Vector3(x * scale, y * scale, z * scale)
  const bodyCenter = point(0.12, 0.94)
  const headCenter = point(-0.38, 2.2)

  const anchors = {
    body: { center: bodyCenter, scale: [0.84 * scale, 0.92 * scale, 0.62 * scale] },
    neck: { center: point(-0.25, 1.7), scale: [0.3 * scale, 0.25 * scale, 0.3 * scale] },
    head: { center: headCenter, scale: [0.62 * scale, 0.59 * scale, 0.57 * scale] },
    muzzle: { center: headCenter.clone().add(point(-0.45, -0.12)), scale: [0.4 * scale, 0.29 * scale, 0.38 * scale] },
    nose: { center: headCenter.clone().add(point(-0.82, -0.1)), scale: [0.1 * scale, 0.095 * scale, 0.11 * scale] },
    ears: {
      right: { root: headCenter.clone().add(point(0.09, 0.44, 0.3)), tip: headCenter.clone().add(point(0.23, 1.91, 0.62)) },
      left: { root: headCenter.clone().add(point(0.09, 0.44, -0.3)), tip: headCenter.clone().add(point(0.23, 1.91, -0.62)) },
    },
    legs: {
      frontNear: { root: point(-0.55, 0.91, 0.32), end: point(-0.8, 0.03, 0.4), radius: 0.25 * scale },
      frontFar: { root: point(-0.55, 0.91, -0.32), end: point(-0.8, 0.03, -0.4), radius: 0.25 * scale },
      rearNear: { root: point(0.62, 0.94, 0.37), end: point(0.06, 0.06, 0.66), radius: 0.36 * scale },
      rearFar: { root: point(0.62, 0.94, -0.37), end: point(0.06, 0.06, -0.66), radius: 0.36 * scale },
    },
    tail: { center: point(0.98, 0.78, 0), scale: [0.3 * scale, 0.3 * scale, 0.3 * scale] },
  }

  // The body stays at its default proportions; ears grow from fixed head roots.
  for (const ear of Object.values(anchors.ears)) {
    ear.tip.sub(ear.root).multiplyScalar(spec.earLength).add(ear.root)
  }
  const tailRadius = 0.3 * scale
  const rumpEdge = bodyCenter.x + anchors.body.scale[0]
  anchors.tail.center.x = rumpEdge + (tailRadius - 0.28 * scale)
  anchors.tail.scale = [tailRadius, tailRadius, tailRadius]
  anchors.tail.root = point(0, 0.78)
  anchors.tail.root.x = rumpEdge - 0.08 * scale
  return anchors
}

// Rabbit-only inflated forms retain SphereGeometry's closed surface and normals.
function addRabbitBubble(group, root, tip, radius, depth, material, name, scale) {
  const axis = tip.clone().sub(root)
  const mesh = addBulb(group, root.clone().add(tip).multiplyScalar(0.5),
    [radius, axis.length() / 2 + 0.09 * scale, radius * depth], material, name)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.normalize())
  return mesh
}

function buildBalloonRabbit(spec) {
  disposeDogGeometry()

  const anchors = createRabbitAnchors(spec)
  const torso = createPartGroup('rabbit torso')
  const head = createPartGroup('rabbit head')
  const ears = createPartGroup('rabbit ears')
  const legs = createPartGroup('rabbit legs')
  const tail = createPartGroup('rabbit tail')

  addBulb(torso, anchors.body.center, anchors.body.scale, animalMaterial('rabbit'), 'cyan rabbit body')
  addBulb(torso, anchors.neck.center, anchors.neck.scale, animalMaterial('rabbit'), 'compressed rabbit neck')
  addBulb(head, anchors.head.center, anchors.head.scale, animalMaterial('rabbit'), 'pearl rabbit head')
  addBulb(head, anchors.muzzle.center, anchors.muzzle.scale, animalMaterial('rabbit'), 'rounded rabbit muzzle')
  addBulb(head, anchors.nose.center, anchors.nose.scale, animalMaterial('rabbit'), 'rabbit tied nose')

  ;[
    { anchor: anchors.ears.right, material: animalMaterial('rabbit'), name: 'right inflated ear' },
    { anchor: anchors.ears.left, material: animalMaterial('rabbit'), name: 'left inflated ear' },
  ].forEach(({ anchor, material, name }) => {
    addRabbitBubble(ears, anchor.root, anchor.tip, 0.3 * spec.bodyScale, 0.78, material, name, spec.bodyScale)
    addBulb(ears, anchor.root, [0.18, 0.12, 0.16].map(value => value * spec.bodyScale), material, `${name} pinched base`)
  })

  const legParts = [
    { anchor: anchors.legs.frontNear, material: animalMaterial('rabbit'), name: 'front near' },
    { anchor: anchors.legs.frontFar, material: animalMaterial('rabbit'), name: 'front far' },
    { anchor: anchors.legs.rearNear, material: animalMaterial('rabbit'), name: 'rear near' },
    { anchor: anchors.legs.rearFar, material: animalMaterial('rabbit'), name: 'rear far' },
  ]
  legParts.forEach(({ anchor, material, name }) => {
    addRabbitBubble(legs, anchor.root, anchor.end, anchor.radius, 0.94, material, `${name} rabbit leg`, spec.bodyScale)
  })

  if (spec.tailStyle === 'heart') {
    const material = animalMaterial('rabbit')
    addBulb(tail, anchors.tail.root, [0.17, 0.16, 0.17].map(v => v * spec.bodyScale), material, 'rabbit heart tail twist')
    const scale = spec.bodyScale
    const center = anchors.tail.root.clone().add(new THREE.Vector3(0.24, 0.26, 0).multiplyScalar(scale))
    // Face the rear/three-quarter view; circular cross-sections give depth
    // when orbiting. Each half is a capped standard Three.js extrusion.
    const point = (x, y) => new THREE.Vector3(0, y, -x)
    const section = new THREE.Shape()
    section.absarc(0, 0, 0.065, 0, Math.PI * 2, false)
    for (const side of [-1, 1]) {
      const curve = new THREE.CurvePath()
      curve.add(new THREE.CubicBezierCurve3(
        point(0, -0.24), point(side * 0.09, -0.16), point(side * 0.29, -0.01), point(side * 0.26, 0.15),
      ))
      curve.add(new THREE.CubicBezierCurve3(
        point(side * 0.26, 0.15), point(side * 0.23, 0.32), point(side * 0.06, 0.32), point(0, 0.13),
      ))
      const geometry = new THREE.ExtrudeGeometry(section, {
        extrudePath: curve, steps: 64, curveSegments: 20, bevelEnabled: false,
      })
      const tube = addMesh(tail, geometry, material, `rabbit heart ${side < 0 ? 'left' : 'right'} balloon tube`)
      tube.scale.setScalar(scale)
      tube.position.copy(center)
    }
    const bottom = center.clone().add(point(0, -0.24).multiplyScalar(scale))
    const notch = center.clone().add(point(0, 0.13).multiplyScalar(scale))
    // Rounded overlaps conceal the flat end caps and suggest compressed twists.
    addBulb(tail, bottom, [0.067, 0.06, 0.067].map(v => v * scale), material, 'rabbit heart lower pinch')
    addBulb(tail, notch, [0.067, 0.06, 0.067].map(v => v * scale), material, 'rabbit heart upper pinch')
    addRabbitBubble(tail, anchors.tail.root, bottom, 0.1 * scale, 0.9, material, 'rabbit heart attachment twist', scale)
  } else if (spec.tailStyle === 'curled') {
    const material = animalMaterial('rabbit')
    addBulb(tail, anchors.tail.root, [0.17, 0.16, 0.17].map(v => v * spec.bodyScale), material, 'rabbit tail twist')
    const curl = addMesh(tail, new THREE.TorusGeometry(0.23, 0.12, 24, 48), material, 'rabbit curled tail')
    curl.scale.setScalar(spec.bodyScale)
    curl.position.copy(anchors.tail.root).add(new THREE.Vector3(0.17, 0.18, 0).multiplyScalar(spec.bodyScale))
    curl.rotation.z = -0.2
  } else {
    addBulb(tail, anchors.tail.center, anchors.tail.scale, animalMaterial('rabbit'), 'amber rabbit tail')
  }
}

buildBalloonDog(balloonDogSpec)

function updateMaterialFinish(material, color) {
  const isJewel = configuratorState.finish === 'jewel'
  const isChrome = configuratorState.finish === 'chrome'

  material.color.set(color)
  material.attenuationColor.set(color)
  material.metalness = isChrome ? 0.94 : 0.025
  material.roughness = isChrome ? 0.13 : isJewel ? 0.1 : 0.17
  material.transmission = isJewel ? 0.3 : 0
  material.thickness = isJewel ? 0.95 : 0.25
  material.ior = isJewel ? 1.42 : 1.33
  material.clearcoat = isChrome ? 0.35 : 1
  material.clearcoatRoughness = isChrome ? 0.12 : isJewel ? 0.035 : 0.06
  material.iridescence = isJewel ? 0.14 : 0
  material.needsUpdate = true
}

function updateMaterials() {
  Object.entries(solidMaterials).forEach(([animal, material]) => {
    const color = colourOptions[solidColours[animal]]
    updateMaterialFinish(material, color)
    flowerSurfacePatterns[animal](configuratorState.decoration === 'flowers', configuratorState.finish)
    const shell = flowerShellMaterials[animal]
    shell.color.set(color)
    shell.attenuationColor.set('#ffffff').lerp(shell.color, 0.25)
  })
  updateSurfacePreviews()
}

function updateSurfacePreviews() {
  document.querySelector('#tray-panel-surface').style.setProperty(
    '--material-colour', colourOptions[solidColours[configuratorState.animal]],
  )
}

function rebuildFromConfigurator() {
  if (configuratorState.animal === 'rabbit') {
    Object.assign(balloonRabbitSpec, {
      earLength: { classic: 1, long: 1.18, short: 0.72 }[rabbitFormState.ears],
      tailStyle: rabbitFormState.tail,
    })
    buildBalloonRabbit(balloonRabbitSpec)
    updateFlowerInterior()
    animalFraming.fit()
    return
  }

  Object.assign(balloonDogSpec, bodyProfiles[configuratorState.body], {
    earStyle: configuratorState.ears,
    tailStyle: configuratorState.tail,
  })
  buildBalloonDog(balloonDogSpec)
  updateFlowerInterior()
  animalFraming.fit()
}

function updateAnimalControlVisibility() {
  document.querySelector('.form-options').classList.toggle('form-options--rabbit', configuratorState.animal === 'rabbit')
  document.querySelectorAll('[data-animal-controls]').forEach((group) => {
    group.hidden = group.dataset.animalControls !== configuratorState.animal
  })
}

function selectBottomPanel(name) {
  document.querySelectorAll('[data-bottom-tab]').forEach(tab => {
    const selected = tab.dataset.bottomTab === name
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
  })
  document.querySelectorAll('[data-bottom-panel]').forEach(panel => {
    panel.hidden = panel.dataset.bottomPanel !== name
  })
}

document.querySelectorAll('[data-bottom-tab]').forEach(tab => {
  tab.addEventListener('click', () => selectBottomPanel(tab.dataset.bottomTab))
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const tabs = [...document.querySelectorAll('[data-bottom-tab]')].filter(item => !item.hidden)
    const index = tabs.indexOf(tab)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    selectBottomPanel(tabs[next].dataset.bottomTab)
    tabs[next].focus()
  })
})

function updateDecorationControls() {
  updateSurfacePreviews()
  const hasFlowers = configuratorState.decoration === 'flowers'
  updateControlState('decoration', configuratorState.decoration)
  document.querySelector('[data-flower-note]').hidden = !hasFlowers
  document.querySelector('[data-flower-note]').textContent = {
    jewel: 'Flowers show inside the transparent balloon.',
    vinyl: 'Flowers decorate the glossy balloon surface.',
    chrome: 'Flowers form a subtle pattern on the reflective surface.',
  }[configuratorState.finish]
  updateControlState('solid-colour', solidColours[configuratorState.animal])
  updateControlState('finish', configuratorState.finish)
}

function alignThemeToggle() {
  const title = document.querySelector('[data-animal-title]')
  const range = document.createRange()
  range.selectNodeContents(title)
  const overflow = range.getBoundingClientRect().bottom - title.getBoundingClientRect().bottom
  document.querySelector('.theme-toggle').style.setProperty('--title-text-overflow', `${overflow}px`)
}

function updateAnimalTitle() {
  const animalName = configuratorState.animal === 'rabbit' ? 'Rabbit' : 'Dog'
  document.querySelector('[data-animal-title]').innerHTML = `Balloon <em>${animalName}</em>`
  document.title = `Balloon ${animalName}`
  alignThemeToggle()
}

function updateControlState(control, value) {
  document.querySelectorAll(`[data-control="${control}"]`).forEach((button) => {
    const selected = button.dataset.value === value
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })
}

document.querySelectorAll('[data-control]').forEach((button) => {
  button.addEventListener('click', () => {
    const { control } = button.dataset
    const value = control === 'decoration'
      ? (configuratorState.decoration === 'flowers' ? 'none' : 'flowers')
      : button.dataset.value
    if (button.disabled) return
    if (control.startsWith('rabbit-')) {
      if (configuratorState.animal !== 'rabbit') return
      rabbitFormState[control.slice(7)] = value
      updateControlState(control, value)
      rebuildFromConfigurator()
      return
    }
    if (control !== 'solid-colour') configuratorState[control] = value
    updateControlState(control, value)

    if (control === 'finish') {
      updateMaterials()
      updateDecorationControls()
      rebuildFromConfigurator()
    }
    if (control === 'animal') {
      updateAnimalControlVisibility()
      updateAnimalTitle()
      updateDecorationControls()
      rebuildFromConfigurator()
    }
    if (control === 'decoration') {
      updateMaterials()
      updateDecorationControls()
      rebuildFromConfigurator()
    }
    if (control === 'solid-colour') {
      solidColours[configuratorState.animal] = value
      updateMaterials()
    }
    if (configuratorState.animal === 'dog' && (control === 'ears' || control === 'body' || control === 'tail')) rebuildFromConfigurator()
  })
})

updateAnimalControlVisibility()
updateAnimalTitle()
updateDecorationControls()
updateMaterials()
window.addEventListener('resize', alignThemeToggle)
document.fonts.ready.then(alignThemeToggle)
setupMobileNavigation()

function resize() {
  const { width, height } = canvas.getBoundingClientRect()
  // The desktop framing intentionally offsets the sculpture for the poster
  // composition. Center it within the narrower mobile canvas instead.
  dog.position.x = window.matchMedia('(max-width: 767px)').matches ? 0 : 0.72
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  animalFraming.fit()
}

new ResizeObserver(resize).observe(canvas)
resize()

let lastFrameTime
renderer.setAnimationLoop(time => {
  const delta = lastFrameTime === undefined ? 1 / 60 : (time - lastFrameTime) / 1000
  lastFrameTime = time
  animalFraming.update(delta)
  controls.update()
  renderer.render(scene, camera)
})
