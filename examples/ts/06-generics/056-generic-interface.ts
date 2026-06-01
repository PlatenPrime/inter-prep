/**
 * 056 — generic interface
 * @tags generics, interface
 * @difficulty medium
 *
 * ## Теория
 * interface Repository<T> { get(id: string): Promise<T | null> } — контракт для любой сущности.
 * Generic interface реализуют классы: class UserRepo implements Repository<User>.
 * Default type params в interface: interface Page<TItem = unknown>.
 * Type alias с generics эквивалентен для объектных форм: type Repo<T> = { ... }.
 *
 * ## На собеседовании
 * - interface generic vs class generic? — Interface — только shape; class — runtime.
 * - implements Repository<T>? — Класс должен совпасть по всем методам.
 * - Covariance в interface? — См. variance-intro (readonly помогает).
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/008-raznica-type-i-interface.md
 */

export interface Repository<T> {
  findById(id: string): T | undefined;
  save(entity: T): void;
}

export interface Identified {
  id: string;
}

export class MemoryRepo<T extends Identified> implements Repository<T> {
  private store = new Map<string, T>();

  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  save(entity: T): void {
    this.store.set(entity.id, entity);
  }

  count(): number {
    return this.store.size;
  }
}

export function loadOrCreate<T extends Identified>(
  repo: Repository<T>,
  id: string,
  factory: () => T,
): T {
  const existing = repo.findById(id);
  if (existing) return existing;
  const created = factory();
  repo.save(created);
  return created;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const repo = new MemoryRepo<{ id: string; v: number }>();
  repo.save({ id: '1', v: 10 });
  assert(repo.findById('1')?.v === 10);
  const e = loadOrCreate(repo, '2', () => ({ id: '2', v: 0 }));
  assert(e.id === '2' && repo.count() === 2);
  console.log('056-generic-interface: ok');
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
