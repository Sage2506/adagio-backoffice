import { readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const indexPath = resolve(distDir, 'index.html');
const serverDir = resolve(distDir, 'server');

const template = await readFile(indexPath, 'utf-8');
const { render } = await import(`${serverDir}/entry-server.js`);
const appHtml = render('/');

const html = template.replace(
  '<div id="root" class="flex w-full"></div>',
  `<div id="root" class="flex w-full">${appHtml}</div>`,
);

await writeFile(indexPath, html);
await rm(serverDir, { recursive: true, force: true });