/**
 * 083 — Abstract class
 * @tags classes, abstract
 * @difficulty medium
 *
 * ## Теория
 * abstract class нельзя инстанцировать напрямую; abstract method без тела — подкласс обязан реализовать. Смесь контракта и общей реализации. Отличие от interface: есть runtime и поля.
 *
 * ## На собеседовании
 * Abstract class vs interface — когда что? Множественное наследование только interfaces. abstract в TypeScript vs Java.
 *
 * ## Связанные темы
 * implements, override, polymorphism.
 */

export abstract class Shape {
  abstract area(): number;

  describe(): string {
    return 'area=' + this.area();
  }
}

export class Circle extends Shape {
  constructor(private readonly radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const c = new Circle(1);
  assert(c.area() > 3 && c.area() < 3.2);
  assert(c.describe().startsWith('area='));
  console.log('083-abstract-class: ok');
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
