/**
 * 041 — function overloads
 * @tags functions, overloads
 * @difficulty medium
 *
 * ## Теория
 * Перегрузка в TS — несколько call signatures + одна implementing signature.
 * Компилятор проверяет вызовы по overloads; в JS остаётся одна функция.
 * Реализация должна быть совместима со всеми overloads (часто union в параметрах).
 * Порядок overloads важен: от более специфичных к общим.
 * Альтернатива: union параметров + conditional types — сложнее, но без overload list.
 *
 * ## На собеседовании
 * - Есть ли overload в runtime? — Нет, только типы.
 * - Почему реализация «шире»? — Одна функция обслуживает все варианты вызова.
 * - Overload vs union arg? — Overload даёт точный return type per call shape.
 *
 * ## Связанные темы
 * - webdev/14. ts/021-peregruzka-funkcij.md
 */

export function format(value: string): string;
export function format(value: number, decimals?: number): string;
export function format(value: Date): string;
export function format(value: string | number | Date, decimals = 0): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return value.toFixed(decimals);
  return value.trim();
}

export function len(value: string): number;
export function len(value: unknown[]): number;
export function len(value: string | unknown[]): number {
  return value.length;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(format('  hi  ') === 'hi');
  assert(format(3.14159, 2) === '3.14');
  assert(len('abc') === 3);
  assert(len([1, 2, 3]) === 3);
  console.log('041-overloads: ok');
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
