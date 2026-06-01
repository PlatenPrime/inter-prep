/**
 * 068 — InstanceType<T>
 * @tags utility-types, classes
 * @difficulty medium
 *
 * ## Теория
 * InstanceType<typeof Class> — тип экземпляра конструктора. Работает с newable: abstract constructor тоже. Полезно для фабрик и DI без дублирования имени класса.
 *
 * ## На собеседовании
 * InstanceType vs ReturnType: второй для обычных функций. new (...args) => T pattern. Ограничение: нужен конструктор, не object literal.
 *
 * ## Связанные темы
 * ConstructorParameters, abstract class.
 */

export class UserService {
  constructor(public readonly name: string) {}
  greet() {
    return 'Hello, ' + this.name;
  }
}

type ServiceInstance = InstanceType<typeof UserService>;

export function createInstance<C extends new (...args: never[]) => unknown>(
  Ctor: C,
  ...args: ConstructorParameters<C>
): InstanceType<C> {
  return new Ctor(...args) as InstanceType<C>;
}

const _inst: ServiceInstance = createInstance(UserService, 'Ann');
void _inst;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const s = createInstance(UserService, 'Bob');
  assert(s.greet() === 'Hello, Bob');
  assert(s.name === 'Bob');
  console.log('068-instancetype: ok');
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
