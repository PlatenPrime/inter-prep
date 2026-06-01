/**
 * 073 — Template literal types
 * @tags template-literal, strings
 * @difficulty medium
 *
 * ## Теория
 * Строковые типы можно собирать как шаблоны: `get${Capitalize<Name>}`. Uppercase, Lowercase, Capitalize, Uncapitalize — встроенные преобразования. Полезно для event names и CSS keys.
 *
 * ## На собеседовании
 * Как типизировать onClick/onFocus из union событий? Intrinsic string manipulation types. Ограничение: только string literal unions.
 *
 * ## Связанные темы
 * Mapped types с as clause, satisfies.
 */

type EventName = 'click' | 'focus';
type HandlerName = `on${Capitalize<EventName>}`;

export function toHandlerName(event: EventName): HandlerName {
  const cap = (event.charAt(0).toUpperCase() + event.slice(1)) as Capitalize<EventName>;
  return ('on' + cap) as HandlerName;
}

export function joinPath<S extends string, T extends string>(a: S, b: T): `${S}/${T}` {
  return (a + '/' + b) as `${S}/${T}`;
}

const _h: HandlerName = 'onClick';
void _h;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(toHandlerName('click') === 'onClick');
  assert(joinPath('api', 'users') === 'api/users');
  console.log('073-template-literal-types: ok');
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
