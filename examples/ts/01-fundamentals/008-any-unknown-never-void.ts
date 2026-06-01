/**
 * 008 — any, unknown, never, void
 * @tags fundamentals, top-types
 * @difficulty medium
 *
 * ## Теория
 * any отключает проверку — избегайте; unknown — безопасный «всё»: сначала сузьте, потом используйте.
 * never — пустое множество: функция, которая всегда бросает, или ветка, которой не должно быть.
 * void — отсутствие полезного return; отличается от undefined (который значение).
 * unknown требует typeof, in, type guard перед доступом к свойствам.
 * never в union исчезает: string | never → string; в intersection доминирует.
 * Параметр rest never[] в unreachable helper — паттерн для assertNever.
 *
 * ## На собеседовании
 * - unknown vs any? — unknown требует сужения; any пропускает всё.
 * - Когда функция возвращает never? — throw, бесконечный цикл, exhaustive default.
 * - void vs undefined в return? — void игнорирует возвращаемое значение; undefined — конкретное значение.
 *
 * ## Связанные темы
 * webdev/14. ts/007-tipy-v-typescript.md
 */

export function assertNever(x: never): never {
  throw new Error('Unexpected: ' + String(x));
}

export function parseJsonSafe(raw: string): unknown {
  return JSON.parse(raw);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function logAndReturnVoid(message: string): void {
  void message;
}

export function fail(msg: string): never {
  throw new Error(msg);
}

export type Unwrap<T> = T extends readonly (infer U)[] ? U : T;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(isRecord({ a: 1 }) === true);
  assert(isRecord(null) === false);
  assert(logAndReturnVoid('x') === undefined);
  let parsed: unknown = parseJsonSafe('{"n":1}');
  assert(isRecord(parsed));
  try { fail('oops'); assert(false); } catch { assert(true); }
  console.log('008-any-unknown-never-void: ok');
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
