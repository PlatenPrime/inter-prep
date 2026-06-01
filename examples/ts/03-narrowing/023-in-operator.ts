/**
 * 023 — in operator narrowing
 * @tags narrowing, in
 * @difficulty medium
 *
 * ## Теория
 * 'prop' in obj сужает union объектов по наличию поля — дискриминант не обязателен.
 * Работает на уровне ключей: 'swim' in duck → ветка с swim.
 * На примитивах in не используют — TypeError в runtime для null/undefined.
 * Различайте in (ключ в объекте) и hasOwnProperty (собственное свойство).
 * С optional полями in может быть true, а значение undefined.
 * Для deep shape лучше discriminated union или schema (zod).
 *
 * ## На собеседовании
 * - 'a' in obj vs obj.a? — in проверяет цепочку прототипа; .a — значение.
 * - in сужает union? — Да, до веток, где поле обязательно.
 * - in на массиве 'length'? — true; для элементов — индексные ключи.
 */

type Fish = { swim: () => void };
type Bird = { fly: () => void };

export function move(animal: Fish | Bird): string {
  if ('swim' in animal) {
    animal.swim();
    return 'swim';
  }
  animal.fly();
  return 'fly';
}

type Admin = { role: 'admin'; level: number };
type Guest = { role: 'guest' };

export function accessLevel(user: Admin | Guest): number {
  if ('level' in user) return user.level;
  return 0;
}

export function hasProp<T extends object>(obj: T, key: PropertyKey): boolean {
  return key in obj;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const fish: Fish = { swim: () => {} };
  const bird: Bird = { fly: () => {} };
  assert(move(fish) === 'swim');
  assert(move(bird) === 'fly');
  assert(accessLevel({ role: 'admin', level: 3 }) === 3);
  assert(accessLevel({ role: 'guest' }) === 0);
  console.log('023-in-operator: ok');
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
