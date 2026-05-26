# Q017. Какие проблемы может вызвать неправильное использование асинхронности в JavaScript?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

Неправильное использование асинхронности приводит к: необработанным rejected Promise (падение процесса в Node.js 15+), race conditions (непредсказуемое состояние при конкурентных запросах), «забытому `await`» (операция с `Promise` вместо значения), последовательному выполнению там где нужно параллельное (потеря производительности), и блокировке event loop тяжёлыми синхронными операциями.

---

## Развёрнутый ответ

### Суть и определение

Асинхронный код сложнее отлаживать чем синхронный, потому что порядок выполнения неочевиден. Неправильные паттерны порождают как явные баги (ошибки, крэши), так и скрытые (гонки, утечки).

### Как это работает

**1. Необработанный rejected Promise (UnhandledPromiseRejection)**

```javascript
// ❌ Ошибка не поймана
async function loadData() {
  const data = await fetch('/api/fail'); // reject без try/catch
}
loadData(); // UnhandledPromiseRejection

// ✅
async function loadData() {
  try {
    const data = await fetch('/api/fail');
  } catch (err) {
    handleError(err);
  }
}
```

В Node.js 15+ — завершает процесс. В браузере — `unhandledrejection` событие.

**2. Забытый `await`**

```javascript
// ❌ user — это Promise, не объект
async function broken() {
  const user = fetchUser(1); // нет await!
  console.log(user.name); // undefined — user это Promise
}
```

**3. Race Condition**

```javascript
// ❌ Результат зависит от порядка завершения запросов
let currentData = null;

async function loadFor(id) {
  const data = await fetch(`/api/${id}`).then(r => r.json());
  currentData = data; // может перезаписать более новый запрос!
}

loadFor(1); // запрос 1
loadFor(2); // запрос 2 (может прийти РАНЬШЕ запроса 1)
// currentData может оказаться от запроса 1, хотя мы ждём 2
```

**4. Последовательное вместо параллельного**

```javascript
// ❌ Медленно: ~3000ms
async function slow() {
  const a = await fetchA(); // 1000ms
  const b = await fetchB(); // ещё 1000ms
  const c = await fetchC(); // ещё 1000ms
  return [a, b, c];
}

// ✅ Быстро: ~1000ms
async function fast() {
  return Promise.all([fetchA(), fetchB(), fetchC()]);
}
```

**5. `forEach` с `async` — тихий баг**

```javascript
// ❌ Функция вернётся ДО завершения операций
async function broken(ids) {
  ids.forEach(async id => {
    await saveItem(id); // промисы игнорируются
  });
  console.log('Все сохранены?'); // нет! forEach не ждёт
}

// ✅
async function correct(ids) {
  await Promise.all(ids.map(id => saveItem(id)));
}
```

**6. Блокировка event loop**

```javascript
// ❌ Синхронная тяжёлая операция блокирует event loop
async function processLargeFile() {
  const data = await readFile('huge.json');
  const result = JSON.parse(data); // парсинг 100MB синхронно — блокировка!
  return result;
}
```

**7. Memory leak из-за незавершённых промисов**

```javascript
// ❌ Промис держит ссылки — если никогда не resolve, память не освобождается
const promises = [];
function startTask() {
  promises.push(new Promise(resolve => {
    // resolve никогда не вызывается — утечка памяти
  }));
}
```

### Практика и применение

- **Lint-правила** — `@typescript-eslint/no-floating-promises`, `no-await-in-loop` (ESLint) помогают поймать типичные ошибки статически.
- **AbortController** — отмена старых запросов при race condition (React `useEffect` cleanup).
- **Worker Threads / Web Workers** — для CPU-bound задач, чтобы не блокировать event loop.
- **Глобальные обработчики** — `window.addEventListener('unhandledrejection', ...)`, `process.on('unhandledRejection', ...)` как последняя линия защиты.

### Важные нюансы и краеугольные камни

- Race condition в React: запрос в `useEffect` с быстрым переключением компонентов — нужна отмена в cleanup через `AbortController`.
- `async` функция в конструкторе класса — антипаттерн: конструктор не может возвращать промис.
- Неправильный порядок `await` и операторов присваивания может создать временное «окно» для race condition.

### Примеры

```javascript
// Race condition fix с AbortController (React useEffect)
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    try {
      const data = await fetch(`/api/items/${id}`, {
        signal: controller.signal,
      }).then(r => r.json());
      setData(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    }
  }

  load();

  return () => controller.abort(); // cleanup: отменяем при смене id или unmount
}, [id]);

// Глобальный обработчик необработанных rejection
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  // В продакшене: graceful shutdown
  process.exit(1);
});

// Исправление: await всех промисов перед завершением
async function runAllTasks(tasks) {
  const results = await Promise.allSettled(tasks.map(t => t()));
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  if (errors.length > 0) {
    logger.warn(`${errors.length} tasks failed`);
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как обнаружить «забытый await» статически?** — ESLint правило `@typescript-eslint/no-floating-promises` или TypeScript с `strictNullChecks`.
- **Как исправить race condition при поиске (search-as-you-type)?** — Debounce + `AbortController`: отменять предыдущий запрос при новом вводе.
- **Что произойдёт с `UnhandledPromiseRejection` в Node.js 15+?** — Процесс завершается с ненулевым exit code.
- **Как найти утечку памяти от промисов?** — Chrome DevTools → Memory Snapshot, искать `Promise` в retained heap.

### Красные флаги (чего не говорить)

- «`async/await` автоматически ловит все ошибки» — нет, нужен явный `try/catch` или `.catch()` на вызове.
- «`forEach` с `async` — то же самое что `Promise.all`» — нет, `forEach` игнорирует промисы.
- «Race condition возможны только в многопоточных языках» — в JS race conditions возникают из-за конкурентных асинхронных операций.

### Связанные темы

- `015-chto-takoe-async-await.md`
- `016-kak-vypolnit-neskolko-asinhronnyh-operaciy-posledovatelno.md`
- `003-plyusy-i-minusy-asinhronnogo-programmirovaniya-v-javascript.md`
