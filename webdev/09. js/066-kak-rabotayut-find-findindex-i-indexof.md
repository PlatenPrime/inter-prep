# Q066. Как работают методы `.find()`, `.findIndex()` и `.indexOf()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`.find(predicate)` — возвращает **первый элемент**, удовлетворяющий предикату (или `undefined`). `.findIndex(predicate)` — возвращает **индекс** первого подходящего элемента (или `-1`). `.indexOf(value)` — ищет по **точному значению** через `===`, возвращает индекс (или `-1`). `find`/`findIndex` — для сложных условий; `indexOf` — для простого поиска примитивов.

---

## Развёрнутый ответ

### `.find()`

```javascript
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Carol', active: true },
];

users.find(u => u.name === 'Bob');    // { id: 2, name: 'Bob', ... }
users.find(u => u.id === 99);         // undefined — не найдено
users.find(u => u.active);            // { id: 1, name: 'Alice', ... } — первый active
```

### `.findIndex()`

```javascript
users.findIndex(u => u.name === 'Bob');  // 1 (индекс)
users.findIndex(u => u.id === 99);       // -1 — не найдено

// Применение: обновление элемента в массиве (иммутабельно)
const index = users.findIndex(u => u.id === 2);
const updated = [
  ...users.slice(0, index),
  { ...users[index], active: true },
  ...users.slice(index + 1)
];
```

### `.indexOf()`

```javascript
const arr = [1, 2, 3, 2, 1];

arr.indexOf(2);       // 1 — первое вхождение
arr.indexOf(2, 2);    // 3 — поиск начиная с индекса 2
arr.indexOf(99);      // -1 — не найдено
arr.lastIndexOf(2);   // 3 — последнее вхождение

// ЛОВУШКА: indexOf использует ===
arr.indexOf(NaN);              // -1 — NaN !== NaN!
[NaN].includes(NaN);           // true — SameValueZero

// Для объектов: по ссылке!
const obj = { x: 1 };
[{x:1}, obj].indexOf({ x: 1 }); // -1 — другой объект
[{x:1}, obj].indexOf(obj);      // 1 — та же ссылка
```

### ES2023: `findLast()` и `findLastIndex()`

```javascript
[1, 2, 3, 2, 1].findLast(x => x === 2);      // 2 — последнее вхождение
[1, 2, 3, 2, 1].findLastIndex(x => x === 2); // 3 — индекс последнего
```

### Практика и применение

```javascript
// find: поиск объекта в коллекции
function getUserById(users, id) {
  return users.find(u => u.id === id) ?? null;
}

// findIndex: редактирование/удаление по условию
function updateUser(users, id, changes) {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return users;
  return users.with(idx, { ...users[idx], ...changes }); // ES2023
  // Или: [...users.slice(0, idx), {...users[idx], ...changes}, ...users.slice(idx+1)]
}

// indexOf: проверка наличия значения
function isAllowed(role, allowedRoles) {
  return allowedRoles.indexOf(role) !== -1;
  // Современно: allowedRoles.includes(role)
}
```

### Важные нюансы и краеугольные камни

- `indexOf` использует `===` — не работает для `NaN`, для объектов сравнивает по ссылке.
- `find`/`findIndex` используют алгоритм SameValueZero — тоже не найдут `NaN` в общем случае (хотя `findIndex(x => Object.is(x, NaN))` сработает).
- В React: для обновления элемента в state всегда использовать `findIndex` + иммутабельное обновление.

### Примеры

```javascript
// Иммутабельное toggle элемента
function toggleActive(users, id) {
  return users.map(u => u.id === id ? { ...u, active: !u.active } : u);
}

// Поиск NaN в массиве
const arr = [1, NaN, 3];
arr.findIndex(x => Number.isNaN(x)); // 1 — правильно
arr.indexOf(NaN);                    // -1 — не работает!
```

---

## Сравнение

| Критерий | `.find()` | `.findIndex()` | `.indexOf()` |
|----------|-----------|----------------|--------------|
| Аргумент | Предикат-функция | Предикат-функция | Значение |
| Возвращает | Элемент / `undefined` | Индекс / `-1` | Индекс / `-1` |
| Алгоритм сравнения | Предикат (гибкий) | Предикат (гибкий) | `===` |
| NaN | Через `Number.isNaN` | Через `Number.isNaN` | Не найдёт |
| Объекты | По содержимому | По содержимому | По ссылке |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `indexOf(NaN)` вернёт -1?** — `indexOf` использует `===`, `NaN !== NaN`.
- **Как найти NaN в массиве?** — `arr.findIndex(x => Number.isNaN(x))` или `arr.includes(NaN)`.
- **Когда `find` вернёт `undefined`?** — Когда ни один элемент не удовлетворяет предикату, или когда найденный элемент сам равен `undefined`.

### Красные флаги (чего не говорить)

- «`indexOf` найдёт объект с теми же полями» — нет, только по ссылке.

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `064-raznica-mezhdu-some-i-every.md`
