/**
 * 051 — create instance
 * @tags prototypes
 * @difficulty easy
 *
 * createInstance(Constructor, ...args) без оператора new.
 */

export function createInstance(Constructor, ...args) {
  return myNew(Constructor, ...args);
}

function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result !== null && typeof result === 'object' ? result : obj;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  function Box(v) { this.v = v; }
  const b = createInstance(Box, 5);
  assert(b.v === 5);
  console.log('051-create-instance: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
