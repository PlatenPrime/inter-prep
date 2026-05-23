/**
 * 188 — ransom note
 * @tags algorithms
 * @difficulty easy
 *
 * canConstruct(ransom, magazine).
 */

export function canConstruct(ransom, magazine) {
  const count = {};
  for (const ch of magazine) count[ch] = (count[ch] ?? 0) + 1;
  for (const ch of ransom) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(canConstruct('aa', 'aab') === true);
  console.log('188-ransom-note: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
