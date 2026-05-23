/**
 * 046 — object create
 * @tags prototypes
 * @difficulty easy
 *
 * Object.create(proto): объект с заданным прототипом.
 */

export function objectCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = objectCreate({ x: 1 });
  assert(o.x === 1);
  console.log('046-object-create: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
