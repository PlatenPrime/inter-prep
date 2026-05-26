# Q008. Что такое callback-функция? Что такое Callback Hell?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

**Callback** — функция, переданная другой функции в качестве аргумента и вызываемая по завершении операции. **Callback Hell** («ад колбэков», pyramid of doom) — антипаттерн, при котором многоуровневая вложенность колбэков делает код нечитаемым и трудно поддерживаемым. Решается промисами и `async/await`.

---

## Развёрнутый ответ

### Суть и определение

В JavaScript функции являются объектами первого класса (first-class citizens), поэтому их можно передавать как аргументы. Callback — фундаментальный паттерн асинхронного программирования в JS: вы передаёте «что делать после», а не ждёте результата синхронно.

Стандарт Node.js — **error-first callback**: первый аргумент — ошибка (`null` если успех), второй — результат:

```javascript
function(err, result) { ... }
```

### Как это работает

```javascript
// Синхронный callback (немедленный вызов)
[1, 2, 3].forEach(n => console.log(n)); // callback вызывается синхронно

// Асинхронный callback (вызов отложен)
setTimeout(() => console.log('later'), 1000); // callback вызовется через 1 сек

// Error-first callback (Node.js стиль)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) return handleError(err);
  processData(data);
});
```

### Callback Hell

При нескольких последовательных асинхронных операциях колбэки вкладываются друг в друга:

```javascript
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      getShippingInfo(details.shippingId, (err, shipping) => {
        if (err) return handleError(err);
        renderPage(user, orders, details, shipping);
      });
    });
  });
});
```

Проблемы:
- **Нечитаемость** — код «уходит» вправо, напоминает пирамиду.
- **Сложная обработка ошибок** — `if (err) return handleError(err)` повторяется на каждом уровне.
- **Трудно рефакторить** — каждый уровень зависит от контекста родителя.
- **Нет возможности повторно использовать** — анонимные функции сложно переиспользовать и тестировать.

### Практика и применение

- **Колбэки** сегодня используются в: `addEventListener`, Node.js streams, некоторых npm-пакетах, `Array.map/filter/reduce` (синхронные).
- **Промисификация** legacy-колбэков: `util.promisify(fs.readFile)` (Node) или ручная обёртка.
- **Callback Hell избегается** через: промисы, `async/await`, именованные функции вместо анонимных.

### Важные нюансы и краеугольные камни

- Не все колбэки — асинхронные. `Array.forEach`, `Array.map` — синхронные колбэки.
- Колбэк может быть вызван несколько раз (итераторы) или ни разу (в зависимости от условий).
- Проблема «zalgo» (непредсказуемость sync/async): функция, которая иногда вызывает колбэк синхронно, иногда — асинхронно — источник тяжёлых багов.

### Примеры

```javascript
// Решение Callback Hell через именованные функции
function handleShipping(err, shipping) {
  if (err) return handleError(err);
  renderPage(context.user, context.orders, context.details, shipping);
}

function handleDetails(err, details) {
  if (err) return handleError(err);
  context.details = details;
  getShippingInfo(details.shippingId, handleShipping);
}

// Лучше — промисы
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => getShippingInfo(details.shippingId))
  .then(shipping => renderPage(shipping))
  .catch(handleError);

// Лучше всего — async/await
async function loadPage(userId) {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  const details = await getOrderDetails(orders[0].id);
  const shipping = await getShippingInfo(details.shippingId);
  renderPage(user, orders, details, shipping);
}

// Ручная промисификация
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как промисифировать функцию с error-first callback в Node.js?** — `util.promisify(fn)` или `new Promise((res, rej) => fn(arg, (err, val) => err ? rej(err) : res(val)))`.
- **Что такое «zalgo» проблема?** — Когда функция иногда вызывает колбэк синхронно, иногда асинхронно — поведение непредсказуемо. Решение: всегда один стиль.
- **Как тестировать код с колбэками?** — Jest / Vitest поддерживают `done` callback: `test('...', done => { fn(() => { expect(...); done(); }); })`.
- **Чем отличается синхронный колбэк от асинхронного?** — Синхронный вызывается в том же тике (`.map`, `.forEach`); асинхронный — после текущего кода (`setTimeout`, I/O).

### Красные флаги (чего не говорить)

- «Колбэки — устаревший паттерн, не нужны» — они фундаментальны: `addEventListener`, итераторы, `Array.map` используют синхронные колбэки.
- «Callback Hell решается просто — разбей на функции» — это частичное решение; настоящее — промисы/async-await с правильным error propagation.
- «Все колбэки асинхронные» — `[1,2,3].forEach(cb)` — синхронный колбэк.

### Связанные темы

- `002-podhody-pri-rabote-s-asinhronnym-kodom.md`
- `009-problemy-pri-ispolzovanii-callback-funkciy.md`
- `010-chto-takoe-promisy-promises.md`
