# Q004. Какие ещё принципы кроме SOLID вы знаете?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

Помимо SOLID существуют принципы **DRY** (Don't Repeat Yourself), **KISS** (Keep It Simple, Stupid), **YAGNI** (You Aren't Gonna Need It), **Law of Demeter** (принцип минимального знания), **Composition over Inheritance**, а также принципы пакетного уровня из книги Роберта Мартина: **REP, CCP, CRP, ADP, SDP, SAP**. Каждый решает конкретную проблему при проектировании.

---

## Развёрнутый ответ

### Базовые принципы (применяются везде)

#### DRY — Don't Repeat Yourself

«Каждое знание должно иметь единственное, однозначное, авторитетное представление в системе.»

```typescript
// ❌ Дублирование логики вычисления скидки
function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * 0.9, 0); // скидка 10%
}

function getOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * 0.9, 0); // та же скидка
}

// ✅ Единственный источник правды
const DISCOUNT_RATE = 0.9;
const applyDiscount = (price: number) => price * DISCOUNT_RATE;

function calcTotal(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + applyDiscount(item.price), 0);
}
```

**Важно:** DRY — не «нет дублирующего кода», а «нет дублирующего знания». Случайное сходство кода — не нарушение DRY.

#### KISS — Keep It Simple, Stupid

Простое решение предпочтительнее сложного. Сложность должна быть оправдана.

```typescript
// ❌ Over-engineered без причины
class NumberSorterFactoryBuilderImpl {
  createSorter(): { sort: (arr: number[]) => number[] } {
    return { sort: (arr) => [...arr].sort((a, b) => a - b) };
  }
}

// ✅
const sortNumbers = (arr: number[]) => [...arr].sort((a, b) => a - b);
```

#### YAGNI — You Aren't Gonna Need It

Не реализуй функциональность, пока она не нужна.

```typescript
// ❌ Преждевременная абстракция
interface PaymentProcessor { /* 15 методов на случай будущих интеграций */ }

// ✅ Реализуй только то, что нужно сейчас
async function chargeCard(amount: number, cardToken: string): Promise<void> {
  await stripeClient.charges.create({ amount, source: cardToken });
}
```

---

### Law of Demeter (Принцип наименьшего знания)

«Объект должен общаться только с ближайшими соседями, не знать о структуре чужих объектов.»

```typescript
// ❌ Нарушение: проходим через цепочку объектов
class OrderProcessor {
  process(order: Order): void {
    const city = order.customer.address.city; // знаем структуру Customer и Address
  }
}

// ✅ Делегируем через интерфейс
class Order {
  getCustomerCity(): string { return this.customer.address.city; }
}

class OrderProcessor {
  process(order: Order): void {
    const city = order.getCustomerCity(); // не знаем внутренностей
  }
}
```

**Train wreck code** (`a.b().c().d()`) — классический признак нарушения LoD.

---

### Composition over Inheritance

Собирай поведение из маленьких кусков вместо построения иерархий.

```typescript
// Миксины/трейты вместо наследования
const Serializable = <T extends new (...args: unknown[]) => object>(Base: T) =>
  class extends Base {
    serialize(): string { return JSON.stringify(this); }
  };

const Timestamped = <T extends new (...args: unknown[]) => object>(Base: T) =>
  class extends Base {
    createdAt = new Date();
  };

class User { constructor(public name: string) {} }

const TimestampedUser = Timestamped(Serializable(User));
const user = new TimestampedUser('Alice');
user.serialize(); // работает
user.createdAt;   // работает
```

---

### Принципы пакетного уровня (Package/Component principles)

| Принцип | Расшифровка | Суть |
|---------|-------------|------|
| **REP** | Reuse/Release Equivalence | Единица повторного использования = единица релиза (npm-пакет) |
| **CCP** | Common Closure Principle | Классы, меняющиеся вместе — в одном пакете |
| **CRP** | Common Reuse Principle | Классы, используемые вместе — в одном пакете |
| **ADP** | Acyclic Dependencies Principle | Нет циклических зависимостей между пакетами |
| **SDP** | Stable Dependencies Principle | Зависеть от стабильных (редко меняемых) компонентов |
| **SAP** | Stable Abstractions Principle | Стабильные компоненты должны быть абстрактными |

---

### Separation of Concerns (SoC)

Разные аспекты системы должны быть изолированы: бизнес-логика отдельно от UI, персистентности, транспорта.

```
Controller → Service → Repository → Database
     ↑             ↑
   HTTP           Domain
  concerns        logic
```

### Важные нюансы и краеугольные камни

- **DRY vs WET** (Write Everything Twice): иногда лёгкое дублирование лучше преждевременной абстракции. Правило трёх: дублируй дважды, абстрагируй на третий раз.
- **KISS и YAGNI** часто противоречат желанию «сделать гибко на будущее». Отдавай предпочтение простоте сейчас.
- **LoD** в контексте React: компонент не должен знать о структуре props дочернего компонента глубже одного уровня.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда DRY вреден?** — При «случайном дублировании» (coincidental duplication): два похожих фрагмента, которые изменяются по разным причинам — не нарушение DRY.
- **Как Law of Demeter связан с тестируемостью?** — Объекты с LoD легче мокировать: меньше цепочек зависимостей.
- **Что общего у SoC и SRP?** — Оба про разделение ответственностей, SRP — на уровне класса, SoC — на уровне системы/слоёв.

### Красные флаги (чего не говорить)

- «DRY — просто не копировать код» — смысл шире: единственный источник знания, не только код.
- Называть YAGNI оправданием для технического долга — YAGNI про преждевременные фичи, не про игнорирование качества.

### Связанные темы

- `002-chto-takoe-solid.md`
- `006-kompozitsiya-vs-nasledovanie.md`
- `026-chto-takoe-pattern-shablon-proektirovaniya.md`
