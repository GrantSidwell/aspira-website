// Tidy a Revit GLB export for the website.
//
//   node tools/prepare_revit_glb.mjs <input.glb> [output.glb]
//
// Default output: public/models/the-drum.glb
//
// What it does:
//  1. Drops export leftovers: Revit level markers and Blender's default "Cube".
//  2. Moves the model so the origin is the centre of the drum at ground-floor level,
//     which is what src/data/hotspots.ts expects. The drum centre is found by
//     fitting a circle to the drum's curtain-wall mullions and panels.
//  3. Gives each Revit family a material (brick, concrete, glass, green paint, doors),
//     because the export comes out as one plain grey material.
//  4. Prunes and de-duplicates unused data.
// Units are left as they are: the export is already in metres (Blender applies the
// 0.3048 feet-to-metres scale on each object), and +Y is up.
import { NodeIO } from '@gltf-transform/core';
import { prune, dedup, weld } from '@gltf-transform/functions';
import path from 'node:path';

const [, , input, outArg] = process.argv;
if (!input) { console.error('Usage: node tools/prepare_revit_glb.mjs <input.glb> [output.glb]'); process.exit(1); }
const output = outArg ?? path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public', 'models', 'the-drum.glb');

const io = new NodeIO();
const doc = await io.read(input);
const root = doc.getRoot();
const scene = root.getDefaultScene() ?? root.listScenes()[0];

// 1. Remove export leftovers.
const DROP = [/^Level /, /^Cube$/];
for (const node of root.listNodes()) {
  if (DROP.some((re) => re.test(node.getName()))) node.dispose();
}

// 2. Find the drum centre from the curtain wall around the drum.
const DRUM = [/^Rectangular Mullion/, /^System Panel Glazed/];
const pts = [];
for (const node of root.listNodes()) {
  if (!DRUM.some((re) => re.test(node.getName())) || !node.getMesh()) continue;
  const m = node.getWorldMatrix();
  let sx = 0, sz = 0, n = 0;
  for (const prim of node.getMesh().listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    for (let i = 0; i < pos.getCount(); i++) {
      const [x, y, z] = pos.getElement(i, []);
      sx += m[0] * x + m[4] * y + m[8] * z + m[12];
      sz += m[2] * x + m[6] * y + m[10] * z + m[14];
      n++;
    }
  }
  if (n) pts.push([sx / n, sz / n]);
}
if (pts.length < 3) { console.error('Could not find the drum curtain wall; is this the drum model?'); process.exit(1); }
// Least-squares circle fit: x^2 + z^2 = 2ax + 2bz + c
let S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], R = [0, 0, 0];
for (const [x, z] of pts) {
  const row = [2 * x, 2 * z, 1], rhs = x * x + z * z;
  for (let i = 0; i < 3; i++) { R[i] += row[i] * rhs; for (let j = 0; j < 3; j++) S[i][j] += row[i] * row[j]; }
}
const solve3 = (A, b) => {
  const M = A.map((r, i) => [...r, b[i]]);
  for (let i = 0; i < 3; i++) {
    const p = M.slice(i).reduce((best, r, k) => (Math.abs(r[i]) > Math.abs(M[best][i]) ? i + k : best), i);
    [M[i], M[p]] = [M[p], M[i]];
    for (let k = 0; k < 3; k++) if (k !== i) { const f = M[k][i] / M[i][i]; for (let j = i; j < 4; j++) M[k][j] -= f * M[i][j]; }
  }
  return M.map((r, i) => r[3] / r[i]);
};
const [cx, cz, c] = solve3(S, R);
const radius = Math.sqrt(c + cx * cx + cz * cz);
console.log(`Drum centre x=${cx.toFixed(2)} z=${cz.toFixed(2)}, radius ${radius.toFixed(2)} m (diameter ${(2 * radius).toFixed(2)} m)`);

// Wrap everything in one parent node that shifts the drum centre to the origin.
const wrap = doc.createNode('The Drum (Revit)').setTranslation([-cx, 0, -cz]);
for (const child of scene.listChildren()) { scene.removeChild(child); wrap.addChild(child); }
scene.addChild(wrap);

// 3. Materials by Revit family name (first match wins).
const mat = (name, rgba, rough = 0.8, blend = false) => {
  const m = doc.createMaterial(name).setBaseColorFactor(rgba).setMetallicFactor(0).setRoughnessFactor(rough).setDoubleSided(true);
  if (blend) m.setAlphaMode('BLEND');
  return m;
};
const brick = mat('Brick', [0.42, 0.15, 0.09, 1]);
const concrete = mat('Concrete', [0.55, 0.55, 0.53, 1]);
const glass = mat('Glass', [0.55, 0.7, 0.75, 0.25], 0.05, true);
const green = mat('Green paint', [0.04, 0.16, 0.1, 1], 0.5);
const door = mat('Doors', [0.18, 0.18, 0.19, 1], 0.6);
const RULES = [
  [/Brick/, brick],
  [/^(System Panel Glazed|M_Window)/, glass],
  [/^(Rectangular Mullion|Railing|Top Rail|M_Trim)/, green],
  [/^M_Door/, door],
  [/./, concrete], // walls, floors, ceiling, stair
];
const named = (node) => {
  // Railing pieces are children of a named "Railing ..." node, so walk up the tree.
  for (let n = node; n && n !== wrap; n = n.getParentNode()) {
    if (n.getName()) return RULES.find(([re]) => re.test(n.getName()))[1];
  }
  return concrete;
};
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const m = named(node);
  for (const prim of mesh.listPrimitives()) prim.setMaterial(m);
}

// 4. Tidy up.
await doc.transform(dedup(), weld(), prune());
await io.write(output, doc);
console.log('Wrote', output);
