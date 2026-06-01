/**
 * 012 — Intersection types
 * @tags unions, intersection
 * @difficulty medium
 *
 * ## Теория
 * Intersection A & B — значение должно удовлетворять обоим типам одновременно (merge полей).
 * Часто комбинируют object types: User & Timestamps → id, name, createdAt.
 * С примитивами intersection обычно даёт never: string & number — невозможно.
 * interface A extends B — номинальное наследование; A & B — композиция структур.
 * Mixin-паттерн: function withTimestamps<T>(obj: T): T & { createdAt: Date }.
 * Пересечение с union распределяется: (A | B) & C → (A & C) | (B & C) (в ряде случаев).
 *
 * ## На собеседовании
 * - A & B для двух object types? — Объединение всех свойств; конфликт имён → never на поле.
 * - Intersection vs extends? — & композиция без иерархии; extends — один родитель interface.
 * - string & number — что это? — never; значение не существует.
 */

export type Timestamps = { createdAt: Date; updatedAt: Date };

export type Named = { name: string };

export type NamedEntity = Named & Timestamps;

export function withTimestamps<T extends object>(obj: T): T & Timestamps {
  const now = new Date(0);
  return { ...obj, createdAt: now, updatedAt: now };
}

export type Admin = { role: 'admin'; permissions: string[] };
export type Member = { role: 'member'; teamId: string };
export type Staff = Admin | Member;

export function staffLabel(person: Staff & Named): string {
  return person.name + ' (' + person.role + ')';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const e = withTimestamps({ name: 'Doc' });
  assert(e.name === 'Doc' && e.createdAt instanceof Date);
  const admin: Admin & Named = { role: 'admin', permissions: ['*'], name: 'Root' };
  assert(staffLabel(admin) === 'Root (admin)');
  console.log('012-intersection: ok');
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
