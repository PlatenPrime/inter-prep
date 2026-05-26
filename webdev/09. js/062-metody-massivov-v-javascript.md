# Q062. Методы массивов в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

JavaScript массивы имеют богатый API: **мутирующие** (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`) и **иммутабельные** (возвращают новый массив: `map`, `filter`, `slice`, `concat`, `flat`, `flatMap`) и **итерирующие** (`forEach`, `find`, `findIndex`, `some`, `every`, `reduce`, `reduceRight`). С ES2023 добавлены иммутабельные альтернативы: `toSorted`, `toReversed`, `toSpliced`, `with`.

---

## Развёрнутый ответ

### Добавление и удаление

```javascript
const arr = [1, 2, 3];

// Мутирующие
arr.push(4);         // добавить в конец → [1,2,3,4], возвращает length
arr.pop();           // удалить с конца  → [1,2,3], возвращает удалённый элемент
arr.unshift(0);      // добавить в начало → [0,1,2,3]
arr.shift();         // удалить с начала  → [1,2,3]
arr.splice(1, 1, 'a'); // удалить/вставить → [1,'a',3]
arr.splice(1, 0, 'x'); // вставить без удаления
```

### Трансформация (иммутабельные)

```javascript
const nums = [1, 2, 3, 4, 5];

nums.map(x => x * 2);           // [2, 4, 6, 8, 10]
nums.filter(x => x % 2 === 0);  // [2, 4]
nums.slice(1, 3);                // [2, 3] — не мутирует
nums.concat([6, 7]);             // [1,2,3,4,5,6,7]

[1, [2, [3]]].flat();            // [1, 2, [3]] — глубина 1
[1, [2, [3]]].flat(Infinity);    // [1, 2, 3] — полная
[1, 2, 3].flatMap(x => [x, x*2]); // [1,2, 2,4, 3,6]
```

### Поиск

```javascript
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
];

users.find(u => u.name === 'Alice');       // { id: 1, ... }
users.findIndex(u => u.name === 'Alice');  // 0
[1, 2, 3].indexOf(2);                     // 1
[1, NaN].includes(NaN);                   // true (SameValueZero!)
[1, NaN].indexOf(NaN);                    // -1 (uses ===, NaN !== NaN)

// ES2023
[1, 2, 3, 2].findLast(x => x === 2);      // 2 (с конца)
[1, 2, 3, 2].findLastIndex(x => x === 2); // 3
```

### Проверка

```javascript
[1, 2, 3].some(x => x > 2);   // true — хотя бы один
[1, 2, 3].every(x => x > 0);  // true — все
Array.isArray([]);             // true
```

### Аккумуляция

```javascript
[1, 2, 3, 4].reduce((acc, x) => acc + x, 0);         // 10
[1, 2, 3, 4].reduceRight((acc, x) => acc + x, 0);    // 10 (справа налево)

// Сложный пример: группировка
const people = [
  { name: 'Alice', dept: 'eng' },
  { name: 'Bob', dept: 'hr' },
  { name: 'Carol', dept: 'eng' },
];
const byDept = people.reduce((acc, person) => {
  (acc[person.dept] ??= []).push(person);
  return acc;
}, {});
// { eng: [Alice, Carol], hr: [Bob] }
```

### Сортировка и обращение

```javascript
// Мутирующие
[3, 1, 2].sort();               // [1, 2, 3] (строковая по умолчанию!)
[3, 1, 2].sort((a, b) => a-b);  // [1, 2, 3] числовая
['b', 'a', 'c'].reverse();      // ['c', 'a', 'b']

// ES2023: иммутабельные альтернативы
[3, 1, 2].toSorted((a, b) => a-b);  // новый массив, оригинал не тронут
[1, 2, 3].toReversed();             // новый массив
[1, 2, 3].toSpliced(1, 1, 'x');     // новый массив
[1, 2, 3].with(1, 99);             // [1, 99, 3] — заменить по индексу
```

### Создание и конвертация

```javascript
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]
Array.from('hello');                    // ['h', 'e', 'l', 'l', 'o']
Array.of(1, 2, 3);                      // [1, 2, 3]
[1, 2, 3].join(' | ');                  // "1 | 2 | 3"
```

### Важные нюансы

- `.sort()` без компаратора — **строковая** сортировка: `[10, 2, 1].sort()` → `[1, 10, 2]`.
- `.sort()` — мутирует оригинал. Для иммутабельности: `[...arr].sort(fn)` или `arr.toSorted(fn)` (ES2023).
- `includes` использует SameValueZero (обрабатывает NaN); `indexOf` — строгое сравнение.
- `flat` и `flatMap` — ES2019.

### Примеры

```javascript
// Пайплайн трансформации
const result = [1, 2, 3, 4, 5, 6]
  .filter(n => n % 2 === 0)         // [2, 4, 6]
  .map(n => ({ value: n, squared: n ** 2 }))
  .reduce((acc, { value, squared }) => {
    acc.sum += value;
    acc.sumOfSquares += squared;
    return acc;
  }, { sum: 0, sumOfSquares: 0 });

// { sum: 12, sumOfSquares: 56 }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `[10, 2, 1].sort()` даёт `[1, 10, 2]`?** — Строковая сортировка по умолчанию: "10" < "2" в лексикографическом порядке.
- **Как иммутабельно отсортировать массив?** — `[...arr].sort(fn)` или `arr.toSorted(fn)` (ES2023).
- **Чем `map` отличается от `forEach`?** — `map` возвращает новый массив; `forEach` — всегда `undefined`.

### Красные флаги (чего не говорить)

- «`sort()` автоматически сортирует числа правильно» — нет, нужен компаратор.
- «`push` и `concat` — одно и то же» — `push` мутирует, `concat` — нет.

### Связанные темы

- `063-raznica-mezhdu-foreach-i-map.md`
- `067-raznica-mezhdu-push-pop-shift-i-unshift.md`
- `068-dlya-chego-primenyaetsya-array-from.md`
