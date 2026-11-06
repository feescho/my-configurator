import * as THREE from 'three'

// Fit the current shape, not a worst-case size shared by all variations.
export function createAnimalFraming(camera, controls, model) {
  let previousBounds = null
  let previousAspect = 0
  let previousFit = 0
  let transition = null
  let interacting = false
  let queued = false

  function fit() {
    if (interacting) {
      queued = true
      return
    }
    model.updateWorldMatrix(true, true)
    const bounds = new THREE.Box3().setFromObject(model, true)
    if (bounds.isEmpty()) return
    if (previousBounds?.equals(bounds) && previousAspect === camera.aspect) return

    const center = bounds.getCenter(new THREE.Vector3())
    const offset = camera.position.clone().sub(controls.target)
    const backward = offset.clone().normalize()
    const right = new THREE.Vector3().crossVectors(camera.up, backward).normalize()
    const up = new THREE.Vector3().crossVectors(backward, right).normalize()
    // Leave a 5% gutter on every canvas edge, including above the bottom tray.
    const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.9
    const tanX = tanY * camera.aspect
    let distance = 0
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const corner = new THREE.Vector3(x, y, z).sub(center)
          const depth = corner.dot(backward)
          distance = Math.max(distance,
            Math.abs(corner.dot(right)) / tanX + depth,
            Math.abs(corner.dot(up)) / tanY + depth,
            camera.near + depth,
          )
        }
      }
    }
    // Preserve intentional zoom-out. A new shape must still fit if the user
    // previously zoomed in; manual zoom remains unrestricted between changes.
    const zoomOut = previousFit && !transition ? Math.max(1, offset.length() / previousFit) : 1
    const targetDistance = Math.max(controls.minDistance, distance * zoomOut)
    controls.maxDistance = Math.max(12, targetDistance * 1.6)
    transition = { center, distance: targetDistance }
    previousBounds = bounds
    previousAspect = camera.aspect
    previousFit = Math.max(controls.minDistance, distance)
  }

  controls.addEventListener('start', () => {
    interacting = true
    transition = null
  })
  controls.addEventListener('end', () => {
    interacting = false
    if (queued) {
      queued = false
      fit()
    }
  })

  function update(delta) {
    if (!transition) return
    const offset = camera.position.clone().sub(controls.target)
    const alpha = 1 - Math.exp(-8 * Math.min(delta, 0.1))
    const distance = THREE.MathUtils.lerp(offset.length(), transition.distance, alpha)
    controls.target.lerp(transition.center, alpha)
    camera.position.copy(controls.target).addScaledVector(offset.normalize(), distance)
    if (controls.target.distanceTo(transition.center) < 0.001 && Math.abs(distance - transition.distance) < 0.001) {
      controls.target.copy(transition.center)
      camera.position.copy(controls.target).addScaledVector(offset, transition.distance)
      transition = null
    }
  }

  return { fit, update }
}
