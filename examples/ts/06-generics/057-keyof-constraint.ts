/**
 * 057 — keyof constraint
 * @tags generics, keyof
 * @difficulty hard
 *
 * ## Теория
 * keyof T — union всех ключей объекта; T[K] — indexed access type.
 * <T, K extends keyof T> safeGet(obj, key) возвращает T[K].
 * const keys: (keyof User)[] — только валидные ключи.
 * keyof any → string | number | symbol; keyof never → never.
 * Связка с generics — основа typed pick/omit/get utilities.
 *
 * ## На собеседовании
 * - keyof union object? — keyof (A | B) = keyof A & keyof B.
 * - Почему K extends keyof T? — Чтобы key и return type связаны.
 * - keyof vs Object.keys? — keyof compile-time; keys runtime string[].
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/014-utilitarnye-tipy-utility-types.md
 */

export function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

export function pickKeys<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

export function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const user = { id: '1', name: 'Ann', age: 30 };
  assert(getProp(user, 'name') === 'Ann');
  assert(setProp(user, 'age', 31).age === 31);
  assert(pickKeys(user, ['id', 'name']).name === 'Ann');
  assert(hasKey(user, 'id'));
  console.log('057-keyof-constraint: ok');
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
