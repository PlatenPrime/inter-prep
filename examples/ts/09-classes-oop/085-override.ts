/**
 * 085 — override модификатор
 * @tags classes, override
 * @difficulty medium
 *
 * ## Теория
 * Ключевое слово override на методе подкласса: компилятор проверит, что в базовом классе есть такой метод. noImplicitOverride в tsconfig — все переопределения явно помечать.
 *
 * ## На собеседовании
 * Зачем override если JS и так перезаписывает? Ловит опечатки в имени метода. override vs overload — разные вещи.
 *
 * ## Связанные темы
 * abstract methods, inheritance chain.
 */

export class Animal {
  speak(): string {
    return '...';
  }
}

export class Dog extends Animal {
  override speak(): string {
    return 'woof';
  }
}

export function speakTwice(animal: Animal): string[] {
  return [animal.speak(), animal.speak()];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const d = new Dog();
  assert(d.speak() === 'woof');
  assert(speakTwice(d).every((s) => s === 'woof'));
  console.log('085-override: ok');
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
