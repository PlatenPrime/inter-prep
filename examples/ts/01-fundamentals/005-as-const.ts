/**
 * 005 — as const assertions
 * @tags fundamentals, const
 * @difficulty medium
 *
 * ## Теория
 * as const — утверждение const для выражения: все поля readonly, литералы не расширяются до примитивов.
 * Массив [1, 2] as const → readonly [1, 2], tuple, не number[].
 * Объект { role: 'admin' } as const → role: 'admin', не string.
 * Удобно для конфигов, routes, action types в Redux без enum.
 * typeof CONFIG as const даёт точный тип объекта для keyof и indexed access.
 * Комбинация с satisfies (TS 4.9): проверить форму и сохранить узкие литералы.
 *
 * ## На собеседовании
 * - Что меняет as const для объекта? — Readonly, литеральные типы полей, tuple для массивов.
 * - as const vs satisfies? — as const сужает вывод; satisfies проверяет соответствие типу без потери литералов.
 * - Можно ли изменить as const массив? — Нет по типу; в runtime массив обычный, но TS запретит push.
 */

export const ROUTES = {
  home: '/',
  profile: '/profile',
  settings: '/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const STATUS = ['idle', 'loading', 'done'] as const;

export type AppStatus = (typeof STATUS)[number];

export function isRoute(path: string): path is RoutePath {
  return (Object.values(ROUTES) as string[]).includes(path);
}

export function statusIndex(status: AppStatus): number {
  return STATUS.indexOf(status);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(ROUTES.home === '/');
  assert(isRoute('/profile') === true);
  assert(isRoute('/unknown') === false);
  assert(statusIndex('idle') === 0);
  assert(statusIndex('done') === 2);
  console.log('005-as-const: ok');
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
