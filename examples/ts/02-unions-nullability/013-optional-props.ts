/**
 * 013 — Optional properties
 * @tags unions, optional
 * @difficulty easy
 *
 * ## Теория
 * Свойство foo?: T означает T | undefined; поле может отсутствовать в литерале.
 * Отличие от foo: T | undefined — при strict optional поле может быть явно undefined.
 * Required<T> и Partial<T> — utility для всех полей обязательных / опциональных.
 * При деструктуризации задавайте default: { timeout = 3000 }.
 * exactOptionalPropertyTypes (флаг) запрещает присвоить undefined туда, где только «отсутствие».
 * В API документируйте, означает ли отсутствие поля «по умолчанию» или «не задано».
 *
 * ## На собеседовании
 * - ?. vs optional property? — ? на поле — тип; ?. — оператор доступа.
 * - Partial<User> делает что? — Все ключи User опциональными.
 * - Можно ли передать { name: 'a', bio: undefined } в { name: string; bio?: string }? — Зависит от exactOptionalPropertyTypes.
 */

export type CreatePostInput = {
  title: string;
  body?: string;
  tags?: string[];
};

export function normalizePost(input: CreatePostInput): { title: string; body: string; tags: string[] } {
  return {
    title: input.title,
    body: input.body ?? '',
    tags: input.tags ?? [],
  };
}

export type Pagination = { page?: number; pageSize?: number };

export function offset({ page = 1, pageSize = 10 }: Pagination): number {
  return (page - 1) * pageSize;
}

export function hasTags(input: CreatePostInput): boolean {
  return (input.tags?.length ?? 0) > 0;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const p = normalizePost({ title: 'Hi' });
  assert(p.body === '' && p.tags.length === 0);
  assert(offset({}) === 0);
  assert(offset({ page: 2, pageSize: 5 }) === 5);
  assert(hasTags({ title: 'T', tags: ['a'] }) === true);
  console.log('013-optional-props: ok');
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
