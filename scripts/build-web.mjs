import { cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output);
await cp(new URL('../flutter/assets/clarity/index.html', import.meta.url), new URL('index.html', output));
