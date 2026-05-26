# Q014. Что делает `Promise.finally()`? Сценарий его применения?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`Promise.finally(callback)` регистрирует обработчик, который выполнится **всегда** — как при успехе, так и при ошибке — и при этом не получает значения и не влияет на результат промиса (он «прозрачен»). Используется для завершающих действий: скрытие лоадера, закрытие соединения, логирование — то, что должно происходить независимо от исхода.

---

## Развёрнутый ответ

### Суть и определение

`.finally()` появился в ES2018 как замена паттерна «продублировать cleanup в `.then()` и `.catch()`». Он аналогичен блоку `finally` в `try/catch/finally`.

**Ключевое свойство**: callback в `.finally()` не получает аргументов (значение или причина ошибки) и не может изменить результат промиса — он только «наблюдает» за завершением.

### Как это работает

```javascript
promise
  .then(value => value)         // обрабатывает fulfilled
  .catch(reason => reason)      // обрабатывает rejected
  .finally(() => cleanup());    // выполняется всегда
```

**Правила «прозрачности»:**

- Возвращаемое значение из `.finally()` игнорируется — промис продолжает нести оригинальное значение или ошибку.
- **Исключение:** если `finally`-callback сам бросает исключение или возвращает rejected промис — результат меняется на эту новую ошибку.

```javascript
Promise.resolve(42)
  .finally(() => 'ignored')  // возврат игнорируется
  .then(v => console.log(v)); // 42

Promise.resolve(42)
  .finally(() => { throw new Error('finally error'); })
  .then(v => console.log(v))     // не выполнится
  .catch(e => console.log(e));   // Error: 'finally error'
```

### Практика и применение

- **Скрытие лоадера/спиннера** — самый частый сценарий: `setLoading(false)` должен вызваться и при успехе, и при ошибке.
- **Закрытие ресурсов** — закрыть DB-соединение, файл, HTTP-соединение.
- **Сброс флагов** — `isSubmitting = false`, `isFetching = false`.
- **Логирование** — записать факт завершения запроса (без значения).

```javascript
async function submitForm(data) {
  setLoading(true);

  await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(r => r.json())
    .then(result => showSuccess(result))
    .catch(err => showError(err))
    .finally(() => setLoading(false)); // всегда скроет спиннер
}
```

### Важные нюансы и краеугольные камни

- `.finally()` возвращает промис — его можно продолжить цепочкой `.then()`/`.catch()`.
- Callback не получает аргументов — используйте `.then()` если нужно значение.
- Если `.finally()` возвращает новый (rejected) промис или бросает — оригинальный результат заменяется этой ошибкой. Используйте с осторожностью.
- Аналог в `async/await` — блок `try/finally`:

```javascript
async function withCleanup() {
  try {
    return await riskyOperation();
  } finally {
    cleanup(); // выполнится всегда
  }
}
```

### Примеры

```javascript
// Скрытие лоадера — основной сценарий
function loadUserData(userId) {
  showSpinner();

  return fetchUser(userId)
    .then(user => {
      displayUser(user);
      return user;
    })
    .catch(err => {
      showError(err.message);
      throw err; // пробрасываем ошибку дальше
    })
    .finally(() => {
      hideSpinner(); // гарантировано выполнится
    });
}

// Без .finally — дублирование кода
// BAD:
fetchUser(userId)
  .then(user => {
    displayUser(user);
    hideSpinner(); // дубль 1
  })
  .catch(err => {
    showError(err.message);
    hideSpinner(); // дубль 2
  });

// Прозрачность: .finally не меняет значение
const result = await Promise.resolve('data')
  .finally(() => console.log('done'));
// result === 'data' (не undefined)

// Ошибка в .finally меняет исход
try {
  await Promise.resolve('ok').finally(() => {
    throw new Error('cleanup failed');
  });
} catch (err) {
  console.log(err.message); // 'cleanup failed' — оригинальный 'ok' потерян
}

// Закрытие соединения в Node.js
async function queryDatabase(sql) {
  const conn = await db.connect();
  try {
    return await conn.query(sql);
  } finally {
    await conn.close(); // закрываем при любом исходе
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Получает ли callback в `.finally()` значение промиса?** — Нет, callback вызывается без аргументов.
- **Что произойдёт, если `.finally()` выбросит ошибку?** — Оригинальный результат заменяется новой ошибкой из finally.
- **Как реализовать `.finally()` через `async/await`?** — Блок `try { return await op(); } finally { cleanup(); }`.
- **Изменяет ли `.finally()` значение промиса?** — Нет (кроме случая когда callback сам бросает или возвращает rejected promise).

### Красные флаги (чего не говорить)

- «`.finally()` получает значение промиса как аргумент» — нет, callback вызывается без аргументов.
- «`.finally()` всегда сохраняет оригинальный результат» — исключение в callback меняет результат.
- «`.finally()` нужен только для промисов» — в `async/await` аналог это `try/finally`.

### Связанные темы

- `010-chto-takoe-promisy-promises.md`
- `012-raznica-mezhdu-promise-all-promise-any-i-promise-race.md`
- `015-chto-takoe-async-await.md`
