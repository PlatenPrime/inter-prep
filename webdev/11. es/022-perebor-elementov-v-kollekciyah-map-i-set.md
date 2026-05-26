# Q022. Как осуществить перебор элементов в коллекциях `Map` и `Set`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Обе коллекции итерируемы (реализуют `Symbol.iterator`) и поддерживают `for...of`. Map перебирается по парам `[key, value]` в порядке вставки. Set — по значениям в порядке вставки. Также доступны методы `forEach()` и итераторы `keys()`, `values()`, `entries()`. Spread-оператор и деструктуризация работают с обоими.

---

## Развёрнутый ответ

### Суть и определение

`Map` и `Set` реализуют **итерационный протокол**: у них есть метод `[Symbol.iterator]()`, который по умолчанию для Map возвращает итератор записей (`[key, value]`), для Set — итератор значений.

Порядок итерации — порядок вставки (insertion order). Это гарантировано спецификацией и отличает их от объектов.

### Способы перебора

**1. `for...of` — самый идиоматичный:**
```javascript
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
const set = new Set([10, 20, 30]);

// Map: итерируем [key, value] пары (деструктуризация)
for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
}

// Map: только ключи
for (const key of map.keys()) { console.log(key); }

// Map: только значения
for (const value of map.values()) { console.log(value); }

// Set: значения
for (const value of set) { console.log(value); }

// Set: entries возвращает [value, value]
for (const [v1, v2] of set.entries()) {
  console.log(v1 === v2); // true — оба одинаковы
}
```

**2. `forEach()`:**
```javascript
// Map: колбэк принимает (value, key, map) — value первый!
map.forEach((value, key) => {
  console.log(`${key} → ${value}`);
});

// Set: колбэк принимает (value, value, set)
set.forEach(value => {
  console.log(value);
});
```

**3. Spread и деструктуризация:**
```javascript
// Map → массив пар
const pairs = [...map];          // [['a',1], ['b',2], ['c',3]]
const keys = [...map.keys()];    // ['a', 'b', 'c']
const values = [...map.values()]; // [1, 2, 3]

// Set → массив
const arr = [...set];            // [10, 20, 30]
const arrFrom = Array.from(set); // то же

// Деструктуризация Map
const [[firstKey, firstValue]] = map;
// firstKey = 'a', firstValue = 1
```

**4. `Array.from()` с маппингом:**
```javascript
// Map → трансформированный массив
const doubled = Array.from(map, ([k, v]) => [k, v * 2]);
// [['a', 2], ['b', 4], ['c', 6]]

// Set → трансформированный массив
const scaled = Array.from(set, v => v / 10);
// [1, 2, 3]
```

### Практика и применение

```javascript
// Поиск в Map (аналог Array.find)
function mapFind(map, predicate) {
  for (const [key, value] of map) {
    if (predicate(value, key)) return [key, value];
  }
  return undefined;
}

const users = new Map([
  [1, { name: 'Alice', active: true }],
  [2, { name: 'Bob', active: false }],
]);
mapFind(users, user => user.active); // [1, { name: 'Alice', active: true }]

// Фильтрация Map
function mapFilter(map, predicate) {
  return new Map([...map].filter(([k, v]) => predicate(v, k)));
}

// Маппинг значений Map
function mapValues(map, fn) {
  return new Map([...map].map(([k, v]) => [k, fn(v)]));
}
```

### Важные нюансы и краеугольные камни

- **Порядок в `for...of`** = порядок вставки. Для объектов порядок менее предсказуем.
- **`forEach` vs `for...of`**: `forEach` нельзя прервать (нет `break`); `for...of` поддерживает `break`, `continue`, `return`.
- **Мутация во время итерации**: если добавить элемент в Set/Map во время итерации — он будет посещён; если удалить — пропущен. Это детерминированное поведение.
- **WeakMap/WeakSet не итерируемы** — нет `for...of`, нет `forEach`.

### Примеры

```javascript
// Подсчёт частоты слов
function wordFrequency(text) {
  const freq = new Map();
  for (const word of text.toLowerCase().split(/\s+/)) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
}

// Сортировка Map по значению
function sortMapByValue(map) {
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

const freq = wordFrequency('the quick brown fox the fox');
// Перебор отсортированного
for (const [word, count] of sortMapByValue(freq)) {
  console.log(`${word}: ${count}`);
}
// the: 2
// fox: 2
// quick: 1
// brown: 1

// Перебор Set с индексом (через entries — [value, value])
const colors = new Set(['red', 'green', 'blue']);
let i = 0;
for (const color of colors) {
  console.log(`${i++}: ${color}`);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как прервать `forEach` в Map/Set?** — Нельзя стандартно; нужно использовать `for...of` с `break` или бросить исключение.
- **Что возвращает итератор `Map` по умолчанию (`map[Symbol.iterator]()`)?** — `entries()` — итератор пар `[key, value]`.
- **Что возвращает `set.entries()`?** — `[value, value]` — value дублируется для симметрии с Map.
- **Можно ли добавлять элементы в Set/Map во время `for...of`?** — Да, они будут посещены в той же итерации.

### Красные флаги (чего не говорить)

- «`forEach` в Map принимает `(key, value)`» — нет, `(value, key)`.
- «WeakMap можно перебрать через `for...of`» — нет, WeakMap не итерируем.
- «Порядок итерации Map непредсказуем» — нет, всегда порядок вставки.

### Связанные темы

- [`019-chto-takoe-set-map-weakmap-i-weakset.md`](019-chto-takoe-set-map-weakmap-i-weakset.md)
- [`023-chto-takoe-iteratory.md`](023-chto-takoe-iteratory.md)
- [`025-dlya-chego-ispolzuetsya-cikl-for-of.md`](025-dlya-chego-ispolzuetsya-cikl-for-of.md)
