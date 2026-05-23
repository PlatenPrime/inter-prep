/**
 * 140 — observable lite
 * @tags dom
 * @difficulty medium
 *
 * createObservable(subscribe): subscribe → unsubscribe.
 */

export function createObservable(subscribe) {
  return { subscribe };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  let n = 0;
  const obs = createObservable((fn) => { fn(1); return () => {}; });
  obs.subscribe((v) => { n = v; });
  assert(n === 1);
  console.log('140-observable-lite: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
