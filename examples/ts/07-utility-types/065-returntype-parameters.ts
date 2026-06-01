/**
 * 065 — ReturnType и Parameters
 * @tags utility-types, functions
 * @difficulty medium
 *
 * ## Теория
 * ReturnType<F> извлекает тип возвращаемого значения функции F. Parameters<F> — кортеж аргументов. Работают с typeof fn, не вызывая функцию. На перегрузках берёт последнюю сигнатуру.
 *
 * ## На собеседовании
 * Обёртки над библиотечными функциями без дублирования типов. ConstructorParameters для new. ThisParameterType для bind/call контекста.
 *
 * ## Связанные темы
 * Awaited для Promise, generics inference.
 */

export function createLogger(prefix: string) {
  return (message: string, level: 'info' | 'error' = 'info') => {
    return `[${prefix}] ${level}: ${message}`;
  };
}

type LogFn = ReturnType<typeof createLogger>;
type LogArgs = Parameters<LogFn>;

export function callWithArgs<F extends (...args: never[]) => unknown>(
  fn: F,
  args: Parameters<F>,
): ReturnType<F> {
  return fn(...args) as ReturnType<F>;
}

const _fn: LogFn = createLogger('app');
void (_fn as LogFn);

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const log = createLogger('test');
  const msg = callWithArgs(log, ['hello', 'info']);
  assert(msg.includes('test') && msg.includes('hello'));
  console.log('065-returntype-parameters: ok');
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
