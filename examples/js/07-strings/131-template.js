/**
 * 131 — template
 * @tags strings
 * @difficulty easy
 *
 * template("Hi {{name}}", { name }).
 */

export function template(str, data) {
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => String(data[key] ?? ''));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(template('Hi {{name}}', { name: 'Ann' }) === 'Hi Ann');
  console.log('131-template: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
