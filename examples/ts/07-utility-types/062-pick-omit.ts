/**
 * 062 — Pick и Omit
 * @tags utility-types, pick, omit
 * @difficulty easy
 *
 * ## Теория
 * Pick<T, K> оставляет только перечисленные ключи K. Omit<T, K> исключает ключи — эквивалент Pick<T, Exclude<keyof T, K>>. Работают только на первом уровне объекта.
 *
 * ## На собеседовании
 * Pick для публичного API и DTO; Omit чтобы убрать password/hash. Omit не удаляет вложенные поля. Для вложенности — кастомный mapped type.
 *
 * ## Связанные темы
 * Exclude, Extract — фильтрация union ключей.
 */

type User = { id: string; name: string; password: string };

export function pickKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) out[k] = obj[k];
  }
  return out;
}

export function omitKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const out = { ...obj } as Record<string, unknown>;
  for (const k of keys) delete out[k as string];
  return out as Omit<T, K>;
}

type PublicUser = Pick<User, 'id' | 'name'>;
const _pu: PublicUser = { id: '1', name: 'Ann' };
void _pu;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const u = { id: '1', name: 'Ann', password: 'secret' };
  const pub = pickKeys(u, ['id', 'name'] as const);
  assert(pub.id === '1' && !('password' in pub));
  const safe = omitKeys(u, ['password'] as const);
  assert(safe.name === 'Ann' && !('password' in safe));
  console.log('062-pick-omit: ok');
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
