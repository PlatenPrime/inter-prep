# Q027. Что такое IIFE (Immediately Invoked Function Expression)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**IIFE** — функциональное выражение, которое объявляется и немедленно вызывается. Основная цель: создать изолированный scope, предотвращая загрязнение глобального пространства имён. В современном коде IIFE в основном заменяются ES-модулями, но остаются полезны в специфических сценариях.

---

## Развёрнутый ответ

### Суть и определение

```javascript
// Классический синтаксис
(function() {
  const privateVar = 42;
  console.log(privateVar); // 42
})();

// Альтернативный синтаксис
(function() { /* ... */ }());

// Стрелочная IIFE (ES6)
(() => {
  const data = 'local';
})();

// IIFE с возвращаемым значением
const result = (function() {
  return 42;
})();
```

Скобки вокруг `function` превращают **function declaration** (statement) в **function expression**, после чего `()` немедленно вызывает его.

### Как это работает

```
(function() { ... })()
│                   │
└─ превращает в ────┘
   expression      │
                   └─ вызов
```

Без внешних скобок `function() {}()` — `SyntaxError`: движок интерпретирует `function` как начало declaration, у которого нет имени.

### Практика и применение

**1. Изоляция scope (основное применение):**
```javascript
// Модуль через IIFE (паттерн Module до ES6)
const counter = (function() {
  let count = 0; // приватная переменная

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
})();

counter.increment();
counter.getCount(); // 1
```

**2. Избежание конфликтов глобальных переменных (legacy скрипты):**
```javascript
(function($) {
  // $ — jQuery внутри, не конфликтует с другими libs
  $(document).ready(function() { /* ... */ });
})(jQuery);
```

**3. Инициализация с async/await в старых окружениях:**
```javascript
// Top-level await недоступен — IIFE решает
(async function() {
  const data = await fetch('/api/data').then(r => r.json());
  init(data);
})();
```

### Важные нюансы и краеугольные камни

- В ES6+ с модулями (`import/export`) IIFE для изоляции scope больше не нужны — модули изолированы по умолчанию.
- IIFE не поднимается — исполняется ровно в том месте, где написан.
- Имя IIFE (Named IIFE) видно только внутри: `(function init() { init(); })()` — рекурсия.
- `void function() { }()` — ещё один способ превратить declaration в expression.

### Примеры

```javascript
// Паттерн Revealing Module
const userService = (function() {
  const _users = [];

  function _validate(user) {
    return user && user.name;
  }

  function addUser(user) {
    if (!_validate(user)) throw new Error('Invalid user');
    _users.push(user);
  }

  function getAll() {
    return [..._users]; // копия, не оригинал
  }

  return { addUser, getAll }; // только публичный API
})();

userService.addUser({ name: 'Alice' });
userService.getAll(); // [{ name: 'Alice' }]
// userService._users — undefined, _validate — undefined
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нужны скобки вокруг `function`?** — Превращают declaration (statement) в expression, иначе SyntaxError.
- **Чем IIFE отличается от обычной функции?** — Вызывается немедленно, не доступна снаружи, не загрязняет scope.
- **Когда IIFE актуален в 2025 году?** — Async init без top-level await, полифилы, legacy совместимость, быстрые одноразовые вычисления.

### Красные флаги (чего не говорить)

- «IIFE устарел, никогда не нужен» — актуален для async-инициализации и в средах без модулей.
- «IIFE — это просто анонимная функция» — ключевое свойство — немедленный вызов и изоляция scope.

### Связанные темы

- `021-chto-takoe-oblast-vidimosti-scope.md`
- `026-raznica-function-declaration-i-function-expression.md`
- `035-chto-takoe-zamykanie-closure.md`
