/**
 * 058 — typeof value types
 * @tags generics, typeof
 * @difficulty medium
 *
 * ## Теория
 * typeof variable в type position — тип значения (не JS typeof).
 * const config = { ... } as const → typeof config с readonly literals.
 * Связка с generics: function createApi<T extends typeof defaults>(partial: Partial<T>).
 * typeof import('./mod') для типов модуля.
 * Отличие: type-only typeof vs runtime typeof operator в value position.
 *
 * ## На собеседовании
 * - typeof в type vs value? — Разные пространства; одно имя — два смысла.
 * - Зачем typeof defaults? — DRY: тип конфига из эталонного объекта.
 * - as const + typeof? — Узкие literal types для ключей и значений.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/007-tipy-v-typescript.md
 */

export const defaultOptions = {
  mode: 'strict' as const,
  retries: 3,
  timeoutMs: 1000,
} as const;

export type DefaultOptions = typeof defaultOptions;
export type Mode = DefaultOptions['mode'];

export function mergeOptions(
  overrides: Partial<DefaultOptions>,
): DefaultOptions {
  return { ...defaultOptions, ...overrides };
}

export function getModeLabel(mode: Mode): string {
  return mode === 'strict' ? 'Strict' : 'Strict';
}

export function optionsFrom<T extends typeof defaultOptions>(base: T): T {
  return base;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const merged = mergeOptions({ retries: 5 });
  assert(merged.retries === 5);
  assert(merged.mode === 'strict');
  assert(getModeLabel('strict') === 'Strict');
  assert(optionsFrom(defaultOptions).timeoutMs === 1000);
  console.log('058-typeof-value-types: ok');
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
