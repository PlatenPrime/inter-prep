/**
 * 047 — prototype chain
 * @tags prototypes
 * @difficulty easy
 *
 * Верни массив прототипов от obj до null.
 */

export function prototypeChain(obj) {
  const chain = [];
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(prototypeChain({}).length >= 1);
  console.log('047-prototype-chain: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
