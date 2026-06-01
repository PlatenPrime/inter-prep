/**
 * 084 — implements interface
 * @tags classes, interface
 * @difficulty easy
 *
 * ## Теория
 * class Foo implements Bar — класс обязан иметь все члены Bar (структурно). Несколько interfaces через запятую. implements не наследует реализацию, только проверку формы.
 *
 * ## На собеседовании
 * implements vs extends. Можно implements без class? type assertion. Дублирование сигнатур class и interface — DRY через Pick.
 *
 * ## Связанные темы
 * structural typing, declaration merging.
 */

export interface Serializable {
  serialize(): string;
}

export interface Timestamped {
  readonly createdAt: number;
}

export class EventLog implements Serializable, Timestamped {
  readonly createdAt = Date.now();

  constructor(private readonly events: string[] = []) {}

  push(event: string): void {
    this.events.push(event);
  }

  serialize(): string {
    return JSON.stringify({ createdAt: this.createdAt, events: this.events });
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const log = new EventLog();
  log.push('start');
  const json = log.serialize();
  assert(json.includes('start') && json.includes('createdAt'));
  console.log('084-implements: ok');
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
