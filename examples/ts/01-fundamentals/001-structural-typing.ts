/**
 * 001 — Structural typing
 * @tags fundamentals, types
 * @difficulty easy
 *
 * ## Теория
 * TypeScript использует структурную (утиную) типизацию: совместимость определяется формой значения, а не именем типа.
 * Если у объекта есть все обязательные поля с подходящими типами — он подходит, даже если тип объявлен иначе.
 * Имена типов и интерфейсов — подсказки для разработчика; на этапе проверки важна только структура.
 * Лишние свойства при присваивании литерала могут вызвать ошибку excess property check, но через переменную — нет.
 * Строки, массивы и многие встроенные типы тоже структурны: у string есть length, поэтому string подходит туда, где ожидают { length: number }.
 * На собеседовании часто сравнивают с номинальной типизацией Java/C#.
 *
 * ## На собеседовании
 * - Чем структурная типизация отличается от номинальной? — Совместимость по форме полей, а не по объявленному имени типа.
 * - Почему { x: 1, y: 2, z: 3 } иногда нельзя присвоить { x: number; y: number }? — Excess property check для свежих объектных литералов.
 * - Подойдёт ли string к типу { length: number }? — Да, структурно у строки есть length.
 *
 * ## Связанные темы
 * webdev/14. ts/007-tipy-v-typescript.md
 */

type HasLength = { length: number };

export function getLength(value: HasLength): number {
  return value.length;
}

export function lengthOfString(text: string): number {
  return getLength(text);
}

export function lengthOfArray(items: readonly unknown[]): number {
  return getLength(items);
}

type Point2D = { x: number; y: number };

export function magnitude(p: Point2D): number {
  return Math.hypot(p.x, p.y);
}

export function useLikePoint(obj: { x: number; y: number; label?: string }): number {
  return magnitude(obj);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(getLength('abc') === 3);
  assert(getLength([1, 2, 3]) === 3);
  assert(lengthOfString('hi') === 2);
  assert(magnitude({ x: 3, y: 4 }) === 5);
  assert(useLikePoint({ x: 0, y: 0, label: 'origin' }) === 0);
  console.log('001-structural-typing: ok');
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
