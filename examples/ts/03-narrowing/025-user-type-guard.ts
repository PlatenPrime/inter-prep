/**
 * 025 — User-defined type guards
 * @tags narrowing, type-guard
 * @difficulty medium
 *
 * ## Теория
 * Предикат value is Type сообщает компилятору сужение при true.
 * function isUser(x: unknown): x is User { return ... }
 * Можно isArrayOfStrings(x): x is string[] с Array.isArray + every.
 * Type guards должны быть честными — ложный true ломает типобезопасность.
 * Комбинируйте несколько guard в цепочке if.
 * Generic guards: function isOfShape<T>(...): x is T — осторожно, легко соврать.
 * В React hooks и API валидации guards — стандартный паттерн.
 *
 * ## На собеседовании
 * - Синтаксис type guard? — param is Type в return type.
 * - Чем отличается от boolean функции? — Компилятор сужает тип в if.
 * - Можно ли guard для generic? — Да, но нет runtime проверки T.
 */

export type User = { id: string; name: string };

export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string';
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
}

export function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new Error('not a user');
}

export function greetUser(value: unknown): string {
  if (!isUser(value)) return 'stranger';
  return 'Hi, ' + value.name;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(isUser({ id: '1', name: 'Ann' }) === true);
  assert(isUser({ id: 1 }) === false);
  assert(isStringArray(['a']) === true);
  assert(greetUser({ id: '1', name: 'Bob' }) === 'Hi, Bob');
  assert(greetUser(null) === 'stranger');
  console.log('025-user-type-guard: ok');
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
