/**
 * 091 — ESM import / export
 * @tags modules, esm
 * @difficulty easy
 *
 * ## Теория
 * ES modules: export, export default, import { named }, import * as ns. Статический анализ импортов, tree-shaking. .ts компилируется в ESM или CJS по module в tsconfig.
 *
 * ## На собеседовании
 * ESM vs CommonJS: require dynamic, import() async. __dirname в ESM через import.meta.url. default export и рефакторинг имени.
 *
 * ## Связанные темы
 * type-only imports, package.json "type": "module".
 */

export const VERSION = '1.0.0';

export function add(a: number, b: number): number {
  return a + b;
}

export default function multiply(a: number, b: number): number {
  return a * b;
}

export function describeOps(): string {
  return 'named:add, default:multiply';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(add(2, 3) === 5);
  assert(multiply(2, 3) === 6);
  assert(VERSION === '1.0.0');
  console.log('091-esm-import-export: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
