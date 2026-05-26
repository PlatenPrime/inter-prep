# Q038. Что такое цепочка вызовов функций (chaining)? Как реализовать такой подход?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Chaining (цепочка вызовов)** — паттерн, при котором каждый метод возвращает объект (`this` или новый объект), что позволяет вызывать следующий метод через точку без промежуточных переменных. Для реализации достаточно, чтобы каждый метод возвращал `this` (для мутирующих операций) или новый объект (для иммутабельных).

---

## Развёрнутый ответ

### Суть и определение

```javascript
// Без chaining
const arr = [1, 2, 3, 4, 5];
const filtered = arr.filter(x => x > 2);
const mapped = filtered.map(x => x * 2);
const result = mapped.reduce((a, b) => a + b, 0);

// С chaining
const result = [1, 2, 3, 4, 5]
  .filter(x => x > 2)   // [3, 4, 5]
  .map(x => x * 2)       // [6, 8, 10]
  .reduce((a, b) => a + b, 0); // 24
```

Встроенные примеры chaining в JS: `Array`, `Promise`, `jQuery`, строки (`str.trim().toLowerCase().split(' ')`).

### Реализация через `return this`

```javascript
class QueryBuilder {
  #table = '';
  #conditions = [];
  #limit = null;
  #offset = 0;

  from(table) {
    this.#table = table;
    return this; // ← ключ к chaining
  }

  where(condition) {
    this.#conditions.push(condition);
    return this;
  }

  limit(n) {
    this.#limit = n;
    return this;
  }

  offset(n) {
    this.#offset = n;
    return this;
  }

  build() {
    let query = `SELECT * FROM ${this.#table}`;
    if (this.#conditions.length) {
      query += ` WHERE ${this.#conditions.join(' AND ')}`;
    }
    if (this.#limit !== null) query += ` LIMIT ${this.#limit}`;
    if (this.#offset) query += ` OFFSET ${this.#offset}`;
    return query;
  }
}

const query = new QueryBuilder()
  .from('users')
  .where('active = true')
  .where('age > 18')
  .limit(10)
  .offset(20)
  .build();
// "SELECT * FROM users WHERE active = true AND age > 18 LIMIT 10 OFFSET 20"
```

### Иммутабельный chaining (новый объект)

Возврат `this` мутирует исходный объект. Для иммутабельности — возвращать новый объект:

```javascript
class ImmutableList {
  constructor(items = []) {
    this._items = [...items];
  }

  add(item) {
    return new ImmutableList([...this._items, item]); // новый объект
  }

  filter(predicate) {
    return new ImmutableList(this._items.filter(predicate));
  }

  map(fn) {
    return new ImmutableList(this._items.map(fn));
  }

  toArray() {
    return [...this._items];
  }
}

const result = new ImmutableList([1, 2, 3])
  .add(4)
  .filter(x => x % 2 === 0)
  .map(x => x * 10)
  .toArray(); // [20, 40]
```

### Практика и применение

- **Fluent API:** `axios`, `knex`, `mongoose`, jQuery — все строятся на chaining.
- **Promise цепочки:** `.then().catch().finally()` — иммутабельный chaining.
- **Array методы** — встроенный chaining с иммутабельностью (каждый возвращает новый массив).
- **Builder паттерн** — пошаговая конструкция сложных объектов.

### Важные нюансы и краеугольные камни

- Мутирующий chaining (return this) — удобен для builder-паттерна, но опасен при параллельных изменениях.
- Длинные цепочки сложно дебажить: нельзя поставить breakpoint «между» вызовами. Решение — тап-метод: `.tap(x => console.log(x))`.
- Optional chaining `?.` — встроенный «безопасный» chaining для nullable объектов.

### Примеры

```javascript
// tap-метод для дебага
Array.prototype.tap = function(fn) {
  fn(this);
  return this;
};

[1, 2, 3, 4, 5]
  .filter(x => x > 2)
  .tap(arr => console.log('after filter:', arr)) // [3, 4, 5]
  .map(x => x * 2)
  .tap(arr => console.log('after map:', arr));   // [6, 8, 10]

// Promise chaining
fetch('/api/users')
  .then(res => res.json())
  .then(users => users.filter(u => u.active))
  .then(active => active.map(u => u.name))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Разница между мутирующим и иммутабельным chaining?** — Мутирующий: `return this` — изменяет объект; иммутабельный: `return new Instance` — не изменяет.
- **Как реализовать безопасный chaining для nullable объектов?** — Optional chaining `?.` или паттерн Maybe/Option.
- **Что такое Builder паттерн?** — Пошаговое создание сложного объекта через chaining с финальным `build()`.

### Красные флаги (чего не говорить)

- «Chaining всегда иммутабельный» — зависит от реализации; `return this` — мутирующий.

### Связанные темы

- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `042-kak-sozdat-obekt-v-javascript.md`
