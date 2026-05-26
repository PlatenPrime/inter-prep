# Q012. Как работают дефолтные параметры в ES6?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Дефолтные параметры (default parameters) позволяют задать значение, которое используется, если аргумент не передан или равен `undefined`. Значение по умолчанию вычисляется при каждом вызове функции, может быть любым выражением (включая вызовы других функций), и вычисляется слева направо — каждый параметр может ссылаться на предыдущие.

---

## Развёрнутый ответ

### Суть и определение

До ES2015 дефолтные значения задавались вручную:
```javascript
function greet(name) {
  name = name !== undefined ? name : 'World';
  return 'Hello, ' + name;
}
```

ES2015 вводит синтаксис `param = defaultValue` прямо в сигнатуре функции.

### Как это работает

1. Дефолтное значение применяется только при `undefined` — не при `null`, `0`, `false`, `''`.
2. Выражение-дефолт вычисляется **лениво** (при каждом вызове, когда нужно), а не при парсинге функции.
3. Параметры инициализируются слева направо, каждый следующий может ссылаться на предыдущие.
4. Если параметр с дефолтом стоит не последним, нужно явно передать `undefined` для «пропуска».

### Практика и применение

```javascript
// Базовый синтаксис
function greet(name = 'World', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}
greet();              // 'Hello, World!'
greet('Alice');       // 'Hello, Alice!'
greet(undefined, 'Hi'); // 'Hi, World!'
greet(null, 'Hi');    // 'Hi, null!' — null НЕ триггерит дефолт

// Выражение как дефолт
function createId(prefix = 'id', suffix = Date.now()) {
  return `${prefix}-${suffix}`;
}
createId(); // 'id-1716739200000' (вычислено в момент вызова)

// Ссылка на предыдущий параметр
function range(start = 0, end = start + 10) {
  return { start, end };
}
range();       // { start: 0, end: 10 }
range(5);      // { start: 5, end: 15 }
range(5, 20);  // { start: 5, end: 20 }

// Вызов функции как дефолт
function required(paramName) {
  throw new TypeError(`Parameter '${paramName}' is required`);
}
function connect(host = required('host'), port = 3000) {
  return `${host}:${port}`;
}
connect('localhost'); // 'localhost:3000'
connect();            // TypeError: Parameter 'host' is required
```

### Важные нюансы и краеугольные камни

- **Только `undefined` триггерит дефолт** — это отличает от ручной проверки через `|| 'default'`, которая активируется и при `null`, `0`, `false`, `''`.
- **TDZ для параметров**: если параметр справа ссылается на параметр слева до его инициализации — ReferenceError:
  ```javascript
  function f(a = b, b = 1) {} // ReferenceError при вызове f()
  ```
- **Дефолтные параметры влияют на `arguments`**: в non-strict режиме `arguments` не отражает дефолтные значения, если аргумент не передан.
- **Rest-параметр `...rest` не может иметь дефолт**.
- **Деструктуризация с дефолтами** — мощная комбинация:
  ```javascript
  function connect({ host = 'localhost', port = 3000 } = {}) {}
  ```
  Двойной дефолт: `= {}` позволяет вызвать без аргумента вообще.

### Примеры

```javascript
// Опциональный конфигурационный объект
function fetchData(url, {
  method = 'GET',
  headers = {},
  timeout = 5000,
  retries = 3,
} = {}) {
  console.log({ url, method, headers, timeout, retries });
}

fetchData('/api/users');
// { url: '/api/users', method: 'GET', headers: {}, timeout: 5000, retries: 3 }

fetchData('/api/posts', { method: 'POST', timeout: 10000 });
// { url: '/api/posts', method: 'POST', headers: {}, timeout: 10000, retries: 3 }

// Динамический дефолт (каждый раз новый объект)
function addItem(item, list = []) {
  list.push(item);
  return list;
}
// ВНИМАНИЕ: для ES5-паттерна с мутацией общего дефолтного массива —
// здесь каждый вызов получает НОВЫЙ [], поэтому мутация безопасна
addItem('a'); // ['a']
addItem('b'); // ['b'] — новый массив, не ['a', 'b']
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `null` не активирует дефолтный параметр?** — Спецификация: только `undefined` считается «отсутствующим» значением.
- **Когда вычисляется выражение-дефолт?** — При каждом вызове функции (лениво), если нужен.
- **Что произойдёт при `function f(...args = []){}?`** — SyntaxError: rest не может иметь дефолт.
- **Как ES5 эквивалент ручной проверки может сломаться?** — `param = param || 'default'` активируется при любом falsy значении (0, false, ''); ES6 дефолт — только при undefined.

### Красные флаги (чего не говорить)

- «Дефолтные параметры работают как `param || default`» — нет, `||` активируется на любом falsy, дефолты — только на `undefined`.
- «Дефолтное выражение вычисляется при парсинге функции» — нет, при каждом вызове.
- «Rest-параметр может иметь дефолт» — SyntaxError.

### Связанные темы

- [`010-chto-takoe-destrukturizaciya.md`](010-chto-takoe-destrukturizaciya.md)
- [`004-chto-takoe-vremennaya-mertvaya-zona-temporal-dead-zone.md`](004-chto-takoe-vremennaya-mertvaya-zona-temporal-dead-zone.md)
- [`015-chto-takoe-operator-nulevogo-sliyaniya.md`](015-chto-takoe-operator-nulevogo-sliyaniya.md)
