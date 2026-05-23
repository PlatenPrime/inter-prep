/**
 * 115 — unflatten object
 * @tags objects
 * @difficulty medium
 *
 * unflatten dotted keys.
 */

export function unflattenObject(flat) {
  const out = {};
  for (const [path, value] of Object.entries(flat)) setPath(out, path, value);
  return out;
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!cur[k]) cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(unflattenObject({ 'a.b': 1 }).a.b === 1);
  console.log('115-unflatten-object: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
