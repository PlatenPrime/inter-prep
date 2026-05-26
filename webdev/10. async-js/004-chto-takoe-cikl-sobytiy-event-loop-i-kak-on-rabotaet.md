# Q004. Что такое цикл событий (event loop) и как он работает?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

Event loop — механизм, который позволяет JavaScript (однопоточному языку) выполнять асинхронный код. Он непрерывно проверяет, пуст ли call stack, и если да — берёт задачи из очередей (сначала все microtasks, затем одну macrotask) и помещает их на стек для выполнения. Таким образом JS создаёт иллюзию конкурентности, не имея настоящей многопоточности.

---

## Развёрнутый ответ

### Суть и определение

Event loop — это цикл в среде выполнения (браузер / Node.js), не в самом движке V8. V8 предоставляет call stack и heap; event loop — часть libuv (Node) или браузерных API.

Ключевые компоненты:

| Компонент | Описание |
|-----------|----------|
| **Call Stack** | LIFO-стек фреймов выполняемых функций |
| **Heap** | Область памяти для объектов |
| **Web APIs / Node APIs** | Среда, обрабатывающая таймеры, сеть, файлы вне JS-потока |
| **Microtask Queue** | Очередь для `Promise` callbacks, `queueMicrotask`, `MutationObserver` |
| **Macrotask Queue (Task Queue)** | Очередь для `setTimeout`, `setInterval`, I/O callbacks, `setImmediate` |
| **Event Loop** | Оркестратор, координирующий все компоненты |

### Как это работает

```
┌─────────────────────────────────────────────────────┐
│                    Event Loop                       │
│                                                     │
│  1. Выполнить весь синхронный код в Call Stack      │
│  2. Выполнить ВСЕ задачи из Microtask Queue         │
│     (включая новые, добавленные во время выполнения)│
│  3. Взять ОДНУ задачу из Macrotask Queue            │
│  4. Снова выполнить все microtasks                  │
│  5. Перейти к п.3 (если macrotask queue не пуста)   │
│  6. Выполнить rendering (в браузере)                │
└─────────────────────────────────────────────────────┘
```

**Шаг за шагом на примере:**

```javascript
console.log('1');            // → Call Stack → вывод: 1

setTimeout(() => {
  console.log('2');          // → Macrotask Queue
}, 0);

Promise.resolve().then(() => {
  console.log('3');          // → Microtask Queue
});

console.log('4');            // → Call Stack → вывод: 4

// Call Stack пуст → event loop:
// Сначала все microtasks: вывод 3
// Затем одна macrotask: вывод 2
// Итог: 1, 4, 3, 2
```

### Практика и применение

- **Понимание порядка вывода** — вопрос на собеседовании «что выведет этот код» почти всегда про event loop.
- **Оптимизация рендеринга** — тяжёлые операции разбивают на части через `setTimeout(fn, 0)` чтобы дать браузеру отрисовать кадр.
- **Node.js I/O** — libuv управляет event loop из 6 фаз (timers, pending callbacks, idle, poll, check, close), что важно для производительности серверов.
- **`requestAnimationFrame`** — ставится перед rendering-шагом, идеально для анимаций.

### Важные нюансы и краеугольные камни

- Microtask queue проверяется **после каждой macrotask**, а не один раз за «оборот». Если microtask порождает новые microtasks, они все выполнятся до следующей macrotask.
- Бесконечный цикл в microtask queue заморозит event loop навсегда: `function inf() { return Promise.resolve().then(inf); }` — не делать так.
- В Node.js есть `setImmediate` — выполняется в фазе check, после I/O callbacks, но до таймеров следующего оборота.
- `process.nextTick` в Node.js обрабатывается раньше `Promise` callbacks (в рамках microtask-очереди, но отдельной).

### Примеры

```javascript
// Порядок выполнения: классический вопрос на собеседовании
console.log('start');

setTimeout(() => console.log('macrotask 1'), 0);
setTimeout(() => console.log('macrotask 2'), 0);

Promise.resolve()
  .then(() => console.log('microtask 1'))
  .then(() => console.log('microtask 2'));

queueMicrotask(() => console.log('microtask 3'));

console.log('end');

// Вывод:
// start
// end
// microtask 1
// microtask 3
// microtask 2   ← добавлена из цепочки .then в microtask 1
// macrotask 1
// macrotask 2

// Node.js: process.nextTick vs Promise
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
// Вывод: nextTick, promise  (nextTick обрабатывается первым)
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт, если microtask бесконечно добавляет новые microtasks?** — Event loop заморозится, macrotasks никогда не выполнятся, страница зависнет.
- **Чем event loop в Node.js отличается от браузерного?** — Node использует libuv с 6 фазами; есть `setImmediate`, `process.nextTick`; нет `requestAnimationFrame`.
- **Когда используется `requestAnimationFrame`?** — Для анимаций: вызывается перед следующим рендер-фреймом браузера (~60fps).
- **Почему `setTimeout(fn, 0)` не гарантирует немедленное выполнение?** — Он попадает в macrotask queue и ждёт завершения всех microtasks и текущей macrotask.

### Красные флаги (чего не говорить)

- «Event loop — это часть V8» — нет, это часть среды выполнения (браузер/libuv).
- «Microtask и macrotask — одна очередь» — это два разных механизма с разным приоритетом.
- «`setTimeout(fn, 0)` выполняется немедленно» — он выполняется после всех microtasks.

### Связанные темы

- `005-raznica-mezhdu-mikro-i-makrozadachami-v-event-loop.md`
- `006-rasskazhite-o-queuemicrotask.md`
- `007-kak-rabotaet-settimeout-s-nulevym-tajmerom-0-ms.md`
