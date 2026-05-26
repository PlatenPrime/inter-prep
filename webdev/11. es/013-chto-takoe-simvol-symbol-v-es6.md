# Q013. Что такое символ (`Symbol`) в ES6?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Symbol` — примитивный тип данных ES2015, каждое значение которого уникально и неизменяемо. Символы создаются через `Symbol(description)` и гарантированно не конфликтуют ни с какими другими ключами — даже с одинаковым описанием. Основное назначение: создание уникальных идентификаторов свойств объектов, реализация протоколов через well-known symbols и создание приватных/полу-приватных ключей.

---

## Развёрнутый ответ

### Суть и определение

До ES2015 типы данных в JS: `undefined`, `null`, `boolean`, `number`, `string`, `object`. ES2015 добавил `symbol` — седьмой примитивный тип (ES2020 добавил `bigint` — восьмой).

`Symbol()` всегда возвращает **уникальное** значение:
```javascript
Symbol('foo') === Symbol('foo'); // false — каждый Symbol уникален
```

### Как это работает

Символы хранятся в движке как уникальные непрозрачные токены. Описание (строка в `Symbol('desc')`) — только для отладки (`symbol.description`, `.toString()`), на уникальность не влияет.

**Symbol.for / Symbol.keyFor** — глобальный реестр символов:
```javascript
const s1 = Symbol.for('shared');
const s2 = Symbol.for('shared');
s1 === s2; // true — один и тот же из реестра
Symbol.keyFor(s1); // 'shared'
```

### Практика и применение

**Уникальные ключи объекта без коллизий:**
```javascript
const ID = Symbol('id');
const obj = {
  [ID]: 12345,
  name: 'Alice',
};
obj[ID]; // 12345 — доступ только через Symbol
```

**Well-known Symbols** — стандартные символы для кастомизации поведения:
```javascript
// Symbol.iterator — делает объект итерируемым
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  }
}
[...new Range(1, 5)]; // [1, 2, 3, 4, 5]

// Symbol.toPrimitive
class Money {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.amount} ${this.currency}`;
    return this.amount;
  }
}
const price = new Money(100, 'USD');
+price;          // 100
`${price}`;      // '100 USD'
price + 50;      // 150

// Symbol.hasInstance — кастомный instanceof
class EvenNumber {
  static [Symbol.hasInstance](num) { return typeof num === 'number' && num % 2 === 0; }
}
2 instanceof EvenNumber; // true
3 instanceof EvenNumber; // false
```

**Enum-подобные константы:**
```javascript
const Direction = Object.freeze({
  UP: Symbol('UP'),
  DOWN: Symbol('DOWN'),
  LEFT: Symbol('LEFT'),
  RIGHT: Symbol('RIGHT'),
});
// Direction.UP !== Direction.DOWN — гарантированно
```

### Важные нюансы и краеугольные камни

- **Символы не перечисляемы** в `for...in`, `Object.keys()`, `JSON.stringify()` — «скрытые» свойства.
- **`Object.getOwnPropertySymbols(obj)`** — единственный способ получить символьные ключи объекта.
- **`Symbol()` нельзя вызвать через `new`**: `new Symbol()` → TypeError.
- **Нет автоматического преобразования в строку**: `'prefix' + Symbol()` → TypeError. Нужно явно: `Symbol().toString()` или `String(Symbol())`.
- **Symbol.for** — глобальный (cross-realm), обычные `Symbol()` — нет. Это важно при работе с iframe, Worker.
- **В JSON символы игнорируются**: `JSON.stringify({ [Symbol()]: 1, a: 2 })` → `'{"a":2}'`.

### Примеры

```javascript
// Скрытые мета-свойства
const _private = Symbol('private');
class Service {
  constructor() {
    this[_private] = { token: 'secret-token' };
  }
  getToken() { return this[_private].token; }
}
const svc = new Service();
svc.getToken(); // 'secret-token'
Object.keys(svc); // [] — символ не виден
JSON.stringify(svc); // '{}' — символ игнорируется

// Well-known Symbol: Symbol.asyncIterator
async function* asyncRange(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise(r => setTimeout(r, 10));
    yield i;
  }
}
for await (const num of asyncRange(1, 3)) {
  console.log(num); // 1, 2, 3
}

// Symbol.species — кастомизация return type
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
const myArr = new MyArray(1, 2, 3);
const mapped = myArr.map(x => x * 2);
mapped instanceof MyArray; // false — вернёт обычный Array
mapped instanceof Array;   // true
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое well-known symbols?** — Встроенные символы (`Symbol.iterator`, `Symbol.toPrimitive` и т.д.) для кастомизации встроенных операций JS.
- **Видны ли символьные ключи через `JSON.stringify`?** — Нет, символы игнорируются при сериализации.
- **В чём разница `Symbol()` и `Symbol.for()`?** — `Symbol()` — всегда уникальный; `Symbol.for('key')` — глобальный реестр, один символ для одного ключа.
- **Почему символы нельзя использовать в строковой конкатенации?** — Предотвращает случайное преобразование к строке; нужно явное `String(sym)`.

### Красные флаги (чего не говорить)

- «Символы — это строки с уникальным именем» — нет, это отдельный примитивный тип.
- «`Symbol('a') === Symbol('a')` — true» — нет, каждый Symbol уникален.
- «Символы полностью приватны» — не совсем: `Object.getOwnPropertySymbols` их находит.

### Связанные темы

- [`023-chto-takoe-iteratory.md`](023-chto-takoe-iteratory.md)
- [`019-chto-takoe-set-map-weakmap-i-weakset.md`](019-chto-takoe-set-map-weakmap-i-weakset.md)
