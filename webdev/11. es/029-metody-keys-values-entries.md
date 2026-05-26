# Q029. Расскажите о методах `.keys()`, `.values()`, `.entries()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Object.keys()`, `Object.values()`, `Object.entries()` (ES2017) возвращают массивы собственных **перечисляемых** строковых свойств объекта: ключей, значений и пар `[key, value]`. У массивов есть одноимённые методы экземпляра (`.keys()`, `.values()`, `.entries()`), возвращающие итераторы. У Map и Set — свои версии этих методов.

---

## Развёрнутый ответ

### Суть и определение

**Статические методы `Object` (ES2017)** — работают с объектами:

| Метод | Возвращает | ES |
|-------|------------|-----|
| `Object.keys(obj)` | `string[]` — собственные enumerable ключи | ES5 |
| `Object.values(obj)` | `any[]` — собственные enumerable значения | ES2017 |
| `Object.entries(obj)` | `[string, any][]` — пары ключ-значение | ES2017 |

**Методы экземпляра `Array` (ES2015)** — работают с массивами, возвращают итераторы:

| Метод | Возвращает |
|-------|------------|
| `arr.keys()` | Итератор индексов |
| `arr.values()` | Итератор значений |
| `arr.entries()` | Итератор `[index, value]` пар |

### Как это работает

**`Object.keys/values/entries`:**
- Возвращают только **собственные** (own) свойства
- Только **enumerable** (`enumerable: true`)
- Только **строковые** ключи (не Symbol)
- Порядок: сначала целочисленные ключи по возрастанию, затем строковые в порядке вставки

### Практика и применение

**Object:**
```javascript
const user = {
  name: 'Alice',
  age: 30,
  city: 'NY',
};

Object.keys(user);    // ['name', 'age', 'city']
Object.values(user);  // ['Alice', 30, 'NY']
Object.entries(user); // [['name', 'Alice'], ['age', 30], ['city', 'NY']]

// Трансформация объекта
const doubled = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, typeof v === 'number' ? v * 2 : v])
);
// { name: 'Alice', age: 60, city: 'NY' }

// Фильтрация свойств
function pick(obj, ...keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k))
  );
}
pick(user, 'name', 'age'); // { name: 'Alice', age: 30 }

// Подсчёт свойств
Object.keys(user).length; // 3
```

**Array.entries() — итератор с индексом:**
```javascript
const fruits = ['apple', 'banana', 'cherry'];

for (const [i, fruit] of fruits.entries()) {
  console.log(`${i}: ${fruit}`);
}
// 0: apple
// 1: banana
// 2: cherry

// Поиск всех индексов элемента
function findAllIndices(arr, target) {
  return [...arr.entries()]
    .filter(([, v]) => v === target)
    .map(([i]) => i);
}
findAllIndices([1, 2, 1, 3, 1], 1); // [0, 2, 4]
```

### Важные нюансы и краеугольные камни

- **`Object.keys` не видит Symbol-ключи** — используйте `Object.getOwnPropertySymbols`.
- **`Object.keys` не видит non-enumerable** — используйте `Object.getOwnPropertyNames`.
- **Порядок ключей**: целочисленные (`'0'`, `'1'`) — по возрастанию; затем строковые — в порядке вставки.
- **`arr.values()` возвращает итератор**, не массив — нужен spread или `for...of`.
- **Унаследованные свойства**: `Object.keys` их не включает; для этого нужен `for...in` + `hasOwnProperty`.
- **Разреженные массивы**: `Object.entries([1,,3])` → `[['0', 1], ['2', 3]]` — пропуск `undefined`.

### Примеры

```javascript
// Инверсия объекта
const codes = { RU: 'Russia', US: 'USA', GB: 'Britain' };
const inverted = Object.fromEntries(
  Object.entries(codes).map(([k, v]) => [v, k])
);
// { Russia: 'RU', USA: 'US', Britain: 'GB' }

// Группировка по свойству
function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    return {
      ...groups,
      [key]: [...(groups[key] ?? []), item],
    };
  }, {});
}

// Валидация: проверить что все обязательные поля присутствуют
function validateRequired(obj, required) {
  const missing = required.filter(key => !Object.keys(obj).includes(key));
  return missing.length === 0 ? null : missing;
}

// Проверить что все values числа
const scores = { alice: 95, bob: 87, charlie: 'absent' };
const valid = Object.values(scores).every(v => typeof v === 'number');
// false

// Array entries для sliding window
function maxSlidingWindow(arr, k) {
  const results = [];
  for (const [i] of arr.entries()) {
    if (i + k > arr.length) break;
    results.push(Math.max(...arr.slice(i, i + k)));
  }
  return results;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Каков порядок ключей в `Object.keys`?** — Целочисленные по возрастанию, затем строковые в порядке вставки.
- **Включает ли `Object.keys` Symbol-ключи?** — Нет, только строковые enumerable.
- **Чем `arr.values()` отличается от просто `arr`?** — Возвращает итератор (не массив); полезен в контексте итерационного протокола.
- **Как получить все ключи включая Symbol и non-enumerable?** — `Object.getOwnPropertyNames(obj)` + `Object.getOwnPropertySymbols(obj)`.

### Красные флаги (чего не говорить)

- «`Object.values` появился в ES6» — нет, в ES2017.
- «`Object.keys` включает унаследованные свойства» — нет, только собственные.
- «`arr.entries()` возвращает массив» — нет, итератор.

### Связанные темы

- [`030-dlya-chego-metod-fromentries.md`](030-dlya-chego-metod-fromentries.md)
- [`026-raznica-for-of-i-for-in.md`](026-raznica-for-of-i-for-in.md)
- [`028-dlya-chego-metod-getownpropertydescriptors.md`](028-dlya-chego-metod-getownpropertydescriptors.md)
