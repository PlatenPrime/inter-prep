# Q028. Что такое псевдомассив `arguments`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`arguments` — встроенный объект, доступный внутри **обычных** (не стрелочных) функций, содержащий все переданные аргументы. Он похож на массив (есть числовые индексы и `length`), но **не является массивом** — у него нет методов `map`, `filter`, `reduce`. В современном коде `arguments` заменяют rest-параметрами (`...args`).

---

## Развёрнутый ответ

### Суть и определение

```javascript
function sum() {
  console.log(arguments);        // Arguments [1, 2, 3]
  console.log(arguments[0]);     // 1
  console.log(arguments.length); // 3

  // НЕТ методов массива
  // arguments.map(x => x * 2); // TypeError!
}
sum(1, 2, 3);
```

`arguments` — объект типа `Arguments`, у которого:
- Числовые ключи `0`, `1`, …
- Свойство `length`
- Итерируемость (`for...of` работает)
- НЕТ методов `Array.prototype`

### Преобразование в массив

```javascript
function toArray() {
  // Способ 1 (ES5)
  const arr1 = Array.prototype.slice.call(arguments);
  // Способ 2
  const arr2 = [].slice.call(arguments);
  // Способ 3 (ES6)
  const arr3 = Array.from(arguments);
  // Способ 4 (ES6 spread)
  const arr4 = [...arguments];
}
```

### `arguments` в стрелочных функциях

```javascript
const arrow = () => {
  console.log(arguments); // ReferenceError в module/strict; window.arguments в sloppy — ловушка!
};

function outer() {
  const inner = () => {
    console.log(arguments); // arguments родительской функции outer!
  };
  inner();
}
outer(1, 2); // Arguments [1, 2]
```

### Современная альтернатива: rest-параметры

```javascript
// Устаревший стиль
function sumOld() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// Современный стиль — rest параметры
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10

// Преимущества rest:
// - настоящий массив с методами
// - явный синтаксис
// - работает в стрелочных функциях
// - TypeScript типизируется нормально
```

### Важные нюансы и краеугольные камни

- В **strict mode** `arguments` не синхронизируется с именованными параметрами (в sloppy mode — синхронизируется!).
- `arguments.callee` — ссылка на текущую функцию; в strict mode запрещён.
- `arguments.caller` — удалён из стандарта по соображениям безопасности.
- `arguments` недоступен в стрелочных функциях — используется `arguments` из охватывающей функции.

### Примеры

```javascript
// Sloppy mode: синхронизация (устарело, избегать)
function mutateDemo(a) {
  arguments[0] = 100;
  console.log(a); // 100 — синхронизируется в sloppy mode
}

// Strict mode: без синхронизации
function safeMutate(a) {
  "use strict";
  arguments[0] = 100;
  console.log(a); // оригинальное значение
}

// Правильный современный вариант
function logAll(...args) {
  args.forEach((arg, i) => console.log(`${i}: ${arg}`));
}
logAll('a', 'b', 'c');
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `arguments` недоступен в стрелочных функциях?** — У стрелочных нет собственного `arguments`; используется из ближайшей обычной функции.
- **Как конвертировать `arguments` в массив?** — `Array.from(arguments)` или `[...arguments]`.
- **Зачем rest-параметры лучше `arguments`?** — Настоящий массив, явный синтаксис, работает в стрелочных, TypeScript-friendly.

### Красные флаги (чего не говорить)

- «`arguments` — это массив» — нет, псевдомассив (array-like).
- «`arguments` работает в стрелочных функциях» — нет, или бросает ошибку, или берёт из внешней функции.

### Связанные темы

- `025-raznica-mezhdu-parametrom-i-argumentom.md`
- `026-raznica-function-declaration-i-function-expression.md`
