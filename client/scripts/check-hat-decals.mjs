import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Box3, BufferAttribute, BufferGeometry, Euler, Mesh, Vector3 } from 'three';
import { DecalGeometry } from 'three-stdlib';
import { prepareHatGeometry } from '../src/canvas/hatGeometry.js';

const bytes = readFileSync(new URL('../public/baseball_hat_028.glb', import.meta.url));
const jsonLength = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
const binaryStart = 28 + jsonLength;
function readAccessor(index) {
  const accessor = gltf.accessors[index];
  const view = gltf.bufferViews[accessor.bufferView];
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3 }[accessor.type];
  const ArrayType = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array }[accessor.componentType];
  assert.ok(ArrayType, 'Supported GLB accessor');
  const componentBytes = ArrayType.BYTES_PER_ELEMENT;
  const values = new ArrayType(accessor.count * components);
  const start = binaryStart + (view.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = view.byteStride || components * componentBytes;
  for (let i = 0; i < accessor.count; i++) {
    for (let j = 0; j < components; j++) {
      const offset = start + i * stride + j * componentBytes;
      values[i * components + j] = accessor.componentType === 5126 ? bytes.readFloatLE(offset)
        : accessor.componentType === 5123 ? bytes.readUInt16LE(offset) : bytes.readUInt32LE(offset);
    }
  }
  return new BufferAttribute(values, components);
}
const nodes = {};
for (const node of gltf.nodes.filter((node) => node.mesh !== undefined)) {
  const primitive = gltf.meshes[node.mesh].primitives[0];
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', readAccessor(primitive.attributes.POSITION));
  geometry.setAttribute('normal', readAccessor(primitive.attributes.NORMAL));
  geometry.setIndex(readAccessor(primitive.indices));
  nodes[node.name] = { geometry };
}
const original = nodes.Object_5.geometry.attributes.position.array.slice();
const result = prepareHatGeometry(nodes);
assert.deepEqual(nodes.Object_5.geometry.attributes.position.array, original, 'Source GLB geometry stays intact');
const bounds = new Box3();
result.parts.forEach(({ geometry }) => bounds.union(geometry.boundingBox));
const size = bounds.getSize(new Vector3());
assert.ok(Math.abs(Math.max(size.x, size.y, size.z) - 0.8) < 0.00001);
const mesh = new Mesh(result.parts.find(({ name }) => name === 'Object_5').geometry);
for (const [name, scale] of [['logo', result.logoScale], ['full', result.fullScale]]) {
  const decal = new DecalGeometry(mesh, new Vector3(...result.placement.position),
    new Euler(...result.placement.rotation), new Vector3(...scale));
  assert.ok(decal.attributes.position.count > 0, `${name} must intersect the actual cap crown`);
  decal.computeBoundingBox();
  const projected = decal.boundingBox.getSize(new Vector3());
  assert.ok(projected.x > 0.1 && projected.y > 0.05, `${name} must have a visible area`);
  console.log(`${name}: ${decal.attributes.position.count / 3} projected triangles; size ${projected.toArray().map((v) => v.toFixed(3)).join(' x ')}`);
  decal.dispose();
}
result.parts.forEach(({ geometry }) => geometry.dispose());
Object.values(nodes).forEach(({ geometry }) => geometry.dispose());
console.log('Hat decal geometry checks passed.');