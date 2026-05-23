/**
 * 163 — json stringify safe
 * @tags polyfills
 * @difficulty medium
 *
 * JSON.stringify с circular ref.
 */

export function jsonStringifySafe(value) {
  const seen = new WeakSet();
  return JSON.stringify(value, (key, val) => {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) return '[Circular]';
      seen.add(val);
    }
    return val;
  });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = {}; o.self = o;
  assert(jsonStringifySafe(o).includes('[Circular]'));
  console.log('163-json-stringify-safe: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
