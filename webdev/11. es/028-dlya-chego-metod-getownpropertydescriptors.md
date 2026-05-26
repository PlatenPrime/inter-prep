# Q028. Для чего используется метод `.getOwnPropertyDescriptors()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Object.getOwnPropertyDescriptors(obj)` (ES2017) возвращает объект со всеми дескрипторами собственных свойств: `value`, `writable`, `enumerable`, `configurable`, `get`, `set`. Главное применение — правильное копирование объектов с сохранением геттеров/сеттеров и non-enumerable свойств, что `Object.assign` и spread не делают.

---

## Развёрнутый ответ

### Суть и определение

Каждое свойство объекта описывается **дескриптором (property descriptor)** — внутренним объектом метаданных:

**Data descriptor:**
```javascript
{
  value: 42,           // значение
  writable: true,      // можно ли изменять
  enumerable: true,    // видно в for...in, Object.keys
  configurable: true,  // можно ли переопределять/удалять
}
```

**Accessor descriptor:**
```javascript
{
  get: function() { return this._x; },
  set: function(v) { this._x = v; },
  enumerable: true,
  configurable: true,
}
```

`Object.getOwnPropertyDescriptor(obj, 'propName')` — один дескриптор.
`Object.getOwnPropertyDescriptors(obj)` — все дескрипторы сразу (ES2017).

### Как это работает

```javascript
const obj = {
  name: 'Alice',
  get greeting() { return `Hello, ${this.name}`; },
};

Object.getOwnPropertyDescriptors(obj);
// {
//   name: { value: 'Alice', writable: true, enumerable: true, configurable: true },
//   greeting: {
//     get: [Function: get greeting],
//     set: undefined,
//     enumerable: true,
//     configurable: true
//   }
// }
```

### Практика и применение

**Правильное копирование с геттерами/сеттерами:**
```javascript
const source = {
  get fullName() { return `${this.first} ${this.last}`; },
  first: 'Alice',
  last: 'Smith',
};

// ПЛОХО: Object.assign копирует вычисленное значение геттера
const bad = Object.assign({}, source);
// bad.fullName === 'Alice Smith' — строка, не геттер!

// ХОРОШО: сохраняем геттер как есть
const good = Object.create(
  Object.getPrototypeOf(source),
  Object.getOwnPropertyDescriptors(source)
);
good.first = 'Bob';
good.fullName; // 'Bob Smith' — геттер работает!
```

**Копирование non-enumerable свойств:**
```javascript
const obj = {};
Object.defineProperty(obj, 'hidden', {
  value: 42,
  enumerable: false,
  writable: false,
  configurable: false,
});

// Spread и Object.assign НЕ копируют non-enumerable
const copy1 = { ...obj };       // {} — hidden не скопирован
const copy2 = Object.assign({}, obj); // {} — то же

// getOwnPropertyDescriptors копирует всё
const copy3 = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
copy3.hidden; // 42
```

**Миксины с сохранением дескрипторов:**
```javascript
const Serializable = {
  toJSON() { return JSON.stringify(this); },
  get serialized() { return JSON.stringify(this); },
};

function mixin(target, ...sources) {
  for (const source of sources) {
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
  }
  return target;
}
```

**Инспекция/отладка:**
```javascript
// Понять, почему свойство нельзя изменить
const desc = Object.getOwnPropertyDescriptor(obj, 'prop');
console.log(`writable: ${desc?.writable}, configurable: ${desc?.configurable}`);
```

### Важные нюансы и краеугольные камни

- **Не включает унаследованные свойства** — только собственные (own), как и `Object.getOwnPropertyNames`.
- **Включает Symbol-ключи**: в отличие от `Object.keys`, возвращает и Symbol-свойства.
- **Замороженные (`Object.freeze`) свойства** имеют `writable: false, configurable: false`.
- **Разница с `Object.keys`**: `getOwnPropertyDescriptors` видит non-enumerable и Symbol; `Object.keys` — только enumerable строковые.
- **`Object.defineProperties(target, descriptors)`** — симметричный метод для установки дескрипторов.

### Примеры

```javascript
// Shallow clone с сохранением всех характеристик
function shallowClone(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

class Person {
  #age;
  constructor(name, age) {
    this.name = name;
    this.#age = age;
  }
  get info() { return `${this.name}, ${this.#age}`; }
}

const alice = new Person('Alice', 30);
// Дескрипторы покажут геттер 'info'
Object.getOwnPropertyDescriptors(alice);
// { name: {...}, info: { get: fn, set: undefined, enumerable: true, configurable: true } }

// Проверка всех свойств frozen объекта
const frozen = Object.freeze({ x: 1, y: 2 });
const descs = Object.getOwnPropertyDescriptors(frozen);
// { x: { value: 1, writable: false, enumerable: true, configurable: false }, ... }

// Создание readonly-версии объекта
function makeReadOnly(obj) {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  for (const key of Object.keys(descriptors)) {
    if (descriptors[key].writable !== undefined) {
      descriptors[key].writable = false;
    }
  }
  return Object.defineProperties({}, descriptors);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `Object.assign` не копирует геттеры?** — `assign` читает значение (вызывает геттер) и присваивает результат — теряет сам геттер.
- **Чем отличается от `Object.getOwnPropertyNames`?** — `getOwnPropertyNames` возвращает имена (строки); `getOwnPropertyDescriptors` — объект с мета-данными каждого свойства.
- **Включает ли Symbol-ключи?** — Да, в отличие от `Object.keys`.
- **Как создать полную копию с геттерами и прототипом?** — `Object.create(Object.getPrototypeOf(source), Object.getOwnPropertyDescriptors(source))`.

### Красные флаги (чего не говорить)

- «`Object.assign` правильно копирует геттеры» — нет, копирует вычисленное значение.
- «`getOwnPropertyDescriptors` включает унаследованные свойства» — нет, только собственные.

### Связанные темы

- [`027-raznica-object-freeze-i-const.md`](027-raznica-object-freeze-i-const.md)
- [`029-metody-keys-values-entries.md`](029-metody-keys-values-entries.md)
