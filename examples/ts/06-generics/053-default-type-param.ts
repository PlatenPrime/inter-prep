/**
 * 053 — default type parameters
 * @tags generics, defaults
 * @difficulty medium
 *
 * ## Теория
 * <T = string> — если T не выведен и не указан, используется string.
 * Defaults для нескольких params справа налево: <T, U = T>.
 * Работает в functions, classes, interfaces, type aliases.
 * Полезно для контейнеров: ApiResponse<TData = unknown>.
 * Явное указание части params: fn<number>(...) при нескольких generics.
 *
 * ## На собеседовании
 * - Когда default type param? — Разумный fallback (unknown, string, never).
 * - Можно ли T = U? — Да, если U объявлен раньше в списке.
 * - Default vs optional value param? — Разные уровни: тип vs значение.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md
 */

export interface ApiResult<TData = unknown, TError = string> {
  data?: TData;
  error?: TError;
}

export function success<TData = unknown>(data: TData): ApiResult<TData> {
  return { data };
}

export function failure<TError = string>(error: TError): ApiResult<never, TError> {
  return { error };
}

export function createStore<TState = Record<string, unknown>>(initial?: TState) {
  let state = (initial ?? {}) as TState;
  return {
    get(): TState {
      return state;
    },
    set(next: TState) {
      state = next;
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const ok = success(42);
  assert(ok.data === 42);
  const err = failure('fail');
  assert(err.error === 'fail');
  const store = createStore({ count: 0 });
  store.set({ count: 1 });
  assert(store.get().count === 1);
  console.log('053-default-type-param: ok');
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
