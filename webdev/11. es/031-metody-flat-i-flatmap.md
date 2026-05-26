# Q031. Для чего используются методы `.flat()` и `.flatMap()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Array.prototype.flat(depth)` (ES2019) «разворачивает» вложенные массивы на указанную глубину. `Array.prototype.flatMap(fn)` — эквивалент `.map(fn).flat(1)`, но эффективнее: применяет функцию к каждому элементу и сглаживает результат на один уровень. Оба метода возвращают новый массив, не мутируя оригинал.

---

## Развёрнутый ответ

### Суть и определение

**`.flat(depth = 1)`:**
- `depth` — глубина разворачивания (по умолчанию 1)
- `Infinity` — разворачивает полностью до плоского массива
- Пропускает «дыры» (sparse array)

**`.flatMap(fn, thisArg)`:**
- Применяет `fn(value, index, array)` к каждому элементу
- Сглаживает результат ровно на **один уровень**
- Нельзя задать глубину больше 1 (для этого — `.map().flat(n)`)
- Оптимизирован: не создаёт промежуточный массив

### Практика и применение

**`.flat()`:**
```javascript
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();    // [1, 2, 3, 4, [5, 6]] — глубина 1
nested.flat(2);   // [1, 2, 3, 4, 5, 6]  — глубина 2
nested.flat(Infinity); // [1, 2, 3, 4, 5, 6]

// Убрать "дыры" в sparse array
[1, , 3, , 5].flat(); // [1, 3, 5] — holes убраны
```

**`.flatMap()` — один из самых полезных методов:**
```javascript
// Разбить предложения на слова
const sentences = ['Hello world', 'foo bar baz'];
sentences.flatMap(s => s.split(' '));
// ['Hello', 'world', 'foo', 'bar', 'baz']

// vs map + flat
sentences.map(s => s.split(' ')).flat();
// то же самое, но создаёт промежуточный массив

// Фильтрация + трансформация за один проход
const users = [
  { name: 'Alice', emails: ['alice@work.com', 'alice@home.com'] },
  { name: 'Bob', emails: [] },
  { name: 'Charlie', emails: ['charlie@work.com'] },
];

const allEmails = users.flatMap(u => u.emails);
// ['alice@work.com', 'alice@home.com', 'charlie@work.com']

// flatMap как filter + map
const numbers = [1, 2, 3, 4, 5, 6];
const evenDoubled = numbers.flatMap(n => n % 2 === 0 ? [n * 2] : []);
// [4, 8, 12] — чётные × 2

// Разворачивание структур с разным количеством элементов
const transactions = [
  { id: 1, items: ['apple', 'bread'] },
  { id: 2, items: ['milk'] },
  { id: 3, items: [] },
];
const allItems = transactions.flatMap(t => t.items);
// ['apple', 'bread', 'milk']
```

### Важные нюансы и краеугольные камни

- **`flatMap` глубина всегда 1** — нельзя передать `Infinity`. Для большей глубины: `.map(fn).flat(n)`.
- **`flatMap` vs `reduce`**: `flatMap` читабельнее для случаев один-к-многим (один элемент → несколько).
- **Пустой массив в `flatMap` = удаление элемента**: `[].flatMap(x => x > 0 ? [x] : [])` — это аналог `filter`.
- **`.flat()` не изменяет оригинал** — возвращает новый массив.
- **Аргумент `depth` для `.flat()`**: если вы не знаете глубину вложенности — используйте `Infinity`.
- **Производительность**: `flatMap` эффективнее чем `map(...).flat()` т.к. не создаёт промежуточный массив.

### Примеры

```javascript
// Парсинг CSV-подобных данных
const rows = ['1,2,3', '4,5,6', '7,8,9'];
const matrix = rows.map(r => r.split(',').map(Number));
// [[1,2,3], [4,5,6], [7,8,9]]
const flat = rows.flatMap(r => r.split(',').map(Number));
// [1,2,3,4,5,6,7,8,9]

// Expand/inline связей
const categories = [
  { name: 'Tech', tags: ['js', 'ts', 'react'] },
  { name: 'Design', tags: ['ux', 'ui'] },
];
const allTags = categories.flatMap(c => c.tags.map(tag => ({ tag, category: c.name })));
// [{ tag: 'js', category: 'Tech' }, ..., { tag: 'ux', category: 'Design' }, ...]

// Безопасное разворачивание с трансформацией
const data = [1, [2, 3], null, [4, [5]]];
const safe = data
  .filter(x => x !== null)
  .flat(Infinity);
// [1, 2, 3, 4, 5]

// "filter + map" через flatMap — идиома
function filterMap(arr, fn) {
  return arr.flatMap(x => {
    const result = fn(x);
    return result !== undefined ? [result] : [];
  });
}
filterMap([1, 2, 3, 4], x => x > 2 ? x * 10 : undefined);
// [30, 40]
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как разворачивает `flatMap` по сравнению с `.map().flat()`?** — Результат одинаков, но `flatMap` эффективнее (нет промежуточного массива).
- **Можно ли в `flatMap` развернуть глубже 1 уровня?** — Нет, `flatMap` всегда глубина 1. Нужно `.map().flat(n)`.
- **Как через `flatMap` сделать filter+map?** — Вернуть `[]` для отброшенных элементов.
- **Что делает `flat(Infinity)`?** — Полностью разворачивает любую вложенность.

### Красные флаги (чего не говорить)

- «`flatMap` эквивалентен `map().flat(n)`» — только для `n=1`; глубже не разворачивает.
- «`flat` мутирует массив» — нет, возвращает новый.
- «`flat` без аргументов разворачивает полностью» — нет, глубина по умолчанию 1.

### Связанные темы

- [`009-raznica-rest-i-spread-operatory.md`](009-raznica-rest-i-spread-operatory.md)
- [`032-dlya-chego-metod-includes.md`](032-dlya-chego-metod-includes.md)
