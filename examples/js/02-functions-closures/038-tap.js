/**
 * 038 — tap
 * @tags closures
 * @difficulty easy
 *
 * tap(value, fn): вызови fn для side-effect, верни value.
 */

export function tap(value, fn) {
  fn(value);
  return value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  let x;
  assert(tap(5, (v) => { x = v; }) === 5 && x === 5);
  console.log('038-tap: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
