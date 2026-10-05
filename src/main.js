import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

document.querySelector('#app').innerHTML = `
  <main class="prototype">
    <header class="masthead">
      <p class="eyebrow">BALLOON STUDY / 001</p>
      <h1>Chromatic<br><em>Balloon Dog</em></h1>
      <p class="intro">A first study in inflated colour, chrome light, and playful form.</p>
    </header>
    <section class="viewer" aria-label="Interactive 3D balloon dog viewer">
      <canvas id="dog-canvas" aria-label="A rotatable 3D balloon dog"></canvas>
      <p class="viewer-label">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</p>
      <p class="edition">PROTOTYPE / 01</p>
    </section>
  </main>
`

const canvas = document.querySelector('#dog-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05

const scene = new THREE.Scene()
scene.background = new THREE.Color('#f1eaf4')

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
camera.position.set(7.2, 4.4, 8.4)

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

scene.add(new THREE.HemisphereLight(0xfffaff, 0x282034, 2.1))

const keyLight = new THREE.DirectionalLight(0xffffff, 4.2)
keyLight.position.set(-4, 8, 6)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.camera.left = -6
keyLight.shadow.camera.right = 6
keyLight.shadow.camera.top = 7
keyLight.shadow.camera.bottom = -3
scene.add(keyLight)

const cyanLight = new THREE.PointLight(0x16d7cf, 20, 10)
cyanLight.position.set(-4, 3, 3)
scene.add(cyanLight)

const magentaLight = new THREE.PointLight(0xd943b8, 18, 9)
magentaLight.position.set(4, 3.5, -3)
scene.add(magentaLight)

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(7.5, 64),
  new THREE.MeshPhysicalMaterial({
    color: 0xe9dfea,
    roughness: 0.44,
    metalness: 0.08,
    clearcoat: 0.18,
  }),
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.08
floor.receiveShadow = true
scene.add(floor)

const balloonMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xd943b8,
  roughness: 0.16,
  metalness: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
})
const violetMaterial = balloonMaterial.clone()
violetMaterial.color.set('#7845e8')
const cyanMaterial = balloonMaterial.clone()
cyanMaterial.color.set('#16d7cf')
const blueMaterial = balloonMaterial.clone()
blueMaterial.color.set('#25a9f0')
const pearlMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xf4f0f6,
  roughness: 0.12,
  metalness: 0.02,
  transmission: 0.22,
  thickness: 0.4,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
})
const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x11111a, roughness: 0.22, metalness: 0.12 })
const yellowMaterial = balloonMaterial.clone()
yellowMaterial.color.set('#f5de72')

const dog = new THREE.Group()
dog.position.y = 0.08
dog.rotation.y = -0.25
scene.add(dog)

function balloon(scale, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), material)
  mesh.scale.set(...scale)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  mesh.castShadow = true
  mesh.receiveShadow = true
  dog.add(mesh)
  return mesh
}

function knot(position, material = pearlMaterial, scale = 0.24) {
  return balloon([scale, scale, scale], position, material)
}

// The dog is assembled from inflated ellipsoids so every part keeps a soft balloon silhouette.
balloon([2.25, 0.78, 0.84], [0, 1.72, 0], balloonMaterial)
balloon([0.9, 0.78, 0.78], [-2.05, 2.35, 0], pearlMaterial, [0, 0, -0.08])
balloon([0.68, 0.46, 0.5], [-2.92, 2.18, 0], pearlMaterial, [0, 0, -0.12])
knot([-3.48, 2.12, 0], yellowMaterial, 0.27)

balloon([0.48, 1.08, 0.52], [-1.12, 0.78, 0.58], violetMaterial, [0, 0, -0.08])
balloon([0.48, 1.08, 0.52], [1.15, 0.78, 0.58], blueMaterial, [0, 0, 0.08])
balloon([0.48, 1.08, 0.52], [-1.12, 0.78, -0.58], cyanMaterial, [0, 0, -0.08])
balloon([0.48, 1.08, 0.52], [1.15, 0.78, -0.58], violetMaterial, [0, 0, 0.08])

balloon([0.47, 1.08, 0.48], [-1.55, 3.32, 0.02], pearlMaterial, [0, 0, -0.1])
balloon([0.47, 1.08, 0.48], [-2.38, 3.3, 0.02], pearlMaterial, [0, 0, 0.1])
knot([-1.95, 2.82, 0], yellowMaterial, 0.2)

balloon([0.34, 0.88, 0.36], [2.2, 2.42, 0], cyanMaterial, [0, 0, -0.68])
knot([2.67, 2.82, 0], violetMaterial, 0.22)

balloon([0.12, 0.12, 0.12], [-2.7, 2.58, 0.59], darkMaterial)
balloon([0.12, 0.12, 0.12], [-2.7, 2.58, -0.59], darkMaterial)
balloon([0.2, 0.2, 0.2], [-3.48, 2.12, 0.03], darkMaterial)

const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(5.2, 2.1),
  new THREE.MeshBasicMaterial({ color: 0x9b7ca5, transparent: true, opacity: 0.16, depthWrite: false }),
)
shadow.rotation.x = -Math.PI / 2
shadow.position.set(0, -0.055, 0)
scene.add(shadow)

function resize() {
  const { width, height } = canvas.getBoundingClientRect()
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
