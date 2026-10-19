import * as THREE from 'three'

// Low-poly rounded petals share one instanced draw call, including the centres.
// Positions are deterministic so changing a finish never rearranges the bouquet.
export function createFlowerInterior(parts, model) {
  model.updateWorldMatrix(true, true)
  const modelInverse = model.matrixWorld.clone().invert()
  const geometry = new THREE.SphereGeometry(1, 12, 8)
  const material = new THREE.MeshStandardMaterial({ roughness: 0.27, metalness: 0.02 })
  const instances = []
  const palette = ['#ed59a5', '#9d6fe8', '#31cbd1', '#ffc84d', '#ec7447', '#a5d87c', '#fff3df']
  const occupied = []
  let flowerCount = 0

  for (const [partIndex, part] of parts.entries()) {
    // Tiny pinches, knots and tips have no room for a complete flower.
    if (/twist|pinch|tied|neck body|head twist|tail root|slender tail|compressed/.test(part.name)) continue
    const type = part.geometry.type
    if (type !== 'SphereGeometry' && type !== 'TorusGeometry') continue
    const transform = modelInverse.clone().multiply(part.matrixWorld)
    const inverse = transform.clone().invert()
    const minimumScale = Math.min(...part.scale.toArray())
    const localRadius = type === 'TorusGeometry' ? part.geometry.parameters.tube : 1
    const radius = Math.min(0.24, minimumScale * localRadius * 0.67)
    if (radius < 0.065) continue

    const contains = (point) => {
      const p = point.clone().applyMatrix4(inverse)
      if (type === 'SphereGeometry') return p.lengthSq() < 0.88 ** 2
      const { radius: major, tube } = part.geometry.parameters
      return (Math.hypot(p.x, p.y) - major) ** 2 + p.z ** 2 < (tube * 0.88) ** 2
    }
    const candidates = type === 'TorusGeometry'
      ? [0.4, 1.25, 2.2, 3.6, 4.65, 5.55].map(angle => new THREE.Vector3(
        Math.cos(angle) * part.geometry.parameters.radius,
        Math.sin(angle) * part.geometry.parameters.radius, 0))
      : [-0.44, 0.02, 0.45].map((offset, i) => {
        const p = new THREE.Vector3()
        const axes = ['x', 'y', 'z'].sort((a, b) => part.scale[b] - part.scale[a])
        p[axes[0]] = offset
        p[axes[1]] = i === 1 ? -0.12 : 0.1
        return p
      })

    for (const [candidateIndex, local] of candidates.entries()) {
      if (flowerCount >= 42) break
      const center = local.applyMatrix4(transform)
      if (occupied.some(item => item.center.distanceTo(center) < (item.radius + radius) * 1.1)) continue
      // Stand each flower in a different plane, keeping its sculptural depth.
      const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        -0.24 + Math.sin(partIndex * 1.7 + candidateIndex) * 0.55,
        0.55 + Math.cos(partIndex * 0.8) * 0.55,
        partIndex * 0.73 + candidateIndex * 0.9))
      let flower
      let size = radius
      for (let attempt = 0; attempt < 4; attempt++, size *= 0.82) {
        flower = []
        for (let petal = 0; petal < 6; petal++) {
          const angle = petal * Math.PI / 3
          const position = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0)
            .multiplyScalar(size * 0.54).applyQuaternion(rotation).add(center)
          const orientation = rotation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle))
          flower.push({ matrix: new THREE.Matrix4().compose(position, orientation,
            new THREE.Vector3(size * 0.47, size * 0.24, size * 0.22)), color: palette[(partIndex + candidateIndex) % palette.length] })
        }
        flower.push({ matrix: new THREE.Matrix4().compose(center, rotation,
          new THREE.Vector3(size * 0.27, size * 0.27, size * 0.3)), color: palette[(partIndex + candidateIndex + 3) % palette.length] })
        // Check every actual vertex, not just the flower's centre or bounding box.
        const vertices = geometry.attributes.position
        if (flower.every(piece => {
          for (let i = 0; i < vertices.count; i++) {
            if (!contains(new THREE.Vector3().fromBufferAttribute(vertices, i).applyMatrix4(piece.matrix))) return false
          }
          return true
        })) break
        flower = null
      }
      if (!flower) continue
      instances.push(...flower)
      occupied.push({ center, radius: size })
      flowerCount++
    }
  }

  const flowers = new THREE.InstancedMesh(geometry, material, instances.length)
  flowers.name = 'contained dimensional flowers'
  flowers.userData.flowerCount = flowerCount
  instances.forEach((piece, index) => {
    flowers.setMatrixAt(index, piece.matrix)
    flowers.setColorAt(index, new THREE.Color(piece.color))
  })
  flowers.instanceMatrix.needsUpdate = true
  if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true
  flowers.computeBoundingSphere()
  return flowers
}
