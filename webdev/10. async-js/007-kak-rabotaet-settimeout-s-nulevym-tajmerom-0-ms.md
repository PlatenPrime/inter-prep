# Q007. Как работает `setTimeout` с нулевым таймером (0 ms)?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`setTimeout(fn, 0)` не выполняет функцию немедленно — он помещает её в macrotask queue, и она выполнится лишь после завершения текущего синхронного кода и **всех** накопившихся microtasks. Фактическая задержка никогда не равна нулю: спецификация HTML устанавливает минимальный порог в 4 мс для вложенных таймеров (уровень 5+), а некоторые среды добавляют задержку и при первом вызове.

---

## Развёрнутый ответ

### Суть и определение

`setTimeout(callback, delay)` регистрирует callback во внешнем API среды выполнения. По истечении `delay` миллисекунд callback помещается в macrotask queue. Event loop возьмёт его только когда call stack пуст и microtask queue пуста.

При `delay = 0` таймер фактически «истекает» немедленно, но callback всё равно идёт в macrotask queue — это не синхронный вызов.

### Как это работает

```
setTimeout(fn, 0)
      │
      ↓
  Web API / libuv: зарегистрировать таймер на 0ms
      │
      │ (таймер истёк немедленно)
      ↓
  Macrotask Queue: [fn]
      │
      │ (после синхронного кода + всех microtasks)
      ↓
  Call Stack: fn()
```

**Минимальная задержка по спецификации:**
- При вложенности таймеров (setTimeout внутри setTimeout) от 5-го уровня вложенности браузеры устанавливают минимум **4 мс**.
- В неактивных вкладках — минимум **1000 мс** (throttling).
- Node.js: минимум **1 мс** (libuv ограничение).

### Практика и применение

- **«Уступить» event loop** — дать браузеру возможность обработать события (клики, ввод), перерисовать страницу, прежде чем выполнить тяжёлую операцию.
- **Разбивка тяжёлых задач** — вместо синхронной обработки 100 000 элементов, обрабатывать по 1000 с `setTimeout(process, 0)` между порциями.
- **Обход проблем с порядком инициализации** — запустить код после завершения текущего synchronous-цикла инициализации (антипаттерн — обычно лучше структурировать код правильно).
- **Legacy: `setTimeout(fn, 0)` как замена microtask** — до промисов это был единственный способ отложить выполнение; теперь лучше `queueMicrotask` если нужна microtask.

### Важные нюансы и краеугольные камни

- `setTimeout(fn, 0)` — macrotask, `Promise.resolve().then(fn)` — microtask. Промис всегда выполнится раньше.
- Throttling в скрытых вкладках (background throttling) может поднять задержку до 1 секунды — не использовать `setTimeout` для точного timing.
- `clearTimeout` работает даже с нулевым таймером, если вызвать до передачи callback в очередь.
- `setInterval(fn, 0)` — особенно опасен: браузер может накапливать «отставшие» вызовы при медленной функции.

### Примеры

```javascript
// Классическая демонстрация порядка
console.log('1 — sync');

setTimeout(() => console.log('2 — macrotask (setTimeout 0)'), 0);

Promise.resolve().then(() => console.log('3 — microtask'));

console.log('4 — sync');

// Вывод: 1, 4, 3, 2

// «Уступить» event loop для рендера
function processHeavyTask(items) {
  const chunkSize = 1000;
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) {
      process(items[index]);
    }
    if (index < items.length) {
      setTimeout(processChunk, 0); // уступаем event loop
    }
  }

  processChunk();
}

// setTimeout 0 НЕ равен немедленному выполнению
const id = setTimeout(() => console.log('не выполнится'), 0);
clearTimeout(id); // можно отменить, если вызвать синхронно до следующей итерации
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `setTimeout(fn, 0)` выполняется после `Promise.resolve().then(fn)`?** — `setTimeout` — macrotask, промис — microtask; microtasks имеют приоритет.
- **Какова реальная минимальная задержка у `setTimeout`?** — По спецификации 0 для первых 4 уровней вложенности, затем 4 мс; в фоновых вкладках — до 1000 мс.
- **Как `setTimeout` используется для разбивки задач?** — Обработка данных порциями с уступкой event loop между порциями для рендера (scheduler pattern).
- **Чем `setImmediate` (Node.js) отличается от `setTimeout(fn, 0)`?** — `setImmediate` выполняется в фазе check (после I/O), `setTimeout` — в фазе timers; порядок между ними зависит от фазы цикла.

### Красные флаги (чего не говорить)

- «`setTimeout(fn, 0)` выполняется немедленно / синхронно» — нет, он всегда асинхронный, всегда macrotask.
- «Задержка точно 0 мс» — фактическая задержка всегда больше нуля из-за overhead среды и спецификационного минимума.
- «`setTimeout(fn, 0)` — то же, что `queueMicrotask(fn)`» — это разные очереди с разным приоритетом.

### Связанные темы

- `004-chto-takoe-cikl-sobytiy-event-loop-i-kak-on-rabotaet.md`
- `005-raznica-mezhdu-mikro-i-makrozadachami-v-event-loop.md`
- `006-rasskazhite-o-queuemicrotask.md`
