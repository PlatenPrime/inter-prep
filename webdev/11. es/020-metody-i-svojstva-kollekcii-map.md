# Q020. Назовите основные методы и свойства работы с коллекцией `Map`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Map` предоставляет методы: `set(key, value)`, `get(key)`, `has(key)`, `delete(key)`, `clear()` — для мутации и доступа. Свойство `size` возвращает количество записей. Для итерации: `keys()`, `values()`, `entries()`, `forEach()`. Map — итерируем, поддерживает `for...of`.

---

## Развёрнутый ответ

### Суть и определение

`Map` — встроенная коллекция ключ-значение с порядком вставки и произвольными типами ключей.

### Полный список API

**Мутирующие методы:**

| Метод | Описание | Возвращает |
|-------|----------|------------|
| `map.set(key, value)` | Добавить/обновить запись | `map` (цепочка) |
| `map.delete(key)` | Удалить запись | `true`/`false` |
| `map.clear()` | Очистить всё | `undefined` |

**Методы доступа:**

| Метод/свойство | Описание | Возвращает |
|----------------|----------|------------|
| `map.get(key)` | Получить значение | значение или `undefined` |
| `map.has(key)` | Проверить наличие | `boolean` |
| `map.size` | Количество записей | `number` |

**Методы итерации:**

| Метод | Описание |
|-------|----------|
| `map.keys()` | Итератор ключей |
| `map.values()` | Итератор значений |
| `map.entries()` | Итератор `[key, value]` пар |
| `map.forEach((value, key, map) => {})` | Перебор с колбэком |

**Создание:**
```javascript
// Пустой Map
const map = new Map();

// Из итерируемого [key, value] пар
const map2 = new Map([
  ['name', 'Alice'],
  ['age', 30],
]);

// Из Object.entries
const obj = { a: 1, b: 2 };
const map3 = new Map(Object.entries(obj));
```

**Конвертация:**
```javascript
// Map → Object
const obj = Object.fromEntries(map.entries());

// Map → Array
const arr = [...map.entries()]; // [[key1, val1], [key2, val2], ...]
const keys = [...map.keys()];
const values = [...map.values()];
```

### Практика и применение

```javascript
// Цепочка вызовов set()
const config = new Map()
  .set('host', 'localhost')
  .set('port', 3000)
  .set('debug', false);

config.get('host');  // 'localhost'
config.has('ssl');   // false
config.size;         // 3

// Безопасное получение с дефолтом
const getOrDefault = (map, key, def) => map.has(key) ? map.get(key) : def;
getOrDefault(config, 'timeout', 5000); // 5000

// Объект как ключ (WeakMap, если нужен GC)
const metadata = new Map();
const node = document.querySelector('.btn');
metadata.set(node, { clickCount: 0, lastClick: null });

// Обновление записи
const clicks = metadata.get(node);
clicks.clickCount++;
// Map обновляется автоматически — мы мутировали объект по ссылке

// Итерация
for (const [key, value] of config) {
  console.log(`${key}: ${value}`);
}

config.forEach((value, key) => {
  console.log(`${key} = ${value}`);
});
// Note: в forEach первый аргумент — VALUE, второй — KEY (аналогично Array.forEach)
```

### Важные нюансы и краеугольные камни

- **`set()` возвращает сам Map** — поддерживает цепочку.
- **`forEach` — порядок аргументов**: `(value, key)`, а не `(key, value)` как можно подумать.
- **`get()` возвращает `undefined`** если ключ не найден — проверяйте через `has()` если `undefined` — валидное значение.
- **Ключи сравниваются по SameValueZero** — `NaN === NaN` для ключей Map.
- **Map vs Object для частых обновлений**: Map оптимизирован для добавления/удаления.
- **`map[key]`** — не API Map, а обычный объектный доступ. Используйте `map.get(key)`.

### Примеры

```javascript
const inventory = new Map([
  ['apples', 5],
  ['bananas', 12],
  ['oranges', 0],
]);

// Группировка
function groupBy(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
}

const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
];
const byRole = groupBy(users, u => u.role);
byRole.get('admin'); // [{ name: 'Alice', role: 'admin' }, { name: 'Charlie', role: 'admin' }]

// Merge двух Map
function mergeMaps(...maps) {
  return new Map(maps.flatMap(m => [...m.entries()]));
}

// Инверсия Map
function invertMap(map) {
  return new Map([...map.entries()].map(([k, v]) => [v, k]));
}
const codes = new Map([['RU', 'Russia'], ['US', 'USA']]);
const names = invertMap(codes); // Map { 'Russia' => 'RU', 'USA' => 'US' }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Каков порядок аргументов в `forEach`?** — `(value, key, map)` — value первый! Часто путают.
- **Как конвертировать Map в объект?** — `Object.fromEntries(map)`.
- **Что вернёт `map.get('nonexistent')`?** — `undefined`; важно использовать `has()` если `undefined` — валидное значение.
- **Чем `map[key] = value` отличается от `map.set(key, value)`?** — Первое — обычное свойство объекта, не запись Map; `map.size` не изменится.

### Красные флаги (чего не говорить)

- «Map.forEach принимает `(key, value)`» — нет, `(value, key)`.
- «`map.key` — способ получить значение» — нет, только `map.get(key)`.
- «Map не отличается от объекта» — разные типы ключей, размер через `.size`, порядок вставки.

### Связанные темы

- [`019-chto-takoe-set-map-weakmap-i-weakset.md`](019-chto-takoe-set-map-weakmap-i-weakset.md)
- [`021-metody-i-svojstva-kollekcii-set.md`](021-metody-i-svojstva-kollekcii-set.md)
- [`022-perebor-elementov-v-kollekciyah-map-i-set.md`](022-perebor-elementov-v-kollekciyah-map-i-set.md)
- [`030-dlya-chego-metod-fromentries.md`](030-dlya-chego-metod-fromentries.md)
