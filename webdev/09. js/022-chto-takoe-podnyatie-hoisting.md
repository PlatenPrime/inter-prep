# Q022. Что такое поднятие (Hoisting)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Hoisting** — механизм JavaScript, при котором объявления переменных и функций «перемещаются» в начало своей области видимости в фазе компиляции (до выполнения кода). `var` поднимается и инициализируется `undefined`; `let`/`const` поднимаются, но остаются в Temporal Dead Zone до строки объявления; function declaration поднимается целиком (вместе с телом).

---

## Развёрнутый ответ

### Суть и определение

Hoisting — это не физическое перемещение кода. Это то, что движок в фазе парсинга/компиляции обрабатывает все объявления в текущем scope до начала выполнения. Результат — будто объявления оказались «наверху».

### Hoisting для разных конструкций

**`var` — поднимается и инициализируется `undefined`:**
```javascript
console.log(x); // undefined (не ReferenceError)
var x = 5;
console.log(x); // 5

// Как это видит движок:
var x;           // поднято
console.log(x);  // undefined
x = 5;
console.log(x);  // 5
```

**`let` / `const` — поднимаются, но в Temporal Dead Zone (TDZ):**
```javascript
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```
Переменная существует в scope с начала блока, но обратиться к ней нельзя до строки объявления.

**Function Declaration — поднимается целиком:**
```javascript
greet(); // "Hello!" — работает до объявления!

function greet() {
  console.log("Hello!");
}
```

**Function Expression — поднимается только переменная (как `var`):**
```javascript
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { console.log("Hi!"); };
```

**Class Declaration — поднимается, но в TDZ (как `let`):**
```javascript
new Foo(); // ReferenceError
class Foo {}
```

### Как это работает (механизм)

1. **Parsing phase:** движок сканирует код, регистрирует все `var`, `function`, `let`, `const`, `class` в scope.
2. **Execution phase:** выполняет код строка за строкой; `var` уже инициализирован `undefined`; `let`/`const` ещё в TDZ.

### Практика и применение

- **Function declarations** поднимаются — полезно для «вспомогательных» функций в конце файла, главный код — вверху.
- **Запрет на `var`** в современном коде: `let`/`const` не позволяют случайно использовать переменную до инициализации.
- ESLint правило `no-use-before-define` предупреждает об использовании до объявления.

### Важные нюансы и краеугольные камни

- `var` в блоке `if`/`for` поднимается до **функционального** scope (не блочного!): ловушка при работе с асинхронностью.
- Несколько `var` с одним именем — не ошибка, поднимается одно объявление.
- `let`/`const` в TDZ: `typeof x` при `x` в TDZ также бросает `ReferenceError` (а не `"undefined"` как для необъявленной).

### Примеры

```javascript
// Ловушка var в условии
function check(condition) {
  if (condition) {
    var result = "yes"; // поднимается к function scope
  }
  console.log(result); // undefined или "yes" — зависит от condition
}

// let безопасен
function checkSafe(condition) {
  if (condition) {
    let result = "yes"; // блочный scope
  }
  console.log(result); // ReferenceError — переменная не видна
}

// Function declaration поднимается полностью
const result = multiply(3, 4); // 12 — работает до объявления

function multiply(a, b) {
  return a * b;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое Temporal Dead Zone?** — Период от начала блока до строки `let`/`const`; обращение → `ReferenceError`.
- **Поднимаются ли `let`/`const`?** — Да, поднимаются, но не инициализируются (TDZ).
- **Что поднимается первым — `var` или function declaration?** — Оба, но function declaration перекрывает `var` с тем же именем.

### Красные флаги (чего не говорить)

- «`let`/`const` не поднимаются» — поднимаются, просто находятся в TDZ.
- «Hoisting физически перемещает код» — это концептуальная модель; движок просто обрабатывает объявления в parsing phase.
- «`var` поднимается со значением» — `var` поднимается с `undefined`, не с присвоенным значением.

### Связанные темы

- `021-chto-takoe-oblast-vidimosti-scope.md`
- `023-chto-takoe-neobyavlennaya-peremennaya.md`
- `026-raznica-function-declaration-i-function-expression.md`
