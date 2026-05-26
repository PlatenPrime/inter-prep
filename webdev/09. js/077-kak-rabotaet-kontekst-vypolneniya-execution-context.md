# Q077. Как работает контекст выполнения (Execution Context) в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Execution Context (контекст выполнения)** — абстрактная среда, в которой выполняется код: содержит Variable Environment (переменные), Lexical Environment (scope chain) и значение `this`. Движок поддерживает **стек контекстов** (Call Stack): при вызове функции добавляется новый контекст, при завершении — удаляется. Типы: глобальный, функциональный, `eval`.

---

## Развёрнутый ответ

### Структура Execution Context

Каждый контекст содержит:
1. **Variable Environment** — хранит `var`-переменные и объявления функций.
2. **Lexical Environment** — текущие лексические привязки (`let`, `const`, параметры); ссылка на внешний scope (outer reference).
3. **ThisBinding** — значение `this`.

### Фазы создания контекста

**1. Creation Phase (до выполнения):**
- Создаётся `Variable Object` / Environment Record.
- Сканируются все объявления: `function` поднимается целиком, `var` — поднимается с `undefined`.
- Определяется `this`.

**2. Execution Phase:**
- Код выполняется строка за строкой.
- Переменным присваиваются значения.

### Call Stack (стек вызовов)

```javascript
function c() {
  return 'c';
}
function b() {
  return c(); // добавляет c в стек
}
function a() {
  return b(); // добавляет b в стек
}

a(); // добавляет a в стек
// Стек: [Global] → [a] → [b] → [c]
// После завершения c: [Global] → [a] → [b]
// После завершения b: [Global] → [a]
// После завершения a: [Global]
```

### Типы контекстов

**1. Global Execution Context:**
- Создаётся при старте скрипта.
- `this = window` (браузер) / `global` (Node.js) / `globalThis` (везде).
- Только один GEC.

**2. Function Execution Context:**
- Создаётся при вызове функции.
- `this` определяется способом вызова.
- Каждый вызов — свой контекст.

**3. Eval Execution Context:**
- Создаётся при вызове `eval()`.
- Наследует контекст вызывающей функции.
- Избегайте — медленно и небезопасно.

### Lexical Environment и Scope Chain

```javascript
const global = 'I am global';

function outer() {
  const outerVar = 'I am outer';

  function inner() {
    const innerVar = 'I am inner';
    console.log(global);   // найдёт в GEC
    console.log(outerVar); // найдёт в outer's LE
    console.log(innerVar); // найдёт в own LE
  }
  inner();
}
outer();
```

При создании `inner` её Lexical Environment содержит ссылку на `outer`'s LE, которая содержит ссылку на GEC. Это формирует **scope chain**.

### Event Loop и контексты

```
Call Stack: [  ]  ← синхронный код (execution contexts)
             ↑
Microtask Queue: Promise.then, queueMicrotask
             ↑
Macrotask Queue: setTimeout, setInterval, I/O

Event Loop: если Call Stack пуст → взять из Microtask Queue → если пуст → из Macrotask Queue
```

### Практика и применение

- **Hoisting** — результат Creation Phase: `var` и функции подняты до исполнения.
- **Замыкания** — inner function хранит ссылку на Lexical Environment внешней функции.
- **`this` binding** — определяется в ThisBinding контекста.
- **Отладка:** Call Stack в DevTools — текущий стек execution contexts.

### Важные нюансы и краеугольные камни

- Функции не разделяют Variable Environment — у каждого вызова своё.
- **Closure** = функция + ссылка на Lexical Environment где объявлена.
- При вызове через `new`: создаётся новый объект, `this = новый объект`.
- В strict mode: GlobalEC `this` = `undefined` внутри функций без контекста.

### Примеры

```javascript
// Демонстрация Creation Phase
console.log(x); // undefined (var поднят, но не инициализирован)
console.log(fn); // function fn() {} (function declaration полностью поднята)

var x = 5;
function fn() { return 'hello'; }

// let/const в TDZ — попытка обратиться до объявления
console.log(y); // ReferenceError (TDZ)
let y = 10;

// Каждый вызов — свой контекст
function makeAdder(x) {
  return function(y) { // замыкание на x из Lexical Environment makeAdder
    return x + y;
  };
}
const add5 = makeAdder(5); // новый execution context, x=5 в LE
const add10 = makeAdder(10); // отдельный context, x=10

add5(3);  // 8 — доступ к x=5 через scope chain
add10(3); // 13 — доступ к x=10
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что происходит в Creation Phase?** — Hoisting: функции подняты полностью, var — с undefined, let/const — в TDZ.
- **Почему замыкания «помнят» переменные из внешней функции?** — Inner function хранит ссылку на Lexical Environment внешнего контекста, который не удаляется GC, пока жива ссылка.
- **Что такое Event Loop и как он связан с Call Stack?** — Event Loop берёт задачи из очередей когда Call Stack пуст.

### Красные флаги (чего не говорить)

- «Execution Context = this» — это лишь одна из трёх частей контекста.
- «Все функции имеют общий стек переменных» — у каждого вызова свой execution context.

### Связанные темы

- `022-chto-takoe-podnyatie-hoisting.md`
- `021-chto-takoe-oblast-vidimosti-scope.md`
- `035-chto-takoe-zamykanie-closure.md`
- `076-tipy-taymerov-v-javascript.md`
