import { rm } from 'node:fs/promises';
import { build as buildClient } from 'vite';
import { build as buildServer } from 'esbuild';
await rm('dist', { recursive: true, force: true });
await buildClient();
await buildServer({ entryPoints: ['start.ts'], bundle: true, platform: 'node', format: 'cjs', packages: 'external', outfile: 'dist/server.cjs', define: { 'process.env.NODE_ENV': '"production"' } });
