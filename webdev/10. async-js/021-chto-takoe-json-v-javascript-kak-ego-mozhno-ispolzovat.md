# Q021. Что такое JSON в JavaScript? Как его можно использовать?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

JSON (JavaScript Object Notation) — текстовый формат обмена данными, основанный на синтаксисе JS-объектов, но являющийся независимым стандартом (RFC 8259). В JavaScript работа с JSON ведётся через встроенный объект `JSON` с двумя ключевыми методами: `JSON.stringify()` (объект → строка) и `JSON.parse()` (строка → объект). JSON — стандарт де-факто для API-коммуникации в вебе.

---

## Развёрнутый ответ

### Суть и определение

JSON разработал Дуглас Крокфорд в начале 2000-х как альтернативу XML для передачи данных. Несмотря на похожесть с JS-объектами, JSON — отдельный формат со строгими правилами:

**Допустимые типы JSON:**

| JSON тип | JS эквивалент |
|----------|---------------|
| `string` | `string` |
| `number` | `number` (без `Infinity`, `NaN`) |
| `boolean` | `boolean` |
| `null` | `null` |
| `object` | `object` (без методов, без `undefined`) |
| `array` | `Array` |

**Ключи** — только строки в двойных кавычках.

### Как это работает

**`JSON.stringify(value, replacer?, space?)`** — сериализация:

```javascript
JSON.stringify({ name: 'Alice', age: 30 });
// '{"name":"Alice","age":30}'

JSON.stringify(data, null, 2); // 2 пробела для читаемости
```

**`JSON.parse(text, reviver?)`** — десериализация:

```javascript
JSON.parse('{"name":"Alice","age":30}');
// { name: 'Alice', age: 30 }
```

**Что теряется при сериализации:**

- `undefined` значения в объектах — пропускаются
- Методы (функции) — пропускаются
- `Symbol` ключи — пропускаются
- `Infinity`, `NaN` → `null`
- `Date` → строка ISO (при парсинге обратно — строка, не Date!)
- Циклические ссылки → `TypeError`

### Практика и применение

- **API-коммуникация** — `fetch('/api').then(r => r.json())` — встроенный метод `Response`.
- **localStorage** — браузер хранит только строки: `localStorage.setItem('user', JSON.stringify(user))`.
- **Deep copy (поверхностное решение)** — `JSON.parse(JSON.stringify(obj))` — быстрый способ, но теряет функции, `Date`, `undefined`.
- **Конфигурационные файлы** — `package.json`, `tsconfig.json`, `.eslintrc`.
- **Логирование** — `JSON.stringify(error, null, 2)` для структурированных логов.

### Важные нюансы и краеугольные камни

- `JSON.parse()` выбрасывает `SyntaxError` при невалидном JSON — всегда оборачивайте в `try/catch`.
- `Date` при `JSON.stringify` превращается в строку ISO 8601. `JSON.parse` обратно строку в `Date` не конвертирует — нужен `reviver`.
- Циклические ссылки в объекте — `TypeError: Converting circular structure to JSON`. Решение: `replacer`-функция или библиотека `flatted`.
- `JSON.stringify` с `replacer` позволяет контролировать сериализацию — фильтровать поля, трансформировать значения.
- Метод `toJSON()` на объекте — позволяет кастомизировать сериализацию: `JSON.stringify` вызовет его автоматически.

### Примеры

```javascript
// Базовое использование
const user = { name: 'Alice', age: 30, admin: false };

const jsonString = JSON.stringify(user);
// '{"name":"Alice","age":30,"admin":false}'

const parsed = JSON.parse(jsonString);
// { name: 'Alice', age: 30, admin: false }

// Потери при сериализации
const data = {
  name: 'Alice',
  greet: () => 'Hello',    // функция — пропускается
  id: Symbol('id'),        // Symbol — пропускается
  value: undefined,        // undefined — пропускается
  score: NaN,              // NaN → null
  infinity: Infinity,      // Infinity → null
};
console.log(JSON.stringify(data));
// '{"name":"Alice","score":null,"infinity":null}'

// Дата — теряется тип
const event = { date: new Date('2024-01-01') };
const str = JSON.stringify(event);
// '{"date":"2024-01-01T00:00:00.000Z"}'
const back = JSON.parse(str);
// { date: "2024-01-01T00:00:00.000Z" }  ← строка, не Date!

// Reviver для восстановления дат
const withDates = JSON.parse(str, (key, value) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
});
// { date: Date object }

// Безопасный парсинг
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// replacer — фильтрация чувствительных полей
const userWithPassword = { name: 'Alice', password: 'secret', age: 30 };
const safe = JSON.stringify(userWithPassword, (key, value) => {
  if (key === 'password') return undefined; // исключаем
  return value;
});
// '{"name":"Alice","age":30}'

// toJSON — кастомная сериализация
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  toJSON() {
    return `${this.amount} ${this.currency}`;
  }
}
JSON.stringify({ price: new Money(100, 'USD') });
// '{"price":"100 USD"}'

// localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadFromStorage(key, fallback = null) {
  return safeJsonParse(localStorage.getItem(key), fallback);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как сделать глубокую копию объекта через JSON?** — `JSON.parse(JSON.stringify(obj))` — быстро, но теряет функции, `Date`, `undefined`, `Symbol`; современная альтернатива — `structuredClone(obj)`.
- **Как обработать `Date` при JSON сериализации?** — `reviver` в `JSON.parse`, или `toJSON` на объекте Date, или библиотека `date-fns`.
- **Что такое JSONP и зачем он был нужен?** — Обход CORS через `<script src>` (тег script не ограничен SOP); устарел, заменён CORS.
- **Чем JSON отличается от JS-объекта?** — JSON: только строковые ключи в кавычках, нет функций/Symbol/undefined, нет trailing commas; JS-объект: произвольные ключи, методы, Symbol.

### Красные флаги (чего не говорить)

- «JSON — это JavaScript» — JSON независимый формат данных, используемый и в других языках.
- «`JSON.parse` безопасен для любой строки» — выбрасывает `SyntaxError` на невалидном JSON, нужен `try/catch`.
- «`JSON.stringify(new Date())` вернёт Date-объект при парсинге» — нет, вернёт строку ISO.

### Связанные темы

- `020-chto-takoe-fetch-kak-rabotaet-funkciya-fetch.md`
- `018-chto-takoe-ajax.md`
