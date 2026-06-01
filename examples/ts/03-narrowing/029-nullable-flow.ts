/**
 * 029 — Nullable control flow
 * @tags narrowing, null
 * @difficulty medium
 *
 * ## Теория
 * Control flow analysis отслеживает сужение после if, return, throw, assignment.
 * if (!user) return — дальше user без null/undefined.
 * Повторное присваивание может расширить тип обратно — осторожно с замыканиями.
 * Closure в async callback может не видеть сужение снаружи — сохраните в const.
 * Optional chaining не сужает тип переменной — только результат выражения.
 * TypeScript 5+ улучшения для narrowing в destructuring и else веток.
 *
 * ## На собеседовании
 * - Почему сужение теряется в callback? — Анализ не через границы функции.
 * - !. non-null assertion vs if? — !. без проверки; if безопаснее.
 * - Сужается ли после Array.find? — T | undefined; нужна проверка.
 */

export function firstNonNull<T>(a: T | null, b: T | null): T | null {
  if (a !== null) return a;
  if (b !== null) return b;
  return null;
}

export function pluck<T, K extends keyof T>(obj: T | null, key: K): T[K] | null {
  if (obj === null) return null;
  return obj[key];
}

export function findById<T extends { id: string }>(items: readonly T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

export function requireFound<T>(value: T | undefined, msg: string): T {
  if (value === undefined) throw new Error(msg);
  return value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(firstNonNull(null, 5) === 5);
  assert(pluck({ id: '1', name: 'a' }, 'name') === 'a');
  assert(pluck(null, 'name') === null);
  const items = [{ id: '1', name: 'x' }];
  assert(requireFound(findById(items, '1'), 'missing').name === 'x');
  console.log('029-nullable-flow: ok');
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
