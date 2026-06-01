/**
 * 034 — callable interface
 * @tags interface, function
 * @difficulty medium
 *
 * ## Теория
 * Интерфейс может описать вызываемый объект через call signature: (args) => R.
 * Синтаксис: interface Fn { (x: number): string; } — аналог type Fn = (x: number) => string.
 * Несколько call/overload-сигнатур в одном interface — как у function overload types.
 * Constructor signature: new (...args) => Instance — для фабрик и классов.
 *
 * ## На собеседовании
 * - interface vs type для функции? — Эквивалентно для простой сигнатуры.
 * - Зачем callable interface? — Объект-функция с полями (например, debounced fn + .cancel).
 * - new () в interface? — Constructor signature для типизации new Expression.
 *
 * ## Связанные темы
 * - webdev/14. ts/007-tipy-v-typescript.md
 * - webdev/14. ts/021-peregruzka-funkcij.md
 */

export interface Formatter {
  (value: number): string;
  precision: number;
}

export function createFormatter(precision: number): Formatter {
  const fn = ((value: number) => value.toFixed(precision)) as Formatter;
  fn.precision = precision;
  return fn;
}

export interface CompareFn {
  (a: string, b: string): number;
}

export function sortWith(copy: string[], cmp: CompareFn): string[] {
  return [...copy].sort(cmp);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const fmt = createFormatter(2);
  assert(fmt(3.14159) === '3.14');
  assert(fmt.precision === 2);
  assert(sortWith(['b', 'a'], (a, b) => a.localeCompare(b)).join('') === 'ab');
  console.log('034-callable-interface: ok');
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
