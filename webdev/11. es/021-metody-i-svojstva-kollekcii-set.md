# Q021. Назовите основные методы и свойства работы с коллекцией `Set`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Set` предоставляет методы: `add(value)`, `has(value)`, `delete(value)`, `clear()`. Свойство `size` возвращает количество уникальных элементов. Для итерации: `values()`, `keys()` (алиас `values()`), `entries()`, `forEach()`. Set итерируем — поддерживает `for...of` и spread.

---

## Развёрнутый ответ

### Полный список API

**Мутирующие методы:**

| Метод | Описание | Возвращает |
|-------|----------|------------|
| `set.add(value)` | Добавить элемент (если нет дубля) | `set` (цепочка) |
| `set.delete(value)` | Удалить элемент | `true`/`false` |
| `set.clear()` | Очистить всё | `undefined` |

**Методы доступа:**

| Метод/свойство | Описание | Возвращает |
|----------------|----------|------------|
| `set.has(value)` | Проверить наличие | `boolean` |
| `set.size` | Количество элементов | `number` |

**Методы итерации:**

| Метод | Описание |
|-------|----------|
| `set.values()` | Итератор значений |
| `set.keys()` | То же, что `values()` (для совместимости с Map) |
| `set.entries()` | Итератор `[value, value]` пар |
| `set.forEach((value, value2, set) => {})` | Перебор с колбэком |

### Создание

```javascript
// Пустой
const set = new Set();

// Из итерируемого
const fromArray = new Set([1, 2, 2, 3, 3, 3]); // Set { 1, 2, 3 }
const fromString = new Set('hello');             // Set { 'h', 'e', 'l', 'o' }
const fromSet = new Set(fromArray);              // копия
```

### Практика и применение

```javascript
const tags = new Set(['js', 'ts', 'react']);

// Добавление
tags.add('node');
tags.add('js');    // дубль — игнорируется
tags.size;         // 4

// Проверка
tags.has('react'); // true
tags.has('vue');   // false

// Удаление
tags.delete('ts'); // true
tags.delete('vue'); // false (нет такого)

// Цепочка add()
const nums = new Set().add(1).add(2).add(3);

// Конвертация
const arr = [...tags];          // ['js', 'react', 'node']
const arr2 = Array.from(tags);  // то же самое

// Операции над множествами
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

const union        = new Set([...a, ...b]);              // {1,2,3,4,5,6}
const intersection = new Set([...a].filter(x => b.has(x))); // {3,4}
const difference   = new Set([...a].filter(x => !b.has(x))); // {1,2}
const symmetric    = new Set([
  ...[...a].filter(x => !b.has(x)),
  ...[...b].filter(x => !a.has(x)),
]); // {1,2,5,6}
```

**Проверка подмножества:**
```javascript
function isSubset(sub, sup) {
  return [...sub].every(x => sup.has(x));
}
isSubset(new Set([1, 2]), new Set([1, 2, 3])); // true
```

### Важные нюансы и краеугольные камни

- **`add()` возвращает сам Set** — поддерживает цепочку.
- **`set.keys()` = `set.values()`** — Set ради совместимости с Map API реализует `keys()`, но возвращает то же, что `values()`.
- **`set.entries()` возвращает `[value, value]`** — не `[index, value]`, как могло бы казаться.
- **`forEach` колбэк**: `(value, value, set)` — первые два аргумента одинаковы (для симметрии с Map).
- **Уникальность по SameValueZero**: `NaN` равен `NaN`, `+0` равен `-0`.
- **Set не поддерживает доступ по индексу**: нет `set[0]`. Для n-го элемента: `[...set][n]`.
- **ES2025** добавит встроенные методы для операций над множествами: `Set.prototype.union()`, `intersection()`, `difference()`.

### Примеры

```javascript
// Дедупликация
function uniqueById(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// Отслеживание посещённых узлов (граф)
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];

  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

// Счётчик уникальных слов
const text = 'hello world hello js world';
const uniqueWords = new Set(text.split(' '));
uniqueWords.size; // 3

// Проверка пересечения
function hasOverlap(a, b) {
  const setB = new Set(b);
  return a.some(x => setB.has(x));
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем у Set есть метод `keys()`?** — Для симметрии с Map API; возвращает то же, что `values()`.
- **Как получить n-й элемент Set?** — `[...set][n]` или итерацией; Set не поддерживает индексный доступ.
- **Как реализовать пересечение двух Set?** — `new Set([...a].filter(x => b.has(x)))`.
- **NaN в Set: два `NaN` — дубли?** — Да: SameValueZero считает NaN равным NaN, в Set он уникален.

### Красные флаги (чего не говорить)

- «Set — это упорядоченный массив без дубликатов» — не массив, нет индексного доступа.
- «Set.entries() возвращает [index, value]» — нет, `[value, value]`.
- «Нельзя сделать пересечение двух Set» — можно через spread + filter.

### Связанные темы

- [`019-chto-takoe-set-map-weakmap-i-weakset.md`](019-chto-takoe-set-map-weakmap-i-weakset.md)
- [`020-metody-i-svojstva-kollekcii-map.md`](020-metody-i-svojstva-kollekcii-map.md)
- [`022-perebor-elementov-v-kollekciyah-map-i-set.md`](022-perebor-elementov-v-kollekciyah-map-i-set.md)
