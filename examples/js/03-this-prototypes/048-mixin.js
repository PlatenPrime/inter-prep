/**
 * 048 — mixin
 * @tags prototypes
 * @difficulty easy
 *
 * mixin(target, ...sources): скопируй enumerable свойства.
 */

export function mixin(target, ...sources) {
  for (const src of sources) {
    Object.assign(target, src);
  }
  return target;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const t = {};
  mixin(t, { a: 1 }, { b: 2 });
  assert(t.a === 1 && t.b === 2);
  console.log('048-mixin: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
