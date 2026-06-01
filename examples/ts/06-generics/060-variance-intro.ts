/**
 * 060 — variance intro
 * @tags generics, variance
 * @difficulty hard
 *
 * ## Теория
 * Variance — как подтип связи T ↔ подтип F<T>.
 * Ковариантность: Dog <: Animal → Producer<Dog> usable as Producer<Animal> (readonly).
 * Контравариантность: для input (function params) направление обратное.
 * Инвариантность: Mutable<Box<Dog>> не assignable to Mutable<Box<Animal>>.
 * TS проверяет variance в strictFunctionTypes; readonly массивы ковариантны.
 *
 * ## На собеседовании
 * - Почему Array<Dog> не Array<Animal>? — push(string) сломает типы (инвариантность).
 * - readonly T[]? — Ковариантны — нельзя мутировать чужой элемент.
 * - Где contravariance? — Параметры функций в strict mode.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/003-osobennosti-typescript.md
 */

export type Animal = { name: string };
export type Dog = Animal & { breed: string };

export function readFirst<T extends Animal>(items: readonly T[]): T | undefined {
  return items[0];
}

export function describeAnimal(getName: (a: Animal) => string, dog: Dog): string {
  return getName(dog);
}

export function animalNames(animals: readonly Animal[]): string[] {
  return animals.map((a) => a.name);
}

export function isDog(a: Animal): a is Dog {
  return 'breed' in a;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const dogs: Dog[] = [
    { name: 'Rex', breed: 'corgi' },
    { name: 'Max', breed: 'lab' },
  ];
  assert(readFirst(dogs)?.name === 'Rex');
  assert(describeAnimal((a) => a.name, dogs[0]) === 'Rex');
  assert(animalNames(dogs).length === 2);
  assert(isDog(dogs[0]));
  console.log('060-variance-intro: ok');
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
