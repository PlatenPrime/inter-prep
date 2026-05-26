# Q081. Типы ошибок в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript есть **базовый класс `Error`** и **7 встроенных подтипов**: `SyntaxError`, `ReferenceError`, `TypeError`, `RangeError`, `URIError`, `EvalError`, `AggregateError`. Каждый соответствует определённой категории проблемы. Кроме встроенных, разработчики создают собственные классы ошибок, расширяя `Error`.

---

## Развёрнутый ответ

### Суть

Ошибка в JS — это объект класса `Error` (или его наследника), обладающий свойствами: `name` (тип ошибки), `message` (описание), `stack` (стек вызовов). Ошибки делятся на: **синтаксические** (парсер), **runtime** (выполнение), **логические** (код неправильный, но не бросает исключение).

### Встроенные типы ошибок

**`SyntaxError`** — нарушение синтаксиса языка (обнаруживается на этапе парсинга):
```javascript
// В REPL / eval():
eval('function () {}'); // SyntaxError: Unexpected token ')'
JSON.parse('{ bad json }'); // SyntaxError: Unexpected token 'b'
```

**`ReferenceError`** — обращение к несуществующей переменной:
```javascript
console.log(undeclaredVar); // ReferenceError: undeclaredVar is not defined
console.log(letVar); // ReferenceError: Cannot access 'letVar' before initialization (TDZ)
```

**`TypeError`** — операция над значением неподходящего типа:
```javascript
null.property;       // TypeError: Cannot read properties of null
undefined();         // TypeError: undefined is not a function
1 .toUpperCase();    // TypeError: 1.toUpperCase is not a function
const x = 1;
x = 2;               // TypeError: Assignment to constant variable
```

**`RangeError`** — значение вне допустимого диапазона:
```javascript
new Array(-1);             // RangeError: Invalid array length
(1.23456).toFixed(200);    // RangeError: toFixed() digits argument must be between 0 and 100
function inf() { inf(); }
inf();                      // RangeError: Maximum call stack size exceeded
```

**`URIError`** — некорректное использование функций URI:
```javascript
decodeURIComponent('%'); // URIError: URI malformed
```

**`EvalError`** — исторически связан с `eval()`, в современном JS практически не используется:
```javascript
// Устарел, присутствует для обратной совместимости
```

**`AggregateError`** (ES2021) — несколько ошибок одновременно:
```javascript
Promise.any([
  Promise.reject(new Error('1')),
  Promise.reject(new Error('2')),
]).catch(e => {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors); // [Error: 1, Error: 2]
});
```

### Свойства объекта Error

```javascript
const err = new Error('Something went wrong');
console.log(err.name);    // 'Error'
console.log(err.message); // 'Something went wrong'
console.log(err.stack);   // 'Error: Something went wrong\n    at <anonymous>:1:13'

// Нестандартное, но полезное:
err.cause // ES2022: причина ошибки
const wrapped = new Error('High level error', { cause: err });
```

### Кастомные ошибки

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError'; // ВАЖНО: перезаписать name
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// Использование:
function validate(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
}

try {
  validate({});
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Field "${err.field}": ${err.message}`);
  }
}
```

### Лучшие практики работы с ошибками

```javascript
// Error cause (ES2022) — цепочка ошибок
async function loadUser(id) {
  try {
    const data = await fetchUser(id);
    return data;
  } catch (err) {
    throw new Error(`Failed to load user ${id}`, { cause: err });
  }
}

// instanceof для проверки типа
try {
  riskyOperation();
} catch (err) {
  if (err instanceof TypeError) {
    // специфичная обработка TypeError
  } else if (err instanceof ValidationError) {
    // специфичная обработка ValidationError
  } else {
    throw err; // перебрасываем неизвестные ошибки
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём отличие `throw new Error()` от `throw 'string'`?** — Объект `Error` содержит `stack`, строка — нет; catch получит строку без контекста. Всегда бросайте объекты ошибок.
- **Как правильно наследоваться от Error?** — Обязательно `super(message)` и явно задавать `this.name`, иначе `name` будет `'Error'`.
- **Что такое `err.cause`?** — ES2022: поле для передачи оригинальной ошибки при оборачивании; позволяет строить цепочку ошибок.

### Красные флаги (чего не говорить)

- Называть только `SyntaxError` и `TypeError` — нужно знать все 7 встроенных.
- Не знать о `AggregateError` (важен при `Promise.any()`).

### Связанные темы

- `082-metody-perekhvata-i-obrabotki-oshibok.md`
- `073-chto-takoe-rekursiya.md` (RangeError: Maximum call stack)
- `075-chto-znachit-max-call-stack-size-exceeded.md`
