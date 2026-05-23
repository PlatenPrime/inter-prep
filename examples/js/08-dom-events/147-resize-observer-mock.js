/**
 * 147 — resize observer mock
 * @tags dom
 * @difficulty easy
 *
 * createResizeHandler(fn): вызови fn при resize (mock).
 */

export function createResizeHandler(fn) {
  const handlers = new Set([fn]);
  return {
    trigger(width, height) {
      handlers.forEach((h) => h({ width, height }));
    },
    subscribe(h) { handlers.add(h); return () => handlers.delete(h); },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  let w = 0;
  const r = createResizeHandler(({ width }) => { w = width; });
  r.trigger(100, 50);
  assert(w === 100);
  console.log('147-resize-observer-mock: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
