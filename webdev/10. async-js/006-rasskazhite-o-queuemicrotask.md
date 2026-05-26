# Q006. Расскажите о `queueMicrotask`?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`queueMicrotask(fn)` — глобальная функция (ES2019, доступна в браузере и Node.js 11+), которая добавляет callback в microtask queue напрямую, без создания промиса. Это более явный и дешёвый способ запланировать микрозадачу по сравнению с `Promise.resolve().then(fn)`.

---

## Развёрнутый ответ

### Суть и определение

До появления `queueMicrotask` единственным способом добавить задачу в microtask queue был `Promise.resolve().then(fn)`. Это работало, но создавало лишний объект `Promise` и неявно говорило читателю о том, что код связан с обработкой промисов. `queueMicrotask` делает намерение явным: «Я хочу выполнить это после текущего синхронного кода, до следующей macrotask, без промиса».

**Стандарт:** HTML Living Standard, не ECMAScript. Доступна как `globalThis.queueMicrotask`.

### Как это работает

```javascript
queueMicrotask(callback)
```

- `callback` — функция без аргументов, добавляется в конец microtask queue.
- Выполняется после текущего синхронного кода и всех уже запланированных microtasks.
- Если callback выбрасывает исключение, оно передаётся через `unhandledrejection`-подобный механизм (в браузере — глобальное событие `unhandledrejection` для промисов, для `queueMicrotask` — через `reportError`).

### Практика и применение

- **Батчинг операций** — накопить изменения синхронно, применить один раз в microtask (паттерн, используемый в реактивных библиотеках: Vue 3 `nextTick`, SolidJS).
- **Отложить callback без промиса** — когда нужна гарантия «до macrotask», но создание `Promise` — избыточно.
- **Реализация планировщиков** — кастомные планировщики задач в библиотеках (React scheduler использует `MessageChannel` как macrotask, но для микрозадач применяется аналогичный подход).

```javascript
// Vue 3 nextTick — упрощённая идея
let isFlushing = false;
const queue = [];

function nextTick(fn) {
  queue.push(fn);
  if (!isFlushing) {
    isFlushing = true;
    queueMicrotask(flushQueue);
  }
}

function flushQueue() {
  for (const fn of queue) fn();
  queue.length = 0;
  isFlushing = false;
}
```

### Важные нюансы и краеугольные камни

- `queueMicrotask` **не** обёртывает callback в `try/catch`. Необработанное исключение в callback не будет поймано как `UnhandledPromiseRejection` — нужно самостоятельно оборачивать.
- В отличие от `process.nextTick` (Node.js), `queueMicrotask` добавляет задачу **в конец** текущей microtask queue, а не в отдельную очередь nextTick (которая выполняется раньше).
- `Promise.resolve().then(fn)` и `queueMicrotask(fn)` добавляют callback в одну и ту же microtask queue, разница только в API и создании объекта Promise.

### Примеры

```javascript
// queueMicrotask vs setTimeout vs Promise.resolve
console.log('sync start');

setTimeout(() => console.log('macrotask'), 0);

queueMicrotask(() => console.log('queueMicrotask'));

Promise.resolve().then(() => console.log('promise microtask'));

console.log('sync end');

// Вывод:
// sync start
// sync end
// queueMicrotask      (microtask — добавлена первой)
// promise microtask   (microtask — добавлена второй)
// macrotask           (macrotask — после всех microtasks)

// Батчинг изменений
const updates = [];
let scheduled = false;

function scheduleUpdate(value) {
  updates.push(value);
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(() => {
      console.log('Применяю батч:', updates);
      updates.length = 0;
      scheduled = false;
    });
  }
}

scheduleUpdate(1);
scheduleUpdate(2);
scheduleUpdate(3);
// Три вызова → один flush: "Применяю батч: [1, 2, 3]"

// Обработка ошибок — нужна явная обёртка
queueMicrotask(() => {
  try {
    riskyOperation();
  } catch (err) {
    handleError(err);
  }
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `queueMicrotask` лучше `Promise.resolve().then()`?** — Явнее выражает намерение, не создаёт лишний Promise-объект, чуть дешевле по памяти.
- **Когда `queueMicrotask` выполнится относительно `process.nextTick`?** — После `process.nextTick`, так как `nextTick`-очередь в Node опустошается первой.
- **Можно ли рекурсивно вызывать `queueMicrotask`?** — Да, но это приведёт к бесконечному циклу в microtask queue и заморозке.
- **Как обрабатываются ошибки в `queueMicrotask`?** — Они не превращаются в rejected Promise; нужна явная обёртка `try/catch`.

### Красные флаги (чего не говорить)

- «`queueMicrotask` — это то же самое что `setTimeout(fn, 0)`» — нет, это microtask (высокий приоритет) vs macrotask (низкий).
- «`queueMicrotask` автоматически ловит ошибки» — нет, в отличие от промисов, ошибки нужно обрабатывать вручную.

### Связанные темы

- `004-chto-takoe-cikl-sobytiy-event-loop-i-kak-on-rabotaet.md`
- `005-raznica-mezhdu-mikro-i-makrozadachami-v-event-loop.md`
- `010-chto-takoe-promisy-promises.md`
