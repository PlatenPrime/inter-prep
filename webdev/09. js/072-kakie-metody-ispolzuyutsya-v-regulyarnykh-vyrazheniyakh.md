# Q072. Какие методы используются в регулярных выражениях?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Методы делятся на два типа: **методы RegExp объекта** (`test`, `exec`) и **методы строки, принимающие RegExp** (`match`, `matchAll`, `search`, `replace`, `replaceAll`, `split`). `test` — быстрая проверка наличия; `exec` — детальный результат одного совпадения; `match`/`matchAll` — все совпадения; `replace` — замена.

---

## Развёрнутый ответ

### Методы RegExp

**`regexp.test(string)`** — возвращает `boolean`:
```javascript
/\d+/.test('abc123');   // true
/\d+/.test('abcdef');   // false

// Использование в условиях
if (/^[a-z]+$/.test(input)) {
  console.log('Only lowercase letters');
}
```

**`regexp.exec(string)`** — возвращает массив деталей или `null`:
```javascript
const re = /(\d{4})-(\d{2})/;
const result = re.exec('2025-05-26');
// ['2025-05', '2025', '05', index: 0, input: '2025-05-26', groups: undefined]

result[0];     // "2025-05" — полное совпадение
result[1];     // "2025" — первая группа
result.index;  // 0 — позиция в строке

// С флагом /g — итерирует по совпадениям
const reG = /\d+/g;
let match;
while ((match = reG.exec('abc 123 def 456')) !== null) {
  console.log(match[0], match.index); // "123" 4, "456" 12
}
```

### Методы строк с RegExp

**`string.match(regexp)`**:
```javascript
// Без флага g — первое совпадение (как exec)
'hello world'.match(/\w+/);
// ['hello', index: 0, ...]

// С флагом g — все совпадения (без деталей)
'hello world'.match(/\w+/g);
// ['hello', 'world']

// Без совпадения
'123'.match(/[a-z]/g); // null — не []!
```

**`string.matchAll(regexp)`** — ES2020, итератор всех совпадений с группами:
```javascript
const re = /(?<word>\w+)/g; // обязателен флаг g
const matches = [...'hello world'.matchAll(re)];
// [
//   { 0: 'hello', groups: { word: 'hello' }, index: 0 },
//   { 0: 'world', groups: { word: 'world' }, index: 6 }
// ]
```

**`string.search(regexp)`** — возвращает индекс первого совпадения (или `-1`):
```javascript
'hello world'.search(/world/);  // 6
'hello world'.search(/xyz/);    // -1
```

**`string.replace(regexp, replacement)`**:
```javascript
// Строковая замена
'hello'.replace(/l/g, 'L');    // "heLLo"

// Функция-обработчик
'2025-05-26'.replace(
  /(\d{4})-(\d{2})-(\d{2})/,
  (match, y, m, d) => `${d}.${m}.${y}`
); // "26.05.2025"

// Именованные группы
'hello world'.replace(/(?<word>\w+)/g, (m, g, offset, str, groups) => {
  return groups.word.toUpperCase();
}); // "HELLO WORLD"
```

**`string.replaceAll(regexp, replacement)`** — ES2021, требует флаг `g`:
```javascript
'a.b.c'.replaceAll('.', '-');       // строка: "a-b-c"
'a.b.c'.replaceAll(/\./g, '-');     // regex с g: "a-b-c"
```

**`string.split(regexp)`**:
```javascript
'one, two,  three'.split(/,\s*/); // ['one', 'two', 'three']
'a1b2c3'.split(/\d/);            // ['a', 'b', 'c', '']
```

### Практика и применение

```javascript
// Парсинг CSV
function parseCSVLine(line) {
  return line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
}

// Валидация и извлечение данных
function parseISO(dateStr) {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error('Invalid date format');
  const [, year, month, day] = match;
  return new Date(+year, +month - 1, +day);
}

// Highlight совпадений
function highlight(text, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}
```

### Важные нюансы и краеугольные камни

- `match(re)` без `g` аналогичен `exec(re)` по содержимому.
- `match(re)` с `g` не возвращает детали групп — используйте `matchAll`.
- `matchAll` требует флаг `g` — иначе `TypeError`.
- Для экранирования пользовательского ввода в RegExp используйте: `str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `matchAll` лучше `match`?** — Возвращает детали каждого совпадения (группы, index); `match(/g)` возвращает только строки.
- **Что вернёт `'abc'.match(/[0-9]/g)`?** — `null` (не пустой массив).
- **Почему нужно экранировать пользовательский ввод перед передачей в RegExp?** — Специальные символы `.`, `*`, `+`, `?` и др. имеют специальное значение; без экранирования — ReDOS или неожиданные совпадения.

### Красные флаги (чего не говорить)

- «`match` без g и `matchAll` — одно и то же» — `matchAll` всегда возвращает итератор всех совпадений с деталями; `match` без `g` — только первое.

### Связанные темы

- `071-chto-takoe-regulyarnoe-vyrazhenie.md`
- `061-metody-strok-v-javascript.md`
