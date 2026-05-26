# Q016. Как выполнить несколько асинхронных операций последовательно?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

Последовательное выполнение асинхронных операций означает, что каждая следующая стартует только после завершения предыдущей. Лучший способ — `async/await` с последовательными `await`. Альтернативы: цепочки `.then()`, `for...of` с `await` для массивов, `Array.reduce` для динамических цепочек промисов.

---

## Развёрнутый ответ

### Суть и определение

«Последовательно» означает: операция B не запускается пока A не завершена (в отличие от параллельного `Promise.all`, где все стартуют одновременно). Это нужно когда B зависит от результата A, или когда важен порядок побочных эффектов (например, запись в БД).

### Как это работает

**1. `async/await` — наиболее читаемый способ**

```javascript
async function sequential() {
  const a = await stepA();
  const b = await stepB(a); // зависит от A
  const c = await stepC(b); // зависит от B
  return c;
}
```

**2. Цепочка `.then()`**

```javascript
stepA()
  .then(a => stepB(a))
  .then(b => stepC(b))
  .then(c => render(c))
  .catch(handleError);
```

**3. `for...of` с `await` для массива задач**

```javascript
async function processSequentially(items) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item); // каждый ждёт предыдущего
    results.push(result);
  }
  return results;
}
```

**4. `Array.reduce` для динамических цепочек**

```javascript
async function chainPromises(tasks) {
  return tasks.reduce(
    (chain, task) => chain.then(results =>
      task().then(result => [...results, result])
    ),
    Promise.resolve([])
  );
}
```

### Практика и применение

- **Зависимые запросы** — получить user → по его ID получить orders → по первому order получить details.
- **Транзакционные операции** — создать запись → обновить связанные записи → отправить уведомление.
- **Обработка очереди** — обработать файлы по одному (ограничение ресурсов), миграции БД.
- **Retry логика** — последовательные попытки с задержкой.

### Важные нюансы и краеугольные камни

- `await a(); await b()` — последовательно. `Promise.all([a(), b()])` — параллельно. Это критически важное различие.
- `Array.forEach` с `async` **не работает** для последовательного выполнения — `forEach` не ждёт промисов.
- Ошибка в середине цепочки (`async/await` + `try/catch` или `.catch()`) прерывает последовательность.
- Для частично-параллельного выполнения (батчи) используют `for` со срезами массива + `Promise.all` на каждый батч.

### Примеры

```javascript
// ✅ Последовательно с async/await
async function loadDashboard(userId) {
  const user = await getUser(userId);
  const subscription = await getSubscription(user.subscriptionId);
  const usage = await getUsage(user.id, subscription.plan);
  return { user, subscription, usage };
}

// ✅ Последовательно с for...of
async function sendNotifications(userIds) {
  for (const id of userIds) {
    await sendNotification(id); // ждём каждое перед следующим
    await delay(100); // throttle — пауза между отправками
  }
}

// ❌ НЕ работает: forEach не ждёт промисов
async function broken(ids) {
  ids.forEach(async id => {
    await processItem(id); // все запускаются одновременно!
  });
  // Функция вернётся до завершения всех
}

// Для сравнения — параллельное выполнение
async function parallel(ids) {
  return Promise.all(ids.map(id => processItem(id))); // все сразу
}

// Батчевая обработка: группы по N параллельно, группы последовательно
async function batchProcess(items, batchSize = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processItem)); // параллельно внутри батча
    results.push(...batchResults);
    // следующий батч — после завершения текущего (последовательно между батчами)
  }
  return results;
}

// Retry с последовательными попытками
async function withRetry(fn, attempts = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === attempts) throw err;
      await delay(delayMs * attempt); // экспоненциальная задержка
    }
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `forEach` с `async` не работает для последовательного выполнения?** — `forEach` игнорирует возвращаемые промисы, все итерации запускаются сразу.
- **Как реализовать батчевую обработку?** — Разбить массив на части, обрабатывать каждый батч параллельно (`Promise.all`), батчи — последовательно (`for...of`).
- **Как реализовать retry с задержкой?** — `for` цикл с попытками, `await delay(ms)` между ними, выброс ошибки на последней.
- **Что быстрее: последовательно или параллельно?** — Параллельно в N раз быстрее при независимых операциях; последовательно необходимо при зависимостях.

### Красные флаги (чего не говорить)

- «`forEach` с `async` запускает операции последовательно» — нет, они запускаются параллельно и `forEach` не ждёт.
- «`for...of` с `await` — плохая практика» — это правильный паттерн для последовательной обработки массива.
- «Последовательное выполнение — всегда хуже» — иногда это единственно верный подход (зависимость от результатов, ограничение ресурсов).

### Связанные темы

- `015-chto-takoe-async-await.md`
- `012-raznica-mezhdu-promise-all-promise-any-i-promise-race.md`
- `017-kakie-problemy-mozhet-vyzvat-nepravilnoe-ispolzovanie-asinhronnosti.md`
