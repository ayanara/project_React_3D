import { Box3, DoubleSide, Euler, Matrix4, Mesh, MeshBasicMaterial, Raycaster, Vector3, Quaternion } from 'three';

// The source GLB uses centimeters, Z up and -X as its front.
// Bake that transform into cloned geometry so decals use the same units.
export function prepareHatGeometry(nodes) {
  const rotation = new Matrix4().makeRotationFromEuler(new Euler(-Math.PI / 2, 0, Math.PI / 2));
  const parts = ['Object_2', 'Object_3', 'Object_4', 'Object_5', 'Object_6'].map((name) => {
    const geometry = nodes[name].geometry.clone().applyMatrix4(rotation);
    geometry.computeBoundingBox();
    return { name, geometry };
  });
  const bounds = new Box3();
  parts.forEach(({ geometry }) => bounds.union(geometry.boundingBox));
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const scale = 0.8 / Math.max(size.x, size.y, size.z);
  parts.forEach(({ geometry }) => {
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(scale, scale, scale);
    geometry.computeBoundingBox();
  });

  // Object_5 is the fabric crown; the other meshes are brim and fittings.
  const crown = parts.find(({ name }) => name === 'Object_5').geometry;
  const crownBounds = crown.boundingBox;
  const crownSize = crownBounds.getSize(new Vector3());
  const origin = crownBounds.getCenter(new Vector3());
  origin.y = crownBounds.min.y + crownSize.y * 0.58;
  origin.z = crownBounds.max.z + 1;
  const material = new MeshBasicMaterial({ side: DoubleSide });
  const surface = new Mesh(crown, material);
  surface.updateMatrixWorld();
  const hit = new Raycaster(origin, new Vector3(0, 0, -1)).intersectObject(surface)[0];
  material.dispose();
  if (!hit) throw new Error('Não foi possível localizar a frente do boné.');
  const normal = hit.face.normal.clone();
  if (normal.z < 0) normal.negate();
  const orientation = new Euler().setFromQuaternion(
    new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal)
  );
  return {
    parts,
    placement: { position: hit.point.toArray(), rotation: orientation.toArray().slice(0, 3) },
    logoScale: [crownSize.x * 0.4, crownSize.y * 0.36, crownSize.z * 0.3],
    fullScale: [crownSize.x * 0.95, crownSize.y * 0.85, crownSize.z * 0.75],
  };
}
