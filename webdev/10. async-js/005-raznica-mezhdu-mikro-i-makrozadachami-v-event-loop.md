# Q005. Разница между микро и макрозадачами в event loop?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

Микрозадачи (microtasks) — задачи с высоким приоритетом, которые выполняются сразу после текущей задачи, до следующего рендера и до любой макрозадачи. Макрозадачи (macrotasks / tasks) — обычные задачи в общей очереди: таймеры, I/O. Порядок: синхронный код → все microtasks → рендер → одна macrotask → все microtasks → рендер → ...

---

## Развёрнутый ответ

### Суть и определение

**Microtask queue** — очередь с приоритетом. Источники: `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`, `process.nextTick` (Node.js, обрабатывается первым среди microtasks).

**Macrotask queue (Task queue)** — основная очередь задач. Источники: `setTimeout`, `setInterval`, `setImmediate` (Node), I/O callbacks, `MessageChannel`, события UI (click, keydown).

### Как это работает

После каждой macrotask event loop **полностью опустошает** microtask queue, прежде чем взять следующую macrotask или выполнить рендер.

```
[Синхронный код (macrotask #0)]
        ↓
[Все microtasks]
        ↓
[Рендер браузера — если нужен]
        ↓
[Одна macrotask]
        ↓
[Все microtasks]
        ↓
[Рендер браузера — если нужен]
        ↓
[Следующая macrotask] ...
```

Важно: если microtask добавляет новые microtasks, они выполняются в том же «слоте» — до macrotask.

### Практика и применение

- **Promise callbacks** — микрозадачи, поэтому `.then()` гарантированно выполнится до следующего `setTimeout`.
- **`MutationObserver`** — микрозадача, реагирует на изменения DOM раньше следующего рендера.
- **`setTimeout(fn, 0)` для разделения задач** — помещает работу в macrotask, давая браузеру отрисовать кадр между итерациями.
- **`process.nextTick` в Node.js** — фактически «самый быстрый» callback, выполняется раньше обычных microtasks.

### Важные нюансы и краеугольные камни

- Бесконечная цепочка microtasks (Promise, рекурсивно добавляющий новый) заморозит страницу — macrotasks никогда не выполнятся.
- Рендер браузера происходит только после очистки microtask queue — это значит, что длинная цепочка `.then()` откладывает перерисовку.
- В Node.js `process.nextTick` обрабатывается перед `Promise.resolve().then()`, хотя оба считаются «microtasks» — это отличие важно при отладке порядка.
- `setImmediate` в Node.js — macrotask, выполняется в фазе check, после I/O, но до таймеров следующего цикла.

### Примеры

```javascript
// Демонстрация приоритетов
console.log('1 — синхронный');

setTimeout(() => console.log('2 — macrotask'), 0);

Promise.resolve()
  .then(() => console.log('3 — microtask (promise)'));

queueMicrotask(() => console.log('4 — microtask (queueMicrotask)'));

console.log('5 — синхронный');

// Вывод: 1, 5, 3, 4, 2

// Microtask, порождающая microtask
Promise.resolve()
  .then(() => {
    console.log('microtask A');
    Promise.resolve().then(() => console.log('microtask B')); // добавлена в той же итерации
  })
  .then(() => console.log('microtask C'));
setTimeout(() => console.log('macrotask'), 0);
// Вывод: microtask A, microtask B, microtask C, macrotask

// Node.js: process.nextTick vs Promise
process.nextTick(() => console.log('nextTick — первый'));
Promise.resolve().then(() => console.log('promise — второй'));
// Вывод: nextTick, promise
```

---

## Сравнение

| Критерий | Microtask | Macrotask |
|----------|-----------|-----------|
| Приоритет | Высокий (выполняются все перед рендером) | Низкий (по одной за итерацию) |
| Источники | `Promise`, `queueMicrotask`, `MutationObserver`, `process.nextTick` | `setTimeout`, `setInterval`, I/O, UI events, `setImmediate` |
| Когда выполняется | После каждой macrotask, до рендера | Одна за «оборот» event loop |
| Влияние на рендер | Задерживает рендер при длинных цепочках | Позволяет рендеру выполниться между задачами |
| Риск заморозки | Да, при бесконечной рекурсии | Меньше, т.к. берётся по одной |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Сколько microtasks может выполниться между двумя macrotasks?** — Неограниченно; все задачи из microtask queue + все новые, добавленные во время их выполнения.
- **Почему `MutationObserver` — microtask?** — Чтобы реагировать на изменения DOM до следующего рендера, не вызывая лишние перерисовки.
- **Как `process.nextTick` соотносится с промисами в Node?** — `nextTick` выполняется раньше Promise-callbacks в том же «microtask слоте».
- **Что происходит с рендером, если microtasks не заканчиваются?** — Рендер откладывается бесконечно, страница зависает.

### Красные флаги (чего не говорить)

- «`setTimeout(fn, 0)` — это microtask» — нет, `setTimeout` всегда macrotask.
- «Microtask и macrotask выполняются вперемешку в одной очереди» — это разные очереди с разным приоритетом.
- «Рендер происходит после каждой microtask» — нет, только после очистки всей microtask queue.

### Связанные темы

- `004-chto-takoe-cikl-sobytiy-event-loop-i-kak-on-rabotaet.md`
- `006-rasskazhite-o-queuemicrotask.md`
- `007-kak-rabotaet-settimeout-s-nulevym-tajmerom-0-ms.md`
