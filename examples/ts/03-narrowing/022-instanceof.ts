/**
 * 022 — instanceof narrowing
 * @tags narrowing, instanceof
 * @difficulty easy
 *
 * ## Теория
 * instanceof проверяет цепочку прототипов: value instanceof Date → Date.
 * Работает с классами и встроенными конструкторами (Error, Array — лучше Array.isArray).
 * Для interface нет runtime — нужен user-defined type guard.
 * instanceof с union: if (x instanceof Foo) x сужается до Foo в ветке.
 * Кастомные классы в разных realm (iframe) могут ломать instanceof.
 * Symbol.hasInstance позволяет переопределить поведение на классе.
 *
 * ## На собеседовании
 * - instanceof для interface? — Нельзя; только type predicate.
 * - [] instanceof Array? — true; предпочтительнее Array.isArray.
 * - Почему instanceof не для plain object? — Нет единого конструктора.
 */

export class ApiError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return '[' + err.code + '] ' + err.message;
  if (err instanceof Error) return err.message;
  return String(err);
}

export function toDate(value: Date | number): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(errorMessage(new ApiError(404, 'Not found')).includes('404'));
  assert(errorMessage(new Error('x')) === 'x');
  assert(toDate(0).getTime() === 0);
  assert(isDate(new Date()) === true);
  console.log('022-instanceof: ok');
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
