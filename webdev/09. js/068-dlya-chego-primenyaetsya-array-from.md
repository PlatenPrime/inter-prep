# Q068. Для чего применяется метод `Array.from()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Array.from(iterable, mapFn?)` создаёт настоящий массив из **итерируемого объекта или псевдомассива** (array-like). Используется для конвертации `NodeList`, `Set`, `Map`, `arguments`, строк, генераторов в массивы. Второй необязательный аргумент — функция-маппер, применяемая к каждому элементу (как `map` без промежуточного массива).

---

## Развёрнутый ответ

### Синтаксис

```javascript
Array.from(arrayLike)
Array.from(arrayLike, mapFn)
Array.from(arrayLike, mapFn, thisArg)
```

### Конвертация итерируемых / псевдомассивов

```javascript
// Строка → массив символов
Array.from('hello');            // ['h', 'e', 'l', 'l', 'o']

// Set → массив (убираем дубли)
Array.from(new Set([1, 2, 2, 3])); // [1, 2, 3]

// Map → массив пар
Array.from(new Map([['a', 1], ['b', 2]]));
// [['a', 1], ['b', 2]]

// NodeList (DOM) → массив
Array.from(document.querySelectorAll('div'));
// Можно .map, .filter, .reduce

// arguments (псевдомассив) → массив
function toArray() {
  return Array.from(arguments);
}
toArray(1, 2, 3); // [1, 2, 3]

// Generator
function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
Array.from(range(1, 5)); // [1, 2, 3, 4, 5]
```

### Создание массива через `{ length }` + mapFn

```javascript
// Создать массив из N элементов (аналог range)
Array.from({ length: 5 }, (_, i) => i);      // [0, 1, 2, 3, 4]
Array.from({ length: 5 }, (_, i) => i + 1);  // [1, 2, 3, 4, 5]
Array.from({ length: 3 }, () => ({}));        // [{}, {}, {}] — разные объекты!

// Матрица N×M
const matrix = Array.from({ length: 3 }, () => Array(3).fill(0));
// [[0,0,0], [0,0,0], [0,0,0]]
```

### Обработка Unicode и emoji

```javascript
// Spread и Array.from корректно работают с суррогатными парами
Array.from('😀🎉');   // ['😀', '🎉'] — правильно!
'😀🎉'.split('');     // ['', '', '', ''] — НЕПРАВИЛЬНО! (суррогатные пары)
```

### Практика и применение

```javascript
// Удаление дубликатов
const unique = arr => Array.from(new Set(arr));
unique([1, 2, 2, 3, 3]); // [1, 2, 3]

// Конвертация Map в объект
const map = new Map([['a', 1], ['b', 2]]);
const obj = Object.fromEntries(map); // {'a': 1, 'b': 2}
// Или Array.from(map).reduce(...)

// Работа с DOM
const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const checked = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
```

### Сравнение с `[...iterable]`

```javascript
// Spread — короче, но не поддерживает mapFn и не работает с { length }
[...new Set([1, 2, 2])]; // [1, 2]
[...'hello'];            // ['h', 'e', 'l', 'l', 'o']

// Array.from — мощнее
Array.from({ length: 5 }, (_, i) => i); // [0,1,2,3,4] — нет аналога через spread
```

### Важные нюансы и краеугольные камни

- `Array.from` vs `Array.of`: `from` создаёт из существующего; `of` создаёт из аргументов: `Array.of(3)` → `[3]` (а `new Array(3)` → 3 пустых слота!).
- `Array.from(new Array(3))` → `[undefined, undefined, undefined]` — заполнены `undefined`.
- `Array.from` создаёт **поверхностную** копию итерируемого.

### Примеры

```javascript
// Chunking массива
function chunk(arr, size) {
  return Array.from(
    { length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size)
  );
}

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Zip двух массивов
function zip(a, b) {
  return Array.from({ length: Math.min(a.length, b.length) }, (_, i) => [a[i], b[i]]);
}

zip([1, 2, 3], ['a', 'b', 'c']); // [[1,'a'], [2,'b'], [3,'c']]
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `Array.from('😀')` лучше `'😀'.split('')`?** — Корректно работает с суррогатными парами (emoji, некоторые Unicode символы).
- **Чем `Array.from({length: 5})` отличается от `new Array(5)`?** — `new Array(5)` создаёт разреженный массив с пустыми слотами; `Array.from({length:5})` заполняет `undefined`.
- **Как эффективно удалить дубли?** — `[...new Set(arr)]` или `Array.from(new Set(arr))`.

### Красные флаги (чего не говорить)

- «`Array.from` работает только с массивами» — работает с любыми итерируемыми объектами и псевдомассивами.

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `028-chto-takoe-psevdomassiv-arguments.md`
