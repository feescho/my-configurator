import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const themeStorageKey = 'balloon-animal-studio-theme'
const initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
document.body.classList.toggle('theme-dark', initialTheme === 'dark')

document.querySelector('#app').innerHTML = `
  <main class="prototype">
    <p class="poster-label poster-label--top">BALLOON ANIMAL STUDIO / 001</p>
    <p class="poster-label poster-label--edition">INTERACTIVE EDITION<br>2026 / BRUSSELS</p>
    <div class="theme-toggle" role="group" aria-label="Colour theme">
      <button class="theme-option ${initialTheme === 'light' ? 'is-active' : ''}" type="button" data-theme="light" aria-pressed="${initialTheme === 'light'}">Light</button>
      <button class="theme-option ${initialTheme === 'dark' ? 'is-active' : ''}" type="button" data-theme="dark" aria-pressed="${initialTheme === 'dark'}">Dark</button>
    </div>
    <span class="poster-rule poster-rule--top" aria-hidden="true"></span>
    <div class="content-column">
      <header class="masthead">
        <p class="eyebrow">PLAYFUL FORM / CHROMATIC SERIES</p>
        <h1 data-animal-title>Chromatic<br><em>Balloon Dog</em></h1>
        <p class="intro">A first study in inflated colour, chrome light, and playful form.</p>
      </header>
      <aside class="config-panel" aria-label="Balloon animal configurator">
        <div class="control-row">
          <div class="animal-switch" role="group" aria-label="Balloon animal">
            <button class="option is-active" type="button" data-control="animal" data-value="dog" aria-pressed="true">Dog</button>
            <button class="option" type="button" data-control="animal" data-value="rabbit" aria-pressed="false">Rabbit</button>
          </div>
          <div class="tray-tabs" role="tablist" aria-label="Configurator sections">
            <button class="tray-tab is-active" type="button" role="tab" id="tray-tab-colour" aria-controls="tray-panel-colour" aria-selected="true" data-tray-tab="colour">Colour</button>
            <button class="tray-tab" type="button" role="tab" id="tray-tab-surface" aria-controls="tray-panel-surface" aria-selected="false" data-tray-tab="surface">Surface</button>
            <button class="tray-tab" type="button" role="tab" id="tray-tab-form" aria-controls="tray-panel-form" aria-selected="false" data-tray-tab="form">Form</button>
          </div>
        </div>
        <section class="tray-panel" role="tabpanel" id="tray-panel-colour" aria-labelledby="tray-tab-colour" data-tray-panel="colour">
          <fieldset class="config-group">
            <legend>Colour composition</legend>
            <div class="option-grid option-grid--two" role="group" aria-label="Colour composition">
              <button class="option is-active" type="button" data-control="colour-composition" data-value="original" aria-pressed="true">Original mix</button>
              <button class="option" type="button" data-control="colour-composition" data-value="custom" aria-pressed="false">Custom colours</button>
            </div>
            <div class="composition-editor" data-composition-editor hidden>
              <p class="composition-label">Choose a part</p>
              <div class="option-grid composition-zones" role="group" aria-label="Balloon part">
                <button class="option is-active" type="button" data-control="colour-zone" data-value="body" aria-pressed="true">Body</button>
                <button class="option" type="button" data-control="colour-zone" data-value="head" aria-pressed="false">Head</button>
                <button class="option" type="button" data-control="colour-zone" data-value="ears" aria-pressed="false">Ears</button>
                <button class="option" type="button" data-control="colour-zone" data-value="front-legs" aria-pressed="false">Front legs</button>
                <button class="option" type="button" data-control="colour-zone" data-value="rear-legs" aria-pressed="false">Rear legs</button>
                <button class="option" type="button" data-control="colour-zone" data-value="tail" aria-pressed="false">Tail</button>
              </div>
              <p class="composition-label">Colour for <span data-active-colour-zone>Body</span></p>
              <div class="swatches" role="group" aria-label="Colour for selected balloon part">
                <button class="swatch swatch-pink" type="button" data-control="zone-colour" data-value="pink" aria-pressed="true" aria-label="Pink"></button>
                <button class="swatch swatch-violet" type="button" data-control="zone-colour" data-value="violet" aria-pressed="false" aria-label="Violet"></button>
                <button class="swatch swatch-cyan" type="button" data-control="zone-colour" data-value="cyan" aria-pressed="false" aria-label="Cyan"></button>
                <button class="swatch swatch-turquoise" type="button" data-control="zone-colour" data-value="turquoise" aria-pressed="false" aria-label="Turquoise"></button>
                <button class="swatch swatch-mint" type="button" data-control="zone-colour" data-value="mint" aria-pressed="false" aria-label="Mint"></button>
                <button class="swatch swatch-yellow" type="button" data-control="zone-colour" data-value="yellow" aria-pressed="false" aria-label="Yellow"></button>
              </div>
            </div>
          </fieldset>
        </section>
        <section class="tray-panel" role="tabpanel" id="tray-panel-surface" aria-labelledby="tray-tab-surface" data-tray-panel="surface" hidden>
          <fieldset class="config-group">
            <legend>Surface</legend>
            <div class="option-grid option-grid--three">
              <button class="option is-active" type="button" data-control="finish" data-value="jewel" aria-pressed="true">Jewel glass</button>
              <button class="option" type="button" data-control="finish" data-value="vinyl" aria-pressed="false">Glossy vinyl</button>
              <button class="option" type="button" data-control="finish" data-value="chrome" aria-pressed="false">Chrome</button>
            </div>
          </fieldset>
        </section>
        <section class="tray-panel" role="tabpanel" id="tray-panel-form" aria-labelledby="tray-tab-form" data-tray-panel="form" hidden>
          <fieldset class="config-group" data-animal-controls="dog">
            <legend>Ears</legend>
            <div class="option-grid">
              <button class="option is-active" type="button" data-control="ears" data-value="classic" aria-pressed="true">Classic loop</button>
              <button class="option" type="button" data-control="ears" data-value="tall" aria-pressed="false">Tall loop</button>
              <button class="option" type="button" data-control="ears" data-value="small" aria-pressed="false">Small loop</button>
            </div>
          </fieldset>
          <fieldset class="config-group" data-animal-controls="dog">
            <legend>Body</legend>
            <div class="option-grid">
              <button class="option is-active" type="button" data-control="body" data-value="classic" aria-pressed="true">Classic</button>
              <button class="option" type="button" data-control="body" data-value="compact" aria-pressed="false">Compact</button>
              <button class="option" type="button" data-control="body" data-value="long" aria-pressed="false">Long</button>
            </div>
          </fieldset>
          <fieldset class="config-group" data-animal-controls="dog">
            <legend>Tail</legend>
            <div class="option-grid">
              <button class="option is-active" type="button" data-control="tail" data-value="upright" aria-pressed="true">Upright</button>
              <button class="option" type="button" data-control="tail" data-value="short" aria-pressed="false">Short curl</button>
              <button class="option" type="button" data-control="tail" data-value="long" aria-pressed="false">Long flourish</button>
            </div>
          </fieldset>
        </section>
      </aside>
    </div>
    <section class="viewer" aria-label="Interactive 3D balloon dog viewer">
      <canvas id="dog-canvas" aria-label="A rotatable 3D balloon dog"></canvas>
      <p class="viewer-label">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</p>
      <p class="edition">ANIMAL OBJECT / 01</p>
      <span class="poster-rule poster-rule--viewer" aria-hidden="true"></span>
    </section>
  </main>
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

// Jewel materials are shared by named anatomy groups. Future controls can
// update the palette or swap finish values without changing the geometry.
const jewelPalette = {
  magenta: '#e21b82',
  violet: '#713de2',
  cyan: '#13cfc8',
  blue: '#218fe6',
  pearl: '#f7d9ed',
  amber: '#f2ad34',
}

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

const balloonMaterials = Object.fromEntries(
  Object.entries(jewelPalette).map(([name, color]) => [name, createJewelMaterial(color)]),
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
}

const configuratorState = {
  animal: 'dog',
  colourComposition: 'original',
  colourZone: { dog: 'body', rabbit: 'body' },
  finish: 'jewel',
  ears: 'classic',
  body: 'classic',
  tail: 'upright',
}

const colourOptions = {
  pink: '#e21b82',
  violet: '#713de2',
  cyan: '#16d7cf',
  turquoise: '#19bfc7',
  mint: '#a9f28e',
  yellow: '#f5de72',
}

const colourZoneLabels = {
  body: 'Body',
  head: 'Head',
  ears: 'Ears',
  'front-legs': 'Front legs',
  'rear-legs': 'Rear legs',
  tail: 'Tail',
}

const customZoneColours = {
  dog: { body: 'pink', head: 'violet', ears: 'cyan', 'front-legs': 'turquoise', 'rear-legs': 'mint', tail: 'yellow' },
  rabbit: { body: 'cyan', head: 'pink', ears: 'violet', 'front-legs': 'mint', 'rear-legs': 'turquoise', tail: 'yellow' },
}

const customZoneMaterials = Object.fromEntries(
  Object.entries(customZoneColours).map(([animal, zones]) => [
    animal,
    Object.fromEntries(Object.entries(zones).map(([zone, colour]) => [zone, createJewelMaterial(colourOptions[colour])])),
  ]),
)

function zoneMaterial(animal, zone, originalMaterial) {
  return configuratorState.colourComposition === 'custom'
    ? customZoneMaterials[animal][zone]
    : originalMaterial
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

function disposeDogGeometry() {
  dogGeometry.traverse((part) => {
    if (part.isMesh) part.geometry.dispose()
  })
  dogGeometry.clear()
  balloonParts.length = 0
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

  addDogBubble(torso, anchors.torso.start, anchors.torso.end, 0.55, zoneMaterial('dog', 'body', balloonMaterials.magenta), 'magenta torso')
  addDogBubble(torso, anchors.neck.root, anchors.neck.top, 0.4, zoneMaterial('dog', 'body', balloonMaterials.amber), 'amber neck')
  addDogBubble(head, anchors.head.muzzleStart, anchors.head.muzzleEnd, 0.41 * spec.headScale, zoneMaterial('dog', 'head', balloonMaterials.pearl), 'pearl muzzle', 1.06)
  addBulb(head, anchors.head.muzzleEnd.clone().add(new THREE.Vector3(-0.1, 0, 0)), [0.12, 0.105, 0.105], zoneMaterial('dog', 'head', balloonMaterials.pearl), 'muzzle tied tip')

  ;[1, -1].forEach((side) => {
    const material = zoneMaterial('dog', 'ears', balloonMaterials[side > 0 ? 'magenta' : 'violet'])
    const ear = addMesh(ears, new THREE.TorusGeometry(earProfile.radius, earProfile.tube, 24, 64), material, `${side > 0 ? 'near' : 'far'} sculptural loop ear`)
    ear.scale.set(...earProfile.scale)
    ear.rotation.set(side * 0.1, side * 0.16, -0.15)
    // Place the bottom of every preset at the same attachment, even when tilted.
    const lowerEnd = new THREE.Vector3(0, -(earProfile.radius + earProfile.tube) * earProfile.scale[1], 0).applyEuler(ear.rotation)
    ear.position.copy(anchors.head.earRoot).add(new THREE.Vector3(0, -0.18, side * 0.28)).sub(lowerEnd)
  })

  const legParts = [
    { anchor: anchors.legs.frontNear, material: zoneMaterial('dog', 'front-legs', balloonMaterials.violet), name: 'front near' },
    { anchor: anchors.legs.frontFar, material: zoneMaterial('dog', 'front-legs', balloonMaterials.cyan), name: 'front far' },
    { anchor: anchors.legs.rearNear, material: zoneMaterial('dog', 'rear-legs', balloonMaterials.blue), name: 'rear near' },
    { anchor: anchors.legs.rearFar, material: zoneMaterial('dog', 'rear-legs', balloonMaterials.magenta), name: 'rear far' },
  ]
  legParts.forEach(({ anchor, material, name }) => {
    addDogBubble(legs, anchor.root, anchor.end, 0.43, material, `${name} inflated leg`, 0.94)
    addBulb(twists, anchor.root, [0.22, 0.17, 0.2], material, `${name} compressed twist`)
  })

  const tailMaterial = zoneMaterial('dog', 'tail', balloonMaterials.cyan)
  if (spec.tailStyle === 'upright') {
    addDogBubble(tail, anchors.tail.root, anchors.tail.tip, 0.3, tailMaterial, 'inflated upright tail')
    const tipEnd = anchors.tail.tip.clone().add(new THREE.Vector3(0.1, 0.26, 0))
    addDogBubble(tail, anchors.tail.tip, tipEnd, 0.09, zoneMaterial('dog', 'tail', balloonMaterials.violet), 'slender tail tip')
  } else {
    const length = spec.tailStyle === 'long' ? 1.25 : 0.62
    // One closed torus gives a folded curl; bury its lower arc in the rump.
    const curl = addMesh(tail, new THREE.TorusGeometry(length * 0.45, 0.19, 24, 64), tailMaterial, 'folded tail curl')
    curl.scale.set(0.8, spec.tailLift, 1)
    curl.position.copy(anchors.tail.root).add(new THREE.Vector3(0.08, length * 0.32, 0))
    curl.rotation.z = -0.22
  }
  addBulb(twists, anchors.neck.root, [0.24, 0.18, 0.24], zoneMaterial('dog', 'body', balloonMaterials.amber), 'neck body twist')
  addBulb(twists, anchors.neck.top, [0.25, 0.18, 0.27], zoneMaterial('dog', 'head', balloonMaterials.pearl), 'head twist')
  addBulb(twists, anchors.tail.root, [0.22, 0.19, 0.22], tailMaterial, 'tail root twist')
}

function createRabbitAnchors(spec) {
  const scale = spec.bodyScale
  const point = (x, y, z = 0) => new THREE.Vector3(x * scale, y * scale, z * scale)
  const bodyCenter = point(0.04, 1.46)
  const headCenter = point(-1.01, 2.02)
  const earAttachmentHeight = 0.82 * scale

  return {
    body: { center: bodyCenter, scale: [1.12 * scale, 0.68 * scale, 0.72 * scale] },
    head: { center: headCenter, scale: [0.63 * scale, 0.56 * scale, 0.59 * scale] },
    ears: {
      right: headCenter.clone().add(new THREE.Vector3(0, earAttachmentHeight, 0.45 * scale)),
      left: headCenter.clone().add(new THREE.Vector3(0, earAttachmentHeight, -0.45 * scale)),
    },
    legs: {
      frontNear: { root: point(-0.62, 0.64, 0.36), end: point(-0.72, -0.11, 0.36), radius: 0.25 },
      frontFar: { root: point(-0.62, 0.64, -0.36), end: point(-0.72, -0.11, -0.36), radius: 0.25 },
      rearNear: { center: point(0.67, 0.54, 0.38), scale: [0.49 * scale, 0.64 * scale, 0.47 * scale] },
      rearFar: { center: point(0.67, 0.54, -0.38), scale: [0.49 * scale, 0.64 * scale, 0.47 * scale] },
    },
    tail: { center: point(1.22, 1.72, -0.08), scale: [0.39 * scale, 0.39 * scale, 0.39 * scale] },
  }
}

function buildBalloonRabbit(spec) {
  disposeDogGeometry()

  const anchors = createRabbitAnchors(spec)
  const torso = createPartGroup('rabbit torso')
  const head = createPartGroup('rabbit head')
  const ears = createPartGroup('rabbit ears')
  const legs = createPartGroup('rabbit legs')
  const tail = createPartGroup('rabbit tail')

  addBulb(torso, anchors.body.center, anchors.body.scale, zoneMaterial('rabbit', 'body', balloonMaterials.cyan), 'cyan rabbit body')
  addBulb(head, anchors.head.center, anchors.head.scale, zoneMaterial('rabbit', 'head', balloonMaterials.pearl), 'pearl rabbit head')

  ;[
    { position: anchors.ears.right, material: zoneMaterial('rabbit', 'ears', balloonMaterials.magenta), name: 'right tall loop ear', side: 1 },
    { position: anchors.ears.left, material: zoneMaterial('rabbit', 'ears', balloonMaterials.violet), name: 'left tall loop ear', side: -1 },
  ].forEach(({ position, material, name, side }) => {
    const ear = addMesh(ears, new THREE.TorusGeometry(0.51, 0.17, 24, 64), material, name)
    ear.position.copy(position)
    ear.scale.set(0.62, 1.48, 1)
    ear.rotation.set(side * 0.14, side * 0.08, 0)
  })

  const legParts = [
    { anchor: anchors.legs.frontNear, material: zoneMaterial('rabbit', 'front-legs', balloonMaterials.violet), name: 'front near' },
    { anchor: anchors.legs.frontFar, material: zoneMaterial('rabbit', 'front-legs', balloonMaterials.cyan), name: 'front far' },
  ]
  legParts.forEach(({ anchor, material, name }) => {
    addCapsule(legs, anchor.root, anchor.end, anchor.radius, material, `${name} rabbit leg`)
  })
  addBulb(legs, anchors.legs.rearNear.center, anchors.legs.rearNear.scale, zoneMaterial('rabbit', 'rear-legs', balloonMaterials.blue), 'rear near rounded haunch')
  addBulb(legs, anchors.legs.rearFar.center, anchors.legs.rearFar.scale, zoneMaterial('rabbit', 'rear-legs', balloonMaterials.magenta), 'rear far rounded haunch')

  addBulb(tail, anchors.tail.center, anchors.tail.scale, zoneMaterial('rabbit', 'tail', balloonMaterials.amber), 'amber rabbit tail')
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
  Object.entries(balloonMaterials).forEach(([name, material]) => {
    updateMaterialFinish(material, jewelPalette[name])
  })
  Object.entries(customZoneMaterials).forEach(([animal, zones]) => {
    Object.entries(zones).forEach(([zone, material]) => {
      updateMaterialFinish(material, colourOptions[customZoneColours[animal][zone]])
    })
  })
}

function rebuildFromConfigurator() {
  if (configuratorState.animal === 'rabbit') {
    buildBalloonRabbit(balloonRabbitSpec)
    return
  }

  Object.assign(balloonDogSpec, bodyProfiles[configuratorState.body], {
    earStyle: configuratorState.ears,
    tailStyle: configuratorState.tail,
  })
  buildBalloonDog(balloonDogSpec)
}

function updateAnimalControlVisibility() {
  const isDog = configuratorState.animal === 'dog'
  document.querySelectorAll('[data-animal-controls]').forEach((group) => {
    group.hidden = group.dataset.animalControls !== configuratorState.animal
  })
  const formTab = document.querySelector('[data-tray-tab="form"]')
  formTab.hidden = !isDog
  if (!isDog && formTab.getAttribute('aria-selected') === 'true') setActiveTraySection('colour')
}

function updateCompositionEditor() {
  const isCustom = configuratorState.colourComposition === 'custom'
  document.querySelector('[data-composition-editor]').hidden = !isCustom

  const activeZone = configuratorState.colourZone[configuratorState.animal]
  document.querySelector('[data-active-colour-zone]').textContent = colourZoneLabels[activeZone]
  document.querySelectorAll('[data-control="colour-zone"]').forEach((button) => {
    const selected = button.dataset.value === activeZone
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })
  document.querySelectorAll('[data-control="zone-colour"]').forEach((button) => {
    const selected = button.dataset.value === customZoneColours[configuratorState.animal][activeZone]
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })
}

function updateAnimalTitle() {
  const animalName = configuratorState.animal === 'rabbit' ? 'Rabbit' : 'Dog'
  document.querySelector('[data-animal-title]').innerHTML = `Chromatic<br><em>Balloon ${animalName}</em>`
  document.title = `Chromatic Balloon ${animalName}`
}

function updateControlState(control, value) {
  document.querySelectorAll(`[data-control="${control}"]`).forEach((button) => {
    const selected = button.dataset.value === value
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })
}

function setActiveTraySection(sectionName) {
  document.querySelectorAll('[data-tray-tab]').forEach((tab) => {
    const selected = tab.dataset.trayTab === sectionName
    tab.classList.toggle('is-active', selected)
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
  })
  document.querySelectorAll('[data-tray-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.trayPanel !== sectionName
  })
}

document.querySelectorAll('[data-tray-tab]').forEach((tab) => {
  tab.addEventListener('click', () => setActiveTraySection(tab.dataset.trayTab))
})

document.querySelectorAll('[data-control]').forEach((button) => {
  button.addEventListener('click', () => {
    const { control, value } = button.dataset
    if (control === 'colour-composition') configuratorState.colourComposition = value
    else if (control !== 'colour-zone' && control !== 'zone-colour') configuratorState[control] = value
    updateControlState(control, value)

    if (control === 'finish') updateMaterials()
    if (control === 'animal') {
      updateAnimalControlVisibility()
      updateAnimalTitle()
      updateCompositionEditor()
      rebuildFromConfigurator()
    }
    if (control === 'colour-composition') {
      updateCompositionEditor()
      rebuildFromConfigurator()
    }
    if (control === 'colour-zone') {
      configuratorState.colourZone[configuratorState.animal] = value
      updateCompositionEditor()
    }
    if (control === 'zone-colour') {
      const activeZone = configuratorState.colourZone[configuratorState.animal]
      customZoneColours[configuratorState.animal][activeZone] = value
      updateCompositionEditor()
      updateMaterials()
    }
    if (configuratorState.animal === 'dog' && (control === 'ears' || control === 'body' || control === 'tail')) rebuildFromConfigurator()
  })
})

updateAnimalControlVisibility()
updateAnimalTitle()
updateCompositionEditor()
updateMaterials()

function resize() {
  const { width, height } = canvas.getBoundingClientRect()
  // The desktop framing intentionally offsets the sculpture for the poster
  // composition. Center it within the narrower mobile canvas instead.
  dog.position.x = window.matchMedia('(max-width: 767px)').matches ? 0 : 0.72
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

new ResizeObserver(resize).observe(canvas)
resize()

renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
