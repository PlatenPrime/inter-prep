/**
 * 049 — inherits es5
 * @tags prototypes
 * @difficulty medium
 *
 * inherits(Child, Parent): ES5 наследование.
 */

export function inherits(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  function A() {}
  function B() {}
  inherits(B, A);
  assert(Object.getPrototypeOf(B.prototype) === A.prototype);
  console.log('049-inherits-es5: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
