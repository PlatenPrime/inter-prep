/**
 * 162 — structured clone lite
 * @tags polyfills
 * @difficulty medium
 *
 * structuredClone lite (JSON types + Date).
 */

export function structuredCloneLite(value) {
  if (value instanceof Date) return new Date(value.getTime());
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(structuredCloneLite);
  const out = {};
  for (const k of Object.keys(value)) out[k] = structuredCloneLite(value[k]);
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = { d: new Date('2020-01-01') };
  const c = structuredCloneLite(o);
  assert(c.d.getTime() === o.d.getTime());
  console.log('162-structured-clone-lite: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
