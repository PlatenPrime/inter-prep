# Q007. Что такое `NaN`? Как определить, что значение равно `NaN`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`NaN` (Not-a-Number) — специальное значение типа `number`, возникающее при невалидных числовых операциях (например, `0/0` или `parseInt("abc")`). Уникальная особенность: `NaN !== NaN` (единственное значение в JS, не равное самому себе). Для проверки используйте `Number.isNaN()`, а не глобальный `isNaN()`.

---

## Развёрнутый ответ

### Суть и определение

`NaN` определён стандартом IEEE 754 как значение, которое не является конкретным числом. В JavaScript:
- `typeof NaN === "number"` — `NaN` имеет числовой тип.
- `NaN !== NaN` — единственное значение в ECMAScript, нарушающее рефлексивность (`a === a`).
- `NaN` — falsy.

### Как это работает

Источники `NaN`:

```javascript
0 / 0            // NaN
Infinity - Infinity // NaN
parseInt("abc")  // NaN
Math.sqrt(-1)    // NaN
undefined + 1    // NaN
Number("hello")  // NaN
```

Распространение: любая арифметическая операция с `NaN` возвращает `NaN`:
```javascript
NaN + 1    // NaN
NaN * 0    // NaN
NaN === NaN // false ← ключевое свойство
```

### Практика и применение

Три способа проверить на `NaN`:

```javascript
// 1. Number.isNaN() — ПРАВИЛЬНО (ES2015+)
Number.isNaN(NaN);         // true
Number.isNaN("abc");       // false — не число, но не NaN
Number.isNaN(undefined);   // false

// 2. Глобальный isNaN() — ОСТОРОЖНО: конвертирует аргумент в число сначала
isNaN("abc");   // true  — "abc" сначала Number("abc") = NaN
isNaN(undefined); // true — undefined → NaN
isNaN(null);    // false  — null → 0

// 3. Self-comparison (устаревший трюк, для старых окружений)
const val = NaN;
val !== val; // true — только для NaN
```

Предпочтительный способ: **`Number.isNaN()`** — без неявного приведения.

### Важные нюансы и краеугольные камни

- `typeof NaN === "number"` — вводит в заблуждение, но это стандарт IEEE 754.
- `Array.includes(NaN)` работает корректно (использует SameValueZero): `[NaN].includes(NaN)` → `true`.
- `[NaN].indexOf(NaN)` → `-1` — использует `===`, не найдёт.
- `Object.is(NaN, NaN)` → `true` — более точное сравнение, чем `===`.
- При `JSON.parse` и `JSON.stringify`: `NaN` в числовых полях сериализуется как `null`.

### Примеры

```javascript
// Безопасное разбиение числа из строки
function parsePositive(str) {
  const n = Number(str);
  if (Number.isNaN(n)) throw new TypeError(`"${str}" is not a number`);
  if (n < 0) throw new RangeError('Value must be positive');
  return n;
}

// Object.is для точного сравнения
Object.is(NaN, NaN);  // true
Object.is(0, -0);     // false (а === даст true)

// Ловушка с Array.indexOf vs includes
const arr = [1, NaN, 3];
arr.indexOf(NaN);   // -1  (uses ===)
arr.includes(NaN);  // true (uses SameValueZero)
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `NaN !== NaN`?** — Стандарт IEEE 754: «не-число» не определено, поэтому два неопределённых результата не равны.
- **Чем `Number.isNaN()` отличается от `isNaN()`?** — Глобальный `isNaN` конвертирует аргумент → ложные срабатывания на строках.
- **Как отфильтровать NaN из массива?** — `arr.filter(Number.isFinite)` или `arr.filter(x => !Number.isNaN(x))`.
- **Что такое `Object.is()`?** — Алгоритм SameValue: отличается от `===` в случаях `NaN === NaN` (false vs true) и `0 === -0` (true vs false).

### Красные флаги (чего не говорить)

- «`NaN` — это не число, поэтому `typeof NaN === "string"`» — нет, `typeof NaN === "number"`.
- «Для проверки на `NaN` используем `value === NaN`» — всегда `false`, это нерабочий подход.
- «`isNaN("abc")` возвращает `false`» — нет, возвращает `true` из-за неявного приведения.

### Связанные темы

- `001-tipy-dannyh-v-javascript.md`
- `008-pochemu-typeof-null-vozvraschaet-object.md`
- `010-raznica-yavnoe-i-neyavnoe-preobrazovanie.md`
- `013-pochemu-0-1-plus-0-2-ne-ravno-0-3.md`
