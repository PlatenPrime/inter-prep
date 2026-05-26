# Q018. Плюсы функционального программирования?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

Главные преимущества ФП: **предсказуемость** (чистые функции всегда дают один результат), **простота тестирования** (нет зависимостей от состояния), **безопасная конкурентность** (иммутабельность исключает race conditions), **модульность** (маленькие функции легко переиспользовать), **мемоизация** (чистые функции можно кэшировать) и **читаемость декларативного кода** (выражаем намерение, а не шаги).

---

## Развёрнутый ответ

### 1. Предсказуемость и понятность

Чистые функции — детерминированные «чёрные ящики»: одинаковый вход → одинаковый выход. Поведение можно предсказать без знания контекста.

```typescript
// Легко рассуждать: выход полностью определён входом
const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

// Всегда '$1,234.56' при одном input
formatCurrency(1234.56, 'USD'); // '$1,234.56'
```

---

### 2. Тестируемость

Чистые функции тестируются в изоляции без моков, стабов и setup.

```typescript
// ФП-функция — unit-тест в одну строку
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

describe('clamp', () => {
  it('ограничивает значение снизу',   () => expect(clamp(-5, 0, 10)).toBe(0));
  it('ограничивает значение сверху',  () => expect(clamp(15, 0, 10)).toBe(10));
  it('не меняет значение в диапазоне', () => expect(clamp(5, 0, 10)).toBe(5));
});

// Сравните с ООП-методом, зависящим от this, DB, HTTP — нужны моки
```

---

### 3. Безопасная конкурентность

Иммутабельность исключает race conditions — не нужны мьютексы и синхронизация.

```typescript
// ❌ Мутабельный подход — опасен в concurrent коде
let sharedCounter = 0;
async function increment() {
  const val = sharedCounter; // читаем
  await delay(1);            // другой поток может изменить между чтением и записью
  sharedCounter = val + 1;   // race condition
}

// ✅ Иммутабельный подход — нет shared mutable state
const createCounter = (count = 0) => ({
  increment: () => createCounter(count + 1),
  value: () => count
});

const c1 = createCounter();
const c2 = c1.increment(); // c1 не изменился
```

---

### 4. Простота отладки

Чистые функции легко отлаживать: можно воспроизвести любую ошибку, передав те же аргументы.

```typescript
// Логируем входы/выходы без риска изменить поведение
function withTrace<T extends unknown[], R>(
  fn: (...args: T) => R,
  name: string
): (...args: T) => R {
  return (...args: T): R => {
    const result = fn(...args);
    console.log(`${name}(${JSON.stringify(args)}) => ${JSON.stringify(result)}`);
    return result;
  };
}

const tracedCalc = withTrace(calculateTax, 'calculateTax');
// Каждый вызов воспроизводим независимо
```

---

### 5. Мемоизация

Детерминированность = кэшируемость. Один раз вычислил — сохранил.

```typescript
function memoize<T extends unknown[], R>(fn: (...args: T) => R) {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key)!;
  };
}

// Fibonacci — O(2^n) без мемоизации → O(n) с ней
const fib = memoize(function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// React.useMemo, React.memo — мемоизация компонентов и значений
```

---

### 6. Модульность и переиспользуемость

Маленькие функции с единственной ответственностью — строительные блоки.

```typescript
// Примитивы — переиспользуются в разных контекстах
const isNotNull = <T>(value: T | null): value is T => value !== null;
const toUpperCase = (s: string): string => s.toUpperCase();
const byField = <T>(field: keyof T) => (a: T, b: T) =>
  a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;

// Комбинируются для любой задачи
const users = getUsers()
  .filter(isNotNull)
  .map(u => ({ ...u, name: toUpperCase(u.name) }))
  .sort(byField('name'));
```

---

### 7. Читаемость декларативного кода

```typescript
// ❌ Императивный: нужно читать каждую строку чтобы понять цель
const result = [];
for (let i = 0; i < transactions.length; i++) {
  if (transactions[i].type === 'credit' && transactions[i].amount > 1000) {
    result.push(transactions[i].amount * 1.05);
  }
}
let total = 0;
for (const amount of result) { total += amount; }

// ✅ Декларативный: намерение читается как предложение
const total = transactions
  .filter(t => t.type === 'credit' && t.amount > 1000)
  .map(t => t.amount * 1.05)
  .reduce((sum, amount) => sum + amount, 0);
```

### Практика и применение

- **Redux**: чистые reducers обеспечивают time-travel debugging и предсказуемость
- **React**: функциональные компоненты + hooks + `React.memo` — полноценный ФП-стиль
- **RxJS**: чистые операторы (`map`, `filter`, `mergeMap`) — реактивное ФП
- **Параллельные вычисления**: Node.js Worker Threads безопасно используют иммутабельные данные

### Важные нюансы и краеугольные камни

- **Производительность**: иммутабельность создаёт много временных объектов → нагрузка на GC. Immer решает через structural sharing
- **Кривая обучения**: каррирование, монады, functor — абстракции требуют привыкания
- **Не всё поддаётся ФП**: UI, сеть, файловая система — inherently side-effectful; ФП изолирует, не устраняет

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какой минус ФП в производительности?** — Иммутабельность создаёт много временных объектов; глубокое копирование может быть дороже мутации для больших структур.
- **Как ФП помогает в React-разработке конкретно?** — Функциональные компоненты, иммутабельный state → точное сравнение через `===` для `React.memo`/`useMemo`.
- **Почему ФП упрощает time-travel debugging?** — Каждое состояние — иммутабельный snapshot; можно хранить историю и откатываться.

### Красные флаги (чего не говорить)

- «ФП всегда лучше ООП» — каждая парадигма сильна в своей области; лучший JS-код сочетает обе.
- «ФП — это просто `map`, `filter`, `reduce`» — это следствие ФП, а не сама парадигма.

### Связанные темы

- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `021-plyusy-i-minusy-fp-i-oop.md`
- `017-osnovnye-printsipy-fp.md`
