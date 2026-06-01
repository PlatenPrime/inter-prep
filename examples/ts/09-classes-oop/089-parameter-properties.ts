/**
 * 089 — Parameter properties
 * @tags classes, constructor
 * @difficulty easy
 *
 * ## Теория
 * Префикс public/private/protected/readonly на параметре конструктора создаёт поле автоматически: constructor(public name: string) {}. Сокращает boilerplate.
 *
 * ## На собеседовании
 * Где хранятся поля после emit? this.name = name в constructor. readonly parameter property — assignable только в constructor.
 *
 * ## Связанные темы
 * access modifiers, DI in Angular/Nest patterns.
 */

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    private role: 'admin' | 'user' = 'user',
  ) {}

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  rename(name: string): void {
    this.name = name;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const u = new User('1', 'Ann', 'admin');
  assert(u.isAdmin() === true);
  u.rename('Anna');
  assert(u.name === 'Anna');
  console.log('089-parameter-properties: ok');
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
