# Q004. Как работает boxing/unboxing в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Boxing** — автоматическое оборачивание примитива в объект-обёртку при обращении к его методам или свойствам (autoboxing). **Unboxing** — обратный процесс: извлечение примитивного значения из обёртки, происходит при явном вызове `.valueOf()` или неявной коэрции в арифметических операциях.

---

## Развёрнутый ответ

### Суть и определение

Термины пришли из языков со статической типизацией (Java, C#), где boxing/unboxing — явная операция упаковки примитива в heap-объект. В JavaScript этот процесс **полностью автоматизирован** движком.

- **Boxing (упаковка):** примитив → объект-обёртка.
- **Unboxing (распаковка):** объект-обёртка → примитив.

### Как это работает

**Boxing при доступе к методу:**
```
"hello".length
  │
  └─▶ new String("hello")  [временный объект]
          │
          └─▶ .length → 5
                  │
                  └─▶ объект уничтожается, возвращается 5
```

**Unboxing через valueOf:**
```javascript
const wrapped = new Number(42);
const prim = wrapped.valueOf(); // unboxing → 42
```

**Неявный unboxing в арифметике:**
```javascript
const n = new Number(10);
console.log(n + 5); // 15 — движок вызывает n.valueOf() → 10
```

### Практика и применение

- **Boxing** используется движком повсеместно при вызове методов строк, чисел, булевых. Разработчик обычно не вызывает его явно.
- **Unboxing** через `.valueOf()` нужен при написании пользовательских объектов, которые должны участвовать в арифметических выражениях или сравнениях.
- **Symbol.toPrimitive** — современный стандартный способ контролировать unboxing для своих объектов.

### Важные нюансы и краеугольные камни

- Многократный autoboxing в hot-path снижает производительность: каждый раз создаётся временный объект. Движки (V8, SpiderMonkey) агрессивно оптимизируют это через JIT, но в критических циклах стоит избегать лишних обращений к свойствам примитивов.
- `new Number(42) == 42` → `true` (нестрогое, неявный unboxing), но `new Number(42) === 42` → `false` (строгое, разные типы).
- Для объекта можно определить `Symbol.toPrimitive` и управлять тем, какое примитивное значение возвращается в разных контекстах (`"number"`, `"string"`, `"default"`).

### Примеры

```javascript
// --- Boxing ---
const str = "hello";
console.log(str.toUpperCase()); // autoboxing: String("hello").toUpperCase()

// --- Unboxing явный ---
const wrapped = new String("world");
const primitive = wrapped.valueOf();
console.log(typeof primitive); // "string"
console.log(primitive === "world"); // true

// --- Unboxing неявный ---
const num = new Number(7);
console.log(num * 3); // 21 — valueOf() вызван неявно

// --- Symbol.toPrimitive: пользовательский unboxing ---
const money = {
  amount: 100,
  currency: 'USD',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.amount} ${this.currency}`;
    return this.amount; // 'default'
  }
};

console.log(+money);        // 100
console.log(`${money}`);    // "100 USD"
console.log(money + 50);    // 150
```

---

## Сравнение

| Критерий | Boxing | Unboxing |
|----------|--------|----------|
| Направление | Примитив → Объект | Объект → Примитив |
| Когда происходит | При вызове метода/свойства на примитиве | `.valueOf()`, арифметика, шаблонные строки |
| Явность | Автоматически (autoboxing) | Явно (`valueOf`) или неявно (коэрция) |
| Контроль | — | `Symbol.toPrimitive`, `valueOf`, `toString` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В каком порядке движок ищет метод при autoboxing?** — На прототипе обёртки (`String.prototype`, `Number.prototype`), затем `Object.prototype`.
- **Как влияет boxing на производительность?** — Минимально за счёт JIT, но в микрооптимизациях циклов с миллионами итераций стоит учитывать.
- **Чем `Symbol.toPrimitive` лучше `valueOf`?** — Принимает hint (`"number"`, `"string"`, `"default"`), что позволяет возвращать разные значения в зависимости от контекста.

### Красные флаги (чего не говорить)

- «Boxing и unboxing — это явные операции, которые надо вызывать вручную» — в JS они автоматические.
- «`new Number(5) === 5`» — нет, строгое сравнение объекта с примитивом всегда `false`.

### Связанные темы

- `003-chto-takoe-obektnaya-obertka-wrapper-objects.md`
- `010-raznica-yavnoe-i-neyavnoe-preobrazovanie.md`
- `002-raznica-mezhdu-primitivom-i-obektom.md`
