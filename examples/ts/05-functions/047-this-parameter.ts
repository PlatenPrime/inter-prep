/**
 * 047 — this parameter
 * @tags functions, this
 * @difficulty hard
 *
 * ## Теория
 * Первый параметр this: Context — только для типизации, не в runtime args.
 * Указывает ожидаемый this при call/bind; function(this: User) { this.name }.
 * Стрелочные функции не имеют own this — this parameter к ним не применяют.
 * noImplicitThis требует явного this type или стрелки/замыкания.
 * Методы в interface: method(): void vs fn(this: T): void — разная проверка this.
 *
 * ## На собеседовании
 * - this parameter в сигнатуре? — Compile-time only; не передаётся вызывающим.
 * - Зачем? — Безопасный bind и callback с известным this.
 * - Arrow vs function this? — Arrow lexically captures; function — dynamic this.
 *
 * ## Связанные темы
 * - webdev/14. ts/018-elementy-oop-v-typescript.md
 * - webdev/09. js/031-pochemu-funkcii-nazyvayut-obektami-pervogo-klassa.md
 */

export interface Logger {
  prefix: string;
  log(this: Logger, message: string): string;
}

export const consoleLogger: Logger = {
  prefix: '[app]',
  log(message) {
    return `${this.prefix} ${message}`;
  },
};

export function callWithLogger(
  logger: Logger,
  fn: (this: Logger, msg: string) => string,
  msg: string,
): string {
  return fn.call(logger, msg);
}

export function bindLog(logger: Logger): (msg: string) => string {
  return logger.log.bind(logger);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(consoleLogger.log('ok') === '[app] ok');
  assert(callWithLogger(consoleLogger, consoleLogger.log, 'x') === '[app] x');
  assert(bindLog(consoleLogger)('y') === '[app] y');
  console.log('047-this-parameter: ok');
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
