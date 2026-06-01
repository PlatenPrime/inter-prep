/**
 * 021 — typeof narrowing
 * @tags narrowing, typeof
 * @difficulty easy
 *
 * ## Теория
 * typeof в type guard позиции сужает union примитивов: string, number, boolean, bigint, symbol, undefined.
 * typeof null в JS — 'object'; для null используйте === null отдельно.
 * typeof function — для callable; typeof array не существует (будет 'object') — нужен Array.isArray.
 * После if (typeof x === 'string') в блоке x: string.
 * Комбинируйте ветки для нескольких typeof в одной функции format.
 * Не полагайтесь на typeof для различения объектных типов — только примитивы.
 *
 * ## На собеседовании
 * - typeof []? — 'object'; как сузить массив? — Array.isArray.
 * - typeof null? — 'object'; проверка: value === null.
 * - Сужает ли typeof union object types? — Нет, все объекты 'object'.
 */

export function stringify(value: string | number | boolean): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toFixed(2);
  return value ? 'true' : 'false';
}

export function double(value: string | number): string | number {
  if (typeof value === 'number') return value * 2;
  return value + value;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function byteLength(value: string | ArrayBuffer): number {
  if (typeof value === 'string') return value.length;
  return value.byteLength;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(stringify(3.14159) === '3.14');
  assert(stringify('hi') === 'hi');
  assert(double(4) === 8);
  assert(double('a') === 'aa');
  assert(isNonEmptyString('x') === true);
  assert(byteLength(new ArrayBuffer(8)) === 8);
  console.log('021-typeof-narrowing: ok');
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
