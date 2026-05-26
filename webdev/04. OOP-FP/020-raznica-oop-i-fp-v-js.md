# Q020. Разница между ООП и ФП в JavaScript?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

ООП организует код вокруг **объектов с состоянием и методами**; ФП — вокруг **чистых функций и трансформации данных** без мутации состояния. JavaScript — мультипарадигменный язык: поддерживает обе парадигмы и на практике они используются вместе. Выбор зависит от задачи: ООП — для сложных предметных моделей с инвариантами; ФП — для трансформаций данных и предсказуемой логики.

---

## Развёрнутый ответ

### Ключевые различия

| Критерий | ООП | ФП |
|----------|-----|----|
| Единица абстракции | Объект | Функция |
| Состояние | Инкапсулировано в объекте (мутабельно) | Передаётся явно, иммутабельно |
| Поведение | Методы объекта | Функции, трансформирующие данные |
| Общение | Объекты посылают друг другу сообщения | Функции принимают и возвращают значения |
| Изменение | Мутация состояния через методы | Создание нового состояния |
| Переиспользование | Наследование, композиция объектов | Композиция функций, HOF |
| Тестируемость | Требует моков состояния | Только входные аргументы |

---

### ООП-подход: объект инкапсулирует состояние

```typescript
// ООП: Cart — объект со своим состоянием и методами
class Cart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity; // мутация внутреннего состояния
    } else {
      this.items.push(item);
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(i => i.id !== id);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  applyDiscount(rate: number): void {
    this.items.forEach(item => {
      item.price = item.price * (1 - rate); // мутация элементов
    });
  }
}

const cart = new Cart();
cart.addItem({ id: '1', name: 'Book', price: 20, quantity: 2 });
cart.getTotal(); // 40
```

---

### ФП-подход: данные + чистые функции

```typescript
// ФП: Cart — просто данные, функции трансформируют их
type CartState = {
  items: CartItem[];
};

// Чистые функции — не меняют оригинал, возвращают новый объект
const addItem = (cart: CartState, item: CartItem): CartState => {
  const existing = cart.items.find(i => i.id === item.id);
  if (existing) {
    return {
      items: cart.items.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      )
    };
  }
  return { items: [...cart.items, item] };
};

const removeItem = (cart: CartState, id: string): CartState => ({
  items: cart.items.filter(i => i.id !== id)
});

const getTotal = (cart: CartState): number =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const applyDiscount = (cart: CartState, rate: number): CartState => ({
  items: cart.items.map(item => ({ ...item, price: item.price * (1 - rate) }))
});

// Нет мутации, каждая операция — новый объект
let cart: CartState = { items: [] };
cart = addItem(cart, { id: '1', name: 'Book', price: 20, quantity: 2 });
getTotal(cart); // 40
```

---

### Когда ООП уместнее в JS

```typescript
// 1. Предметные сущности с инвариантами — хорошо защищать через класс
class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) throw new RangeError('Amount cannot be negative');
  }

  static of(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency)
      throw new Error('Currency mismatch');
    return new Money(this.amount + other.amount, this.currency);
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }
}

// 2. Сложные иерархии компонентов (класс NestJS-контроллера, Angular-сервиса)
@Injectable()
class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailer: Mailer
  ) {}

  async register(dto: CreateUserDto): Promise<User> { /* ... */ }
}
```

---

### Когда ФП уместнее в JS

```typescript
// 1. Трансформации данных
const processOrders = (orders: Order[]): Summary =>
  orders
    .filter(o => o.status === 'completed')
    .map(o => ({ ...o, tax: o.amount * 0.2 }))
    .reduce((acc, o) => ({
      total: acc.total + o.amount,
      taxTotal: acc.taxTotal + o.tax
    }), { total: 0, taxTotal: 0 });

// 2. Предсказуемая бизнес-логика (Redux-редьюсеры)
type Action = { type: 'ADD' | 'REMOVE'; payload: string };

const reducer = (state: string[], action: Action): string[] => {
  switch (action.type) {
    case 'ADD': return [...state, action.payload];
    case 'REMOVE': return state.filter(s => s !== action.payload);
    default: return state;
  }
};

// 3. Утилиты / хелперы
const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
```

---

### Смешанный подход (типично для реального JS/TS)

```typescript
// Архитектурный слой — классы (DI, тестируемость)
class OrderService {
  constructor(private repo: OrderRepository) {}

  async getCompletedTotal(userId: string): Promise<number> {
    const orders = await this.repo.findByUser(userId);
    // Бизнес-логика — чистые ФП-функции
    return orders
      .filter(isCompleted)
      .reduce((sum, o) => sum + o.amount, 0);
  }
}

// Утилиты — ФП
const isCompleted = (order: Order): boolean => order.status === 'completed';
```

### Важные нюансы и краеугольные камни

- JS не принуждает к чистым функциям — нужна дисциплина и code review
- TypeScript улучшает оба подхода: `readonly` для иммутабельности, `abstract` для ООП-контрактов
- **Избегай догматизма**: React-компоненты — функции (ФП), но используют хуки с состоянием (не чисто ФП)

---

## Сравнение

| Задача | ООП | ФП |
|--------|-----|----|
| Предметные сущности с инвариантами | Хорошо | Сложнее |
| Трансформации данных | Можно | Хорошо |
| Переиспользование логики | Наследование/миксины | Функции высшего порядка |
| DI-контейнер (NestJS) | Хорошо | Awkward |
| Async-обработка (RxJS) | Возможно | Хорошо |
| Time-travel debugging | Сложно | Хорошо (иммутабельность) |
| Изучение | Привычнее | Требует привыкания |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как React сочетает ФП и ООП?** — Компоненты — функции (ФП), Hooks — ФП с изолированным состоянием; раньше были class-компоненты (ООП).
- **Может ли Redux быть реализован в ООП-стиле?** — Технически да, но потеряет преимущества: чистые reducers, time-travel, devtools.
- **Что выбрать для нового проекта?** — Архитектурный слой (сервисы, репозитории) — классы с DI; бизнес-логика и утилиты — ФП-стиль.

### Красные флаги (чего не говорить)

- «Нужно выбрать одно — ООП или ФП» — современный JS использует оба подхода.
- «Классы в JS — настоящие ООП классы как в Java» — синтаксический сахар над прототипами.

### Связанные темы

- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `001-osnovnye-printsipy-oop.md`
- `021-plyusy-i-minusy-fp-i-oop.md`
- `022-imperativnyy-vs-deklarativnyy-podkhod.md`
