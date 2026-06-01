/**
 * 006 — satisfies operator
 * @tags fundamentals, satisfies
 * @difficulty medium
 *
 * ## Теория
 * Оператор satisfies (TS 4.9) проверяет, что значение соответствует типу, но сохраняет узкий выведенный тип.
 * theme satisfies Record<string, Theme> — все значения Theme, но ключи остаются конкретными для автодополнения.
 * Альтернатива: as ThemeConfig теряет литералы ключей; аннотация : ThemeConfig расширяет всё поле.
 * Типичный кейс: палитра цветов, словарь локалей, map статусов с проверкой полноты.
 * Ошибки satisfies указывают на конкретное несоответствие, не меняя inferred type.
 * Часто используют вместе с as const для строгих конфигов.
 *
 * ## На собеседовании
 * - satisfies vs : Type на переменной? — satisfies не расширяет литералы; аннотация сужает до объявленного типа.
 * - satisfies vs as? — satisfies проверяет структуру; as — принудительное утверждение без проверки.
 * - Когда satisfies бесполезен? — Когда и так нужен широкий тип Record<string, unknown>.
 *
 * ## Связанные темы
 * webdev/14. ts/003-osobennosti-typescript.md
 */

type Color = '#000' | '#fff' | '#f00';

type ColorPalette = Record<string, Color>;

export const palette = {
  text: '#000',
  bg: '#fff',
  danger: '#f00',
} satisfies ColorPalette;

export type PaletteKey = keyof typeof palette;

export function pickColor(key: PaletteKey): Color {
  return palette[key];
}

export const ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
} as const satisfies Record<string, `/${string}`>;

export function endpointKeys(): (keyof typeof ENDPOINTS)[] {
  return Object.keys(ENDPOINTS) as (keyof typeof ENDPOINTS)[];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(pickColor('text') === '#000');
  assert(pickColor('danger') === '#f00');
  assert(ENDPOINTS.users === '/api/users');
  const keys = endpointKeys();
  assert(keys.includes('users') && keys.includes('posts'));
  console.log('006-satisfies: ok');
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
