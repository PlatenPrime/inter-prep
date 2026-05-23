/**
 * 141 — matches selector
 * @tags dom
 * @difficulty easy
 *
 * closestMatch(target, selector, root): mock closest.
 */

export function closestMatch(target, selector, root = null) {
  let el = target;
  while (el && el !== root) {
    if (el.matches?.(selector)) return el;
    el = el.parentElement ?? el.parent;
  }
  return null;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const child = { matches: () => false, parent: { matches: (s) => s === '.p', parent: null } };
  assert(closestMatch(child, '.p').matches('.p'));
  console.log('141-matches-selector: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
