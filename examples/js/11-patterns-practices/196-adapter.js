/**
 * 196 — adapter
 * @tags patterns
 * @difficulty easy
 *
 * adaptLegacyApi(legacy): modern { fetchUser(id) }.
 */

export function adaptLegacyApi(legacy) {
  return {
    async fetchUser(id) {
      return new Promise((resolve, reject) => {
        legacy.getUser(id, (err, user) => (err ? reject(err) : resolve(user)));
      });
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const api = adaptLegacyApi({ getUser: (id, cb) => cb(null, { id }) });
  assert((await api.fetchUser(1)).id === 1);
  console.log('196-adapter: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
