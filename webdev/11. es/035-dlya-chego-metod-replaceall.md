# Q035. Для чего используется метод `.replaceAll()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`String.prototype.replaceAll(searchValue, replaceValue)` (ES2021) заменяет **все** вхождения строки или RegExp с флагом `g`, возвращая новую строку. До ES2021 для замены всех вхождений нужно было использовать RegExp с флагом `/g`, что требовало экранирования спецсимволов при строковом поиске.

---

## Развёрнутый ответ

### Суть и определение

`String.prototype.replace(search, replacement)` заменяет только **первое** вхождение строки (для замены всех — только RegExp с `/g`).

`replaceAll` — специализированный метод: заменяет **все** вхождения строки без регулярных выражений.

```javascript
// До ES2021
'a.b.c'.replace(/\./g, '-');          // 'a-b-c' — RegExp с /g
'a.b.c'.split('.').join('-');         // 'a-b-c' — split/join трюк

// ES2021
'a.b.c'.replaceAll('.', '-');         // 'a-b-c' — чисто и явно
```

### Как это работает

`replaceAll(searchValue, replaceValue)`:
- Если `searchValue` — строка: заменяет все вхождения дословно
- Если `searchValue` — RegExp: **требует флаг `/g`**, иначе `TypeError`
- `replaceValue` — строка или функция `(match, ...groups, offset, str) => replacement`

### Практика и применение

```javascript
// Замена специальных символов в пути
const path = 'C:\\Users\\Alice\\Documents';
path.replaceAll('\\', '/'); // 'C:/Users/Alice/Documents'

// Замена в шаблоне
const template = 'Hello, {{name}}! Your code is {{code}}.';
const filled = template
  .replaceAll('{{name}}', 'Alice')
  .replaceAll('{{code}}', 'ABC123');
// 'Hello, Alice! Your code is ABC123.'

// HTML-экранирование
function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Нормализация разделителей
const csv = 'a,,b,,c';
csv.replaceAll(',,', ','); // 'a,b,c'
```

**С функцией замены:**
```javascript
// Маскирование данных
const text = 'Call 123-456-7890 or 098-765-4321';
text.replaceAll(/\d{3}-\d{3}-\d{4}/g, match =>
  match.slice(0, -4) + '****'
);
// 'Call 123-456-**** or 098-765-****'
```

### Важные нюансы и краеугольные камни

- **RegExp без `/g` → TypeError**: `'abc'.replaceAll(/a/, 'x')` → TypeError. Намеренное ограничение — `replaceAll` должен быть глобальным.
- **Замена строки — буквальная**, не RegExp: точки, скобки, `^`, `$` — не интерпретируются как спецсимволы. Это главное преимущество над `/pattern/g`.
- **Не мутирует** исходную строку — возвращает новую.
- **Паттерны в `replaceValue`**: `$&` (совпавший текст), `$1`, `$2` (группы RegExp) — работают в строке замены.

### Примеры

```javascript
// Проблема с replace (строка) — заменяет только первое
'Hello World World'.replace('World', 'JS'); // 'Hello JS World' ← только первое!

// replaceAll — все вхождения
'Hello World World'.replaceAll('World', 'JS'); // 'Hello JS JS'

// Экранирование RegExp-спецсимволов не нужно с replaceAll(string)
const needle = 'a.b';
// replace: '.' — это любой символ в RegExp
'a.b a-b axb'.replace(needle, 'X');    // 'X a-b axb' (только первое, '.' = any)
'a.b a-b axb'.replaceAll(needle, 'X'); // 'X a-b axb' (все '.', буквально)
// Попробуем через RegExp:
'a.b a-b axb'.replace(/a\.b/g, 'X');   // 'X a-b axb' — тоже буквально, но требует экранирования

// Нормализация пробелов
function normalizeSpaces(str) {
  return str.replaceAll(/\s+/g, ' ').trim();
}
normalizeSpaces('  hello   world  '); // 'hello world'

// Slug генерация
function slugify(str) {
  return str
    .toLowerCase()
    .replaceAll(/[^\w\s-]/g, '')  // убрать спецсимволы
    .replaceAll(/\s+/g, '-')      // пробелы → дефисы
    .replaceAll(/-+/g, '-');       // схлопнуть дефисы
}
slugify('Hello, World! 123'); // 'hello-world-123'
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `replaceAll(regex)` требует флаг `/g`?** — Метод называется `replaceAll` — он должен быть глобальным по определению; без `/g` это противоречие.
- **Чем `replaceAll(string)` лучше `/pattern/g`?** — Не нужно экранировать спецсимволы RegExp; читабельнее при работе со строковыми паттернами.
- **Как заменить все символы, которые могут быть спецсимволами RegExp?** — `replaceAll(string)` — безопасно, или вручную экранировать для RegExp.

### Красные флаги (чего не говорить)

- «`replace` заменяет все вхождения» — нет, только первое при строковом аргументе.
- «`replaceAll` мутирует строку» — нет, строки иммутабельны.
- «`replaceAll` появился в ES2015» — нет, в ES2021.

### Связанные темы

- [`036-udalenie-probelnyh-simvolov-trim.md`](036-udalenie-probelnyh-simvolov-trim.md)
- [`034-metody-startswith-i-endswith.md`](034-metody-startswith-i-endswith.md)
- [`038-novovvedeniya-ecmascript-2021-es12.md`](038-novovvedeniya-ecmascript-2021-es12.md)
