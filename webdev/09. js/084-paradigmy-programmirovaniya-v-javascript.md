# Q084. Парадигмы программирования в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

JavaScript — **мультипарадигменный** язык, поддерживающий три основные парадигмы: **императивную** (включая процедурную и ООП), **функциональную** (ФП) и **событийно-ориентированную**. Разработчик выбирает подход в зависимости от задачи; в реальных проектах они комбинируются.

---

## Развёрнутый ответ

### Суть

Парадигма программирования — это способ мышления о коде и организации его структуры. JavaScript изначально задумывался как объектно-ориентированный язык, но с ECMAScript 5/6 стал полноценно поддерживать функциональный стиль. Node.js сделал event-driven программирование центральным.

### Парадигма 1: Императивная / Процедурная

Код описывает **как** выполнить задачу, шаг за шагом:

```javascript
// Процедурный стиль
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

const order = [
  { price: 10, quantity: 2 },
  { price: 5, quantity: 3 },
];
const total = calculateTotal(order); // 35
```

### Парадигма 2: Объектно-Ориентированная (ООП)

JS реализует ООП через **прототипное наследование** (не классовое). Синтаксис `class` — лишь синтаксический сахар над прототипами.

```javascript
// ООП: инкапсуляция через классы
class ShoppingCart {
  #items = []; // приватное поле (ES2022)

  addItem(item) {
    this.#items.push(item);
    return this; // chaining
  }

  get total() {
    return this.#items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}

// Наследование
class DiscountCart extends ShoppingCart {
  constructor(discountRate) {
    super();
    this.discountRate = discountRate;
  }

  get total() {
    return super.total * (1 - this.discountRate);
  }
}

const cart = new DiscountCart(0.1);
cart.addItem({ price: 100, quantity: 1 });
console.log(cart.total); // 90
```

**Принципы ООП в JavaScript:**
- **Инкапсуляция** — `#privateFields`, замыкания.
- **Наследование** — `extends`, прототипная цепочка.
- **Полиморфизм** — переопределение методов в подклассах.
- **Абстракция** — скрытие деталей реализации за публичным API.

### Парадигма 3: Функциональная (ФП)

Описывает **что** нужно получить, а не как. Ключевые принципы: **чистые функции, иммутабельность, функции высшего порядка, композиция**.

```javascript
// ФП стиль
const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Функции высшего порядка и композиция
const pipe = (...fns) => (value) => fns.reduce((v, fn) => fn(v), value);

const applyDiscount = (rate) => (total) => total * (1 - rate);
const applyTax = (rate) => (total) => total * (1 + rate);
const roundCents = (total) => Math.round(total * 100) / 100;

const processTotalPipeline = pipe(
  calculateTotal,
  applyDiscount(0.1),
  applyTax(0.2),
  roundCents,
);

const finalTotal = processTotalPipeline(order);

// Иммутабельность
const addItem = (items, newItem) => [...items, newItem]; // не мутирует
const removeItem = (items, id) => items.filter(i => i.id !== id); // не мутирует
```

### Парадигма 4: Событийно-Ориентированная (EDA)

Код реагирует на **события** вместо прямого вызова. Базовая для браузерного JS и Node.js.

```javascript
// Браузерные события
document.getElementById('btn').addEventListener('click', handleClick);

// Паттерн EventEmitter (Node.js)
import { EventEmitter } from 'events';

class OrderService extends EventEmitter {
  placeOrder(order) {
    processOrder(order);
    this.emit('order:placed', order); // публикация события
  }
}

const orderService = new OrderService();
orderService.on('order:placed', (order) => sendConfirmationEmail(order));
orderService.on('order:placed', (order) => updateInventory(order));
```

### Реактивная парадигма (Reactive / Rx)

Расширение EDA — работа с потоками данных через `Observable`:

```javascript
// RxJS
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

const search$ = fromEvent(input, 'input').pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(event => fetchResults(event.target.value))
);

search$.subscribe(results => renderResults(results));
```

### Сравнение парадигм

| Аспект | Процедурная | ООП | ФП |
|--------|-------------|-----|----|
| Состояние | Изменяемое | В объектах (инкапсулировано) | Иммутабельное |
| Повторное использование | Функции | Наследование/композиция | Композиция функций |
| Тестируемость | Умеренная | Умеренная | Высокая (чистые функции) |
| Обучаемость | Высокая | Умеренная | Ниже |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **JavaScript — ООП или ФП язык?** — Мультипарадигменный; ООП прототипное (не классовое), ФП через функции первого класса.
- **В чём преимущество ФП для тестирования?** — Чистые функции без состояния и side effects легко unit-тестировать изолированно.
- **Можно ли совмещать ООП и ФП в JavaScript?** — Да, и это распространённая практика; например, React классы + hooks (ФП).

### Красные флаги (чего не говорить)

- «JS — классический ООП язык» — прототипное наследование принципиально отличается от классического.
- Считать парадигмы взаимоисключающими — в реальном коде они смешиваются.

### Связанные темы

- `032-chto-takoe-chistaya-funkciya.md`
- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `046-chto-takoe-prototipnoe-nasledovanie.md`
