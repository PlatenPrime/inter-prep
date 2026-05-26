# Q015. Что такое `async/await`?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`async/await` — синтаксический сахар над промисами, введённый в ES2017. `async` перед функцией делает её всегда возвращающей `Promise`. `await` внутри `async`-функции приостанавливает выполнение **этой функции** (не всего потока) до resolve промиса, после чего возобновляет с результатом. Позволяет писать асинхронный код в синхронном стиле с обычным `try/catch`.

---

## Развёрнутый ответ

### Суть и определение

До ES2017 для читаемого асинхронного кода использовались цепочки `.then()`. `async/await` позволяет записать ту же логику в линейном, «синхронном» стиле. Под капотом движок транспилирует его в промисы (и генераторы).

**Два ключевых слова:**

- `async` — помечает функцию как асинхронную. Возвращаемое значение автоматически оборачивается в `Promise.resolve()`. Выброшенное исключение — в `Promise.reject()`.
- `await` — можно использовать только внутри `async`-функции (или на верхнем уровне ES-модуля с ES2022 Top-level await). Ожидает разрешения промиса, не блокируя event loop.

### Как это работает

```javascript
async function example() {
  const result = await somePromise;
  return result;
}
// Эквивалентно:
function example() {
  return somePromise.then(result => result);
}
```

При встрече `await`:
1. Функция «приостанавливается», её контекст сохраняется.
2. Event loop продолжает обработку других задач.
3. Когда промис разрешается, выполнение функции возобновляется со следующей строки.

### Практика и применение

- **Последовательные зависимые запросы** — `async/await` значительно читабельнее цепочек `.then()`.
- **Обработка ошибок** — стандартный `try/catch` вместо `.catch()`.
- **Условная асинхронная логика** — легко использовать `if/else`, `for`, `while` с `await`.
- **Top-level await** (ES2022) — инициализация модуля, загрузка конфига при старте.

### Важные нюансы и краеугольные камни

- `await` без `async` — SyntaxError (кроме top-level await в модулях).
- `async` функция без `await` — выполняется синхронно до конца, но всё равно возвращает `Promise`.
- «Забытый `await`» — распространённый баг: `const user = fetchUser()` возвращает `Promise`, а не значение.
- Для параллельного выполнения нельзя писать `await a; await b;` — это последовательно. Нужен `Promise.all([a(), b()])`.
- `for...of` с `await` — итерация последовательная. Для параллельной — `Promise.all(arr.map(async item => ...))`.
- Ошибки в `async` функции без `try/catch` возвращают rejected Promise — это `UnhandledPromiseRejection`.

### Примеры

```javascript
// Базовый синтаксис
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (err) {
    console.error('Failed to fetch user:', err);
    throw err; // пробросить выше
  }
}

// Параллельное vs последовательное выполнение
async function sequential() {
  const a = await fetchA(); // ждём A
  const b = await fetchB(); // только потом B
  // Итого: время(A) + время(B)
}

async function parallel() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]); // одновременно
  // Итого: max(время(A), время(B))
}

// for...of с await — последовательная обработка
async function processItems(ids) {
  const results = [];
  for (const id of ids) {
    const item = await fetchItem(id); // каждый ждёт предыдущего
    results.push(item);
  }
  return results;
}

// Параллельная обработка массива
async function processItemsParallel(ids) {
  return Promise.all(ids.map(id => fetchItem(id)));
}

// Top-level await (ES2022, в .mjs или "type": "module")
const config = await fetchConfig();
export const API_URL = config.apiUrl;

// async функция всегда возвращает Promise
const result = fetchUserData(1); // result — Promise, не значение!
console.log(result instanceof Promise); // true
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Блокирует ли `await` весь поток JavaScript?** — Нет, только текущую `async`-функцию; event loop продолжает работу.
- **Что вернёт `async function`?** — Всегда `Promise`: значение оборачивается в `Promise.resolve()`, исключение — в `Promise.reject()`.
- **Как запустить два `await` параллельно?** — `const [a, b] = await Promise.all([fetchA(), fetchB()])`.
- **Можно ли использовать `await` в колбэках `Array.forEach`?** — Нет смысла: `forEach` не ждёт промисов; используйте `for...of` или `Promise.all(arr.map(async...))`.

### Красные флаги (чего не говорить)

- «`async/await` работает быстрее промисов» — это синтаксический сахар, производительность идентична.
- «`await` блокирует весь JavaScript» — только текущую функцию, не поток.
- «`async/await` заменяет все промисы» — `Promise.all`, `Promise.race` и другие комбинаторы всё равно нужны.
- «Ошибки в `async` функции без `try/catch` пропадают» — они превращаются в rejected Promise, и их нужно ловить на уровне вызова.

### Связанные темы

- `010-chto-takoe-promisy-promises.md`
- `016-kak-vypolnit-neskolko-asinhronnyh-operaciy-posledovatelno.md`
- `017-kakie-problemy-mozhet-vyzvat-nepravilnoe-ispolzovanie-asinhronnosti.md`
