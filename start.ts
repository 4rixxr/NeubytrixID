import express from 'express';
import path from 'node:path';
import { createApp } from './server';
async function main() {
  const app = createApp();
  if (process.env.NODE_ENV === 'production') {
    const client = path.resolve('dist/client');
    app.use(express.static(client));
    app.get('*', (req, res) => {
      // Do not turn missing assets or server-source probes into a successful HTML response.
      if (path.extname(req.path)) { res.status(404).end(); return; }
      res.sendFile(path.join(client, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT harus bernilai 1–65535.');
  app.listen(port, '0.0.0.0', () => console.log(`NeubytrixID siap di http://localhost:${port}`));
}
main().catch(() => { console.error('Server gagal dimulai. Periksa PORT, dependensi, dan hasil build.'); process.exitCode = 1; });
