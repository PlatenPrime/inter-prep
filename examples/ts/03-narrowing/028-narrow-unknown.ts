/**
 * 028 — Narrowing unknown
 * @tags narrowing, unknown
 * @difficulty medium
 *
 * ## Теория
 * unknown — вход по умолчанию для JSON.parse, catch, внешних API.
 * Перед использованием: typeof, instanceof, custom guard, schema validation.
 * Нельзя читать свойства без сужения — в отличие от any.
 * Паттерн: if (!isUser(data)) return; дальше data: User.
 * Zod/io-ts поверх unknown — промышленный стандарт.
 * В catch (e: unknown) сужайте до Error через instanceof.
 *
 * ## На собеседовании
 * - Почему не any для API? — any отключает проверку; unknown заставляет сузить.
 * - unknown в catch? — TS 4.4+ default; раньше any.
 * - Как сузить unknown[]? — Array.isArray + guard на элементы.
 */

export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(String(value));
}

export function readNumber(value: unknown): number | null {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return value;
}

export function readStringProp(obj: unknown, key: string): string | null {
  if (typeof obj !== 'object' || obj === null) return null;
  const record = obj as Record<string, unknown>;
  const v = record[key];
  return typeof v === 'string' ? v : null;
}

export function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(toError('x').message === 'x');
  assert(readNumber(42) === 42);
  assert(readNumber('x') === null);
  assert(readStringProp({ name: 'a' }, 'name') === 'a');
  assert(safeJsonParse('{"n":1}') !== null);
  console.log('028-narrow-unknown: ok');
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
