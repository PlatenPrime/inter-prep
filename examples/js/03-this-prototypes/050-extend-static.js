/**
 * 050 — extend static
 * @tags prototypes
 * @difficulty easy
 *
 * extendStatic(ctor, props): статические поля на конструктор.
 */

export function extendStatic(ctor, props) {
  Object.assign(ctor, props);
  return ctor;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  function C() {}
  extendStatic(C, { version: 1 });
  assert(C.version === 1);
  console.log('050-extend-static: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
