/**
 * 088 — Геттеры и сеттеры
 * @tags classes, accessors
 * @difficulty easy
 *
 * ## Теория
 * get/set в классе — accessor properties. В типе видны как обычные поля. Можно readonly через get без set. Сеттер может валидировать и нормализовать.
 *
 * ## На собеседовании
 * Accessor vs метод getX(). Когда setter бросает — тип не отражает. Object.defineProperty совместимость.
 *
 * ## Связанные темы
 * readonly, parameter properties.
 */

export class Temperature {
  private _c = 0;

  get celsius(): number {
    return this._c;
  }

  set celsius(value: number) {
    if (value < -273.15) throw new Error('below absolute zero');
    this._c = value;
  }

  get fahrenheit(): number {
    return this._c * 1.8 + 32;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const t = new Temperature();
  t.celsius = 100;
  assert(Math.round(t.fahrenheit) === 212);
  let err = false;
  try { t.celsius = -300; } catch { err = true; }
  assert(err);
  console.log('088-getters-setters: ok');
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
