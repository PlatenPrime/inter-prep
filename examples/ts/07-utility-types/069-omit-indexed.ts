/**
 * 069 — Omit по индексу и фильтр ключей
 * @tags utility-types, mapped
 * @difficulty hard
 *
 * ## Теория
 * Omit<T, K> реализуется через Pick + Exclude<keyof T, K>. Для фильтра по префиксу/суффиксу ключа — mapped type с as и template literal: OmitByPrefix<T, "set">.
 *
 * ## На собеседовании
 * Как написать OmitByPrefix без built-in Omit? keyof T + conditional на string. as clause в mapped types (TS 4.1+).
 *
 * ## Связанные темы
 * Mapped types, template literal types, Pick.
 */

type Keys = 'id' | 'setName' | 'setAge' | 'getName';

type OmitSetters<T, P extends string> = {
  [K in keyof T as K extends `${P}${string}` ? never : K]: T[K];
};

export function omitKeysByPrefix<T extends object, P extends string>(
  obj: T,
  prefix: P,
): OmitSetters<T, P> {
  const out = {} as Record<string, unknown>;
  for (const k of Object.keys(obj) as (keyof T)[]) {
    if (typeof k === 'string' && k.startsWith(prefix)) continue;
    out[k as string] = obj[k];
  }
  return out as OmitSetters<T, P>;
}

type Api = { id: number; setName: (v: string) => void; getName: () => string };
type ApiReadonly = OmitSetters<Api, 'set'>;
const _a: ApiReadonly = { id: 1, getName: () => 'x' };
void _a;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const o = { id: 1, setX: 2, keep: 3 };
  const trimmed = omitKeysByPrefix(o, 'set');
  assert(trimmed.id === 1 && trimmed.keep === 3 && !('setX' in trimmed));
  console.log('069-omit-indexed: ok');
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
