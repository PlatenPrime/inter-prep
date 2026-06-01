/**
 * 098 — tsconfig strict options
 * @tags config, strict
 * @difficulty medium
 *
 * ## Теория
 * strict включает noImplicitAny, strictNullChecks, strictFunctionTypes и др. noUncheckedIndexedAccess, exactOptionalPropertyTypes — дополнительная строгость. strict — baseline для production TS.
 *
 * ## На собеседовании
 * Что ломает strictNullChecks? Как мигрировать legacy проект? strict: true vs отдельные флаги. useUnknownInCatchVariables.
 *
 * ## Связанные темы
 * narrowing, unknown, never.
 */

export function strictPick<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  const value = obj[key];
  if (value === undefined && !(key in obj)) {
    throw new Error('missing key');
  }
  return value;
}

export function assertDefined<T>(value: T | null | undefined, msg?: string): T {
  if (value === null || value === undefined) {
    throw new Error(msg ?? 'expected defined value');
  }
  return value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const o = { a: 1, b: undefined as number | undefined };
  assert(strictPick(o, 'a') === 1);
  assert(assertDefined(0) === 0);
  console.log('098-tsconfig-strict: ok');
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
