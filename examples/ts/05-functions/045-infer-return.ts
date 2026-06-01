/**
 * 045 — infer return type
 * @tags functions, inference
 * @difficulty medium
 *
 * ## Теория
 * ReturnType<F> и typeof fn выводят тип возврата из сигнатуры функции.
 * satisfies и const context помогают сохранить узкие return types.
 * Явная аннотация return : T иногда нужна для публичного API и рекурсии.
 * async function возвращает Promise<T>; ReturnType оборачивает в Promise.
 * Избегай лишних аннотаций там, где inference даёт точный union/literal.
 *
 * ## На собеседовании
 * - ReturnType vs ручной тип? — DRY при рефакторинге реализации.
 * - Почему async return Promise? — Спецификация TS для async.
 * - infer в conditional? — Связано с ReturnType implementation (см. тему 071+).
 *
 * ## Связанные темы
 * - webdev/14. ts/014-utilitarnye-tipy-utility-types.md
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 */

export function makeCounter(start = 0) {
  let n = start;
  return () => ++n;
}

export type CounterFn = ReturnType<typeof makeCounter>;

export function invoke<T extends (...args: never[]) => unknown>(
  fn: T,
): ReturnType<T> {
  return fn() as ReturnType<T>;
}

export function parseResult(input: string): { ok: true; value: number } | { ok: false; error: string } {
  const n = Number(input);
  if (Number.isNaN(n)) return { ok: false, error: 'NaN' };
  return { ok: true, value: n };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const c = makeCounter(10);
  assert(c() === 11);
  assert(invoke(() => 'ts') === 'ts');
  const r = parseResult('42');
  assert(r.ok && r.value === 42);
  console.log('045-infer-return: ok');
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
