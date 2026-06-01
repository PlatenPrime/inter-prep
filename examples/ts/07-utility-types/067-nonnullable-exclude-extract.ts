/**
 * 067 — NonNullable, Exclude, Extract
 * @tags utility-types, unions
 * @difficulty medium
 *
 * ## Теория
 * NonNullable<T> убирает null и undefined. Exclude<T, U> удаляет из union T члены, присваиваемые U. Extract<T, U> оставляет только присваиваемые U. Основа фильтрации string literal unions.
 *
 * ## На собеседовании
 * Exclude для «все кроме error». Extract для выбора подмножества тегов. NonNullable после optional chaining в типах API.
 *
 * ## Связанные темы
 * infer, conditional types, discriminated unions.
 */

type Status = 'idle' | 'loading' | 'success' | 'error';
type OkStatus = Exclude<Status, 'error'>;
type ErrOnly = Extract<Status, 'error'>;

export function excludeTag<T extends string, E extends T>(
  value: T,
  excluded: readonly E[],
): Exclude<T, E> {
  if ((excluded as readonly string[]).includes(value)) {
    throw new Error('excluded value');
  }
  return value as Exclude<T, E>;
}

export function stripNullish<T>(value: T | null | undefined): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('nullish');
  }
  return value as NonNullable<T>;
}

const _ok: OkStatus = 'success';
void _ok;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(excludeTag('idle' as Status, ['error'] as const) === 'idle');
  assert(stripNullish('x') === 'x');
  let threw = false;
  try { stripNullish(null); } catch { threw = true; }
  assert(threw);
  console.log('067-nonnullable-exclude-extract: ok');
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
