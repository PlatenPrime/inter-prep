/**
 * 020 — Indexed access types
 * @tags unions, indexed
 * @difficulty medium
 *
 * ## Теория
 * T[K] — тип свойства K в T: User['id'] → string.
 * Можно индексировать union ключей: User['id' | 'name'] → string.
 * Массивы: MyArray[number] — тип элемента.
 * Вложенный доступ: Config['server']['port'] при вложенной структуре.
 * typeof + indexed: (typeof obj)[keyof typeof obj] для значений as const объекта.
 * Часто комбинируют с generics ReturnType, Parameters, Awaited.
 *
 * ## На собеседовании
 * - T[K] когда K union? — Union типов соответствующих свойств.
 * - Чем отличается от obj[key] в runtime? — Только compile-time; в JS обычный доступ.
 * - Array[number] vs Array[0]? — number — элемент; 0 — конкретный tuple slot.
 */

export type ApiEndpoints = {
  users: { list: '/users'; get: '/users/:id' };
  posts: { list: '/posts'; create: '/posts' };
};

export type UsersPaths = ApiEndpoints['users'][keyof ApiEndpoints['users']];

export function pathUsersList(): UsersPaths {
  return '/users';
}

export type Tuple = [string, number, boolean];

export type Second = Tuple[1];

export function getSecond(t: Tuple): Second {
  return t[1];
}

export const MODES = { view: 'view', edit: 'edit' } as const;
export type Mode = (typeof MODES)[keyof typeof MODES];

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(pathUsersList() === '/users');
  const t: Tuple = ['a', 2, true];
  assert(getSecond(t) === 2);
  assert((MODES.edit as Mode) === 'edit');
  console.log('020-indexed-access: ok');
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
