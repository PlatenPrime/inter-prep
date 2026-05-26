# Q019. Что такое Strict mode в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Strict mode (`"use strict"`) — режим интерпретации JavaScript с более строгой обработкой ошибок, введённый в ES5. Он превращает «тихие» ошибки в явные `TypeError`/`SyntaxError`, запрещает устаревшие возможности и делает код более предсказуемым. ES6-модули (`import/export`) и классы (`class`) автоматически работают в strict mode.

---

## Развёрнутый ответ

### Суть и определение

Директива `"use strict"` добавляется в начало файла или функции. При этом движок переключается в режим с дополнительными ограничениями, которые помогают избежать распространённых ошибок и устаревших паттернов.

### Как включить

```javascript
// Весь файл в strict mode
"use strict";

function foo() { }

// Только функция в strict mode
function bar() {
  "use strict";
  // строгий режим только здесь
}

// ES6 модули — всегда strict mode
export function baz() { } // автоматически
```

### Что меняет strict mode

**1. Запрет необъявленных переменных:**
```javascript
"use strict";
x = 10; // ReferenceError: x is not defined
```

**2. Запрет `with`:**
```javascript
"use strict";
with (obj) { } // SyntaxError
```

**3. Ошибки при записи в read-only свойства:**
```javascript
"use strict";
const obj = Object.freeze({ x: 1 });
obj.x = 2; // TypeError
```

**4. Дублирование параметров запрещено:**
```javascript
"use strict";
function foo(a, a) { } // SyntaxError
```

**5. `this` в функциях без контекста — `undefined`, не `globalThis`:**
```javascript
"use strict";
function test() {
  console.log(this); // undefined (не window/global)
}
test();
```

**6. Запрет `delete` на переменные:**
```javascript
"use strict";
let x = 1;
delete x; // SyntaxError
```

**7. Зарезервированы ключевые слова ES будущего:** `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, `yield`.

### Практика и применение

- **Современные проекты:** работают в strict mode автоматически (ES-модули, TypeScript, Babel/webpack трансформации).
- **Отладка:** `this === undefined` в функции сразу обнаруживает потерю контекста.
- **Безопасность:** предотвращает запись в глобальные переменные из-за опечатки.

### Важные нюансы и краеугольные камни

- Нельзя использовать `"use strict"` с `eval`/`arguments` как именами переменных.
- Strict mode нельзя отменить — нет `"use sloppy"`.
- В strict mode `eval` не вносит переменные во внешний scope.
- Если скрипты конкатенируются (без бандлера) — строгость одного файла не распространяется на другой.
- Strict mode не делает код автоматически безопасным — это не замена валидации.

### Примеры

```javascript
"use strict";

// 1. Опечатка в переменной — сразу ошибка
function createUser(name) {
  usser = { name }; // ReferenceError — без strict mode тихо создаёт глобальную переменную!
}

// 2. Потеря this
class Timer {
  constructor() { this.count = 0; }

  start() {
    // Без стрелочной функции в strict mode this === undefined
    setInterval(() => { // стрелочная — правильно
      this.count++;
    }, 1000);
  }
}

// 3. Чистая функция без this-проблем
function multiply(a, b) {
  "use strict";
  return a * b; // this не нужен — нет проблем
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Включён ли strict mode в ES6-модулях?** — Да, автоматически.
- **Что происходит с `this` в strict mode?** — В обычной функции без вызовного контекста `this === undefined` (не `window`).
- **Влияет ли `"use strict"` в одном файле на другие?** — Нет, при конкатенации.

### Красные флаги (чего не говорить)

- «Strict mode делает JS статически типизированным» — нет, только добавляет runtime-ограничения.
- «Strict mode замедляет JavaScript» — в реальности современные движки оптимизируют strict-код лучше благодаря предсказуемости.

### Связанные темы

- `020-plyusy-i-minusy-use-strict.md`
- `022-chto-takoe-podnyatie-hoisting.md`
- `033-chto-oboznachaet-this-v-javascript.md`
