/**
 * 042 — optional and default params
 * @tags functions, params
 * @difficulty easy
 *
 * ## Теория
 * param?: T эквивалентно param: T | undefined с optional call.
 * Значение по умолчанию: param = value — тип выводится из default expression.
 * Optional параметры должны идти после обязательных (или иметь default).
 * undefined при вызове с ? — отдельно от «аргумент не передан» только с exactOptionalPropertyTypes.
 * Default в деструктуризации объекта — частый паттерн для options.
 *
 * ## На собеседовании
 * - ? vs default? — ? допускает omit; default подставляет значение при undefined/omit.
 * - Порядок параметров? — Required → optional → rest.
 * - optional property vs optional param? — Разные места; оба про отсутствие значения.
 *
 * ## Связанные темы
 * - webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md
 */

export function greet(name: string, title?: string): string {
  const t = title ? `${title} ` : '';
  return `Hello, ${t}${name}`;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): { page: number; items: T[] } {
  const start = (page - 1) * pageSize;
  return { page, items: items.slice(start, start + pageSize) };
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(greet('Ann') === 'Hello, Ann');
  assert(greet('Ann', 'Dr.') === 'Hello, Dr. Ann');
  assert(paginate([1, 2, 3, 4, 5], 2, 2).items.join('') === '34');
  assert(clamp(150) === 100);
  console.log('042-optional-default-params: ok');
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
