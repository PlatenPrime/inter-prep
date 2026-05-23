/**
 * 193 — builder
 * @tags patterns
 * @difficulty easy
 *
 * QueryBuilder: select/from/where/build.
 */

export function createQueryBuilder() {
  const parts = { select: '*', from: '', where: [] };
  return {
    select(cols) { parts.select = cols; return this; },
    from(table) { parts.from = table; return this; },
    where(cond) { parts.where.push(cond); return this; },
    build() {
      let sql = `SELECT ${parts.select} FROM ${parts.from}`;
      if (parts.where.length) sql += ' WHERE ' + parts.where.join(' AND ');
      return sql;
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const sql = createQueryBuilder().select('id').from('users').where('id=1').build();
  assert(sql.includes('SELECT id') && sql.includes('WHERE'));
  console.log('193-builder: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
