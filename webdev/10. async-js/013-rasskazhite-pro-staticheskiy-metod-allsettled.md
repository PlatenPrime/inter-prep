# Q013. Расскажите про статический метод `.allSettled()`?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`Promise.allSettled(promises)` ждёт завершения **всех** переданных промисов, независимо от того, fulfilled они или rejected, и возвращает массив объектов с полем `status` (`"fulfilled"` или `"rejected"`) и `value` или `reason`. Он **никогда не reject'ится**. Используется когда нужно знать результат каждой операции, даже если некоторые упали.

---

## Развёрнутый ответ

### Суть и определение

`Promise.allSettled` появился в ES2020 как ответ на частый паттерн «запусти несколько операций, обработай всё, что получилось». `Promise.all` в таких сценариях не подходит — один сбой отменяет весь результат.

**Стандарт:** ES2020 (Stage 4 с 2019).

### Как это работает

```javascript
const results = await Promise.allSettled(promises);
// results — всегда массив, никогда не reject
// Каждый элемент:
// { status: "fulfilled", value: ... }
// { status: "rejected", reason: ... }
```

Промис `allSettled` всегда переходит в **fulfilled** — разница только в содержимом массива результатов.

### Практика и применение

- **Batch-обновления** — отправить 50 уведомлений пользователям, собрать статистику: сколько отправлено успешно, сколько упало и почему.
- **Параллельная загрузка виджетов** — каждый виджет страницы загружается независимо; страница рендерится с тем что получилось, упавшие — показывают placeholder с ошибкой.
- **Синхронизация данных** — синхронизировать список сущностей с сервером, логировать ошибки по каждой.
- **Тестирование нескольких сценариев** — запустить набор тест-кейсов параллельно и собрать полный отчёт.

```javascript
// Типичный паттерн: обработка результатов
const results = await Promise.allSettled(items.map(item => saveItem(item)));

const succeeded = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);

const failed = results
  .filter(r => r.status === 'rejected')
  .map(r => r.reason);

console.log(`Успешно: ${succeeded.length}, Ошибок: ${failed.length}`);
```

### Важные нюансы и краеугольные камни

- `Promise.allSettled` **всегда** resolve'ится (в `fulfilled`) — пишите логику обработки ошибок внутри `.then()`, а не в `.catch()`.
- В отличие от `Promise.all`, отдельные ошибки не «теряются» — каждая доступна в `reason`.
- Для TypeScript полезно: `PromiseSettledResult<T>` = `PromiseFulfilledResult<T> | PromiseRejectedResult`.
- Если передать пустой массив — немедленно resolved с `[]`.

### Примеры

```javascript
// Сравнение: all vs allSettled
const p1 = Promise.resolve('ok');
const p2 = Promise.reject(new Error('fail'));
const p3 = Promise.resolve('also ok');

// Promise.all — падает на p2
try {
  await Promise.all([p1, p2, p3]);
} catch (err) {
  console.log(err.message); // "fail" — p3 потерян!
}

// Promise.allSettled — все результаты
const results = await Promise.allSettled([p1, p2, p3]);
console.log(results);
// [
//   { status: "fulfilled", value: "ok" },
//   { status: "rejected", reason: Error("fail") },
//   { status: "fulfilled", value: "also ok" }
// ]

// Реальный пример: batch email отправка
async function sendBatchEmails(emails) {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );

  const report = {
    total: emails.length,
    sent: 0,
    failed: [],
  };

  for (const [index, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      report.sent++;
    } else {
      report.failed.push({ email: emails[index], error: result.reason.message });
    }
  }

  return report;
}

// TypeScript: типизация результатов
async function typedAllSettled<T>(promises: Promise<T>[]) {
  const results: PromiseSettledResult<T>[] = await Promise.allSettled(promises);

  const fulfilled = results
    .filter((r): r is PromiseFulfilledResult<T> => r.status === 'fulfilled')
    .map(r => r.value);

  const rejected = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason as Error);

  return { fulfilled, rejected };
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда `Promise.allSettled` лучше `Promise.all`?** — Когда частичный успех допустим: пакетные операции, независимые виджеты, логирование.
- **Может ли `Promise.allSettled` reject'иться?** — Нет (если не передать невалидный аргумент типа не-итерируемое).
- **Как разделить успешные и упавшие результаты?** — Фильтрация по `r.status === 'fulfilled'` / `'rejected'`.
- **Чем отличается от `Promise.all` + индивидуальных `.catch()`?** — `allSettled` — декларативный стандарт; индивидуальные `.catch()` дают больше контроля но более многословны.

### Красные флаги (чего не говорить)

- «`Promise.allSettled` может упасть с ошибкой» — он всегда resolve'ится, ошибки внутри массива.
- «Использую `allSettled` вместо `all` везде» — `all` лучше когда одна ошибка делает весь результат бесполезным (fail-fast).
- «`allSettled` медленнее `all`» — оба запускают операции параллельно; разница только в поведении при ошибке.

### Связанные темы

- `010-chto-takoe-promisy-promises.md`
- `012-raznica-mezhdu-promise-all-promise-any-i-promise-race.md`
- `014-chto-delaet-promise-finally-scenariy-ego-primeneniya.md`
