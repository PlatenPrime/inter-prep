# Q017. Основные принципы функционального программирования?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

Основные принципы ФП: **чистые функции** (pure functions), **иммутабельность** (immutability), **функции первого класса** (first-class functions), **функции высшего порядка** (higher-order functions), **декларативность** (declarative style), **функциональная композиция** (composition) и **управление сайд-эффектами** (side effects isolation). Все принципы направлены на предсказуемость, тестируемость и простоту рассуждений о коде.

---

## Развёрнутый ответ

### 1. Чистые функции (Pure Functions)

```typescript
// Детерминированность: один вход → один выход, всегда
// Нет сайд-эффектов

// ✅ Чистая
const calculateTax = (price: number, rate: number): number => price * rate;

// ❌ Нечистая: зависит от Date.now() — недетерминированная
const getAge = (birthYear: number): number => new Date().getFullYear() - birthYear;

// ✅ Чистая версия
const getAge = (birthYear: number, currentYear: number): number => currentYear - birthYear;
```

Преимущества: тривиально тестируются, мемоизируемы, безопасны для параллельного выполнения.

---

### 2. Иммутабельность (Immutability)

```typescript
interface Cart {
  items: CartItem[];
  total: number;
}

// ❌ Мутация — изменяем оригинал
function addToCart(cart: Cart, item: CartItem): Cart {
  cart.items.push(item);          // мутация
  cart.total += item.price;       // мутация
  return cart;
}

// ✅ Иммутабельное обновление
function addToCart(cart: Cart, item: CartItem): Cart {
  return {
    items: [...cart.items, item],
    total: cart.total + item.price
  };
}
```

---

### 3. Функции первого класса (First-Class Functions)

```typescript
// Функции — такие же значения, как числа и строки
type Predicate<T> = (value: T) => boolean;
type Transformer<T, R> = (value: T) => R;

const isEven: Predicate<number> = n => n % 2 === 0;
const toString: Transformer<number, string> = n => n.toString();

// Массив функций
const validators: Predicate<string>[] = [
  s => s.length > 0,
  s => s.length <= 100,
  s => /^[a-zA-Z]+$/.test(s),
];

const validate = (value: string): boolean =>
  validators.every(fn => fn(value));
```

---

### 4. Функции высшего порядка (Higher-Order Functions)

```typescript
// Принимает функцию как аргумент
function map<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.reduce<R[]>((acc, item) => [...acc, fn(item)], []);
}

// Возвращает функцию
function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Декорирование функции
function withLogging<T extends unknown[], R>(
  fn: (...args: T) => R,
  label: string
): (...args: T) => R {
  return (...args: T): R => {
    console.log(`[${label}] called with`, args);
    const result = fn(...args);
    console.log(`[${label}] returned`, result);
    return result;
  };
}
```

---

### 5. Функциональная композиция (Composition)

```typescript
const pipe = <T>(...fns: Array<(x: T) => T>) =>
  (x: T): T => fns.reduce((v, f) => f(v), x);

// Маленькие, фокусированные функции
const trim = (s: string) => s.trim();
const lowercase = (s: string) => s.toLowerCase();
const replace = (pattern: RegExp, replacement: string) =>
  (s: string) => s.replace(pattern, replacement);

const slugify = pipe(
  trim,
  lowercase,
  replace(/[^\w\s-]/g, ''),
  replace(/\s+/g, '-')
);

slugify('  Hello, World!  '); // 'hello-world'
```

---

### 6. Декларативность (Declarative Style)

```typescript
const orders = [
  { id: 1, amount: 150, status: 'completed' },
  { id: 2, amount: 80,  status: 'pending' },
  { id: 3, amount: 200, status: 'completed' },
];

// Императивный: КАК делать
let total = 0;
for (const order of orders) {
  if (order.status === 'completed') {
    total += order.amount;
  }
}

// Декларативный: ЧТО получить
const total = orders
  .filter(o => o.status === 'completed')
  .reduce((sum, o) => sum + o.amount, 0);
// 350 — описываем намерение, не шаги
```

---

### 7. Управление сайд-эффектами (Side Effect Isolation)

```typescript
// Сайд-эффекты неизбежны — выносим их на края системы
// Бизнес-логика — чистые функции
// I/O — изолировано

// ✅ Чистое ядро (pure core)
function calculateDiscount(price: number, userId: string, discounts: Map<string, number>): number {
  const userDiscount = discounts.get(userId) ?? 0;
  return price * (1 - userDiscount);
}

// ✅ Грязная оболочка (impure shell) — изолирует I/O
async function applyUserDiscount(price: number, userId: string): Promise<number> {
  const discounts = await fetchDiscounts(); // сайд-эффект здесь
  return calculateDiscount(price, userId, discounts); // вызов чистой функции
}
```

---

### 8. Каррирование и частичное применение

```typescript
// Карри: функция от нескольких аргументов → цепочка функций от одного
const add = (a: number) => (b: number) => a + b;
const add5 = add(5);
add5(3); // 8

// Частичное применение через bind
function multiply(a: number, b: number): number { return a * b; }
const double = multiply.bind(null, 2);
double(7); // 14
```

### Практика и применение

- **Redux reducers** — чистые функции: `(state, action) => newState`
- **React `useMemo`/`useCallback`** — мемоизация чистых функций
- **`Array.prototype.map/filter/reduce`** — декларативный ФП-стиль в стандарте JS
- **Immer.js** — иммутабельные обновления с удобным синтаксисом мутации

### Важные нюансы и краеугольные камни

- **Иммутабельность стоит памяти** — structural sharing (Immer, Immutable.js) решает это через разделение общих узлов
- **Partial application ≠ currying**: частичное применение фиксирует несколько аргументов сразу; карри — строго по одному
- **Функциональная чистота** в JS — конвенция, не гарантия: движок не запрещает нечистые функции
- Чрезмерное следование ФП-стилю в JS без TypeScript снижает читаемость (длинные `pipe`-цепочки без типов)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как иммутабельность помогает в React?** — Позволяет сравнивать через `===` (shallow equality) для определения необходимости ре-рендера (`React.memo`, `shouldComponentUpdate`).
- **Что такое «функциональное ядро, императивная оболочка»?** — Архитектурный паттерн: бизнес-логика — чистые функции; I/O, работа с состоянием — в оболочке.
- **Можно ли мемоизировать нечистую функцию?** — Нет смысла: результат непредсказуем, кэш даст неверный ответ.

### Красные флаги (чего не говорить)

- «Функциональное программирование — без циклов» — нет запрета на циклы; декларативность предпочтительна, но не обязательна.
- «В ФП нет состояния» — состояние есть, оно иммутабельно и передаётся явно.

### Связанные темы

- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `019-chto-takoe-karrirovanie-currying.md`
- `022-imperativnyy-vs-deklarativnyy-podkhod.md`
- `020-raznica-oop-i-fp-v-js.md`
