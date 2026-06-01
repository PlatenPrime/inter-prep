/**
 * 030 — Truthiness narrowing
 * @tags narrowing, truthiness
 * @difficulty easy
 *
 * ## Теория
 * if (value) сужает тип, убирая falsy: '', 0, false, null, undefined, NaN, document.all legacy.
 * Для строк if (s) отсекает ''; для чисел — 0; осторожно, если 0 валиден.
 * Boolean(value) не сужает так же агрессивно в некоторых позициях — предпочтите явные проверки.
 * !!value — приведение к boolean без сужения union в TS (часто).
 * Для optional string используйте s !== undefined && s !== '' если пустая строка допустима.
 * Различайте truthiness narrowing и nullish проверки (??, === null).
 *
 * ## На собеседовании
 * - if (count) проблема? — Отфильтрует 0; используйте count != null.
 * - Truthiness vs ?? — ?? только null/undefined; if (!x) все falsy.
 * - Сужает ли if (arr.length)? — arr всё ещё массив; length truthy не меняет тип элементов.
 */

export function nonEmpty(value: string | null | undefined): value is string {
  return Boolean(value);
}

export function trimOptional(value: string | undefined): string {
  if (!value) return '';
  return value.trim();
}

export function countTruthy(values: readonly (string | number | false | null)[]): number {
  let n = 0;
  for (const v of values) {
    if (v) n++;
  }
  return n;
}

export function pickName(user: { name: string } | null): string {
  if (!user) return 'Guest';
  return user.name;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(nonEmpty('a') === true);
  assert(nonEmpty('') === false);
  assert(trimOptional(undefined) === '');
  assert(trimOptional('  hi ') === 'hi');
  assert(countTruthy([0, '', 'x', null, 1]) === 2);
  assert(pickName(null) === 'Guest');
  console.log('030-truthiness: ok');
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
