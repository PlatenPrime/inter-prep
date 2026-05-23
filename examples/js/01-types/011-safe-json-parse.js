/**
 * 011 — safe json parse
 * @tags types
 * @difficulty easy
 *
 * JSON.parse с fallback при ошибке.
 */

export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(safeJsonParse('{"a":1}').a === 1);
  assert(safeJsonParse('{bad}', 0) === 0);
  console.log('011-safe-json-parse: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
