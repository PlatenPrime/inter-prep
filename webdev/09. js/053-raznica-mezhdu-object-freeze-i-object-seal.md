# Q053. Разница между `Object.freeze()` и `Object.seal()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Object.freeze()` делает объект полностью неизменяемым: нельзя добавлять, удалять или **изменять** свойства. `Object.seal()` запрещает добавление и удаление свойств, но **изменение значений существующих свойств** — разрешено. Оба работают только на верхнем уровне (shallow), вложенные объекты не замораживаются.

---

## Развёрнутый ответ

### `Object.freeze()`

```javascript
const obj = Object.freeze({ x: 1, y: 2 });

obj.x = 99;     // тихо игнорируется (в strict mode — TypeError)
obj.z = 3;      // тихо игнорируется
delete obj.x;   // тихо игнорируется

console.log(obj); // { x: 1, y: 2 } — не изменился

// Проверка
Object.isFrozen(obj); // true
```

Все дескрипторы свойств: `writable: false`, `configurable: false`.

### `Object.seal()`

```javascript
const obj = Object.seal({ x: 1, y: 2 });

obj.x = 99;     // РАЗРЕШЕНО — изменение существующего
obj.z = 3;      // тихо игнорируется — нельзя добавить
delete obj.x;   // тихо игнорируется — нельзя удалить

console.log(obj); // { x: 99, y: 2 }

// Проверка
Object.isSealed(obj);  // true
Object.isFrozen(obj);  // false
```

Дескрипторы: `configurable: false`, но `writable` не меняется.

### Shallow: вложенные объекты не затронуты

```javascript
const config = Object.freeze({
  server: { host: 'localhost', port: 3000 } // вложенный объект
});

config.server = {};       // заблокировано — свойство верхнего уровня
config.server.host = 'remote'; // РАЗРЕШЕНО — вложенный объект не заморожен!
console.log(config.server.host); // "remote"
```

**Глубокое замораживание:**
```javascript
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const value = obj[name];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}
```

### Практика и применение

- **`Object.freeze`** — константы, конфигурации, иммутабельные значения состояния в Redux/Zustand.
- **`Object.seal`** — «закрытые» объекты: структура фиксирована, но значения обновляемы. Полезно для schema-like объектов.
- **`const` ≠ `Object.freeze`** — `const` запрещает переприсваивание переменной, но не мутацию объекта.

### Важные нюансы и краеугольные камни

- В **sloppy mode** попытки нарушить freeze/seal тихо игнорируются. В **strict mode** — `TypeError`.
- `Object.freeze` не влияет на Symbol-свойства — нужен особый подход для полного замораживания.
- Замороженный массив: нельзя `push`/`pop`/`splice`, но можно `arr[0] = x` — нет, тоже нельзя (writable: false).
- `structuredClone` создаёт глубокую копию, но не замороженную.

### Примеры

```javascript
// Immutable конфигурация
const CONFIG = deepFreeze({
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
  },
  features: {
    darkMode: true,
    analytics: false,
  }
});

// Попытка изменить → TypeError в strict mode
CONFIG.api.timeout = 10000; // TypeError!

// const vs freeze
const user = { name: 'Alice' };
user.name = 'Bob';  // OK — const не замораживает содержимое
// user = {};        // TypeError — нельзя переприсвоить const

const frozenUser = Object.freeze({ name: 'Alice' });
frozenUser.name = 'Bob'; // TypeError — заморожено
```

---

## Сравнение

| Критерий | `Object.freeze()` | `Object.seal()` |
|----------|-------------------|-----------------|
| Добавить свойство | ✗ | ✗ |
| Удалить свойство | ✗ | ✗ |
| Изменить значение | ✗ | ✓ |
| `writable` | `false` | Не меняется |
| `configurable` | `false` | `false` |
| Вложенные объекты | Не затронуты | Не затронуты |
| Проверка | `Object.isFrozen()` | `Object.isSealed()` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое «поверхностная» заморозка?** — Freeze/seal работают только на первом уровне; вложенные объекты остаются изменяемыми.
- **Чем `const` отличается от `Object.freeze`?** — `const` запрещает переприсваивание ссылки; `freeze` запрещает мутацию объекта по ссылке.
- **Как реализовать глубокую заморозку?** — Рекурсивный обход всех свойств-объектов + freeze.

### Красные флаги (чего не говорить)

- «`const` замораживает объект» — нет, только фиксирует ссылку.
- «`Object.freeze` работает глубоко» — нет, только первый уровень.

### Связанные темы

- `054-dlya-chego-ispolzuetsya-object-seal.md`
- `058-plyusy-i-minusy-immutabelnosti.md`
- `055-raznica-mezhdu-deep-i-shallow-kopiyami-obiekta.md`
