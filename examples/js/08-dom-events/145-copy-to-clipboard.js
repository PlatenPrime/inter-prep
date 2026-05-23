/**
 * 145 — copy to clipboard
 * @tags dom
 * @difficulty easy
 *
 * copyToClipboard(text, api): mock writeText.
 */

export async function copyToClipboard(text, api = { writeText: async (t) => t }) {
  await api.writeText(text);
  return true;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  assert((await copyToClipboard('hi', { writeText: async (t) => t })) === true);
  console.log('145-copy-to-clipboard: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
