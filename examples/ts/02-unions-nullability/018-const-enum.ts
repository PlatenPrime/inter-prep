/**
 * 018 — const enum
 * @tags unions, enum
 * @difficulty hard
 *
 * ## Теория
 * const enum члены инлайнятся в использование — нет объекта Direction в JS (при preserveConstEnums: false).
 * Ускоряет runtime и уменьшает bundle, но ломает runtime-итерацию по enum.
 * preserveConstEnums: true оставляет объект для отладки — редко включают.
 * С isolatedModules Babel не может инлайнить — предпочитайте union или обычный enum.
 * const enum Direction { Up, Down } → в коде станет 0, 1.
 * Для совместимости с vite/esbuild часто избегают const enum.
 *
 * ## На собеседовании
 * - Виден ли const enum в runtime? — Обычно нет, значения подставлены.
 * - Почему const enum спорен? — Плохая совместимость с transpile-only пайплайнами.
 * - Альтернатива? — as const object + union typeof values.
 */

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export function opposite(dir: Direction): Direction {
  switch (dir) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
  }
}

export function isVertical(dir: Direction): boolean {
  return dir === Direction.Up || dir === Direction.Down;
}

export function parseDirection(raw: string): Direction | null {
  const values = Object.values(Direction) as string[];
  if (!values.includes(raw)) return null;
  return raw as Direction;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(opposite(Direction.Up) === Direction.Down);
  assert(isVertical(Direction.Left) === false);
  assert(parseDirection('UP') === Direction.Up);
  assert(parseDirection('diag') === null);
  console.log('018-const-enum: ok');
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
