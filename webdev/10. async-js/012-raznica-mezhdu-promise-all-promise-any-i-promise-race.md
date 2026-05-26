# Q012. Разница между `Promise.all()`, `Promise.any()` и `Promise.race()`?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`Promise.all()` ждёт все промисы и reject'ится при первой ошибке. `Promise.race()` возвращает результат первого завершившегося промиса (независимо от исхода — успех или ошибка). `Promise.any()` возвращает первый успешный результат и reject'ится только если все промисы упали с `AggregateError`. Выбор зависит от стратегии: «нужны все» → `all`, «нужен самый быстрый» → `race`, «нужен хоть один успешный» → `any`.

---

## Развёрнутый ответ

### Суть и определение

Все три метода — комбинаторы промисов: принимают итерируемый набор промисов и возвращают один промис с агрегированным результатом. Каждый реализует свою стратегию завершения.

### Как это работает

**`Promise.all(promises)`**

- Ждёт **все** промисы.
- Resolve: массив всех результатов (в порядке входного массива, не в порядке завершения).
- Reject: при первой ошибке — немедленно, не дожидаясь остальных (остальные продолжают выполняться, результаты игнорируются).

**`Promise.race(promises)`**

- Resolve/Reject: по первому завершившемуся промису (что бы ни произошло — успех или ошибка).
- Остальные промисы продолжают выполняться, но их результаты игнорируются.

**`Promise.any(promises)`** *(ES2021)*

- Resolve: при первом fulfilled.
- Reject: только если **все** промисы rejected — выбрасывает `AggregateError` с массивом всех ошибок.

### Практика и применение

- **`Promise.all`** — загрузка нескольких независимых ресурсов, необходимых одновременно (данные пользователя + настройки + разрешения). Если одного не хватает — бессмысленно продолжать.
- **`Promise.race`** — таймаут для промиса: `Promise.race([fetch('/api'), timeout(5000)])`. Также для тестирования производительности нескольких эндпоинтов.
- **`Promise.any`** — несколько зеркал/резервных серверов: вернуть данные от самого быстрого рабочего. `Promise.any([cdn1.get(url), cdn2.get(url), origin.get(url)])`.

### Важные нюансы и краеугольные камни

- Все три метода **запускают** все промисы одновременно — они не «отменяют» лишние (отмена через `AbortController`).
- `Promise.all` с пустым массивом — немедленно resolved с `[]`.
- `Promise.race` с пустым массивом — зависает навсегда (pending forever).
- `Promise.any` с пустым массивом — немедленно rejected с `AggregateError`.
- Порядок результатов в `Promise.all` соответствует порядку **входного** массива, а не порядку завершения.
- Для «жди всех, не падай при ошибке» — `Promise.allSettled`.

### Примеры

```javascript
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 500));
const fail = new Promise((_, reject) => setTimeout(() => reject(new Error('fail')), 200));

// Promise.all — все или ничего
await Promise.all([fast, slow]);       // resolve: ['fast', 'slow'] через 500ms
await Promise.all([fast, fail, slow]); // reject: Error('fail') через 200ms

// Promise.race — первый завершившийся
await Promise.race([fast, slow]);      // resolve: 'fast' через 100ms
await Promise.race([fail, slow]);      // reject: Error('fail') через 200ms

// Promise.any — первый успешный
await Promise.any([fail, fast, slow]); // resolve: 'fast' через 100ms
await Promise.any([fail]);             // reject: AggregateError([Error('fail')])

// Реальный паттерн: таймаут с Promise.race
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

const data = await withTimeout(fetch('/api/slow'), 3000);

// Реальный паттерн: несколько CDN с Promise.any
async function fetchWithFallback(url) {
  const cdnUrls = [
    `https://cdn1.example.com/${url}`,
    `https://cdn2.example.com/${url}`,
    `https://origin.example.com/${url}`,
  ];
  try {
    return await Promise.any(cdnUrls.map(u => fetch(u).then(r => r.json())));
  } catch (err) {
    // AggregateError — все CDN упали
    throw new Error('All CDN failed');
  }
}
```

---

## Сравнение

| Критерий | `Promise.all` | `Promise.race` | `Promise.any` |
|----------|--------------|----------------|---------------|
| Resolve при | Все fulfilled | Первый завершился (fulfilled или rejected) | Первый fulfilled |
| Reject при | Первый rejected | Первый завершился с rejected (если раньше всех) | Все rejected |
| Ошибка | Первая ошибка | Ошибка первого (если упал первым) | `AggregateError` со всеми ошибками |
| Пустой массив | `[]` (resolved) | Зависает навсегда | `AggregateError` (rejected) |
| Добавлен в | ES2015 | ES2015 | ES2021 |
| Применение | «Нужны все» | «Нужен самый быстрый» / таймаут | «Нужен хоть один» / failover |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что возвращает `Promise.all` с пустым массивом?** — Немедленно resolved с `[]`.
- **Как сделать таймаут для промиса?** — `Promise.race([originalPromise, new Promise((_, rej) => setTimeout(rej, ms))])`.
- **Как отменить лишние запросы после `Promise.race`?** — `AbortController`: каждый запрос получает signal, победитель оставляется, остальные abort.
- **Что такое `AggregateError`?** — Ошибка, содержащая массив ошибок (`.errors`), выбрасывается `Promise.any` когда все rejected.

### Красные флаги (чего не говорить)

- «`Promise.race` останавливает проигравшие промисы» — нет, они продолжают работать, просто результаты игнорируются.
- «`Promise.all` возвращает результаты в порядке завершения» — нет, порядок соответствует входному массиву.
- «`Promise.any` — то же, что `Promise.race`» — `race` возвращает первый любой (включая ошибку), `any` — только первый успешный.

### Связанные темы

- `010-chto-takoe-promisy-promises.md`
- `013-rasskazhite-pro-staticheskiy-metod-allsettled.md`
- `014-chto-delaet-promise-finally-scenariy-ego-primeneniya.md`
