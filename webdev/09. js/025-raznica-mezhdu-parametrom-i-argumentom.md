# Q025. Разница между параметром и аргументом функции?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Параметр (parameter)** — именованная переменная в **объявлении** функции, принимающая переданное значение. **Аргумент (argument)** — конкретное **значение**, передаваемое функции при **вызове**. Параметры — это «заглушки» в сигнатуре, аргументы — реальные данные на момент вызова.

---

## Развёрнутый ответ

### Суть и определение

```javascript
//         параметры
//         ↓     ↓
function add(a,   b) {
  return a + b;
}

add(3, 5); // ← аргументы
//   ↑  ↑
```

- `a` и `b` — **параметры** (существуют в scope функции).
- `3` и `5` — **аргументы** (передаются при вызове).

### Возможности и особенности параметров

**Значения по умолчанию (ES6):**
```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}`;
}
greet();         // "Hello, Guest"
greet('Alice');  // "Hello, Alice"
greet(undefined);// "Hello, Guest" — default применяется только для undefined
greet(null);     // "Hello, null"  — null не триггерит default
```

**Rest параметры:**
```javascript
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10 — numbers = [1, 2, 3, 4]
```

**Деструктуризация в параметрах:**
```javascript
function displayUser({ name, age = 0 }) {
  return `${name} (${age})`;
}
displayUser({ name: 'Alice', age: 30 }); // "Alice (30)"
```

### Несоответствие числа аргументов и параметров

```javascript
function show(a, b, c) {
  console.log(a, b, c);
}
show(1, 2);     // 1 2 undefined — меньше аргументов
show(1, 2, 3, 4); // 1 2 3 — лишние аргументы игнорируются (но доступны через arguments)
```

### Объект `arguments`

В обычных (не стрелочных) функциях доступен псевдомассив `arguments` со всеми аргументами:
```javascript
function all() {
  return Array.from(arguments).join(', ');
}
all(1, 2, 3); // "1, 2, 3"
```
В современном коде предпочтительно использовать rest-параметры (`...args`).

### Примеры

```javascript
// Параметры с деструктуризацией и значениями по умолчанию
function createUser({
  name,
  role = 'user',
  active = true
} = {}) {
  return { name, role, active };
}

createUser({ name: 'Bob' });
// { name: 'Bob', role: 'user', active: true }

// Rest + spread
function mergeConfigs(base, ...overrides) {
  return Object.assign({}, base, ...overrides);
}

mergeConfigs(
  { timeout: 3000 },
  { retries: 3 },
  { debug: false }
);
// { timeout: 3000, retries: 3, debug: false }
```

---

## Сравнение

| Критерий | Параметр | Аргумент |
|----------|----------|----------|
| Где | В объявлении функции | При вызове функции |
| Суть | Переменная в scope функции | Конкретное значение |
| Время жизни | Весь вызов функции | До передачи в параметр |
| Количество | Фиксировано (с ES6 дефолты) | Произвольное |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что если передать меньше аргументов, чем параметров?** — Лишние параметры получают `undefined`.
- **Чем rest параметры лучше `arguments`?** — Rest — настоящий массив, работает в стрелочных функциях, явный синтаксис.
- **Когда `default` параметр не применяется?** — Только для `undefined`; `null`, `0`, `""` — не применяется.

### Красные флаги (чего не говорить)

- «Параметры и аргументы — одно и то же» — разные концепции: объявление vs вызов.

### Связанные темы

- `028-chto-takoe-psevdomassiv-arguments.md`
- `026-raznica-function-declaration-i-function-expression.md`
- `040-kak-peredayutsya-parametry-po-ssylke-ili-po-znacheniyu.md`
