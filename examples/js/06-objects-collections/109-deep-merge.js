/**
 * 109 — deep merge
 * @tags objects
 * @difficulty medium
 *
 * deep merge вложенных объектов.
 */

export function deepMerge(target, ...sources) {
  for (const src of sources) {
    for (const key of Object.keys(src)) {
      const tv = target[key];
      const sv = src[key];
      if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
        deepMerge(tv, sv);
      } else {
        target[key] = sv;
      }
    }
  }
  return target;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = deepMerge({ a: { x: 1 } }, { a: { y: 2 } });
  assert(o.a.x === 1 && o.a.y === 2);
  console.log('109-deep-merge: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
