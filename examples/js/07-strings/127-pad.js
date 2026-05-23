/**
 * 127 — pad
 * @tags strings
 * @difficulty easy
 *
 * pad(str, len, char, side).
 */

export function pad(str, len, char = ' ', side = 'end') {
  const padLen = Math.max(0, len - str.length);
  const p = char.repeat(padLen);
  return side === 'start' ? p + str : str + p;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(pad('1', 3, '0', 'start') === '001');
  console.log('127-pad: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
