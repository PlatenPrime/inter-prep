# Q010. Что такое промисы (Promises)?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`Promise` — объект-обёртка над результатом асинхронной операции, которая ещё не завершилась. Промис имеет три состояния: `pending` (ожидание), `fulfilled` (выполнен успешно) и `rejected` (отклонён). Переход из `pending` в `fulfilled` или `rejected` необратим. Промисы появились в ES2015 и решают проблемы колбэков: инверсию контроля, Callback Hell и непредсказуемую обработку ошибок.

---

## Развёрнутый ответ

### Суть и определение

До промисов единственным способом работы с асинхронным кодом были колбэки. Промис — это «обещание» того, что операция завершится (успехом или ошибкой), и вы сможете зарегистрировать реакцию на это событие в любой момент — даже после завершения операции.

**Стандарт:** Promises/A+, закреплён в ES2015 (ES6).

### Как это работает

```javascript
const promise = new Promise((resolve, reject) => {
  // executor — функция, выполняется синхронно
  if (success) {
    resolve(value);   // переводит в fulfilled
  } else {
    reject(reason);   // переводит в rejected
  }
});
```

**Машина состояний:**

```
         resolve(value)
pending ──────────────→ fulfilled
        └──────────────→ rejected
         reject(reason)
```

Переход необратим: нельзя перейти из `fulfilled` обратно в `pending` или в `rejected`.

**Методы экземпляра:**

- `.then(onFulfilled, onRejected)` — регистрирует обработчики успеха/ошибки, возвращает новый Promise (позволяет цепочки).
- `.catch(onRejected)` — сахар над `.then(null, onRejected)`.
- `.finally(onFinally)` — выполняется всегда (и при resolve, и при reject), не получает значение.

**Статические методы:**

- `Promise.resolve(value)` — уже fulfilled промис.
- `Promise.reject(reason)` — уже rejected промис.
- `Promise.all(iterable)` — ждёт все; reject при первой ошибке.
- `Promise.allSettled(iterable)` — ждёт все, сообщает статус каждого.
- `Promise.race(iterable)` — берёт результат первого завершившегося.
- `Promise.any(iterable)` — первый fulfilled; reject только если все rejected.

### Практика и применение

- **`fetch` API** — возвращает промис, цепочки `.then()` для обработки ответа.
- **Параллельные запросы** — `Promise.all([fetchA(), fetchB()])` вместо вложенных колбэков.
- **Инициализация приложения** — последовательная загрузка конфига, данных пользователя, прав через цепочку `.then()`.
- **Промисификация** — обёртка legacy callback-API для совместимости с modern code.

### Важные нюансы и краеугольные камни

- `.then()` всегда возвращает **новый** Promise — не тот же самый. Мутировать промис нельзя.
- Callback в `.then()` всегда вызывается **асинхронно** (microtask), даже если промис уже resolved в момент регистрации.
- Если в `.then()` выбросить исключение, следующий промис в цепочке будет rejected.
- Необработанный rejected Promise (без `.catch()`) — `UnhandledPromiseRejection`. В Node.js с версии 15+ это завершает процесс.
- `Promise` — не отменяемы из коробки. Для отмены используют `AbortController` + `AbortSignal`.

### Примеры

```javascript
// Базовый промис
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Цепочка .then()
fetch('/api/user/1')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  })
  .then(user => {
    console.log(user.name);
    return fetch(`/api/orders/${user.id}`);
  })
  .then(r => r.json())
  .then(orders => console.log(orders))
  .catch(err => console.error('Ошибка:', err))
  .finally(() => console.log('Запрос завершён'));

// Promise.all — параллельные запросы
const [user, config] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/config').then(r => r.json()),
]);

// Промисификация вручную
function readFileAsync(path, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Состояния: callback в .then всегда асинхронный
const p = Promise.resolve(42);
p.then(v => console.log('async:', v)); // добавляется в microtask queue
console.log('sync');                   // выполняется первым
// Вывод: "sync", "async: 42"
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Сколько раз можно вызвать `resolve` или `reject`?** — Только один раз; последующие вызовы игнорируются.
- **Что возвращает `.then()`?** — Новый Promise, а не тот же. Это основа для цепочек.
- **Как отменить промис?** — Промис сам по себе не отменяем; для отмены используют `AbortController` и проверяют `signal.aborted`.
- **Чем `Promise.all` отличается от `Promise.allSettled`?** — `all` reject'ится при первой ошибке; `allSettled` ждёт все и возвращает массив `{status, value/reason}`.

### Красные флаги (чего не говорить)

- «Промис может изменить состояние несколько раз» — состояние неизменяемо после первого перехода.
- «`.catch()` — отдельный механизм от `.then()`» — это сахар над `.then(null, fn)`.
- «Если не вызвать `.catch()`, ошибка пропадёт тихо» — в Node.js 15+ это `UnhandledPromiseRejection` с завершением процесса.

### Связанные темы

- `008-chto-takoe-callback-funkciya-chto-takoe-callback-hell.md`
- `011-preimushchestva-ispolzovaniya-promisov-vmesto-kolbekov.md`
- `012-raznica-mezhdu-promise-all-promise-any-i-promise-race.md`
- `015-chto-takoe-async-await.md`
