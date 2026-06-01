/**
 * 059 — conditional in generics
 * @tags generics, conditional
 * @difficulty hard
 *
 * ## Теория
 * Условный тип: T extends U ? X : Y — зависит от совместимости T и U.
 * В generic: type Unwrap<T> = T extends Promise<infer U> ? U : T.
 * Distributive conditional: T extends Array<infer E> ? E[] : T при T union.
 * Используется в utility types, overload-like type logic.
 * infer — извлечь тип изнутри Promise/Array в conditional branch.
 *
 * ## На собеседовании
 * - Distributive когда? — T naked type parameter слева от extends.
 * - infer где? — Только в extends ветке conditional type.
 * - Conditional vs function overload? — Type-level vs call-level.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/014-utilitarnye-tipy-utility-types.md
 */

export type IsString<T> = T extends string ? true : false;

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function unwrapValue<T>(value: T): UnwrapPromise<T> {
  if (value instanceof Promise) {
    throw new Error('use unwrapValueAsync for promises');
  }
  return value as UnwrapPromise<T>;
}

export async function unwrapValueAsync<T>(value: T): Promise<UnwrapPromise<T>> {
  return (await value) as UnwrapPromise<T>;
}

export type Flatten<T> = T extends readonly (infer E)[] ? E : T;

export function flattenOne<T>(value: T): Flatten<T> {
  return (Array.isArray(value) ? value[0] : value) as Flatten<T>;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

async function runTests() {
  assert(unwrapValue(42) === 42);
  assert(flattenOne([1, 2, 3]) === 1);
  const p = await unwrapValueAsync(Promise.resolve('ok'));
  assert(p === 'ok');
  console.log('059-conditional-in-generic: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
