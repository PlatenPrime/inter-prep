# Q051. Разница между `Object` и `Map`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Object` — обычный объект с ключами-строками/символами и прототипом. `Map` — коллекция пар ключ-значение, где ключами могут быть **любые значения** (включая объекты и функции), нет прототипа, гарантированный порядок вставки, есть свойство `size`. `Map` предпочтителен для динамических коллекций с частыми добавлениями/удалениями.

---

## Развёрнутый ответ

### Ключи

```javascript
// Object: только строки и символы
const obj = {};
obj[42] = 'number key';   // ключ преобразован в строку "42"
obj[{}] = 'object key';   // ключ "[object Object]" — все объекты один ключ!

// Map: любой тип ключа
const map = new Map();
map.set(42, 'number');      // ключ 42 (number)
map.set({}, 'object');      // ключ — уникальный объект
map.set(() => {}, 'fn');    // ключ — функция
map.set(null, 'null');
map.set(undefined, 'undef');
```

### Порядок, размер, итерация

```javascript
const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

// Гарантированный порядок вставки
map.size; // 3 — встроенное свойство

// Итерация
for (const [key, value] of map) {
  console.log(key, value);
}
map.forEach((value, key) => {});
[...map.keys()];    // ['a', 'b', 'c']
[...map.values()];  // [1, 2, 3]
[...map.entries()]; // [['a',1], ['b',2], ['c',3]]
```

### API Map

```javascript
const map = new Map();
map.set('key', 'value');  // добавить/обновить
map.get('key');           // 'value'
map.has('key');           // true
map.delete('key');        // true
map.clear();              // очистить всё
map.size;                 // 0
```

### Производительность

| Операция | Object | Map |
|----------|--------|-----|
| Вставка | O(1) | O(1) |
| Поиск | O(1) | O(1) |
| Удаление | O(1), но медленнее `delete` | O(1) |
| Подсчёт | O(n) — `Object.keys().length` | O(1) — `.size` |

### Когда использовать Map

- Ключи — не строки/символы (объекты, числа).
- Частые добавления и удаления (оптимизирован под это).
- Нужен гарантированный порядок итерации.
- Нужно свойство `size`.
- Нет риска конфликтов с `toString`, `constructor`, `__proto__`.

### Когда использовать Object

- Статичная структура данных / DTO.
- Работа с JSON (Map не сериализуется напрямую).
- Нужны методы прототипа.
- Деструктуризация: `const { a, b } = obj`.
- TypeScript: типизированные интерфейсы.

### Важные нюансы и краеугольные камни

- `Map` не сериализуется через `JSON.stringify` напрямую: `JSON.stringify(new Map([['a', 1]]))` → `"{}"`. Нужна конвертация: `Object.fromEntries(map)`.
- `Object` имеет прототип — ключи вроде `constructor`, `__proto__` могут конфликтовать. `Object.create(null)` решает частично.
- Для кэша по объектам-ключам — `WeakMap` предпочтительнее (не удерживает объекты от GC).

### Примеры

```javascript
// Map как кэш по объектам-ключам
function getMetadata(element, metaMap) {
  if (!metaMap.has(element)) {
    metaMap.set(element, computeMetadata(element));
  }
  return metaMap.get(element);
}

// Конвертации
const obj = { a: 1, b: 2 };
const map = new Map(Object.entries(obj));     // Object → Map
const backToObj = Object.fromEntries(map);    // Map → Object

// JSON сериализация Map
const json = JSON.stringify([...map]);        // сохранить как массив пар
const restored = new Map(JSON.parse(json));   // восстановить
```

---

## Сравнение

| Критерий | Object | Map |
|----------|--------|-----|
| Типы ключей | string, symbol | Любые |
| Порядок | Гарантирован (ES2015+, с нюансами) | Гарантирован (вставка) |
| `size` | `Object.keys(obj).length` | `.size` |
| Прототип | `Object.prototype` | Нет конфликтов |
| JSON | ✓ | ✗ (требует конвертации) |
| Производительность | Хорошая для статики | Лучше для динамических изменений |
| Деструктуризация | ✓ | ✗ |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как сериализовать Map в JSON?** — `JSON.stringify(Object.fromEntries(map))` или `JSON.stringify([...map])`.
- **Когда Map работает быстрее Object?** — При частых add/delete операциях — Map оптимизирован под изменяемые коллекции.
- **Чем WeakMap отличается от Map?** — Ключи только объекты, слабые ссылки (GC может удалить), нет итерации, нет `size`.

### Красные флаги (чего не говорить)

- «Map и Object — одно и то же, просто разный синтаксис» — принципиально разные структуры с разными возможностями.

### Связанные темы

- `059-zachem-nuzhen-konstruktor-proxy.md`
- `049-kak-opredelit-nalichie-svoystva-v-obekte.md`
- `058-plyusy-i-minusy-immutabelnosti.md`
