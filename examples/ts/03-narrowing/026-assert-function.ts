/**
 * 026 — Assertion functions
 * @tags narrowing, asserts
 * @difficulty medium
 *
 * ## Теория
 * asserts value is T — функция либо завершает нормально (тип сужен), либо throw.
 * asserts value is NonNullable<T> убирает null/undefined после вызова.
 * В отличие от type guard, assert не возвращает boolean — управление потоком через throw.
 * Паттерн Node assert.ok — можно обернуть в asserts cond.
 * Не злоупотребляйте — предпочитайте явные if для пользовательского ввода.
 * asserts this is ... — assertion methods в классах (инициализация полей).
 *
 * ## На собеседовании
 * - asserts vs is guard? — asserts бросает; guard возвращает boolean.
 * - Сужается ли тип после assert? — Да, в коде ниже по потоку.
 * - Можно ли asserts для условия? — asserts condition is true (TS 3.7+).
 */

export function assertDefined<T>(value: T | null | undefined, msg?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(msg ?? 'value is nullish');
  }
}

export function assertString(value: unknown, msg?: string): asserts value is string {
  if (typeof value !== 'string') throw new Error(msg ?? 'expected string');
}

export function len(value: string | null): number {
  assertDefined(value);
  return value.length;
}

export function parseLabel(raw: unknown): string {
  assertString(raw);
  return raw.trim();
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(len('abc') === 3);
  assert(parseLabel('  x ') === 'x');
  let threw = false;
  try { assertDefined(null); } catch { threw = true; }
  assert(threw === true);
  console.log('026-assert-function: ok');
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
