/**
 * 110 — defaults
 * @tags objects
 * @difficulty easy
 *
 * defaults(obj, defs): только отсутствующие ключи.
 */

export function defaults(obj, defs) {
  const out = { ...obj };
  for (const [k, v] of Object.entries(defs)) {
    if (out[k] === undefined) out[k] = v;
  }
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(defaults({ a: 1 }, { a: 0, b: 2 }).b === 2);
  console.log('110-defaults: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
