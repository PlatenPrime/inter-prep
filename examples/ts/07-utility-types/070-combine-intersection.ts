/**
 * 070 — Intersection и merge типов
 * @tags utility-types, intersection
 * @difficulty medium
 *
 * ## Теория
 * A & B — intersection: объект должен удовлетворять обоим типам. При конфликте свойств получаем never на этом ключе. Runtime merge — spread; типы — intersection или Overwrite utility.
 *
 * ## На собеседовании
 * Intersection vs extends. Почему { a: string } & { a: number } → never на a. Overwrite<T,U> для замены полей. Spread merge и потеря точности типов.
 *
 * ## Связанные темы
 * Union vs intersection, type compatibility.
 */

type A = { id: string };
type B = { name: string };
type AB = A & B;

export function mergeObjects<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

/** Overwrite: поля U перекрывают T */
export type Overwrite<T, U> = Omit<T, keyof U & keyof T> & U;

export function overwriteField<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
): T {
  return { ...obj, [key]: value };
}

const _ab: AB = { id: '1', name: 'Ann' };
void _ab;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const m = mergeObjects({ id: '1' }, { name: 'Ann' });
  assert(m.id === '1' && m.name === 'Ann');
  const u = overwriteField({ id: '1', n: 0 }, 'n', 2);
  assert(u.n === 2);
  console.log('070-combine-intersection: ok');
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
