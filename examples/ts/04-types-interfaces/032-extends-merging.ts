/**
 * 032 — extends and intersection
 * @tags interface, extends
 * @difficulty medium
 *
 * ## Теория
 * interface Admin extends User добавляет поля к базе; компилятор объединяет формы.
 * type Admin = User & { role: string } — intersection для type-алиасов.
 * extends для interface — иерархия с понятными ошибками; & — гибче, но при конфликте свойств получаем never на ключе.
 * Множественное extends: interface C extends A, B { } — все поля должны быть совместимы.
 * Intersection с примитивами даёт never — осторожно с & string.
 *
 * ## На собеседовании
 * - extends vs & для объектов? — Похожий результат; extends только у interface, & у type.
 * - Конфликт типов в &? — Свойство становится never, ошибка при использовании.
 * - Можно ли extends type? — interface extends только interface/type alias к объекту.
 *
 * ## Связанные темы
 * - webdev/14. ts/008-raznica-type-i-interface.md
 * - webdev/14. ts/010-raznica-obedinenie-i-peresechenie.md
 */

export interface User {
  id: string;
  name: string;
}

export interface Admin extends User {
  role: 'admin' | 'super';
}

export type Guest = User & { readonly guest: true };

export function isAdmin(u: User): u is Admin {
  return 'role' in u && (u as Admin).role !== undefined;
}

export function displayName(u: User): string {
  return isAdmin(u) ? `[${u.role}] ${u.name}` : u.name;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const admin: Admin = { id: '1', name: 'Ann', role: 'admin' };
  assert(displayName(admin) === '[admin] Ann');
  assert(isAdmin(admin));
  assert(!isAdmin({ id: '2', name: 'Bob' }));
  console.log('032-extends-merging: ok');
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
