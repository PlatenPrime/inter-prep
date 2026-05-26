# Q035. Что такое замыкание (Closure)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Замыкание (closure)** — функция, которая «помнит» переменные из своего лексического окружения (внешнего scope) даже после того, как внешняя функция завершила выполнение. В JavaScript каждая функция образует замыкание над переменными scope, в котором была объявлена.

---

## Развёрнутый ответ

### Суть и определение

Замыкание = функция + её лексическое окружение (lexical environment). Когда функция возвращает другую функцию, внутренняя функция сохраняет ссылку на переменные родительского scope — они не удаляются сборщиком мусора, пока есть ссылки на внутреннюю функцию.

### Как это работает

```javascript
function makeCounter() {
  let count = 0; // переменная в scope makeCounter

  return function() {
    count++;     // ссылается на count из внешнего scope
    return count;
  };
}

const counter = makeCounter(); // makeCounter завершился...
counter(); // 1 — count: 1 — но count всё ещё жив!
counter(); // 2
counter(); // 3

const counter2 = makeCounter(); // отдельное замыкание, свой count
counter2(); // 1 — независимо от counter
```

**Механизм:** при создании функции движок прикрепляет к ней ссылку на текущий lexical environment (объект переменных). При вызове — цепочка окружений обходится для поиска переменных.

### Практика и применение

**1. Приватные данные (encapsulation):**
```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // приватная переменная

  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
    },
    getBalance() { return balance; },
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.getBalance(); // 150
account.balance;      // undefined — недоступно снаружи!
```

**2. Частичное применение / фабрика функций:**
```javascript
function createLogger(prefix) {
  return (message) => console.log(`[${prefix}] ${message}`);
}
const infoLog = createLogger('INFO');
const errorLog = createLogger('ERROR');

infoLog('Server started');  // [INFO] Server started
errorLog('Not found');      // [ERROR] Not found
```

**3. Мемоизация:**
```javascript
function memoize(fn) {
  const cache = new Map(); // замкнуто в cache
  return (...args) => {
    const key = JSON.stringify(args);
    return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key);
  };
}
```

### Важные нюансы и краеугольные камни

- **Ловушка `var` в цикле:** все замыкания разделяют одну переменную `var i`:
```javascript
// Ловушка
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}
// Решение: let создаёт новый scope на каждой итерации
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
```

- **Утечки памяти:** замыкание удерживает весь lexical environment в памяти. Если замыкание живёт долго и держит ссылку на большой объект — утечка. Обнуляйте ненужные ссылки.
- Замыкания создаются при каждом вызове функции — у каждого экземпляра свой набор переменных.

### Примеры

```javascript
// React: useState под капотом — замыкание
function useState(initial) {
  let state = initial;
  return [
    () => state,                        // getter
    (newState) => { state = newState; } // setter
  ];
}

// Event handler с данными из closure
function attachHandlers(items) {
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      console.log(`Clicked item #${index}: ${item.text}`);
      // index и item замкнуты для каждого обработчика
    });
  });
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему замыкание может вызвать утечку памяти?** — Замкнутые переменные не освобождаются GC пока живёт замыкание; если держит ссылку на DOM-элемент — утечка.
- **Решите классическую задачу: `for var` + `setTimeout`** — Использовать `let`, IIFE или `bind(null, i)`.
- **Сколько замыканий создаст функция при 100 вызовах?** — 100 отдельных lexical environments с независимыми копиями переменных.

### Красные флаги (чего не говорить)

- «Замыкание — это когда функция внутри функции» — вложенность необходима, но суть в доступе к переменным внешнего scope.
- «Замыкания — это копии переменных» — это **ссылки** на переменные; изменение переменной видно через замыкание.

### Связанные темы

- `021-chto-takoe-oblast-vidimosti-scope.md`
- `022-chto-takoe-podnyatie-hoisting.md`
- `037-chto-takoe-memoizaciya-realizuyte-bazvuyu-logiku.md`
- `079-chto-takoe-utechki-pamyati.md`
