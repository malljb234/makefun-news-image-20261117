// A working news-image-daily entry (Node 22, standard library only): its image is the entry.png beside this file, and
// the program copies it to /output/entry.png. The image is a newspaper front page summing up the world news of
// Tuesday 17 November 2026: the Kerch Bridge struck again, tankers hit near Hormuz, Xi, Trump and Putin to meet
// in Shenzhen, and the Pentagon failing its audit for a ninth year — plus a ticker with two more stories.
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels, and the judge sees exactly the
// bytes copied. (entry.png here holds JPEG bytes, which the rules allow: the file is told apart by its first bytes.)
//
// Usage:
//   node main.ts [--out <dir>] [--verify]
//     --out <dir>  where to write entry.png (default: $MAKEFUN_OUTPUT_DIR, else /output)
//     --verify     after copying, recompute the sha256 of the copy and of entry.png, print both,
//                  and fail unless the copy is byte-identical to entry.png and matches the known
//                  final digest below (guards against a corrupted or swapped entry.png).
//   MAKEFUN_OUTPUT_DIR=out node main.ts            # same as --out out (the output dir is created if missing)
//   node main.ts --out out --verify               # copy + prove the copy is byte-identical

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

// sha256 of the final entry.png (verified 2026-11-18; do not change unless the image changes).
const EXPECTED_SHA256 = 'b3fae2fa58b03595ee98430dad79efa151670bb79d9cfb811a7b2927abe0065a';

const args = process.argv.slice(2);
let outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
let verify = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') {
    const dir = args[++i];
    if (dir === undefined) { console.error('error: --out needs a directory'); process.exit(2); }
    outDir = dir;
  } else if (args[i] === '--verify') {
    verify = true;
  } else {
    console.error(`error: unknown argument: ${args[i]}`);
    process.exit(2);
  }
}

const src = new URL('./entry.png', import.meta.url);
const dest = join(outDir, 'entry.png');
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
console.log(`copied entry.png -> ${dest}`);

if (verify) {
  const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
  const srcDigest = digest(src);
  const destDigest = digest(dest);
  console.log(`entry.png sha256:     ${srcDigest}`);
  console.log(`out/entry.png sha256: ${destDigest}`);
  if (srcDigest !== destDigest) {
    console.error('VERIFY FAILED: copied file differs from entry.png');
    process.exit(1);
  }
  if (srcDigest !== EXPECTED_SHA256) {
    console.error('VERIFY FAILED: entry.png does not match the known final digest');
    process.exit(1);
  }
  console.log('VERIFY OK: copied file is byte-identical to entry.png');
}
