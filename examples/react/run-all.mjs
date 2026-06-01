#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', '..');

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vitest', 'run', 'examples/react'],
  {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

child.on('close', (code) => process.exit(code ?? 1));
