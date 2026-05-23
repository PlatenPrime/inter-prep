/**
 * 014 — deep clone json
 * @tags types
 * @difficulty easy
 *
 * Deep clone через JSON (только JSON-типы).
 */

export function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = { a: { b: 1 } };
  const c = deepCloneJson(o);
  c.a.b = 2;
  assert(o.a.b === 1);
  console.log('014-deep-clone-json: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
