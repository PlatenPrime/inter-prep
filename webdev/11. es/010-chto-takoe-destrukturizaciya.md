# Q010. Что такое деструктуризация?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Деструктуризация (destructuring assignment) — синтаксис ES2015, позволяющий извлекать значения из массивов и свойства из объектов в отдельные переменные в одно выражение. Это синтаксический сахар над серией присвоений, делающий код компактным и выразительным.

---

## Развёрнутый ответ

### Суть и определение

Деструктуризация — паттерн присвоения, в котором левая сторона `=` — структурный шаблон, а правая — объект/массив/итерируемое. Движок сопоставляет структуры и извлекает значения.

Два вида:
- **Деструктуризация массивов** — по позиции
- **Деструктуризация объектов** — по ключу

### Как это работает

**Массивы** — движок итерирует правую сторону (`Symbol.iterator`) и присваивает по позиции.

**Объекты** — движок читает свойства по именам.

### Практика и применение

**Массив:**
```javascript
const [a, b, c] = [1, 2, 3];
// a=1, b=2, c=3

// Пропуск элементов
const [, second, , fourth] = [1, 2, 3, 4];
// second=2, fourth=4

// Rest в деструктуризации
const [head, ...tail] = [1, 2, 3, 4];
// head=1, tail=[2, 3, 4]

// Значения по умолчанию
const [x = 0, y = 0] = [10];
// x=10, y=0

// Обмен переменных
let p = 1, q = 2;
[p, q] = [q, p];
// p=2, q=1
```

**Объект:**
```javascript
const { name, age } = { name: 'Alice', age: 30, city: 'NY' };
// name='Alice', age=30

// Переименование
const { name: userName, age: userAge } = user;

// Значения по умолчанию
const { role = 'guest', permissions = [] } = user;

// Rest
const { name: n, ...rest } = { name: 'Alice', age: 30, city: 'NY' };
// n='Alice', rest={ age: 30, city: 'NY' }

// Вложенная деструктуризация
const { address: { city, zip = '00000' } } = { address: { city: 'NY' } };
```

**В параметрах функции** — очень распространённый паттерн:
```javascript
function greet({ name, greeting = 'Hello' }) {
  return `${greeting}, ${name}!`;
}
greet({ name: 'Alice' }); // 'Hello, Alice!'

// React props
function Button({ label, onClick, disabled = false }) { /* ... */ }
```

**Из возвращаемого значения функции:**
```javascript
const [data, error] = await fetchData(); // tuple pattern
const { data: users, total } = await getUsers();
```

### Важные нюансы и краеугольные камни

- **Деструктуризация `null`/`undefined` — TypeError**: `const { a } = null` → TypeError. Защита: `const { a } = obj ?? {}`.
- **Вложенная деструктуризация с отсутствующим свойством** — TypeError при попытке деструктурировать `undefined`:
  ```javascript
  const { a: { b } } = { a: undefined }; // TypeError: Cannot destructure 'b' of undefined
  const { a: { b } = {} } = {};           // b = undefined — безопасно
  ```
- **Дефолтное значение активируется только при `undefined`**, не при `null`:
  ```javascript
  const { x = 10 } = { x: null }; // x = null, NOT 10
  ```
- **Деструктуризация итерируемых** (не только массивов): работает с `Set`, `Map.entries()`, генераторами.
- **Деструктуризация не создаёт глубокую копию** — извлечённые объекты/массивы всё ещё ссылки.

### Примеры

```javascript
// Из API ответа
const response = {
  status: 200,
  data: {
    users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
    total: 2,
  },
};

const { status, data: { users: [firstUser, ...otherUsers], total } } = response;
// firstUser = { id: 1, name: 'Alice' }
// otherUsers = [{ id: 2, name: 'Bob' }]
// total = 2

// Безопасная деструктуризация с дефолтом
function processConfig({ host = 'localhost', port = 3000, ssl = false } = {}) {
  return `${ssl ? 'https' : 'http'}://${host}:${port}`;
}
processConfig();                     // 'http://localhost:3000'
processConfig({ host: 'example.com', ssl: true }); // 'https://example.com:3000'

// Деструктуризация в цикле
const users = [{ name: 'Alice', role: 'admin' }, { name: 'Bob', role: 'user' }];
for (const { name, role } of users) {
  console.log(`${name}: ${role}`);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда срабатывает дефолтное значение при деструктуризации?** — Только при `undefined`, не при `null`, `0`, `false`, `''`.
- **Можно ли деструктурировать `Map`?** — Через `for...of` и деструктуризацию массива: `for (const [key, value] of map)`.
- **Как деструктурировать параметр функции с возможностью вызова без аргументов?** — `function f({ x = 0 } = {})` — двойной дефолт.
- **Деструктуризация создаёт копию или ссылку?** — Примитивы копируются, объекты — ссылка.

### Красные флаги (чего не говорить)

- «Деструктуризация создаёт копию объекта» — нет, только извлекает значения; вложенные объекты — всё ещё ссылки.
- «`null` активирует дефолтное значение» — нет, только `undefined`.
- «Деструктуризация только для массивов и объектов» — работает с любым итерируемым (Set, Map, строки, генераторы).

### Связанные темы

- [`009-raznica-rest-i-spread-operatory.md`](009-raznica-rest-i-spread-operatory.md)
- [`012-kak-rabotayut-defaulnye-parametry-v-es6.md`](012-kak-rabotayut-defaulnye-parametry-v-es6.md)
- [`011-chto-takoe-shablonnye-literaly-template-literals.md`](011-chto-takoe-shablonnye-literaly-template-literals.md)
