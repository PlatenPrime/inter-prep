# Q002. Подходы при работе с асинхронным кодом?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

В JavaScript существуют три основных подхода к работе с асинхронным кодом: **callbacks** (колбэки) — исторически первый, **Promises** — появились в ES2015, **async/await** — синтаксический сахар над промисами из ES2017. Современный стандарт — `async/await` с промисами под капотом; колбэки используются только в legacy-коде и низкоуровневых API.

---

## Развёрнутый ответ

### Суть и определение

Каждый подход решает одну задачу — описать, что делать после завершения асинхронной операции — но с разной эргономикой, читаемостью и обработкой ошибок.

### Как это работает

**1. Callbacks (колбэки)**

Функция-обработчик передаётся как аргумент и вызывается по завершении операции. Стандарт Node.js — error-first callback: `(err, result) => {}`.

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) return handleError(err);
  process(data);
});
```

Проблема: вложенность при последовательных операциях — «Callback Hell» (pyramid of doom).

**2. Promises**

Объект-обёртка над будущим значением с тремя состояниями: `pending → fulfilled | rejected`. Цепочки `.then()` / `.catch()` / `.finally()` позволяют писать последовательный асинхронный код без вложенности.

```javascript
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetchProfile(user.id))
  .then(profile => render(profile))
  .catch(err => handleError(err));
```

**3. async/await**

Ключевые слова ES2017. `async` перед функцией — она всегда возвращает `Promise`. `await` внутри — приостанавливает выполнение функции (не потока!) до resolve промиса. Позволяет писать асинхронный код как синхронный.

```javascript
async function loadProfile(userId) {
  try {
    const user = await fetchUser(userId);
    const profile = await fetchProfile(user.id);
    return render(profile);
  } catch (err) {
    handleError(err);
  }
}
```

### Практика и применение

- **Callbacks** — EventEmitter в Node.js, `addEventListener` в браузере, некоторые старые npm-пакеты. Промисифировать можно через `util.promisify` (Node) или `new Promise(...)`.
- **Promises** — нативные Web API (`fetch`, `IndexedDB`, `Notification`), параллельное выполнение через `Promise.all`, `Promise.race`.
- **async/await** — де-факто стандарт для нового кода. Особенно удобен для последовательных операций и читаемой обработки ошибок.

### Важные нюансы и краеугольные камни

- `await` можно использовать только внутри `async`-функции (или на верхнем уровне модуля ES2022+ — Top-level await).
- При параллельном выполнении `await Promise1; await Promise2` — последовательно. Для параллельности нужен `Promise.all([p1, p2])`.
- Необработанная ошибка в промисе без `.catch()` вызывает `UnhandledPromiseRejection` — в Node.js это может завершить процесс.
- `async/await` не делает код быстрее — он делает его читаемее.

### Примеры

```javascript
// Все три подхода для одной задачи: последовательные запросы

// 1. Callback Hell
getUser(id, (err, user) => {
  if (err) return cb(err);
  getOrders(user.id, (err, orders) => {
    if (err) return cb(err);
    getItems(orders[0].id, (err, items) => {
      if (err) return cb(err);
      cb(null, items);
    });
  });
});

// 2. Promise chain
getUser(id)
  .then(user => getOrders(user.id))
  .then(orders => getItems(orders[0].id))
  .catch(cb);

// 3. async/await (предпочтительно)
async function loadItems(id) {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
  return getItems(orders[0].id);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как промисифировать callback-функцию?** — `new Promise((resolve, reject) => fn(arg, (err, res) => err ? reject(err) : resolve(res)))` или `util.promisify` в Node.
- **Что такое Top-level await?** — Возможность использовать `await` вне `async`-функции в ES-модулях (ES2022), удобно для инициализации модуля.
- **Как обработать ошибку в `Promise.all`, если один из промисов падает?** — Весь `Promise.all` reject'ится; если нужно обработать каждый отдельно — `Promise.allSettled`.
- **Можно ли смешивать промисы и async/await?** — Да, они совместимы: `await anyPromise`, `asyncFn().then(...)`.

### Красные флаги (чего не говорить)

- «Колбэки устарели и их не нужно знать» — они используются в Node.js core API и ивент-системах.
- «`async/await` работает параллельно» — `async/await` сам по себе последователен, параллельность даёт `Promise.all`.
- «Промисы сложнее колбэков» — наоборот, они решают проблему вложенности и обработки ошибок.

### Связанные темы

- `001-raznica-mezhdu-sinhronnymi-i-asinhronnymi-funkciyami.md`
- `008-chto-takoe-callback-funkciya-chto-takoe-callback-hell.md`
- `010-chto-takoe-promisy-promises.md`
- `015-chto-takoe-async-await.md`
