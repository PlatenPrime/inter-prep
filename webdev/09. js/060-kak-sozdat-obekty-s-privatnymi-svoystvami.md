# Q060. Как можно создать объекты с приватными свойствами и методами в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Способы создания приватных свойств: **1) ES2022 `#privateField`** — настоящая приватность, принудительная на уровне движка; **2) замыкание** в фабричной функции — переменные недоступны снаружи; **3) `WeakMap`** — хранение приватных данных вне экземпляра; **4) `_underscore` конвенция** — не истинная приватность, только соглашение. Рекомендуется `#privateField` для классов.

---

## Развёрнутый ответ

### 1. ES2022 Private Class Fields (`#`)

Настоящая приватность на уровне движка: нет доступа снаружи, даже через `obj['#field']`.

```javascript
class BankAccount {
  #balance;         // приватное поле
  #owner;

  constructor(owner, initialBalance) {
    this.#owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new RangeError('Amount must be positive');
    this.#balance += amount;
    return this;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
    return this;
  }

  get balance() { return this.#balance; }
  get owner() { return this.#owner; }

  // Приватный метод
  #validate(amount) {
    return amount > 0 && amount <= this.#balance;
  }
}

const account = new BankAccount('Alice', 1000);
account.deposit(500);
account.balance; // 1500

account.#balance;  // SyntaxError — недоступно снаружи!
```

### 2. Замыкание в фабричной функции

```javascript
function createCounter(initial = 0) {
  let count = initial;      // приватная через замыкание
  let step = 1;

  function validate(n) {    // приватная функция
    return typeof n === 'number' && !Number.isNaN(n);
  }

  return {
    increment() { count += step; return this; },
    decrement() { count -= step; return this; },
    setStep(n) { if (validate(n)) step = n; return this; },
    getCount() { return count; },
    reset() { count = initial; return this; }
  };
}

const counter = createCounter(10);
counter.increment().increment();
counter.getCount(); // 12
counter.count;      // undefined — не доступна снаружи
```

### 3. `WeakMap` для приватных данных в классах (старый паттерн)

```javascript
const _private = new WeakMap();

class User {
  constructor(name, password) {
    _private.set(this, { password, loginCount: 0 });
    this.name = name;
  }

  login(input) {
    const priv = _private.get(this);
    if (input === priv.password) {
      priv.loginCount++;
      return true;
    }
    return false;
  }

  get loginCount() {
    return _private.get(this).loginCount;
  }
}

const user = new User('Alice', 'secret');
user.login('secret');  // true
user.loginCount;       // 1
// user.password — undefined
```

### 4. `_underscore` конвенция (не рекомендуется)

```javascript
class Config {
  constructor() {
    this._apiKey = 'secret'; // соглашение, не ограничение!
  }
}

const cfg = new Config();
cfg._apiKey; // 'secret' — доступно, это просто конвенция
```

### Сравнение подходов

| Подход | Истинная приватность | Наследование | TypeScript | Совместимость |
|--------|---------------------|--------------|------------|---------------|
| `#field` | ✓ | Сложно (private → нельзя в extends) | ✓ | ES2022 |
| Замыкание | ✓ | ✗ (каждый экземпляр — свои методы) | Сложно | Всегда |
| WeakMap | ✓ | ✓ | Неудобно | ES6+ |
| `_convention` | ✗ | ✓ | Только `private` TS | Всегда |

### Практика и применение

- Для новых проектов — `#privateField` (нативная поддержка в V8, SpiderMonkey).
- Для легаси/функционального стиля — замыкания.
- TypeScript: `private` ключевое слово — только на этапе компиляции; `#` — runtime приватность.

### Примеры

```javascript
// TypeScript: private vs #
class Service {
  private apiKey: string;  // только compile-time
  #token: string;          // runtime + compile-time

  constructor(key: string, token: string) {
    this.apiKey = key;
    this.#token = token;
  }
}

// Runtime: доступ к private через приведение типа
const s = new Service('key', 'token');
(s as any).apiKey; // 'key' — доступно в runtime!
(s as any)['#token']; // undefined — недоступно даже так
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `#private` в JS отличается от `private` в TypeScript?** — TypeScript `private` — только compile-time; `#` — runtime ограничение движка.
- **Почему замыкание создаёт отдельные методы для каждого экземпляра?** — Методы замыкаются на своих переменных — нет общего прототипа → больше памяти.
- **Когда WeakMap лучше `#private`?** — Для легаси ES6 кода или когда нужна возможность хранить данные за пределами класса.

### Красные флаги (чего не говорить)

- «`_underscore` — это настоящая приватность» — только конвенция, технически публичное свойство.
- «`private` в TypeScript гарантирует приватность в runtime» — нет.

### Связанные темы

- `035-chto-takoe-zamykanie-closure.md`
- `042-kak-sozdat-obekt-v-javascript.md`
- `059-zachem-nuzhen-konstruktor-proxy.md`
