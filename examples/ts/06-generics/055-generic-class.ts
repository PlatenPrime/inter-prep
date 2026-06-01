/**
 * 055 — generic class
 * @tags generics, class
 * @difficulty medium
 *
 * ## Теория
 * class Box<T> { value: T } — T на уровне экземпляра и методов.
 * static members не могут использовать class type param T напрямую (нужен отдельный static generic).
 * new Box<number>(1) — inference через constructor.
 * Наследование: class StringBox extends Box<string> { }.
 * Generic class vs generic factory function — выбор по ООП vs functional style.
 *
 * ## На собеседовании
 * - Generic class vs interface? — Class — value + type; interface — только type.
 * - static <T> method? — Отдельный method-level generic, не class T.
 * - private fields + generic? — Поля типизируются T как обычно.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/018-elementy-oop-v-typescript.md
 */

export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

export class Pair<T, U> {
  constructor(
    readonly first: T,
    readonly second: U,
  ) {}

  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const s = new Stack<number>();
  s.push(1);
  s.push(2);
  assert(s.pop() === 2);
  assert(s.peek() === 1);
  const p = new Pair('a', 1).swap();
  assert(p.first === 1 && p.second === 'a');
  console.log('055-generic-class: ok');
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
