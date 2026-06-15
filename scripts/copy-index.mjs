import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientRoot = dirname(__dirname);
const distDir = join(clientRoot, 'dist');
const sourceFile = join(distDir, 'vite-index.html');
const targetFile = join(distDir, 'index.html');

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

if (!existsSync(sourceFile)) {
  throw new Error(`Expected build output not found: ${sourceFile}`);
}

copyFileSync(sourceFile, targetFile);
console.log('Copied dist/vite-index.html to dist/index.html');
