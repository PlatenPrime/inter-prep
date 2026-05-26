# Q013. Что такое дескрипторы свойств объектов?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Дескриптор свойства** — объект метаданных, описывающий поведение свойства объекта в JavaScript. Существует два типа: **дескриптор данных** (`value`, `writable`) и **дескриптор доступа** (`get`, `set`). Оба имеют флаги `enumerable` и `configurable`. Управление дескрипторами осуществляется через `Object.defineProperty` / `Object.defineProperties` и `Object.getOwnPropertyDescriptor`.

---

## Развёрнутый ответ

### Суть и определение

Каждое свойство объекта хранит не только значение, но и набор флагов, контролирующих его поведение.

#### Дескриптор данных (data descriptor)

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|-------------|---------|
| `value` | any | `undefined` | Значение свойства |
| `writable` | boolean | `false` | Можно ли перезаписать |
| `enumerable` | boolean | `false` | Видно ли в `for...in` и `Object.keys()` |
| `configurable` | boolean | `false` | Можно ли изменить дескриптор или удалить свойство |

#### Дескриптор доступа (accessor descriptor)

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|-------------|---------|
| `get` | function | `undefined` | Геттер |
| `set` | function | `undefined` | Сеттер |
| `enumerable` | boolean | `false` | Видимость |
| `configurable` | boolean | `false` | Изменяемость дескриптора |

---

### Чтение дескриптора

```javascript
const obj = { name: 'Alice' };

Object.getOwnPropertyDescriptor(obj, 'name');
// { value: 'Alice', writable: true, enumerable: true, configurable: true }

// При создании через Object.defineProperty — умолчания false
const obj2 = {};
Object.defineProperty(obj2, 'id', { value: 42 });
Object.getOwnPropertyDescriptor(obj2, 'id');
// { value: 42, writable: false, enumerable: false, configurable: false }
```

---

### Флаг `writable`

```javascript
const config = {};
Object.defineProperty(config, 'MAX_SIZE', {
  value: 100,
  writable: false,    // нельзя перезаписать
  enumerable: true,
  configurable: false
});

config.MAX_SIZE = 200;  // В strict mode — TypeError; в sloppy mode — молча игнорируется
console.log(config.MAX_SIZE); // 100
```

---

### Флаг `enumerable`

```javascript
const user = { name: 'Alice' };
Object.defineProperty(user, '_secret', {
  value: 'token-xyz',
  enumerable: false,  // не появится в for...in, Object.keys(), JSON.stringify
  writable: true,
  configurable: true
});

Object.keys(user);              // ['name']
JSON.stringify(user);           // '{"name":"Alice"}'
user._secret;                   // 'token-xyz' — доступно напрямую
```

---

### Флаг `configurable`

```javascript
const obj = {};
Object.defineProperty(obj, 'locked', {
  value: 42,
  configurable: false,
  writable: false,
  enumerable: true
});

// Попытка переопределить — TypeError
Object.defineProperty(obj, 'locked', { value: 99 }); // ❌ TypeError
delete obj.locked;                                     // ❌ false (молча), TypeError в strict
```

---

### Дескриптор доступа (accessor)

```javascript
const temperature = {
  _celsius: 0
};

Object.defineProperty(temperature, 'fahrenheit', {
  get() {
    return this._celsius * 9/5 + 32;
  },
  set(f) {
    this._celsius = (f - 32) * 5/9;
  },
  enumerable: true,
  configurable: true
});

temperature._celsius = 100;
console.log(temperature.fahrenheit); // 212

temperature.fahrenheit = 32;
console.log(temperature._celsius);   // 0
```

---

### Object.freeze, Object.seal, Object.preventExtensions

Высокоуровневые операции, управляющие дескрипторами массово:

```javascript
const obj = { a: 1, b: 2 };

// preventExtensions: нельзя добавить новые свойства
Object.preventExtensions(obj);
obj.c = 3; // игнорируется (TypeError в strict)

// seal: preventExtensions + все configurable → false
Object.seal(obj);
delete obj.a; // false — нельзя
obj.a = 99;   // можно (writable всё ещё true)

// freeze: seal + все writable → false
Object.freeze(obj);
obj.a = 0;   // игнорируется
// Внимание: shallow freeze — вложенные объекты не заморожены
```

---

### Практика и применение

- **`Object.freeze`** — иммутабельные константы (конфигурации, lookup-объекты)
- **Computed properties в Vue 2** — реализованы через `Object.defineProperty` с геттерами/сеттерами
- **Декораторы TypeScript** — `@readonly`, `@enumerable` управляют дескрипторами методов класса
- **Отладка**: `Object.getOwnPropertyDescriptors(obj)` — увидеть все дескрипторы

### Важные нюансы и краеугольные камни

- Нельзя одновременно задать `value`/`writable` и `get`/`set` — это разные типы дескрипторов
- `configurable: false` **необратимо**: нельзя вернуть `configurable: true`
- Исключение: `configurable: false` + `writable: true` → можно поменять `writable` на `false`, но не обратно
- **Deep freeze** требует рекурсивного обхода — `Object.freeze` только верхний уровень

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как Vue 2 реализует реактивность через defineProperty?** — При инициализации Vue проходит по свойствам `data` и переопределяет их через `get`/`set`; `set` вызывает обновление компонента.
- **Чем `Object.freeze` отличается от `const`?** — `const` запрещает переназначение переменной; `freeze` запрещает мутацию объекта. `const` не делает объект иммутабельным.
- **Как сделать deep freeze?** — Рекурсивно применять `Object.freeze` ко всем вложенным объектам.

### Красные флаги (чего не говорить)

- «`Object.freeze` — полная иммутабельность» — shallow; вложенные объекты мутируемы.
- «Дескрипторы — редко нужная функция» — Vue 2, Proxy, декораторы активно их используют.

### Связанные темы

- `014-osobennosti-getterov-i-setterov.md`
- `015-mekhanizm-prototipov-v-js.md`
- `012-staticheskiy-metod-klassa-static.md`
