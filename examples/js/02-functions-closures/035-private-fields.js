/**
 * 035 — private fields
 * @tags closures
 * @difficulty easy
 *
 * createSecret(value): get/set через замыкание.
 */

export function createSecret(initial) {
  let secret = initial;
  return {
    get() { return secret; },
    set(v) { secret = v; },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const s = createSecret(1);
  s.set(2);
  assert(s.get() === 2);
  console.log('035-private-fields: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
