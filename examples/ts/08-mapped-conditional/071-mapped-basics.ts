/**
 * 071 — Mapped types — основы
 * @tags mapped-types, keyof
 * @difficulty medium
 *
 * ## Теория
 * [K in keyof T]: T[K] — цикл по ключам. Можно добавить readonly или ? через модификаторы. Создаёт новый объектный тип с теми же или преобразованными свойствами.
 *
 * ## На собеседовании
 * Как Partial реализован через mapped type? keyof T vs string для index signature. Ограничение: только известные ключи T.
 *
 * ## Связанные темы
 * Utility types Partial, Record, Pick.
 */

type User = { id: string; name: string };

type Nullable<T> = { [K in keyof T]: T[K] | null };

export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R,
): { [K in keyof T]: R } {
  const out = {} as { [K in keyof T]: R };
  for (const k of Object.keys(obj) as (keyof T)[]) {
    out[k] = fn(obj[k], k);
  }
  return out;
}

type NullableUser = Nullable<User>;
const _nu: NullableUser = { id: null, name: 'Ann' };
void _nu;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const doubled = mapValues({ a: 1, b: 2 }, (v) => v * 2);
  assert(doubled.a === 2 && doubled.b === 4);
  console.log('071-mapped-basics: ok');
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
