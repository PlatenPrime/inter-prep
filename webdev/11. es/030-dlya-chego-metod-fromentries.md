# Q030. Для чего используется метод `.fromEntries()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Object.fromEntries(iterable)` (ES2019) — обратная операция к `Object.entries()`: создаёт объект из итерируемого `[key, value]` пар. Принимает массив пар, `Map`, или любой итерируемый, выдающий двухэлементные массивы. Главный use case — трансформация объектов через `entries` → `map/filter` → `fromEntries`.

---

## Развёрнутый ответ

### Суть и определение

До ES2019 для трансформации объекта через pipeline нужно было писать вспомогательные функции или вручную собирать результат через `reduce`. `Object.fromEntries` закрывает этот пробел, замыкая цикл: `Object → entries → transform → fromEntries → Object`.

### Как это работает

`Object.fromEntries(iterable)`:
1. Итерирует переданный объект
2. Каждый элемент должен быть `[key, value]`
3. Собирает объект: для дублирующихся ключей — побеждает последний

### Практика и применение

**Трансформация объекта:**
```javascript
const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 };

// Удвоить все цены
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);
// { apple: 3, banana: 1.5, cherry: 6 }

// Отфильтровать дорогие товары
const affordable = Object.fromEntries(
  Object.entries(prices).filter(([, v]) => v < 2)
);
// { apple: 1.5, banana: 0.75 }
```

**Map → Object:**
```javascript
const map = new Map([['name', 'Alice'], ['age', 30]]);
const obj = Object.fromEntries(map);
// { name: 'Alice', age: 30 }
```

**URLSearchParams → Object:**
```javascript
const params = new URLSearchParams('name=Alice&age=30&city=NY');
const obj = Object.fromEntries(params);
// { name: 'Alice', age: '30', city: 'NY' }
```

**Инверсия объекта:**
```javascript
const codes = { RU: 'Russia', US: 'USA' };
const inverted = Object.fromEntries(
  Object.entries(codes).map(([k, v]) => [v, k])
);
// { Russia: 'RU', USA: 'US' }
```

**Compose функции pick/omit:**
```javascript
const pick = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));

const omit = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

const user = { name: 'Alice', age: 30, password: 'secret', role: 'admin' };
pick(user, 'name', 'role');   // { name: 'Alice', role: 'admin' }
omit(user, 'password');       // { name: 'Alice', age: 30, role: 'admin' }
```

**Lowercase всех ключей:**
```javascript
const obj = { Name: 'Alice', AGE: 30, CITY: 'NY' };
const normalized = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
);
// { name: 'Alice', age: 30, city: 'NY' }
```

### Важные нюансы и краеугольные камни

- **Ключи — строки или Symbol**: ключи автоматически преобразуются в строки (кроме Symbol).
- **Дубликаты**: если два элемента имеют одинаковый ключ — побеждает последний.
- **Принимает любой итерируемый** с `[key, value]` парами, не только массивы.
- **`Object.fromEntries(obj.entries())`** не работает с обычными объектами — у них нет `.entries()`. Нужно `Object.fromEntries(Object.entries(obj))`.

### Примеры

```javascript
// Полный pipeline трансформации
function transformConfig(config, transformer) {
  return Object.fromEntries(
    Object.entries(config)
      .filter(([key]) => !key.startsWith('_'))   // убрать приватные
      .map(([key, val]) => [key, transformer(val)]) // трансформировать
  );
}

// Нормализация данных из API
const apiResponse = {
  user_name: 'alice',
  user_age: '30',
  user_active: 'true',
};

// Camel-case ключи + типизация
const normalized = Object.fromEntries(
  Object.entries(apiResponse).map(([k, v]) => {
    const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    const parsed = v === 'true' ? true : v === 'false' ? false : isNaN(v) ? v : Number(v);
    return [camelKey, parsed];
  })
);
// { userName: 'alice', userAge: 30, userActive: true }

// Создание lookup-таблицы из массива
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const usersById = Object.fromEntries(users.map(u => [u.id, u]));
// { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }
usersById[1]; // { id: 1, name: 'Alice' } — O(1) доступ
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что принимает `Object.fromEntries` кроме массива?** — Любой итерируемый `[key, value]` пар: Map, URLSearchParams, генератор.
- **Что произойдёт с дублирующимися ключами?** — Последнее значение перезапишет предыдущие.
- **Как реализовать `pick` и `omit` через `fromEntries`?** — Через `Object.entries` + `filter` + `fromEntries`.
- **Есть ли `Array.fromEntries`?** — Нет; для массивов есть `Array.from()`.

### Красные флаги (чего не говорить)

- «`Object.fromEntries` появился в ES6» — нет, в ES2019.
- «Принимает только массив пар» — принимает любой итерируемый.

### Связанные темы

- [`029-metody-keys-values-entries.md`](029-metody-keys-values-entries.md)
- [`020-metody-i-svojstva-kollekcii-map.md`](020-metody-i-svojstva-kollekcii-map.md)
