/**
 * 129 — parse query
 * @tags strings
 * @difficulty medium
 *
 * query string → object.
 */

export function parseQuery(qs) {
  const s = qs.startsWith('?') ? qs.slice(1) : qs;
  if (!s) return {};
  return Object.fromEntries(s.split('&').map((p) => {
    const [k, v = ''] = p.split('=');
    return [decodeURIComponent(k), decodeURIComponent(v)];
  }));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(parseQuery('a=1&b=2').a === '1');
  console.log('129-parse-query: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
