# Q019. Что такое каррирование (Currying)?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Каррирование** — преобразование функции от нескольких аргументов в цепочку функций, каждая из которых принимает **один** аргумент. `f(a, b, c)` → `f(a)(b)(c)`. Не путать с **частичным применением** — фиксацией части аргументов функции. В JavaScript каррирование реализуется вручную или через библиотеки (lodash, ramda). Позволяет создавать специализированные функции из общих.

---

## Развёрнутый ответ

### Суть и определение

Термин идёт от математика Хаскелла Карри (Haskell Curry). В функциональных языках (Haskell, ML) все функции каррированы по умолчанию.

```typescript
// Обычная функция от двух аргументов
function add(a: number, b: number): number {
  return a + b;
}

// Каррированная версия
function curriedAdd(a: number): (b: number) => number {
  return (b: number) => a + b;
}

// Использование
add(3, 4);            // 7
curriedAdd(3)(4);     // 7

// Создание специализированной функции
const add5 = curriedAdd(5);  // (b: number) => 5 + b
add5(3);   // 8
add5(10);  // 15
```

---

### Универсальная функция curry

```typescript
// Простая реализация для двух аргументов
function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a: A) => (b: B) => fn(a, b);
}

// Обобщённая реализация (runtime)
function curry(fn: (...args: unknown[]) => unknown) {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...moreArgs: unknown[]) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

const multiply = (a: number, b: number, c: number) => a * b * c;
const curriedMultiply = curry(multiply);

curriedMultiply(2)(3)(4);  // 24
curriedMultiply(2, 3)(4);  // 24 — автокаррирование с несколькими аргументами
curriedMultiply(2)(3, 4);  // 24
```

---

### Практические примеры

```typescript
// 1. Специализация обработчиков событий
const handleEvent =
  (eventType: string) =>
  (handler: (data: unknown) => void) =>
  (data: unknown) => {
    if (data !== null) {
      console.log(`[${eventType}]`);
      handler(data);
    }
  };

const handleClick = handleEvent('click');
const handleHover = handleEvent('hover');

// Разные обработчики для разных событий
const onButtonClick = handleClick(data => console.log('Button:', data));
const onLinkHover  = handleHover(data => console.log('Link:', data));

// 2. Конфигурируемые трансформации данных
const formatDate =
  (locale: string) =>
  (format: Intl.DateTimeFormatOptions) =>
  (date: Date): string =>
    new Intl.DateTimeFormat(locale, format).format(date);

const formatRU = formatDate('ru-RU');
const formatRUShort = formatRU({ day: '2-digit', month: '2-digit', year: 'numeric' });
const formatRULong  = formatRU({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

formatRUShort(new Date()); // '26.05.2026'
formatRULong(new Date());  // 'вторник, 26 мая 2026 г.'

// 3. Каррирование в pipe
const pipe = <T>(...fns: Array<(x: T) => T>) =>
  (x: T): T => fns.reduce((v, f) => f(v), x);

const multiplyBy = (factor: number) => (x: number) => x * factor;
const addValue   = (addend: number) => (x: number) => x + addend;

const transform = pipe(
  multiplyBy(2),  // специализированная через каррирование
  addValue(10),
  multiplyBy(3)
);

transform(5); // ((5 * 2) + 10) * 3 = 60
```

---

### Каррирование vs Частичное применение

```typescript
// Каррирование: функция от N аргументов → N вложенных функций от 1 аргумента
const curriedAdd3 = (a: number) => (b: number) => (c: number) => a + b + c;
curriedAdd3(1)(2)(3); // 6

// Частичное применение: фиксируем часть аргументов
function add3(a: number, b: number, c: number): number {
  return a + b + c;
}

const add1And2 = add3.bind(null, 1, 2); // зафиксировали a=1, b=2
add1And2(3); // 6

// Через замыкание
const partialAdd3 = (a: number, b: number) => (c: number) => add3(a, b, c);
const add10And20 = partialAdd3(10, 20);
add10And20(5); // 35

// Ключевое отличие:
// Каррирование — строго по одному аргументу, всегда
// Частичное применение — фиксируем любое количество аргументов
```

---

### Каррирование в lodash/ramda

```typescript
import { curry } from 'lodash';

const curriedFilter = curry(
  (predicate: (x: number) => boolean, arr: number[]) => arr.filter(predicate)
);

const filterEvens = curriedFilter((x: number) => x % 2 === 0);
filterEvens([1, 2, 3, 4, 5]); // [2, 4]

// Ramda — все функции каррированы по умолчанию
import * as R from 'ramda';
const isEven = R.filter((x: number) => x % 2 === 0);
isEven([1, 2, 3, 4]); // [2, 4]
```

### Практика и применение

- **Конфигурируемые функции**: `withConfig(config)(data)` — сначала передаём конфиг, потом данные
- **Переиспользование в pipe/compose**: каждая функция в цепочке принимает один аргумент
- **React: обработчики событий**: `const handleChange = (field: string) => (e: Event) => setState(...)`
- **Валидаторы**: `const minLength = (min: number) => (str: string) => str.length >= min`

### Важные нюансы и краеугольные камни

- Встроенный `Function.prototype.bind` — инструмент частичного применения, не каррирования
- Каррированные функции с TypeScript требуют явных типов или перегрузок — автовывод типов ограничен
- **Point-free style**: `const double = map(x => x * 2)` — функция без явного указания аргумента
- Каррирование понижает читаемость если злоупотреблять — нужен баланс

---

## Сравнение

| Аспект | Каррирование | Частичное применение |
|--------|-------------|---------------------|
| Шаги | Строго по одному аргументу | Любое количество |
| Вызов | `f(a)(b)(c)` | `f.bind(null, a, b)(c)` |
| Специализация | Создаёт цепочку | Фиксирует часть |
| Порядок | Слева направо | Фиксируются с начала (bind) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем каррирование, если можно сразу передать все аргументы?** — Отложенное выполнение, специализация функций, удобство в pipe/compose.
- **Как каррирование связано с замыканиями?** — Каждый промежуточный вызов создаёт замыкание, удерживающее зафиксированные аргументы.
- **Что такое point-free style?** — Запись функции без явного упоминания аргументов: `const sum = reduce(add, 0)`.

### Красные флаги (чего не говорить)

- «Каррирование = частичное применение» — разные понятия; каррирование строже (по одному аргументу).
- «Каррирование есть в JS "из коробки"» — нет, нужно реализовать вручную или использовать библиотеку.

### Связанные темы

- `017-osnovnye-printsipy-fp.md`
- `007-kompozitsiya-v-kontekste-js.md`
- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
