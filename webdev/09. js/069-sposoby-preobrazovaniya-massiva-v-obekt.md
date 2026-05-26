# Q069. Назовите способы преобразования массива в объект?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Основные способы: **`Object.fromEntries(entries)`** — из массива пар `[key, value]`; **`reduce()`** — универсальный способ для любого маппинга; **`Object.assign({}, ...arr)`** — слияние массива объектов; деструктуризация и spread для простых случаев.

---

## Развёрнутый ответ

### 1. `Object.fromEntries()` — ES2019

Принимает итерируемое объектов `[key, value]`:

```javascript
// Из массива пар
const entries = [['name', 'Alice'], ['age', 30], ['role', 'admin']];
Object.fromEntries(entries);
// { name: 'Alice', age: 30, role: 'admin' }

// Из Map
const map = new Map([['a', 1], ['b', 2]]);
Object.fromEntries(map); // { a: 1, b: 2 }

// Трансформация объекта (объект → entries → transform → объект)
const prices = { apple: 1.5, banana: 0.8, cherry: 3.0 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.9])
);
// { apple: 1.35, banana: 0.72, cherry: 2.7 }
```

### 2. `Array.prototype.reduce()`

Универсальный: любое маппинг-условие:

```javascript
// Индексация по полю
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
const byId = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
// { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }

// Подсчёт вхождений
const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] ?? 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, cherry: 1 }
```

### 3. `Object.assign({}, ...objects)`

Слияние массива объектов:

```javascript
const configs = [
  { timeout: 3000 },
  { retries: 3 },
  { debug: false }
];
Object.assign({}, ...configs);
// { timeout: 3000, retries: 3, debug: false }

// Аналог через spread
const merged = Object.assign({}, ...configs);
const mergedSpread = { ...configs[0], ...configs[1], ...configs[2] };
```

### 4. Spread

```javascript
// Только если массив содержит числовые ключи (превращается в объект с индексами)
const arr = ['a', 'b', 'c'];
const obj = { ...arr }; // { 0: 'a', 1: 'b', 2: 'c' }

// Не то же самое, что Array.from или fromEntries!
```

### 5. `new Map(arr).entries()` → объект

```javascript
// Для массивов пар через Map
const pairs = [['x', 10], ['y', 20]];
const map = new Map(pairs);
const obj = Object.fromEntries(map); // { x: 10, y: 20 }
```

### Практика и применение

```javascript
// Lookup table (быстрый поиск по ID)
const products = [
  { id: 'p1', name: 'Phone', price: 999 },
  { id: 'p2', name: 'Tablet', price: 599 },
];
const productById = Object.fromEntries(products.map(p => [p.id, p]));
productById['p1']; // { id: 'p1', name: 'Phone', ... }

// Grouping (группировка)
const orders = [
  { status: 'pending', id: 1 },
  { status: 'done', id: 2 },
  { status: 'pending', id: 3 },
];
const grouped = orders.reduce((acc, order) => {
  (acc[order.status] ??= []).push(order);
  return acc;
}, {});
// { pending: [{id:1}, {id:3}], done: [{id:2}] }

// Object.groupBy (ES2024)
const grouped2 = Object.groupBy(orders, o => o.status);
```

### Важные нюансы и краеугольные камни

- `Object.fromEntries` — ES2019, полифил нужен для старых окружений.
- `reduce` — самый гибкий, но может быть менее читаем.
- `Object.assign` выполняет **shallow** мерж.
- `Object.groupBy` (ES2024) — нативная группировка без reduce.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как быстро найти элемент по полю в массиве объектов?** — Предварительно индексировать через `reduce` или `Object.fromEntries`.
- **Что делает `{...arr}`?** — Создаёт объект с числовыми индексами как ключами.

### Красные флаги (чего не говорить)

- «Нет простого способа конвертировать массив в объект» — есть несколько нативных.

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `051-raznica-mezhdu-object-i-map.md`
