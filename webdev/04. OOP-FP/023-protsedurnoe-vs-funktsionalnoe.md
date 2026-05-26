# Q023. Разница между процедурным и функциональным программированием?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Процедурное программирование** — подмножество императивного: программа разбита на процедуры (функции/подпрограммы), которые выполняют шаги и могут изменять общее состояние. **Функциональное программирование** — декларативная парадигма, где функции — чистые математические отображения без сайд-эффектов и мутации. Ключевое различие: процедуры **изменяют состояние**, ФП-функции — **трансформируют данные**, возвращая новые значения.

---

## Развёрнутый ответ

### Суть и определение

| Аспект | Процедурное | Функциональное |
|--------|-------------|---------------|
| Основа | Процедуры (подпрограммы) | Чистые функции |
| Состояние | Изменяется через переменные | Иммутабельное, передаётся явно |
| Сайд-эффекты | Нормальная практика | Изолируются |
| Стиль | Императивный | Декларативный |
| Языки | C, Pascal, ранний JS | Haskell, Erlang, Elm, Clojure |
| JS примеры | Скрипты с глобальными переменными | `map/filter/reduce`, redux reducer |

---

### Процедурный подход

```javascript
// Процедурный: глобальное состояние, мутация, шаги
let inventory = [];
let totalValue = 0;

function addItem(name, price, quantity) {
  inventory.push({ name, price, quantity }); // мутация глобального состояния
  updateTotal();
}

function updateTotal() {
  totalValue = 0;
  for (let i = 0; i < inventory.length; i++) {
    totalValue += inventory[i].price * inventory[i].quantity; // мутация
  }
}

function removeItem(name) {
  const index = inventory.findIndex(item => item.name === name);
  if (index !== -1) {
    inventory.splice(index, 1); // мутация
    updateTotal();
  }
}

addItem('Apple', 1.5, 10);
addItem('Banana', 0.5, 20);
console.log(totalValue); // 25
```

---

### Функциональный подход

```typescript
// Функциональный: иммутабельное состояние, чистые функции
interface InventoryItem {
  name: string;
  price: number;
  quantity: number;
}

type Inventory = InventoryItem[];

// Чистые функции — нет мутации, нет сайд-эффектов
const addItem = (inventory: Inventory, item: InventoryItem): Inventory =>
  [...inventory, item];

const removeItem = (inventory: Inventory, name: string): Inventory =>
  inventory.filter(item => item.name !== name);

const calcTotal = (inventory: Inventory): number =>
  inventory.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Состояние передаётся явно
let inventory: Inventory = [];
inventory = addItem(inventory, { name: 'Apple', price: 1.5, quantity: 10 });
inventory = addItem(inventory, { name: 'Banana', price: 0.5, quantity: 20 });

calcTotal(inventory); // 25 — нет глобального состояния
```

---

### Различие в работе с состоянием

```typescript
// --- Процедурный: функция зависит от внешнего состояния ---
let taxRate = 0.2;

function calcPrice(basePrice: number): number {
  return basePrice + basePrice * taxRate; // зависит от внешней переменной
}

taxRate = 0.3;
calcPrice(100); // 130 — поведение изменилось, не вызов!

// --- Функциональный: все зависимости — аргументы ---
const calcPriceFP = (basePrice: number, rate: number): number =>
  basePrice + basePrice * rate;

calcPriceFP(100, 0.2); // 120 — всегда
calcPriceFP(100, 0.3); // 130 — всегда
// Одни и те же аргументы → один и тот же результат
```

---

### Рекурсия вместо итерации

В ФП рекурсия — основной механизм повторения (вместо циклов):

```typescript
// Процедурный: цикл + мутация
function factorialImperative(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i; // мутация result
  }
  return result;
}

// Функциональный: рекурсия, нет мутации
const factorialFP = (n: number): number =>
  n <= 1 ? 1 : n * factorialFP(n - 1);

// Оптимизация: хвостовая рекурсия (TCO)
const factorialTCO = (n: number, acc = 1): number =>
  n <= 1 ? acc : factorialTCO(n - 1, n * acc);
```

---

### Управление сайд-эффектами

```typescript
// Процедурный: сайд-эффекты разбросаны по всему коду
function processOrder(orderId: string): void {
  const order = db.getOrder(orderId); // I/O — сайд-эффект
  if (order.total > 1000) {
    discount = 0.1;                   // мутация внешнего состояния
  }
  db.updateOrder(orderId, { discount }); // I/O — сайд-эффект
  emailService.send(order.email);    // I/O — сайд-эффект
}

// Функциональный: чистое ядро + сайд-эффекты на краях
// Чистая функция — тестируемая бизнес-логика
const calcDiscount = (total: number): number =>
  total > 1000 ? 0.1 : 0;

// Сайд-эффекты изолированы в оболочке
async function processOrder(orderId: string): Promise<void> {
  const order = await db.getOrder(orderId);          // I/O — здесь
  const discount = calcDiscount(order.total);        // чистая функция
  await db.updateOrder(orderId, { discount });       // I/O — здесь
  await emailService.send(order.email, discount);    // I/O — здесь
}
```

---

### Практика и применение

- Процедурный стиль — в простых скриптах, CLI-утилитах, shell-скриптах
- Функциональный стиль — Redux reducers, трансформации данных, утилиты
- Большинство реального JS/TS — смесь: классы (ООП) + чистые функции для логики (ФП)

### Важные нюансы и краеугольные камни

- **Процедурное != плохо**: простые последовательные задачи — читаемее процедурно
- JavaScript не является функциональным языком: нет гарантий чистоты, нет TCO в большинстве движков
- **Tail Call Optimization (TCO)** в ES6 — есть в спецификации, но поддерживается только в Safari/JSC на практике; Node.js не поддерживает

---

## Сравнение

| Критерий | Процедурное | Функциональное |
|----------|-------------|---------------|
| Состояние | Изменяемое, часто глобальное | Иммутабельное, явное |
| Повторение | Циклы (`for`, `while`) | Рекурсия, HOF |
| Зависимости | Неявные (глобал. переменные) | Явные (аргументы) |
| Тестируемость | Сложнее | Проще |
| Читаемость для новичков | Выше | Ниже |
| Отладка | Проще отследить шаги | Сложнее при глубокой рекурсии |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Процедурное — это ООП?** — Нет: процедурное появилось раньше ООП; C — процедурный, но не ОО. ООП добавляет инкапсуляцию и полиморфизм поверх.
- **Почему рекурсия предпочтительна в ФП?** — Нет мутации итератора; выражение через базовый случай + шаг математически чисто.
- **Что такое TCO и почему важно в ФП?** — Хвостовая рекурсия без роста стека; позволяет обрабатывать большие данные рекурсивно.

### Красные флаги (чего не говорить)

- «Процедурное программирование = плохой код» — это базовый подход, подходящий для многих задач.
- «Все функции в JS — ФП» — только чистые функции относятся к ФП-стилю.

### Связанные темы

- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `022-imperativnyy-vs-deklarativnyy-podkhod.md`
- `017-osnovnye-printsipy-fp.md`
