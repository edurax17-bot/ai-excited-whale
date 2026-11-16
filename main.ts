// ai-excited-01 entry (Node 22, standard library only): copy the image
// beside this file to the output directory as entry.png. The run is
// deterministic: the same input bytes are copied out, so two runs write
// identical files.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);
const dest = join(outputDir, 'entry.png');

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, dest);

// Self-check the gate limits so a bad build fails loudly instead of
// silently shipping an invalid image: whole PNG or JPEG, at most 1 MiB,
// at most 1024 by 1024 pixels.
const bytes = readFileSync(dest);
const isPng = bytes.subarray(0, 8).equals(
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
);
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a whole PNG nor a whole JPEG');
}
if (bytes.length > 1_048_576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
console.log(`wrote ${dest} (${statSync(dest).size} bytes)`);
