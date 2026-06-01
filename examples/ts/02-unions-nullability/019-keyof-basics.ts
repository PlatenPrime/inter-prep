/**
 * 019 — keyof operator
 * @tags unions, keyof
 * @difficulty medium
 *
 * ## Теория
 * keyof T — union всех ключей объекта: keyof { a: 1; b: 2 } → 'a' | 'b'.
 * Для индексных сигнатур keyof включает string | number | symbol.
 * С generics: function pick<T, K extends keyof T>(obj: T, key: K): T[K].
 * keyof any → string | number | symbol; keyof never → never.
 * С union объектов keyof — пересечение ключей (общие поля).
 * Record<keyof T, boolean> — типичный флаговый объект по всем полям.
 *
 * ## На собеседовании
 * - keyof (A | B) для объектов? — keyof A & keyof B (пересечение).
 * - Зачем extends keyof T? — Безопасный доступ к свойству по имени.
 * - keyof array? — 'length' | 'push' | ... union методов и индексов.
 */

export type User = { id: string; name: string; email: string };

export function pick<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function keysOf<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

export type UserKeys = keyof User;

export function isUserKey(key: string): key is UserKeys {
  return key === 'id' || key === 'name' || key === 'email';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const user: User = { id: '1', name: 'Ann', email: 'a@b.c' };
  assert(pick(user, 'name') === 'Ann');
  assert(keysOf(user).length === 3);
  assert(hasKey(user, 'email') === true);
  assert(isUserKey('name') === true);
  assert(isUserKey('age') === false);
  console.log('019-keyof-basics: ok');
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
