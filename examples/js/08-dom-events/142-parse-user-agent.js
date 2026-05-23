/**
 * 142 — parse user agent
 * @tags dom
 * @difficulty easy
 *
 * Lite parse UA: browser name.
 */

export function parseUserAgent(ua) {
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/Edge/i.test(ua)) return 'Edge';
  return 'Unknown';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(parseUserAgent('Mozilla/5.0 Chrome/120') === 'Chrome');
  console.log('142-parse-user-agent: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
