/**
 * 139 — mitt
 * @tags dom
 * @difficulty easy
 *
 * Tiny pub/sub mitt.
 */

export function mitt() {
  const all = Object.create(null);
  return {
    on(type, handler) { (all[type] ||= []).push(handler); },
    off(type, handler) { if (all[type]) all[type] = all[type].filter((h) => h !== handler); },
    emit(type, evt) { (all[type] || []).slice().forEach((h) => h(evt)); },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const bus = mitt(); let x = 0; bus.on('a', () => x++); bus.emit('a'); assert(x === 1);
  console.log('139-mitt: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
