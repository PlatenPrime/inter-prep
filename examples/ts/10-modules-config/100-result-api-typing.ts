/**
 * 100 — Result API typing
 * @tags config, result, api
 * @difficulty medium
 *
 * ## Теория
 * Discriminated union Result<T,E> = { ok: true; value: T } | { ok: false; error: E } — явные ошибки без throw. Сужение по ok. Альтернатива exceptions и Go-style errors.
 *
 * ## На собеседовании
 * Result vs throw vs Either from fp-ts. Типизация HTTP client с Result. ok narrowing в switch. never в exhaustive default.
 *
 * ## Связанные темы
 * discriminated unions, narrowing, assertNever.
 */

export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function parsePositiveInt(input: string): Result<number, 'not-a-number' | 'not-positive'> {
  const n = Number(input);
  if (Number.isNaN(n)) return err('not-a-number');
  if (n <= 0) return err('not-positive');
  return ok(n);
}

export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(parsePositiveInt('42').ok === true);
  const bad = parsePositiveInt('-1');
  assert(bad.ok === false);
  if (!bad.ok) assert(bad.error === 'not-positive');
  assert(unwrapOr(ok(1), 0) === 1);
  assert(unwrapOr(err('x'), 0) === 0);
  console.log('100-result-api-typing: ok');
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
