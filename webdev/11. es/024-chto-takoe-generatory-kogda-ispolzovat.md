# Q024. Что такое генераторы? Когда стоит использовать генераторы?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Генераторы — специальные функции (`function*`), исполнение которых можно приостанавливать через `yield` и возобновлять позднее. Они реализуют оба итерационных протокола: являются итерируемыми и итераторами одновременно. Применяются для ленивых последовательностей, бесконечных рядов, конечных автоматов и управления потоком выполнения (основа `async/await` в некоторых реализациях).

---

## Развёрнутый ответ

### Суть и определение

`function*` — функция-генератор. Вызов создаёт объект-генератор (Generator), не выполняя тело функции. Тело выполняется порционно — между вызовами `next()`:

- `yield expr` — приостановить, вернуть `{ value: expr, done: false }`
- `return expr` — завершить, вернуть `{ value: expr, done: true }`
- `yield* iterable` — делегировать итерацию другому итерируемому

Генератор является одновременно:
- **Итерируемым** (имеет `[Symbol.iterator]()`)
- **Итератором** (имеет `next()`)

### Как это работает

```
Создание:  gen = generatorFn()   ← тело НЕ выполняется

gen.next()      ← выполняется до первого yield
  → { value: 1, done: false }
gen.next()      ← продолжается после yield
  → { value: 2, done: false }
gen.next(input) ← input становится результатом yield внутри
  → { value: 3, done: false }
gen.next()
  → { value: 'done', done: true }  ← return
gen.next()
  → { value: undefined, done: true }  ← исчерпан
```

### Практика и применение

**Бесконечные последовательности:**
```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function* take(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) return;
    yield item;
  }
}

[...take(fibonacci(), 8)]; // [0, 1, 1, 2, 3, 5, 8, 13]
```

**Пагинация / lazy loading:**
```javascript
async function* paginate(fetchFn, pageSize = 20) {
  let page = 0;
  while (true) {
    const items = await fetchFn({ page: page++, size: pageSize });
    if (items.length === 0) return;
    yield* items;
  }
}

for await (const user of paginate(fetchUsers)) {
  processUser(user); // обрабатываем по одному, не загружая всё сразу
}
```

**Конечный автомат (state machine):**
```javascript
function* trafficLight() {
  while (true) {
    yield 'green';
    yield 'yellow';
    yield 'red';
  }
}
const light = trafficLight();
light.next().value; // 'green'
light.next().value; // 'yellow'
light.next().value; // 'red'
light.next().value; // 'green' — цикл
```

**`yield*` — делегирование:**
```javascript
function* concat(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}
[...concat([1, 2], [3, 4], [5])]; // [1, 2, 3, 4, 5]
```

**Передача значений в генератор через `next(value)`:**
```javascript
function* accumulator() {
  let total = 0;
  while (true) {
    const n = yield total;    // n = значение, переданное в next()
    if (n === null) return total;
    total += n;
  }
}
const acc = accumulator();
acc.next();    // { value: 0, done: false } — запуск
acc.next(10);  // { value: 10, done: false }
acc.next(5);   // { value: 15, done: false }
acc.next(null); // { value: 15, done: true } — завершение
```

### Когда стоит использовать генераторы

| Сценарий | Почему генератор |
|----------|-----------------|
| Ленивые последовательности | Вычисление по требованию, без загрузки в память |
| Бесконечные ряды | Не нужно создавать массив |
| Пагинация / streaming | Обработка порциями |
| Конечные автоматы | Явное управление состоянием |
| Кастомные итераторы | Проще, чем ручной объект с `next()` |

**Когда НЕ использовать:**
- Простые трансформации массивов (`map`/`filter` читаемее)
- Когда весь результат нужен сразу
- В React компонентах/хуках — не идиоматично

### Важные нюансы и краеугольные камни

- **Стрелочные генераторы не существуют**: `const gen = *() => {}` — SyntaxError.
- **`return()` и `throw()`**: внешний код может досрочно завершить (`gen.return(val)`) или бросить ошибку (`gen.throw(err)`) в генератор.
- **`yield` — выражение**: результат `yield` — значение, переданное следующим `next(value)`.
- **Асинхронные генераторы** (`async function*`) — возвращают `AsyncGenerator`, итерируются через `for await...of`.

### Примеры

```javascript
// Диапазон — короче чем класс с [Symbol.iterator]
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}
[...range(0, 10, 2)]; // [0, 2, 4, 6, 8, 10]

// Плоская итерация вложенных структур
function* flatten(iterable, depth = Infinity) {
  for (const item of iterable) {
    if (depth > 0 && Symbol.iterator in Object(item) && typeof item !== 'string') {
      yield* flatten(item, depth - 1);
    } else {
      yield item;
    }
  }
}
[...flatten([1, [2, [3, [4]]]])]; // [1, 2, 3, 4]

// try/finally в генераторе — освобождение ресурсов
function* withCleanup() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log('cleanup'); // вызовется при break или gen.return()
  }
}
const g = withCleanup();
g.next(); // { value: 1, done: false }
g.return(); // 'cleanup', { value: undefined, done: true }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт если вызвать `next()` на завершённом генераторе?** — `{ value: undefined, done: true }` — всегда.
- **Как передать значение в генератор?** — Через `gen.next(value)`: значение становится результатом `yield` внутри.
- **Что такое `yield*`?** — Делегирование итерации другому итерируемому; генератор поочерёдно `yield`-ит каждый элемент.
- **Как генераторы связаны с `async/await`?** — `async/await` — синтаксический сахар, реализованный на генераторах + Promise под капотом (в большинстве transpilers).

### Красные флаги (чего не говорить)

- «Генераторы — это просто функции, возвращающие массив» — нет, ленивое выполнение, значения по требованию.
- «Стрелочная функция может быть генератором» — нет, SyntaxError.
- «`return` в генераторе — то же что `yield`» — нет: `return` завершает генератор (`done: true`).

### Связанные темы

- [`023-chto-takoe-iteratory.md`](023-chto-takoe-iteratory.md)
- [`025-dlya-chego-ispolzuetsya-cikl-for-of.md`](025-dlya-chego-ispolzuetsya-cikl-for-of.md)
