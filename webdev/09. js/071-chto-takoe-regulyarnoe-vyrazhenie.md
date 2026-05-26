# Q071. Что такое регулярное выражение (Regular Expression)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Регулярное выражение (RegExp)** — шаблон для поиска, проверки и замены подстрок в тексте. В JavaScript создаётся через литерал `/pattern/flags` или конструктор `new RegExp(pattern, flags)`. Поддерживает флаги: `g` (global), `i` (case-insensitive), `m` (multiline), `s` (dotAll), `u` (Unicode), `d` (indices, ES2022).

---

## Развёрнутый ответ

### Синтаксис

```javascript
// Литерал (предпочтительно для статических паттернов)
const re1 = /hello/i;

// Конструктор (для динамических паттернов)
const pattern = 'hello';
const re2 = new RegExp(pattern, 'i');
const re3 = new RegExp(`\\b${pattern}\\b`, 'gi'); // экранирование!
```

### Основные метасимволы

```javascript
// Символьные классы
/[abc]/     // a, b или c
/[^abc]/    // НЕ a, b, c
/[a-z]/     // любая строчная буква
/\d/        // цифра [0-9]
/\D/        // не-цифра
/\w/        // слово [a-zA-Z0-9_]
/\W/        // не-слово
/\s/        // пробельный символ
/\S/        // не-пробельный
/./         // любой символ (кроме \n без флага s)

// Квантификаторы
/a*/        // 0 или больше a
/a+/        // 1 или больше a
/a?/        // 0 или 1 a
/a{3}/      // ровно 3 a
/a{2,4}/    // от 2 до 4 a
/a{2,}/     // 2 или больше a

// Жадность vs ленивость
/<.+>/      // жадный: захватывает максимум
/<.+?>/     // ленивый: захватывает минимум

// Якоря
/^hello/    // начало строки/строки
/world$/    // конец строки
/\bhello\b/ // граница слова

// Группы
/(abc)/     // захватывающая группа
/(?:abc)/   // не-захватывающая группа
/(?<name>abc)/ // именованная группа (ES2018)
```

### Флаги

```javascript
/pattern/g  // global — найти все совпадения
/pattern/i  // case insensitive
/pattern/m  // multiline — ^ и $ для каждой строки
/pattern/s  // dotAll — . включает \n
/pattern/u  // Unicode — корректная работа с суррогатными парами
/pattern/d  // indices — предоставить позиции совпадений (ES2022)
/pattern/gi // можно комбинировать
```

### Lookahead и Lookbehind

```javascript
/\d+(?= рублей)/   // lookahead: цифры перед " рублей"
/\d+(?! рублей)/   // negative lookahead
/(?<=₽)\d+/        // lookbehind: цифры после "₽"
/(?<!₽)\d+/        // negative lookbehind
```

### Практика

```javascript
// Валидация email (упрощённо)
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailRe.test('user@example.com'); // true

// Извлечение данных
const dateRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = '2025-05-26'.match(dateRe);
match.groups; // { year: '2025', month: '05', day: '26' }

// Замена с обработчиком
const camelToKebab = str =>
  str.replace(/([A-Z])/g, char => `-${char.toLowerCase()}`);
camelToKebab('helloWorld'); // "hello-world"
```

### Важные нюансы и краеугольные камни

- RegExp объект с флагом `g` **сохраняет состояние** (`lastIndex`) между вызовами `exec`. После исчерпания совпадений `lastIndex` сбрасывается в 0. Это ловушка при переиспользовании.
- `new RegExp(str)` не требует двойного экранирования в шаблонных строках, но в строке нужны `\\d` вместо `\d`.
- Флаг `u` обязателен для корректной работы с Unicode (emoji, символы > U+FFFF).

### Примеры

```javascript
// Ловушка с lastIndex у /g регулярок
const re = /a/g;
re.test('abc'); // true  (lastIndex = 1)
re.test('abc'); // true  (lastIndex = 2 — начинает с 1!)
re.test('abc'); // false (достиг конца)
re.test('abc'); // true  (сброс)

// Безопасный способ: создавать новый объект или использовать matchAll
const all = [...'abcabc'.matchAll(/a/g)];

// Unicode флаг
/^.$/u.test('😀');  // true — один символ
/^.$/.test('😀');   // false — два UTF-16 байта без u
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем нужен флаг `u`?** — Корректная работа с Unicode code points > U+FFFF (emoji, некоторые китайские символы).
- **Что такое `lastIndex` и когда это проблема?** — Флаг `g` сохраняет позицию поиска; при переиспользовании объекта RegExp результаты будут неожиданными.
- **Lookahead vs lookbehind?** — lookahead `(?=)` — следующее; lookbehind `(?<=)` — предыдущее.

### Красные флаги (чего не говорить)

- «Регулярки всегда медленнее, чем String методы» — для простых паттернов разница минимальна; для сложного поиска RegExp может быть быстрее.

### Связанные темы

- `072-kakie-metody-ispolzuyutsya-v-regulyarnykh-vyrazheniyakh.md`
- `061-metody-strok-v-javascript.md`
