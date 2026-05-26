# Q019. Что такое `Set`, `Map`, `WeakMap` и `WeakSet`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Set` — коллекция уникальных значений любого типа. `Map` — коллекция пар ключ-значение, где ключом может быть любое значение (в отличие от объекта — только строки/символы). `WeakMap` и `WeakSet` — «слабые» версии: держат слабые ссылки на ключи/элементы (только объекты), не препятствуют сборке мусора и не итерируемы.

---

## Развёрнутый ответ

### Суть и определение

**Set** — аналог математического множества:
- Хранит только уникальные значения
- Порядок вставки сохраняется
- Может хранить значения любых типов
- Проверка уникальности через алгоритм SameValueZero (`NaN === NaN` в Set)

**Map** — словарь с сохранением порядка вставки:
- Ключи — любой тип (объекты, функции, примитивы)
- Прямое хранение размера через `.size`
- Нет prototype-загрязнения (в отличие от `{}`)

**WeakMap** — Map только с объектными ключами и слабыми ссылками:
- Не препятствует GC: если ключ-объект удалён, запись исчезает
- Не итерируем, нет `.size`
- Применяется для хранения приватных данных, кешей без утечек памяти

**WeakSet** — Set только из объектов со слабыми ссылками:
- Не итерируем, нет `.size`
- Применяется для отслеживания объектов без удержания ссылок

### Как это работает

**Слабые ссылки** (WeakMap/WeakSet): если ключ-объект нигде больше не реферируется — сборщик мусора его уберёт вместе с записью. Это предотвращает утечки памяти в долгоживущих кешах.

### Практика и применение

**Set:**
```javascript
// Уникальные значения
const unique = new Set([1, 2, 2, 3, 3, 3]);
[...unique]; // [1, 2, 3]

// Дедупликация массива
const dedup = arr => [...new Set(arr)];

// Операции над множествами
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);
const union        = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference   = new Set([...a].filter(x => !b.has(x)));
```

**Map:**
```javascript
// Объект как ключ
const cache = new Map();
function process(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = heavyComputation(obj);
  cache.set(obj, result);
  return result;
}

// Счётчик вхождений
const count = new Map();
['a', 'b', 'a', 'c', 'b', 'a'].forEach(ch => {
  count.set(ch, (count.get(ch) ?? 0) + 1);
});
// Map { 'a' => 3, 'b' => 2, 'c' => 1 }
```

**WeakMap — приватные данные:**
```javascript
const privateData = new WeakMap();
class User {
  constructor(name, password) {
    privateData.set(this, { password });
    this.name = name;
  }
  validatePassword(input) {
    return privateData.get(this).password === input;
  }
}
```

**WeakSet — отслеживание посещённых объектов:**
```javascript
const visited = new WeakSet();
function processNode(node) {
  if (visited.has(node)) return;
  visited.add(node);
  // обработка...
  node.children?.forEach(processNode);
}
```

### Важные нюансы и краеугольные камни

- **Map vs Object**: объект хранит только строки/символы как ключи; при частых добавлениях/удалениях Map быстрее; порядок ключей в объекте менее предсказуем.
- **Set использует SameValueZero**: `NaN` равен `NaN` в Set, `+0` === `-0`.
- **WeakMap/WeakSet не итерируемы**: нет `forEach`, `keys()`, `values()`, `entries()`, нет `.size` — это намеренно для GC-безопасности.
- **WeakRef (ES2021)** — родственная концепция для слабых ссылок на любые объекты.

### Примеры

```javascript
// Set с объектами (по ссылке, не по значению)
const s = new Set();
const obj1 = { x: 1 };
const obj2 = { x: 1 };
s.add(obj1);
s.add(obj2); // оба добавятся — разные ссылки
s.size; // 2

s.add(obj1); // дубликат — игнорируется
s.size; // 2

// Map с нестроковыми ключами
const m = new Map();
const keyObj = {};
const keyFn = () => {};
m.set(keyObj, 'object key');
m.set(keyFn, 'function key');
m.set(42, 'number key');
m.get(keyObj); // 'object key'

// WeakMap для кеша вычислений
const computedCache = new WeakMap();
function getExpensiveValue(obj) {
  if (!computedCache.has(obj)) {
    computedCache.set(obj, performHeavyComputation(obj));
  }
  return computedCache.get(obj);
}
// Когда obj будет собран GC — кеш автоматически очистится
```

---

## Сравнение

| Критерий | `Set` | `Map` | `WeakSet` | `WeakMap` |
|----------|-------|-------|-----------|-----------|
| Хранит | Уникальные значения | Ключ-значение | Объекты (уникальные) | Объект → значение |
| Ключи/элементы | Любой тип | Любой тип | Только объекты | Только объекты |
| Итерируем | Да | Да | Нет | Нет |
| `.size` | Да | Да | Нет | Нет |
| Слабые ссылки | Нет | Нет | Да | Да |
| Очистка GC | Нет | Нет | Да | Да |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему WeakMap не итерируемый?** — Итерация потребовала бы знания всех ключей, но GC может удалить их в любой момент — это недетерминировано.
- **Когда Map лучше Object?** — Когда ключи не строки, нужен предсказуемый порядок вставки, частые добавления/удаления.
- **Может ли Set содержать объекты-дубликаты?** — Только если это одна и та же ссылка; `{a:1}` и `{a:1}` — разные объекты → оба в Set.
- **Для чего WeakRef?** — Слабая ссылка на объект без удержания в памяти; можно проверить `ref.deref()` — вернёт объект или `undefined`.

### Красные флаги (чего не говорить)

- «Map — это просто объект» — нет: другие типы ключей, порядок вставки, нет прототипного загрязнения.
- «WeakMap можно перебрать циклом» — нет, он не итерируемый.
- «Set проверяет равенство через `===`» — почти: SameValueZero, где `NaN === NaN`.

### Связанные темы

- [`020-metody-i-svojstva-kollekcii-map.md`](020-metody-i-svojstva-kollekcii-map.md)
- [`021-metody-i-svojstva-kollekcii-set.md`](021-metody-i-svojstva-kollekcii-set.md)
- [`022-perebor-elementov-v-kollekciyah-map-i-set.md`](022-perebor-elementov-v-kollekciyah-map-i-set.md)
