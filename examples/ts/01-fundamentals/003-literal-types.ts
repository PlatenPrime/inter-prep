/**
 * 003 — Literal types
 * @tags fundamentals, literals
 * @difficulty easy
 *
 * ## Теория
 * Литеральные типы — точные значения: 'ok', 42, true вместо string, number, boolean.
 * const x = 'left' с as const или без widening даёт union литералов или один литерал.
 * Литералы часто комбинируют в union: type Dir = 'up' | 'down' для дискриминантов и API.
 * Шаблонные литеральные типы (TS 4.1+): `item-${string}` для префиксов в строках.
 * Без as const let status = 'idle' расширяется до string; с as const остаётся 'idle'.
 * Литералы помогают автодополнению и исчерпывающим switch без enum.
 *
 * ## На собеседовании
 * - Чем literal type отличается от string? — Допускает только одно конкретное значение.
 * - Почему let mode = 'dark' имеет тип string? — Widening при let; const или as const сохраняют литерал.
 * - Зачем union литералов вместо enum? — Нет runtime, tree-shaking, проще для JSON API.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Theme = 'light' | 'dark';

export function buildUrl(path: string, method: HttpMethod): string {
  return method + ' ' + path;
}

export function themeLabel(theme: Theme): string {
  return theme === 'dark' ? 'Тёмная' : 'Светлая';
}

export function statusCodeMessage(code: 200 | 404 | 500): string {
  switch (code) {
    case 200:
      return 'OK';
    case 404:
      return 'Not Found';
    default:
      return 'Server Error';
  }
}

export const DEFAULT_THEME: Theme = 'light';

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(buildUrl('/api', 'GET') === 'GET /api');
  assert(themeLabel('dark') === 'Тёмная');
  assert(themeLabel('light') === 'Светлая');
  assert(statusCodeMessage(200) === 'OK');
  assert(statusCodeMessage(404) === 'Not Found');
  console.log('003-literal-types: ok');
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
