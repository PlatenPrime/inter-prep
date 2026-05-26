# Q026. Разница между `for...of` и `for...in`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`for...in` перебирает **перечисляемые строковые ключи** объекта, включая унаследованные из прототипной цепочки — это источник багов. `for...of` перебирает **значения итерируемых объектов** (массивы, Set, Map, строки) и никогда не затрагивает прототипы. В современном коде `for...in` почти не используется — вместо него `Object.keys/entries` + `for...of` или `for...of` напрямую.

---

## Развёрнутый ответ

### Суть и определение

**`for...in`** (ES1):
- Перебирает **перечисляемые (enumerable) свойства** объекта
- Включает унаследованные свойства из `[[Prototype]]`
- Ключи всегда **строки** (даже для числовых индексов массива)
- Порядок не гарантирован для нечисловых ключей

**`for...of`** (ES2015):
- Перебирает **значения итерируемых объектов**
- Использует `[Symbol.iterator]` протокол
- Не затрагивает прототипную цепочку
- Порядок определён итерируемым

### Как это работает

```javascript
const arr = [10, 20, 30];
arr.custom = 'extra'; // добавили свойство

// for...in — перебирает ВСЕ enumerable ключи, включая custom
for (const key in arr) {
  console.log(key); // '0', '1', '2', 'custom' — строки!
}

// for...of — перебирает только значения итерируемого
for (const value of arr) {
  console.log(value); // 10, 20, 30 — нет 'extra'
}
```

### Практика и применение

**Для чего реально нужен `for...in`:**
```javascript
// Обход собственных свойств объекта (с проверкой!)
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    console.log(`${key}: ${obj[key]}`);
  }
}

// Отладка / инспекция неизвестного объекта
function inspectObject(obj) {
  for (const key in obj) {
    console.log(`${key} (own: ${obj.hasOwnProperty(key)}): ${obj[key]}`);
  }
}
```

**Почему `for...in` опасен для массивов:**
```javascript
Array.prototype.sum = function() { /* polyfill */ };
const arr = [1, 2, 3];

for (const key in arr) {
  console.log(key); // '0', '1', '2', 'sum' — метод из прототипа!
}
```

**Современные альтернативы `for...in`:**
```javascript
const obj = { a: 1, b: 2, c: 3 };

// Собственные ключи
for (const key of Object.keys(obj)) { /* */ }

// Собственные значения
for (const value of Object.values(obj)) { /* */ }

// Собственные пары
for (const [key, value] of Object.entries(obj)) { /* */ }
```

### Важные нюансы и краеугольные камни

- **`for...in` даёт строковые ключи** даже для `arr[0]` — получите `'0'`, не `0`.
- **`for...in` обходит прототип** — без `hasOwnProperty` можно итерировать унаследованные свойства.
- **`for...in` и non-enumerable свойства**: методы классов `enumerable: false` — не будут итерироваться (это хорошо).
- **`for...of` требует итерируемый**: `for (const x of {})` → TypeError.
- **`for...in` не работает с Symbol-ключами**: Symbol-свойства не enumerable для `for...in`.
- **`for...in` для отладки прототипной цепочки** — одно из редких легитимных применений.

### Примеры

```javascript
// Демонстрация разницы
function Animal(name) { this.name = name; }
Animal.prototype.type = 'animal';

const dog = new Animal('Rex');
dog.breed = 'husky';

// for...in — собственные + унаследованные enumerable
for (const key in dog) {
  console.log(key);
}
// 'name', 'breed', 'type' ← 'type' из прототипа!

// for...in с hasOwnProperty
for (const key in dog) {
  if (Object.prototype.hasOwnProperty.call(dog, key)) {
    console.log(key); // 'name', 'breed' — только свои
  }
}

// ES6 класс — методы неперечисляемые
class Cat {
  constructor(name) { this.name = name; }
  meow() { return 'meow'; }
}
const cat = new Cat('Whiskers');
for (const key in cat) {
  console.log(key); // только 'name' — meow не enumerable
}

// Для массива — никогда for...in
const nums = [1, 2, 3];
for (const i in nums) {
  console.log(typeof i, i); // 'string' '0', 'string' '1', 'string' '2'
}
for (const n of nums) {
  console.log(typeof n, n); // 'number' 1, 'number' 2, 'number' 3
}
```

---

## Сравнение

| Критерий | `for...in` | `for...of` |
|----------|------------|------------|
| Что перебирает | Ключи (строки) | Значения |
| Объект | Все enumerable (включая прототип) | Итерируемые |
| Прототипная цепочка | Включает | Не затрагивает |
| Тип переменной | Строка (ключ) | Значение |
| Работает с `{}` | Да | Нет (не итерируемый) |
| Работает с `[]` | Да (но опасно) | Да |
| Порядок | Не гарантирован | Гарантирован |
| `break`/`continue` | Да | Да |
| Введён в | ES1 | ES2015 |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `for...in` опасен для массивов?** — Даёт строковые ключи, итерирует прототипные свойства если добавлен полифил.
- **Когда оправдано использование `for...in`?** — Обход собственных свойств объекта (с `hasOwnProperty`), отладка прототипной цепочки.
- **Как сделать объект итерируемым для `for...of`?** — Добавить метод `[Symbol.iterator]()`.
- **Дадут ли Symbol-ключи `for...in`?** — Нет: Symbol-свойства не попадают в `for...in`.

### Красные флаги (чего не говорить)

- «`for...in` — современная альтернатива `for...of`» — нет, они для разных задач; `for...in` скорее легаси.
- «`for...in` по массиву даёт числовые индексы» — нет, строковые.
- «`for...of` перебирает ключи объекта» — нет, значения итерируемого.

### Связанные темы

- [`025-dlya-chego-ispolzuetsya-cikl-for-of.md`](025-dlya-chego-ispolzuetsya-cikl-for-of.md)
- [`029-metody-keys-values-entries.md`](029-metody-keys-values-entries.md)
- [`028-dlya-chego-metod-getownpropertydescriptors.md`](028-dlya-chego-metod-getownpropertydescriptors.md)
