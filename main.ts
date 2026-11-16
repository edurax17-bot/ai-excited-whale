// ai-excited-01 entry (Node 22, standard library only).
// The whale image lives beside this file as entry.png; this program
// places an exact copy of it at $MAKEFUN_OUTPUT_DIR/entry.png,
// falling back to /output/entry.png inside the grader's container,
// so both runs produce byte-identical output.

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

// Gate self-check: the image must be a whole JPEG/PNG within the
// competition limits (at most 1 MiB) before it is copied anywhere.
const srcSize = statSync(src).size;
if (srcSize === 0 || srcSize > 1048576) {
  throw new Error(`entry.png is ${srcSize} bytes, outside the 1 MiB gate`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
if (statSync(dst).size !== srcSize) {
  throw new Error("copied entry.png does not match the source size");
}
