/**
 * 082 — Модификаторы доступа
 * @tags classes, access
 * @difficulty easy
 *
 * ## Теория
 * public (по умолчанию), protected (подклассы), private (только класс). На уровне типов private не изолирует в runtime — только # private fields настоящие. # с ES2022.
 *
 * ## На собеседовании
 * private vs #private. protected в React class components (legacy). Можно ли обойти private в TS? Да, через bracket access на скомпилированном JS.
 *
 * ## Связанные темы
 * private fields (#), encapsulation.
 */

export class BankAccount {
  public readonly id: string;
  private balance: number;

  constructor(id: string, initial = 0) {
    this.id = id;
    this.balance = initial;
  }

  deposit(amount: number): number {
    if (amount <= 0) throw new Error('positive only');
    this.balance += amount;
    return this.balance;
  }

  getBalance(): number {
    return this.balance;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const acc = new BankAccount('a1', 10);
  assert(acc.deposit(5) === 15);
  assert(acc.getBalance() === 15);
  assert(acc.id === 'a1');
  console.log('082-access-modifiers: ok');
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
