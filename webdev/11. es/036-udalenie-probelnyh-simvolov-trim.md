# Q036. Как в JavaScript удалять пробельные символы в начале и в конце строки?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`String.prototype.trim()` удаляет пробельные символы с обоих концов строки. ES2019 добавил `trimStart()` (или алиас `trimLeft()`) — только начало, и `trimEnd()` (или `trimRight()`) — только конец. Все три метода возвращают новую строку, не мутируя оригинал.

---

## Развёрнутый ответ

### Суть и определение

**Пробельные символы (whitespace)**, которые удаляют `trim*` методы:
- Пробел `' '` (U+0020)
- Горизонтальная табуляция `\t` (U+0009)
- Перевод строки `\n` (U+000A)
- Возврат каретки `\r` (U+000D)
- Другие Unicode whitespace: `\v`, `\f`, `\u00A0`, `\u2028`, `\u2029` и т.д.

| Метод | Синоним | Действие |
|-------|---------|----------|
| `str.trim()` | — | Удалить с обоих концов |
| `str.trimStart()` | `str.trimLeft()` | Удалить только спереди |
| `str.trimEnd()` | `str.trimRight()` | Удалить только сзади |

`trimLeft`/`trimRight` — нестандартные алиасы (но поддерживаются везде). Предпочтительны `trimStart`/`trimEnd`.

### Практика и применение

```javascript
// Базовое использование
'  Hello, World!  '.trim();       // 'Hello, World!'
'  Hello, World!  '.trimStart();  // 'Hello, World!  '
'  Hello, World!  '.trimEnd();    // '  Hello, World!'

// Многострочный текст
'  \n  text  \n  '.trim(); // 'text'
```

**Обработка пользовательского ввода:**
```javascript
function validateEmail(input) {
  const email = input.trim(); // убрать случайные пробелы
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Нормализация формы
function processForm(formData) {
  return Object.fromEntries(
    Object.entries(formData).map(([k, v]) => [
      k,
      typeof v === 'string' ? v.trim() : v,
    ])
  );
}
```

**Парсинг текста:**
```javascript
// Построчный парсинг
const lines = multilineText
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0); // убрать пустые строки

// CSV
const csv = '  Alice  ,  30  ,  NY  ';
const values = csv.split(',').map(v => v.trim());
// ['Alice', '30', 'NY']
```

**`trimStart` — удаление отступов в коде:**
```javascript
// Нормализация отступов
const code = `
    function hello() {
        console.log('Hi');
    }
`;
const lines = code.split('\n').map(l => l.trimStart());
```

### Важные нюансы и краеугольные камни

- **Не мутирует строку** — всегда новая строка.
- **`trimLeft`/`trimRight`** — нестандартные алиасы, но поддерживаются в V8, SpiderMonkey. Лучше использовать `trimStart`/`trimEnd`.
- **Удаляет все whitespace**, включая Unicode-пробелы (`\u00A0` — non-breaking space). Иногда это нежелательно (в некоторых контекстах NBSP нужен).
- **Для удаления только обычных пробелов** — RegExp: `str.replace(/^ +| +$/g, '')`.
- **`trim()` не влияет на внутренние пробелы** — только края.

### Примеры

```javascript
// Примеры с различными whitespace символами
'\t  \n hello \n  \t'.trim();    // 'hello'
'\u00A0hello\u00A0'.trim();      // 'hello' — non-breaking space тоже убирается

// Сравнение методов
const str = '   hello   ';
str.trim();       // 'hello'
str.trimStart();  // 'hello   '
str.trimEnd();    // '   hello'

// Нормализация пробелов (trim + collapse internal)
function normalizeWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ');
}
normalizeWhitespace('  hello   world  \n  '); // 'hello world'

// Trim при работе с промисами/async
async function fetchAndProcess(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text.trim(); // убрать trailing newline из файлов
}

// Проверка что строка не пустая (после trim)
function isNonEmpty(str) {
  return str.trim().length > 0;
}
isNonEmpty('   ');   // false
isNonEmpty('  a  '); // true
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Удаляет ли `trim` внутренние пробелы?** — Нет, только с краёв. Для нормализации внутренних — `.replace(/\s+/g, ' ')`.
- **Какие символы считаются whitespace?** — Пробел, `\t`, `\n`, `\r`, `\v`, `\f` и Unicode whitespace (`\u00A0` и т.д.).
- **Чем `trimStart` отличается от `trimLeft`?** — Синонимы; `trimStart`/`trimEnd` — стандартные (ES2019), `trimLeft`/`trimRight` — нестандартные алиасы.

### Красные флаги (чего не говорить)

- «`trim` удаляет все пробелы в строке» — только с краёв.
- «`trim` мутирует строку» — нет, строки иммутабельны.
- «`trimLeft` — стандартный метод» — нестандартный алиас; предпочитать `trimStart`.

### Связанные темы

- [`033-metody-padstart-i-padend.md`](033-metody-padstart-i-padend.md)
- [`035-dlya-chego-metod-replaceall.md`](035-dlya-chego-metod-replaceall.md)
