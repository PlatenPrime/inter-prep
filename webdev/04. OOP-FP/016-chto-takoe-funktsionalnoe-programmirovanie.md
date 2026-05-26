# Q016. Что такое функциональное программирование?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Функциональное программирование (ФП)** — парадигма, в которой программа строится как набор **чистых функций** без мутации состояния и сайд-эффектов. Основные идеи: функции — объекты первого класса (можно передавать и возвращать), данные иммутабельны, вычисления выражены через трансформацию данных, а не через изменение состояния. В JavaScript ФП применяется наряду с ООП.

---

## Развёрнутый ответ

### Суть и определение

ФП восходит к **лямбда-исчислению** Алонзо Чёрча (1930-е). Чистые функциональные языки: Haskell, Erlang, Elm. Мультипарадигменные с сильной ФП-поддержкой: JavaScript, Scala, Clojure, F#.

Ключевое отличие от императивного подхода:

```typescript
// Императивный: мутируем состояние, шаг за шагом
function sumImperative(numbers: number[]): number {
  let total = 0;               // изменяемое состояние
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];       // мутация
  }
  return total;
}

// Функциональный: трансформация через выражение
const sumFunctional = (numbers: number[]): number =>
  numbers.reduce((acc, n) => acc + n, 0); // нет мутации, нет переменных состояния
```

---

### Функции как объекты первого класса

```typescript
// Функцию можно:
// 1. Присваивать переменной
const double = (x: number) => x * 2;

// 2. Передавать как аргумент
const apply = (fn: (x: number) => number, value: number) => fn(value);
apply(double, 5); // 10

// 3. Возвращать из функции (функции высшего порядка)
const multiplier = (factor: number) => (x: number) => x * factor;
const triple = multiplier(3);
triple(4); // 12

// 4. Хранить в структурах данных
const operations = {
  add: (a: number, b: number) => a + b,
  sub: (a: number, b: number) => a - b,
  mul: (a: number, b: number) => a * b,
};
```

---

### Чистые функции

```typescript
// ✅ Чистая функция: одни и те же входные данные → один и тот же результат
// Нет сайд-эффектов, нет зависимости от внешнего состояния
function add(a: number, b: number): number {
  return a + b;
}

// ❌ Нечистая: зависит от внешнего состояния
let tax = 0.2;
function addTax(price: number): number {
  return price + price * tax; // зависит от внешней переменной tax
}

// ❌ Нечистая: сайд-эффект (запись в консоль, мутация аргумента)
function processItems(items: string[]): string[] {
  console.log('Processing...'); // сайд-эффект
  items.push('extra');          // мутация аргумента
  return items;
}

// ✅ Чистая версия
function processItemsPure(items: readonly string[]): string[] {
  return [...items, 'extra']; // новый массив, аргумент не тронут
}
```

---

### Иммутабельность

```typescript
// ❌ Мутация — меняем оригинал
function addUserRole(user: User, role: string): User {
  user.roles.push(role); // ❌
  return user;
}

// ✅ Иммутабельность — возвращаем новый объект
function addUserRole(user: User, role: string): User {
  return {
    ...user,
    roles: [...user.roles, role] // новый массив
  };
}

// ✅ Иммутабельные обновления вложенных структур
interface State {
  user: { name: string; settings: { theme: string } };
}

function updateTheme(state: State, theme: string): State {
  return {
    ...state,
    user: {
      ...state.user,
      settings: { ...state.user.settings, theme }
    }
  };
}
```

---

### Функции высшего порядка (Higher-Order Functions)

```typescript
const numbers = [1, 2, 3, 4, 5];

// map — трансформация
const doubled = numbers.map(n => n * 2);            // [2, 4, 6, 8, 10]

// filter — фильтрация
const evens = numbers.filter(n => n % 2 === 0);     // [2, 4]

// reduce — свёртка
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// Комбинирование
const sumOfDoubledEvens = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((acc, n) => acc + n, 0); // (2+4)*2 = 12
```

---

### Referential Transparency (Прозрачность ссылок)

Выражение можно заменить его значением без изменения поведения программы.

```typescript
// Чистая функция — референциально прозрачна
const square = (x: number) => x * x;
square(4); // всегда 16 — можно заменить литералом 16

// Memo: если функция чистая — её можно мемоизировать
function memoize<T extends unknown[], R>(fn: (...args: T) => R) {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key)!;
  };
}

const memoSquare = memoize(square);
memoSquare(4); // вычисляет
memoSquare(4); // из кэша
```

### Практика и применение

- **Redux**: reducers — чистые функции `(state, action) => newState`
- **React Hooks**: `useMemo`, `useCallback` предполагают чистые вычисления
- **Array методы**: `map`, `filter`, `reduce`, `flatMap` — ФП в стандартной библиотеке
- **RxJS**: цепочки операторов — функциональная трансформация потоков данных

### Важные нюансы и краеугольные камни

- **Сайд-эффекты неизбежны** (HTTP-запросы, DOM, файлы); ФП не запрещает их — изолирует на границах системы
- **Иммутабельность ≠ медленно**: `Immer.js` и `immutable.js` делают иммутабельные обновления эффективными через структурное разделение (structural sharing)
- **ФП и ООП не антагонисты** — в JS/TS используются вместе: классы + чистые методы

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое «сайд-эффект»?** — Любое действие функции за пределами возврата значения: мутация аргумента/глобального состояния, I/O, запросы.
- **Почему иммутабельность упрощает отладку?** — Состояние никогда не меняется «тайно»; время проще откатить, проще сравнивать snapshots.
- **Что такое referential transparency?** — Выражение можно заменить его значением; это позволяет мемоизацию и параллельное выполнение.

### Красные флаги (чего не говорить)

- «ФП — это просто `map/filter/reduce`» — это HOF из стандарта; ФП как парадигма значительно шире.
- «В ФП нельзя использовать сайд-эффекты» — можно, нужно изолировать. В Haskell — монада `IO`, в JS — на краях системы.

### Связанные темы

- `017-osnovnye-printsipy-fp.md`
- `018-plyusy-funktsionalnogo-programmirovaniya.md`
- `019-chto-takoe-karrirovanie-currying.md`
- `020-raznica-oop-i-fp-v-js.md`
