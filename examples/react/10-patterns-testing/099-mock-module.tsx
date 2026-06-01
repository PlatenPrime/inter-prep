/**
 * 099 — vi.mock module
 * @tags testing, vitest
 * @difficulty hard
 *
 * ## Теория
 * vi.mock подменяет ESM модуль. hoisted — объявляйте до imports в отдельном setup или top level.
 *
 * ## На собеседовании
 * - partial mock? — vi.importActual + spread.
 */

export function formatName(name: string) {
  return `Hello, ${name}`;
}

export function Greeting({ name }: { name: string }) {
  return <p>{formatName(name)}</p>;
}
