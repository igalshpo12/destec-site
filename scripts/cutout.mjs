#!/usr/bin/env node
/**
 * Cut a product photo out of its uniform light background → transparent webp.
 * Border flood-fill with tolerance + keep-largest-connected-component
 * (same approach as the Vacuson/turbine 360 frames; see destec memory).
 *
 * Usage: node scripts/cutout.mjs <input-url-or-path> <output.webp> [tolerance=28]
 */
import sharp from 'sharp';

const [, , input, output, tolArg] = process.argv;
if (!input || !output) { console.error('usage: cutout.mjs <input> <output.webp> [tolerance]'); process.exit(1); }
const TOL = Number(tolArg) || 28;

const buf = input.startsWith('http')
  ? Buffer.from(await (await fetch(input)).arrayBuffer())
  : input;

const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;

// background reference = median of border pixels
const border = [];
for (let x = 0; x < W; x += 4) border.push(px(x, 0), px(x, H - 1));
for (let y = 0; y < H; y += 4) border.push(px(0, y), px(W - 1, y));
const med = (ch) => {
  const v = border.map((i) => data[i + ch]).sort((a, b) => a - b);
  return v[v.length >> 1];
};
const bg = [med(0), med(1), med(2)];
const isBg = (i) =>
  Math.abs(data[i] - bg[0]) < TOL &&
  Math.abs(data[i + 1] - bg[1]) < TOL &&
  Math.abs(data[i + 2] - bg[2]) < TOL;

// flood fill background from borders
const mask = new Uint8Array(W * H); // 1 = background
const stack = [];
for (let x = 0; x < W; x++) { stack.push(x, 0, x, H - 1); }
for (let y = 0; y < H; y++) { stack.push(0, y, W - 1, y); }
while (stack.length) {
  const y = stack.pop(), x = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const m = y * W + x;
  if (mask[m] || !isBg(px(x, y))) continue;
  mask[m] = 1;
  stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}

// keep only the largest foreground component (drops floating shadow blobs)
const comp = new Int32Array(W * H).fill(-1);
let best = -1, bestSize = 0, nc = 0;
for (let i = 0; i < W * H; i++) {
  if (mask[i] || comp[i] !== -1) continue;
  let size = 0;
  const q = [i];
  comp[i] = nc;
  while (q.length) {
    const j = q.pop();
    size++;
    const x = j % W, y = (j / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const k = ny * W + nx;
      if (!mask[k] && comp[k] === -1) { comp[k] = nc; q.push(k); }
    }
  }
  if (size > bestSize) { bestSize = size; best = nc; }
  nc++;
}

for (let i = 0; i < W * H; i++) {
  if (mask[i] || comp[i] !== best) data[i * 4 + 3] = 0;
}

await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .trim()
  .webp({ quality: 88 })
  .toFile(output);
console.log('wrote', output);
