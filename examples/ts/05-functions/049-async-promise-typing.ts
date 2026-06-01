/**
 * 049 — async and Promise typing
 * @tags functions, async, promise
 * @difficulty medium
 *
 * ## Теория
 * async function всегда возвращает Promise<T>, даже если return 1.
 * await сужает Promise<T> до T; try/catch для rejected promise.
 * Promise<void> — fire-and-forget side effects.
 * Типизация .then: then<TResult>(onfulfilled?: (value: T) => TResult).
 * never throw в async — rejection; Result pattern для явных ошибок.
 *
 * ## На собеседовании
 * - return T vs return Promise<T> в async? — Оба оборачиваются в Promise.
 * - void vs undefined в Promise? — void игнорирует значение; undefined — явное.
 * - Awaited<T> utility? — Рекурсивно разворачивает Promise (тема 07).
 *
 * ## Связанные темы
 * - webdev/14. ts/014-utilitarnye-tipy-utility-types.md
 * - webdev/10. async-js/001-raznica-mezhdu-sinhronnymi-i-asinhronnymi-funkciyami.md
 */

export async function delay(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

export async function fetchJson(url: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(url);
  return { ok: res.ok, status: res.status };
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

export function okValue(): Promise<number> {
  return Promise.resolve(42);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

async function runTests() {
  await delay(1);
  const v = await okValue();
  assert(v === 42);
  const once = await retry(async () => 7, 3);
  assert(once === 7);
  console.log('049-async-promise-typing: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
