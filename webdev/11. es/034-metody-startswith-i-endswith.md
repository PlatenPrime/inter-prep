# Q034. Для чего используются методы `.startsWith()` и `.endsWith()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`String.prototype.startsWith(searchString, position)` и `String.prototype.endsWith(searchString, length)` (ES2015) проверяют, начинается или заканчивается ли строка заданной подстрокой, возвращая `boolean`. Являются более выразительной и семантически понятной заменой `indexOf === 0` и `slice(-n) === suffix`.

---

## Развёрнутый ответ

### Суть и определение

**`str.startsWith(searchString, position)`:**
- `position` — позиция, с которой начинается поиск (по умолчанию 0)
- Чувствительно к регистру

**`str.endsWith(searchString, length)`:**
- `length` — рассматривать строку как будто она длиной `length` символов (по умолчанию `str.length`)
- Чувствительно к регистру

### Практика и применение

```javascript
// Базовые примеры
'Hello, World'.startsWith('Hello');       // true
'Hello, World'.startsWith('World');       // false
'Hello, World'.startsWith('World', 7);   // true — проверяем с позиции 7

'Hello, World'.endsWith('World');         // true
'Hello, World'.endsWith('Hello');         // false
'Hello, World'.endsWith('Hello', 5);     // true — рассматриваем первые 5 символов

// Регистр
'Hello'.startsWith('hello');             // false — чувствительно
'Hello'.toLowerCase().startsWith('hello'); // true — с явным приведением
```

**Маршрутизация / обработка URL:**
```javascript
// Роутер
function handleRequest(path) {
  if (path.startsWith('/api/')) return handleApi(path);
  if (path.startsWith('/admin/')) return handleAdmin(path);
  if (path.endsWith('.html')) return serveStatic(path);
  return handle404();
}

// Проверка типа файла
function getFileType(filename) {
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.css')) return 'stylesheet';
  return 'unknown';
}
```

**Валидация и парсинг:**
```javascript
// Проверка формата
const isHttps = url => url.startsWith('https://');
const isEmail = str => !str.startsWith(' ') && str.includes('@');
const isRelativePath = path => path.startsWith('./') || path.startsWith('../');

// Нормализация путей
function ensureTrailingSlash(path) {
  return path.endsWith('/') ? path : path + '/';
}
function removeLeadingSlash(path) {
  return path.startsWith('/') ? path.slice(1) : path;
}
```

**Фильтрация:**
```javascript
const keys = Object.keys(config);
const publicKeys = keys.filter(k => !k.startsWith('_'));
const apiKeys = keys.filter(k => k.startsWith('api') || k.startsWith('API'));
```

### Важные нюансы и краеугольные камни

- **Оба чувствительны к регистру** — нет флага `i`. Для нечувствительного поиска: `.toLowerCase().startsWith(...)`.
- **`endsWith(str, length)` — второй аргумент — длина**, не индекс. `str.endsWith('o', 5)` проверяет, заканчивается ли `str.slice(0, 5)` на `'o'`.
- **Пустая строка**: `'abc'.startsWith('')` → `true`. Любая строка начинается и заканчивается пустой строкой.
- **vs RegEx**: для простых проверок `startsWith`/`endsWith` читабельнее и быстрее; для сложных паттернов — RegExp.
- **TypeScript**: типизированы корректно, не требуют дополнительных приведений.

### Примеры

```javascript
// Перед ES2015 (громоздко)
str.indexOf('prefix') === 0;             // startsWith
str.lastIndexOf('suffix') === str.length - 'suffix'.length; // endsWith (с ошибками)
str.slice(-'suffix'.length) === 'suffix'; // чище, но всё равно менее читаемо

// ES2015 (чисто)
str.startsWith('prefix');
str.endsWith('suffix');

// Протокол URL
const protocols = ['https://', 'http://', 'ftp://'];
function getProtocol(url) {
  return protocols.find(p => url.startsWith(p)) ?? 'unknown';
}

// Markdown парсинг заголовков
function parseHeading(line) {
  if (line.startsWith('### ')) return { level: 3, text: line.slice(4) };
  if (line.startsWith('## '))  return { level: 2, text: line.slice(3) };
  if (line.startsWith('# '))   return { level: 1, text: line.slice(2) };
  return null;
}

// Поиск по расширениям
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
const isImage = filename => imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
isImage('photo.JPG');  // true
isImage('doc.pdf');    // false
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что означает второй аргумент `endsWith(str, length)`?** — Рассматривать строку как будто она обрезана до `length` символов.
- **Чувствительны ли к регистру?** — Да; для case-insensitive нужно `str.toLowerCase().startsWith(...)`.
- **Что вернёт `'abc'.startsWith('')`?** — `true`: пустая строка — подстрока любой строки.
- **Когда использовать RegEx вместо `startsWith`?** — Когда нужен паттерн (`/^https?:\/\//`), множество вариантов или флаг `i`.

### Красные флаги (чего не говорить)

- «`startsWith` нечувствителен к регистру» — нет, чувствителен.
- «`endsWith(str, length)` — второй аргумент это индекс» — нет, это длина строки для рассмотрения.

### Связанные темы

- [`032-dlya-chego-metod-includes.md`](032-dlya-chego-metod-includes.md)
- [`035-dlya-chego-metod-replaceall.md`](035-dlya-chego-metod-replaceall.md)
