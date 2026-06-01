/**
 * 078 — Рекурсивные типы (lite)
 * @tags recursive, json
 * @difficulty hard
 *
 * ## Теория
 * Тип может ссылаться на себя: JsonValue = string | number | JsonValue[] | { [k: string]: JsonValue }. Ограничение глубины — compiler recursion limit. Для деревьев и nested API.
 *
 * ## На собеседовании
 * DeepPartial рекурсивно. Когда TS выдаёт "type instantiation excessively deep"? Остановка через interface + extends вместо alias.
 *
 * ## Связанные темы
 * JSON.parse typing, tree structures.
 */

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export function isJsonPrimitive(v: unknown): v is JsonPrimitive {
  return (
    v === null ||
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean'
  );
}

export function deepCloneJson<T extends JsonValue>(value: T): T {
  if (!isJsonPrimitive(value) && typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map((x) => deepCloneJson(x as JsonValue)) as T;
    }
    const out: Record<string, JsonValue> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepCloneJson(v as JsonValue);
    }
    return out as T;
  }
  return value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const tree = { a: [1, { b: true }] };
  const copy = deepCloneJson(tree);
  copy.a[1].b = false;
  assert(tree.a[1].b === true);
  assert(isJsonPrimitive(null));
  console.log('078-recursive-type-lite: ok');
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
