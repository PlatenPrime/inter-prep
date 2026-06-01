/**
 * 063 — Record<K, V>
 * @tags utility-types, record
 * @difficulty easy
 *
 * ## Теория
 * Record<Keys, Value> строит объект с ключами из union Keys и одинаковым типом значения Value. Безопаснее index signature Record<string, unknown> для известного набора ключей.
 *
 * ## На собеседовании
 * Record<Role, string[]> для lookup-таблиц. Record vs Map: Record — plain object, Map — любые ключи. Partial<Record<K,V>> когда не все ключи заданы.
 *
 * ## Связанные темы
 * keyof, as const объекты для ключей.
 */

type Role = 'admin' | 'user' | 'guest';

export function buildRecord<K extends string, V>(
  keys: readonly K[],
  valueFactory: (key: K) => V,
): Record<K, V> {
  const out = {} as Record<K, V>;
  for (const k of keys) out[k] = valueFactory(k);
  return out;
}

export function getFromRecord<K extends string, V>(
  table: Record<K, V>,
  key: K,
): V {
  return table[key];
}

const permissions: Record<Role, string[]> = buildRecord(
  ['admin', 'user', 'guest'] as const,
  (r) => [r + ':read'],
);
void permissions;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const t = buildRecord(['a', 'b'] as const, (k) => k.length);
  assert(t.a === 1 && t.b === 1);
  assert(getFromRecord(t, 'a') === 1);
  console.log('063-record: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
