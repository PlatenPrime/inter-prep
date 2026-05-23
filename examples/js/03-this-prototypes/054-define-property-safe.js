/**
 * 054 — define property safe
 * @tags prototypes
 * @difficulty medium
 *
 * definePropertySafe с дефолтами enumerable/writable/configurable.
 */

export function definePropertySafe(obj, key, descriptor) {
  const defaults = { enumerable: false, writable: false, configurable: false };
  return Object.defineProperty(obj, key, { ...defaults, ...descriptor });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = {};
  definePropertySafe(o, 'x', { value: 1, enumerable: true });
  assert(o.x === 1);
  console.log('054-define-property-safe: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
