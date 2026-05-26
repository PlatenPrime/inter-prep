# Q034. Разница между `.call()`, `.apply()` и `bind()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Все три метода позволяют явно задать `this` для функции. **`call`** вызывает функцию немедленно, аргументы — через запятую. **`apply`** вызывает немедленно, аргументы — массивом. **`bind`** не вызывает, а создаёт **новую функцию** с постоянно привязанным `this` (и опционально зафиксированными аргументами).

---

## Развёрнутый ответ

### Синтаксис

```javascript
fn.call(thisArg, arg1, arg2, ...)   // вызов немедленно
fn.apply(thisArg, [arg1, arg2, ...]) // вызов немедленно
fn.bind(thisArg, arg1, arg2, ...)    // возвращает новую функцию
```

### Как это работает

```javascript
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

const user = { name: 'Alice' };

// call — аргументы перечислены
greet.call(user, 'Hello', '!');   // "Hello, Alice!"

// apply — аргументы массивом
greet.apply(user, ['Hi', '.']);   // "Hi, Alice."

// bind — создаёт новую функцию
const boundGreet = greet.bind(user, 'Hey');
boundGreet('?');                  // "Hey, Alice?"
boundGreet('!');                  // "Hey, Alice!" — 'Hey' зафиксирован
```

### Ключевые различия

| | `call` | `apply` | `bind` |
|--|--------|---------|--------|
| Вызов | Немедленный | Немедленный | Отложенный (возвращает функцию) |
| Аргументы | Перечисленные | Массив/array-like | Перечисленные (частичное применение) |
| Возвращает | Результат функции | Результат функции | Новую функцию |
| `this` | Задаётся | Задаётся | Фиксируется |

### Практика и применение

**`call`** — когда аргументы уже известны поштучно:
```javascript
// Заимствование метода
const maxVal = Math.max.call(null, ...numbersArr);
Array.prototype.slice.call(arguments); // конвертация псевдомассива
```

**`apply`** — когда аргументы уже в массиве:
```javascript
// Устаревший spread до ES6
Math.max.apply(null, [1, 5, 3, 9]); // 9
// В современном коде: Math.max(...[1, 5, 3, 9])
```

**`bind`** — для создания обработчиков с контекстом:
```javascript
class Button {
  constructor(label) {
    this.label = label;
    this.handleClick = this.handleClick.bind(this); // фиксируем this для callback
  }
  handleClick() {
    console.log(this.label);
  }
}
```

**Частичное применение через `bind`:**
```javascript
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2); // a=2 зафиксирован
double(5);  // 10
double(10); // 20
```

### Важные нюансы и краеугольные камни

- `bind` нельзя переопределить повторным `bind`, `call` или `apply` — `this` зафиксирован навсегда.
- У стрелочных функций `call`/`apply`/`bind` не меняют `this` — только аргументы.
- `bind` создаёт новую функцию при каждом вызове — в React передача `fn.bind(this, arg)` напрямую в JSX создаёт новый объект при каждом рендере → антипаттерн.
- `call`/`apply` с `null` или `undefined` в non-strict mode → `this = globalThis`; в strict mode → `null`/`undefined`.

### Примеры

```javascript
// Мнемоника: call = comma, apply = array

// Полезный паттерн: заимствование методов
function logArgs() {
  const args = Array.prototype.slice.call(arguments);
  console.log(args.join(', '));
}
logArgs(1, 2, 3); // "1, 2, 3"

// bind в React (устаревший паттерн)
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { on: false };
    this.toggle = this.toggle.bind(this); // ✓ один раз в конструкторе
  }
  toggle() { this.setState(s => ({ on: !s.on })); }
  render() {
    return <button onClick={this.toggle}>{this.state.on ? 'ON' : 'OFF'}</button>;
  }
}

// Современная альтернатива — стрелочное поле
class ToggleModern extends React.Component {
  state = { on: false };
  toggle = () => this.setState(s => ({ on: !s.on })); // this автоматически
}
```

---

## Сравнение

| Критерий | `.call()` | `.apply()` | `.bind()` |
|----------|-----------|------------|-----------|
| Вызов | Немедленно | Немедленно | Создаёт функцию |
| Аргументы | Через запятую | Массивом | Через запятую (фиксируются) |
| Возврат | Результат | Результат | Новая функция |
| Применение | Заимствование методов | Variadic функции | Обработчики, partial application |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что если передать `null` в `call`?** — В strict mode `this = null`; в sloppy mode `this = globalThis`.
- **Почему `bind` в JSX-пропах — антипаттерн?** — Каждый ре-рендер создаёт новую функцию → shallow compare считает пропы изменёнными → ненужные ре-рендеры дочернего компонента.
- **Можно ли `apply` заменить spread-оператором?** — Да: `fn.call(ctx, ...arr)` вместо `fn.apply(ctx, arr)`.

### Красные флаги (чего не говорить)

- «`bind` вызывает функцию» — нет, возвращает новую функцию.
- «`call` и `apply` — одно и то же» — отличаются способом передачи аргументов.

### Связанные темы

- `033-chto-oboznachaet-this-v-javascript.md`
- `025-raznica-mezhdu-parametrom-i-argumentom.md`
- `036-chto-takoe-karrirovanie-currying.md`
