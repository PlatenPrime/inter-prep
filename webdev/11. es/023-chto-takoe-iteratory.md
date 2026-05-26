# Q023. Что такое итераторы?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Итератор (iterator) — объект, реализующий метод `next()`, который при каждом вызове возвращает `{ value, done }`. Итерируемое (iterable) — объект с методом `[Symbol.iterator]()`, возвращающим итератор. Протокол итерации — основа `for...of`, spread, деструктуризации, `Array.from()`. Встроенные итерируемые: массивы, строки, Set, Map, генераторы.

---

## Развёрнутый ответ

### Суть и определение

**Протокол итерации** состоит из двух частей:

**Iterator protocol** — объект является итератором, если у него есть:
- `next()` метод, возвращающий `{ value: any, done: boolean }`
- опционально `return(value)` — досрочное завершение (вызывается при `break`)
- опционально `throw(error)` — бросить ошибку в генератор

**Iterable protocol** — объект является итерируемым, если у него есть:
- `[Symbol.iterator]()` метод, возвращающий итератор

Итерируемое ≠ итератор (хотя итераторы часто также итерируемы: `[Symbol.iterator]() { return this; }`).

### Как это работает

```
for...of, spread, деструктуризация
    ↓
Вызов [Symbol.iterator]() → получаем итератор
    ↓
Цикл вызовов next():
    → { value: 1, done: false }
    → { value: 2, done: false }
    → { value: 3, done: false }
    → { value: undefined, done: true } ← конец
```

### Практика и применение

**Создание кастомного итерируемого:**
```javascript
// Диапазон чисел
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;
    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const range = new Range(1, 10, 2);
[...range]; // [1, 3, 5, 7, 9]

for (const n of range) {
  if (n > 5) break; // вызовет range[Symbol.iterator]().return()
  console.log(n);
}
```

**Итерируемый объект:**
```javascript
const iterableObj = {
  data: [10, 20, 30],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => index < this.data.length
        ? { value: this.data[index++], done: false }
        : { value: undefined, done: true },
      [Symbol.iterator]() { return this; }, // сам итератор тоже итерируем
    };
  },
};

for (const x of iterableObj) {
  console.log(x); // 10, 20, 30
}
```

**Бесконечные итераторы:**
```javascript
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

// Взять первые N элементов
function take(iterable, n) {
  const result = [];
  for (const item of iterable) {
    result.push(item);
    if (result.length >= n) break;
  }
  return result;
}

take(naturals(), 5); // [1, 2, 3, 4, 5]
```

### Важные нюансы и краеугольные камни

- **Итератор одноразовый**: после `done: true` — исчерпан. Для повторной итерации нужен новый вызов `[Symbol.iterator]()`.
- **Встроенные итерируемые**: `Array`, `String`, `Set`, `Map`, `arguments`, `NodeList`, генераторы.
- **`String` — итерируемая и перебирает по кодовым точкам Unicode** (а не байтам):
  ```javascript
  [...'😀']; // ['😀'] — один элемент (2 байта UTF-16)
  ```
- **`Array.from(iterable)`** создаёт массив из любого итерируемого.
- **Ленивость**: итераторы вычисляют значения по требованию — эффективны для больших/бесконечных последовательностей.
- **`return()` вызывается** при выходе из `for...of` через `break`, `return`, `throw` — позволяет освободить ресурсы.

### Примеры

```javascript
// Итерация строки по кодовым точкам
for (const char of 'Hello') { console.log(char); } // H e l l o

// Перебор arguments
function listArgs() {
  for (const arg of arguments) { console.log(arg); }
}

// Ручное использование итератора
const arr = [1, 2, 3];
const iter = arr[Symbol.iterator]();
iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: 3, done: false }
iter.next(); // { value: undefined, done: true }

// Итерируемый через closure (без класса)
function counter(from, to) {
  let current = from;
  return {
    next() {
      return current <= to
        ? { value: current++, done: false }
        : { value: undefined, done: true };
    },
    [Symbol.iterator]() { return this; },
  };
}
[...counter(5, 8)]; // [5, 6, 7, 8]
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница между итерируемым (iterable) и итератором (iterator)?** — Iterable реализует `[Symbol.iterator]()`, iterator — `next()`. Генераторы — оба одновременно.
- **Можно ли перебрать итератор дважды?** — Нет, итератор одноразовый. Iterable — можно (каждый раз новый итератор через `[Symbol.iterator]()`).
- **Что такое `return()` в итераторе?** — Метод для досрочного завершения, вызывается при `break`/`return` в `for...of`.
- **Как сделать бесконечный итерируемый?** — Никогда не возвращать `{ done: true }`. Ленивость позволяет обрабатывать по требованию.

### Красные флаги (чего не говорить)

- «Итерируемый — это то же что итератор» — нет: iterable имеет `[Symbol.iterator]`, iterator имеет `next()`.
- «Все объекты итерируемы» — нет: объекты `{}` не итерируемы по умолчанию.
- «Итератор можно перебрать несколько раз» — нет, одноразовый. Нужен новый итератор.

### Связанные темы

- [`024-chto-takoe-generatory-kogda-ispolzovat.md`](024-chto-takoe-generatory-kogda-ispolzovat.md)
- [`025-dlya-chego-ispolzuetsya-cikl-for-of.md`](025-dlya-chego-ispolzuetsya-cikl-for-of.md)
- [`013-chto-takoe-simvol-symbol-v-es6.md`](013-chto-takoe-simvol-symbol-v-es6.md)
