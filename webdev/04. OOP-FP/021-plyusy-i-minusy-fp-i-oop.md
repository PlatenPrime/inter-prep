# Q021. Плюсы и минусы ФП и ООП?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

ООП силён в моделировании сложных предметных областей: инкапсуляция, полиморфизм, DI — плюсы. Минусы: хрупкие иерархии, скрытое мутабельное состояние. ФП даёт предсказуемость, тестируемость, безопасную конкурентность — плюсы. Минусы: кривая обучения, производительность при иммутабельности, неестественность для I/O-heavy задач. Лучший результат — их грамотное сочетание.

---

## Развёрнутый ответ

### ООП: Плюсы

#### 1. Моделирование предметной области

```typescript
// Объекты отражают бизнес-концепции — понятно бизнесу и разработчику
class Order {
  private status: OrderStatus = 'draft';

  constructor(
    public readonly id: string,
    private items: OrderItem[]
  ) {}

  submit(): void {
    if (this.items.length === 0) throw new Error('Cannot submit empty order');
    this.status = 'submitted';
  }

  cancel(): void {
    if (this.status === 'shipped') throw new Error('Cannot cancel shipped order');
    this.status = 'cancelled';
  }
}
// Инварианты защищены — нельзя нарушить бизнес-правила извне
```

#### 2. Encapsulation и защита состояния

```typescript
class BankAccount {
  private _balance: number;
  private _transactions: Transaction[] = [];

  get balance() { return this._balance; }

  deposit(amount: number): void {
    if (amount <= 0) throw new RangeError('Amount must be positive');
    this._balance += amount;
    this._transactions.push({ type: 'deposit', amount, date: new Date() });
  }
  // Нельзя напрямую изменить баланс — только через контролируемые методы
}
```

#### 3. Полиморфизм и расширяемость

Новый тип — новый класс, существующий код не меняется (OCP).

#### 4. DI-контейнеры и фреймворки

NestJS, Angular, InversifyJS — построены на классах с декораторами. Классы дают метаданные для рефлексии.

---

### ООП: Минусы

#### 1. Хрупкие иерархии

```typescript
// Добавление метода в базовый класс ломает подклассы
class Logger {
  log(msg: string) { console.log(msg); }
  // Добавили новый метод:
  logWithTimestamp(msg: string) { this.log(`[${new Date()}] ${msg}`); }
}

class FileLogger extends Logger {
  // override log — но logWithTimestamp всё равно зовёт Logger.log
  log(msg: string) { writeToFile(msg); }
  // logWithTimestamp будет логировать в консоль, а не в файл — баг!
}
```

#### 2. Скрытое мутабельное состояние

```typescript
// Труднее тестировать и предсказывать
class UserService {
  private cache: Map<string, User> = new Map(); // скрытое состояние

  getUser(id: string): User {
    // Поведение зависит от истории вызовов — не детерминировано
    return this.cache.get(id) ?? this.fetchUser(id);
  }
}
```

#### 3. Проблема diamond inheritance (JS обходит через прототипы)

#### 4. Переусложнение

Паттерн «Фабрика Фабрик», AbstractBeanFactory, EnterpriseBeanBuilderFactoryImpl — хрестоматийный overengineering Java-ООП.

---

### ФП: Плюсы

#### 1. Предсказуемость и тестируемость

```typescript
// Тест = передать аргументы, проверить результат. Нет setup, нет teardown
const calculateShipping = (weight: number, distance: number): number =>
  weight * 0.5 + distance * 0.1;

test('calculates shipping', () => {
  expect(calculateShipping(10, 100)).toBe(15);
});
```

#### 2. Иммутабельность → безопасная конкурентность

Нет shared mutable state — нет race conditions. Критично для Node.js worker threads, параллельных редьюсеров.

#### 3. Мемоизация из коробки

Детерминированность = кэшируемость. `React.memo`, `useMemo`, `useCallback` работают именно благодаря этому.

#### 4. Composability

```typescript
// Каждый шаг — независимая функция, тестируемая отдельно
const processUsers = pipe(
  filterActive,
  sortByName,
  enrichWithPermissions,
  toApiResponse
);
```

---

### ФП: Минусы

#### 1. Производительность при глубокой иммутабельности

```typescript
// Проблема: большой объект, мелкое изменение → весь объект копируется
const bigState = { /* 1000 полей */ };
const newState = { ...bigState, updatedField: 'new' }; // создаёт новый объект

// Решение: Immer (structural sharing)
import produce from 'immer';
const nextState = produce(bigState, draft => {
  draft.updatedField = 'new'; // мутация черновика, под капотом structural sharing
});
```

#### 2. Кривая обучения

Каррирование, монады, functor, applicative — абстракции требуют привыкания. Код с глубоким `pipe` сложно читать без опыта.

#### 3. Неестественность для I/O-heavy задач

Работа с файлами, HTTP, DOM — inherently mutable. ФП изолирует сайд-эффекты, но не устраняет их сложность.

#### 4. Сложность с TypeScript

```typescript
// Глубокие compose/pipe теряют типы
const pipeline = pipe(fn1, fn2, fn3, fn4, fn5); // TypeScript не всегда выводит тип
```

---

## Сравнение

| Критерий | ООП | ФП |
|----------|-----|----|
| Предметные модели | ++ | + |
| Тестируемость | + (с моками) | ++ (без моков) |
| Конкурентность | - (shared state) | ++ (иммутабельность) |
| Кривая обучения | Низкая | Средняя |
| DI-фреймворки | ++ (native) | Awkward |
| Трансформации данных | + | ++ |
| Производительность | + | - (копирование) |
| Читаемость модели | ++ | + |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как Immer решает проблему производительности?** — Structural sharing: копирует только изменённые узлы дерева данных, разделяя неизменённые.
- **Когда бы вы выбрали ООП, а не ФП в новом проекте?** — ООП: сложная предметная область с инвариантами, NestJS/Angular. ФП: pipeline трансформаций, Redux-логика.
- **Можно ли писать ФП-код в классах?** — Да: неизменяемые методы, возвращающие новые объекты (Value Object pattern в DDD).

### Красные флаги (чего не говорить)

- «ФП всегда лучше» или «ООП всегда лучше» — оба подхода имеют контексты применения.
- «ФП медленнее» — обобщение без контекста; structural sharing нивелирует разницу.

### Связанные темы

- `020-raznica-oop-i-fp-v-js.md`
- `018-plyusy-funktsionalnogo-programmirovaniya.md`
- `001-osnovnye-printsipy-oop.md`
- `022-imperativnyy-vs-deklarativnyy-podkhod.md`
