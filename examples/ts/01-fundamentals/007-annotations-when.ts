/**
 * 007 — When to annotate
 * @tags fundamentals, best-practices
 * @difficulty medium
 *
 * ## Теория
 * Аннотируйте публичный API функций и экспортируемых сущностей — контракт виден без чтения тела.
 * Внутри функции полагайтесь на вывод, если он точный; иначе укажите тип для промежуточных переменных.
 * Параметры колбэков часто не нужны — contextual typing подставит тип из .filter, .map.
 * Явный возвращаемый тип функции ловит ошибки return и стабилизирует API при рефакторинге.
 * Избегайте избыточных : string у очевидных литералов и дублирования того, что уже вывелось.
 * В tsconfig включайте noImplicitAny и strict — они заставляют аннотировать только проблемные места.
 *
 * ## На собеседовании
 * - Нужен ли return type у private функции? — Желателен при сложной логике; иначе вывод достаточен.
 * - Зачем аннотация при пустом массиве []? — Без неё тип never[]; нужен number[] или generic.
 * - Где аннотация вредна? — Когда дублирует вывод и мешает сужению (лишний string вместо литерала).
 */

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function parsePositive(input: string): Result<number> {
  const n = Number(input);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, error: 'not a positive number' };
  }
  return { ok: true, value: n };
}

export function filterEvens(values: readonly number[]): number[] {
  return values.filter((n): n is number => n % 2 === 0);
}

export function createEmpty<T>(): T[] {
  const items: T[] = [];
  return items;
}

export function last<T>(arr: readonly T[]): T | undefined {
  return arr[arr.length - 1];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const ok = parsePositive('42');
  assert(ok.ok === true && ok.ok && ok.value === 42);
  const bad = parsePositive('-1');
  assert(bad.ok === false);
  assert(filterEvens([1, 2, 3, 4]).join(',') === '2,4');
  assert(createEmpty<number>().length === 0);
  assert(last([1, 2, 3]) === 3);
  console.log('007-annotations-when: ok');
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
