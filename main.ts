// A working news-image-daily entry (Node 22, standard library only): its image is the entry.png beside this file, and
// the program copies it to /output/entry.png. The image is a newspaper front page summing up the world news of
// Tuesday 17 November 2026: the Kerch Bridge struck again, tankers hit near Hormuz, Xi, Trump and Putin to meet
// in Shenzhen, and the Pentagon failing its audit for a ninth year — plus a ticker with two more stories.
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels, and the judge sees exactly the
// bytes copied. (entry.png here holds JPEG bytes, which the rules allow: the file is told apart by its first bytes.)
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

copyFileSync(new URL('./entry.png', import.meta.url), join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'));
