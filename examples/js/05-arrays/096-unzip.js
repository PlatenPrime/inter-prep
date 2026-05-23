/**
 * 096 — unzip
 * @tags arrays
 * @difficulty easy
 *
 * unzip: обратно к столбцам.
 */

export function unzip(rows) {
  return rows[0].map((_, i) => rows.map((row) => row[i]));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(unzip([[1, 'a'], [2, 'b']])[0].join() === '1,2');
  console.log('096-unzip: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
