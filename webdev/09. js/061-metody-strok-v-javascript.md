# Q061. Методы строк в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

JavaScript предоставляет богатый API строк через `String.prototype`: поиск (`indexOf`, `includes`, `startsWith`, `endsWith`), извлечение (`slice`, `substring`), преобразование (`toUpperCase`, `toLowerCase`, `trim`, `replace`, `replaceAll`), разбиение (`split`), форматирование (`padStart`, `padEnd`, `repeat`), работа с символами (`charAt`, `charCodeAt`, `at`). Все строковые методы возвращают новую строку — строки иммутабельны.

---

## Развёрнутый ответ

### Поиск и проверка

```javascript
const str = "Hello, World!";

// Поиск индекса
str.indexOf("World");        // 7
str.indexOf("world");        // -1 (регистрозависимо)
str.lastIndexOf("l");        // 10

// Проверки (ES6)
str.includes("World");       // true
str.startsWith("Hello");     // true
str.endsWith("!");           // true
str.startsWith("World", 7);  // true — с позиции 7
```

### Извлечение подстроки

```javascript
const str = "Hello, World!";

str.slice(7, 12);      // "World" — отрицательные индексы работают
str.slice(-6);         // "World!" — с конца
str.substring(7, 12);  // "World" — отрицательные приводятся к 0

// Одиночный символ
str[0];           // "H"
str.charAt(0);    // "H"
str.at(-1);       // "!" — ES2022, поддержка отрицательных
```

### Преобразование

```javascript
"hello".toUpperCase();    // "HELLO"
"HELLO".toLowerCase();    // "hello"

"  hello  ".trim();       // "hello"
"  hello  ".trimStart();  // "hello  "
"  hello  ".trimEnd();    // "  hello"

"hello".replace("l", "L");    // "heLlo" — только первое
"hello".replaceAll("l", "L"); // "heLLo" — ES2021
"hello".replace(/l/g, "L");   // "heLLo" — regex с флагом g

// Template с replace + функция
"hello world".replace(/\b\w/g, c => c.toUpperCase()); // "Hello World"
```

### Разбиение и объединение

```javascript
"a,b,c".split(",");        // ["a", "b", "c"]
"hello".split("");         // ["h", "e", "l", "l", "o"]
"a  b  c".split(/\s+/);   // ["a", "b", "c"] — regex

["a", "b", "c"].join("-"); // "a-b-c" — Array.join (не метод строки)
```

### Форматирование и повторение

```javascript
"5".padStart(3, "0");    // "005" — лидирующие нули
"5".padEnd(3, "0");      // "500"
"abc".padStart(5);       // "  abc" — пробелы по умолчанию

"ha".repeat(3);          // "hahaha"
```

### Работа с Unicode и символами

```javascript
const str = "Hello";
str.length;               // 5 (кол-во UTF-16 кодовых единиц)
str.charCodeAt(0);        // 72 (код символа H)
str.codePointAt(0);       // 72 (ES6, правильно работает с emoji)
String.fromCharCode(72);  // "H"
String.fromCodePoint(128512); // "😀"

// Emoji занимает 2 UTF-16 единицы!
"😀".length;              // 2 — неожиданно!
[..."😀"].length;          // 1 — правильно через итератор
```

### ES2022+

```javascript
// at() — поддержка отрицательных индексов
"hello".at(-1);  // "o"
"hello".at(0);   // "h"
```

### Важные нюансы

- Строки иммутабельны — все методы возвращают новую строку.
- `slice` vs `substring`: `slice(-3)` работает с конца, `substring(-3)` трактует как 0.
- `trim` удаляет пробелы, символы табуляции, переносы строк (все whitespace).
- `replace` с первым аргументом-строкой заменяет **только первое** вхождение.

### Примеры

```javascript
// Форматирование номера телефона
function formatPhone(digits) {
  return digits
    .replace(/\D/g, '')  // убрать не-цифры
    .replace(/(\d{3})(\d{3})(\d{4})/, '+7 ($1) $2-$3');
}
formatPhone('89161234567'); // "+7 (916) 123-4567"

// Безопасное сокращение текста
function truncate(text, maxLength, ellipsis = '...') {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}
truncate('Hello, World!', 8); // "Hello..."
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `"😀".length === 2`?** — Emoji — surrogate pair в UTF-16; длина считает кодовые единицы, не символы.
- **Чем `slice` отличается от `substring`?** — `slice` поддерживает отрицательные индексы (с конца); `substring` — нет.
- **Как `replace` с функцией-обработчиком используется на практике?** — Динамическая замена на основе совпадения: форматирование, шаблонизация.

### Красные флаги (чего не говорить)

- «`replace` заменяет все вхождения» — без флага `g` или `replaceAll` — только первое.
- «Строки имеют метод `reverse()`» — нет; нужно `str.split('').reverse().join('')`.

### Связанные темы

- `071-chto-takoe-regulyarnoe-vyrazhenie.md`
- `062-metody-massivov-v-javascript.md`
