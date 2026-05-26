# Q033. Для чего используются методы `.padStart()` и `.padEnd()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`String.prototype.padStart(targetLength, padString)` и `String.prototype.padEnd(targetLength, padString)` (ES2017) дополняют строку символами до заданной длины — слева и справа соответственно. По умолчанию заполняют пробелами. Возвращают новую строку, не мутируя оригинал.

---

## Развёрнутый ответ

### Суть и определение

Оба метода:
- `targetLength` — желаемая итоговая длина строки
- `padString` — строка-заполнитель (по умолчанию `' '`)
- Если строка уже длиннее `targetLength` — возвращается без изменений
- Если `padString` длиннее нужного — обрезается справа

### Практика и применение

**Форматирование чисел:**
```javascript
// Выравнивание числовых колонок
'5'.padStart(3, '0');    // '005'
'42'.padStart(3, '0');   // '042'
'100'.padStart(3, '0');  // '100'

// Форматирование времени
const h = '9', m = '5', s = '3';
const time = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
// '09:05:03'
```

**Выравнивание текста:**
```javascript
// Таблица в консоли
const data = [['Name', 'Score'], ['Alice', '95'], ['Bob', '100'], ['Charlie', '87']];
data.forEach(([name, score]) => {
  console.log(`${name.padEnd(12)}${score.padStart(5)}`);
});
// Name           95
// Alice          95
// Bob           100
// Charlie        87
```

**Маскирование данных:**
```javascript
function maskCard(cardNumber) {
  const last4 = cardNumber.slice(-4);
  return last4.padStart(cardNumber.length, '*');
}
maskCard('1234567890123456'); // '************3456'

function maskEmail(email) {
  const [name, domain] = email.split('@');
  return name[0] + '***'.padEnd(name.length - 1, '*') + '@' + domain;
}
```

**ID с фиксированной шириной:**
```javascript
const formatId = (id, width = 6) => String(id).padStart(width, '0');
formatId(1);    // '000001'
formatId(1234); // '001234'
```

### Важные нюансы и краеугольные камни

- **`padString` обрезается**, если не помещается в остаток:
  ```javascript
  'abc'.padStart(6, '123'); // '123abc'
  'abc'.padStart(5, '123'); // '12abc' — '123' обрезается до '12'
  ```
- **Если строка уже >= `targetLength`** — возвращается без изменений (не обрезается!).
  ```javascript
  'hello'.padStart(3); // 'hello' — не обрезает
  ```
- **Unicode**: метод работает с кодовыми единицами, не кодовыми точками. Символы > U+FFFF (эмодзи) занимают 2 единицы.
- **Не мутирует**: возвращает новую строку.

### Примеры

```javascript
// Hex-представление с ведущими нулями
const toHex = n => n.toString(16).toUpperCase().padStart(8, '0');
toHex(255);      // '000000FF'
toHex(16777215); // '00FFFFFF'

// Binary padding
const toBinary = n => n.toString(2).padStart(8, '0');
toBinary(5);   // '00000101'
toBinary(255); // '11111111'

// Прогресс-бар в консоли
function progressBar(percent, width = 20) {
  const filled = Math.round(percent / 100 * width);
  const bar = '█'.repeat(filled).padEnd(width, '░');
  return `[${bar}] ${String(percent).padStart(3)}%`;
}
progressBar(0);   // '[░░░░░░░░░░░░░░░░░░░░]   0%'
progressBar(50);  // '[██████████░░░░░░░░░░]  50%'
progressBar(100); // '[████████████████████] 100%'

// Форматирование времени для filename
const now = new Date();
const timestamp = [
  String(now.getFullYear()),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
  String(now.getHours()).padStart(2, '0'),
  String(now.getMinutes()).padStart(2, '0'),
].join('-');
// '2026-05-26-17-00'
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт если строка длиннее `targetLength`?** — Вернётся без изменений, метод не обрезает.
- **Что если `padString` длиннее остатка?** — Обрезается справа до нужного количества символов.
- **Как добавить ведущие нули к числу?** — `String(num).padStart(5, '0')` или `num.toString().padStart(5, '0')`.

### Красные флаги (чего не говорить)

- «`padStart` мутирует строку» — нет, строки иммутабельны; возвращает новую.
- «`padStart` обрезает строку если она длиннее» — нет, возвращает как есть.

### Связанные темы

- [`034-metody-startswith-i-endswith.md`](034-metody-startswith-i-endswith.md)
- [`036-udalenie-probelnyh-simvolov-trim.md`](036-udalenie-probelnyh-simvolov-trim.md)
- [`011-chto-takoe-shablonnye-literaly-template-literals.md`](011-chto-takoe-shablonnye-literaly-template-literals.md)
