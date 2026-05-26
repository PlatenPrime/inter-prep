# Q059. Зачем нужен конструктор `Proxy`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Proxy` — встроенный объект (ES2015), позволяющий создать прозрачную «обёртку» вокруг другого объекта и перехватывать/переопределять фундаментальные операции: чтение/запись свойств, вызов функций, проверку наличия ключа (`in`), удаление и др. Используется для валидации, логирования, реактивности (Vue 3), ORM, виртуальных свойств.

---

## Развёрнутый ответ

### Синтаксис

```javascript
const proxy = new Proxy(target, handler);
```

- `target` — объект-цель (оригинал).
- `handler` — объект с «ловушками» (traps) — методами, перехватывающими операции.

### Основные ловушки (traps)

| Trap | Перехватывает |
|------|--------------|
| `get(target, prop, receiver)` | Чтение свойства `obj.prop` |
| `set(target, prop, value, receiver)` | Запись `obj.prop = value` |
| `has(target, prop)` | Оператор `in` |
| `deleteProperty(target, prop)` | `delete obj.prop` |
| `apply(target, thisArg, args)` | Вызов функции `fn()` |
| `construct(target, args)` | `new Constructor()` |
| `ownKeys(target)` | `Object.keys()`, `for...in` |
| `defineProperty(target, prop, descriptor)` | `Object.defineProperty` |

### Примеры использования

**1. Валидация при записи:**
```javascript
const user = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number') throw new TypeError('age must be a number');
      if (value < 0 || value > 150) throw new RangeError('Invalid age');
    }
    target[prop] = value;
    return true; // обязательно возвращать true при успехе
  }
});

user.name = 'Alice'; // OK
user.age = 30;       // OK
user.age = 'thirty'; // TypeError!
user.age = -5;       // RangeError!
```

**2. Логирование / debugging:**
```javascript
function createLogger(obj, name = 'obj') {
  return new Proxy(obj, {
    get(target, prop) {
      console.log(`[GET] ${name}.${String(prop)}`);
      return target[prop];
    },
    set(target, prop, value) {
      console.log(`[SET] ${name}.${String(prop)} = ${JSON.stringify(value)}`);
      target[prop] = value;
      return true;
    }
  });
}

const loggedUser = createLogger({ name: 'Alice' }, 'user');
loggedUser.name;       // [GET] user.name
loggedUser.age = 30;   // [SET] user.age = 30
```

**3. Реактивность (как во Vue 3):**
```javascript
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value) {
      const old = target[prop];
      target[prop] = value;
      if (old !== value) onChange(prop, value, old);
      return true;
    }
  });
}

const state = reactive({ count: 0 }, (key, val) => {
  console.log(`${key} changed to ${val}`);
  render(state);
});

state.count++; // "count changed to 1" → render
```

**4. Виртуальные свойства / default значения:**
```javascript
const withDefaults = new Proxy({}, {
  get(target, prop) {
    return prop in target ? target[prop] : `[${String(prop)} not found]`;
  }
});

withDefaults.name = 'Alice';
withDefaults.name;  // 'Alice'
withDefaults.email; // '[email not found]'
```

### Практика и применение

- **Vue 3 reactivity system** — построена на Proxy (Vue 2 использовал `Object.defineProperty`).
- **MobX 5+** — также Proxy для автоматического отслеживания зависимостей.
- **ORM / DB-abstraction** — виртуальные поля, lazy-loading через Proxy.
- **Immer** — draft-объекты реализованы через Proxy.
- **Тестирование** — мок-объекты с перехватом вызовов.

### Важные нюансы и краеугольные камни

- `get` trap для функций: нужно вернуть функцию, привязанную к target, чтобы `this` работал правильно.
- `set` trap должен вернуть `true` (успех) или `false` (неудача) — в strict mode `false` бросает `TypeError`.
- `Reflect` — объект-компаньон Proxy: `Reflect.get(target, prop, receiver)` выполняет дефолтное поведение.
- Proxy нельзя «распаковать» — нет способа получить target из proxy снаружи.
- Производительность: Proxy добавляет overhead при каждом перехватываемом обращении.

### Примеры

```javascript
// Правильный get trap с Reflect
const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    console.log(`Accessing: ${String(prop)}`);
    return Reflect.get(target, prop, receiver); // правильный this binding
  }
});

// Отменяемый Proxy (Proxy.revocable)
const { proxy, revoke } = Proxy.revocable({ data: 'secret' }, {});
proxy.data; // 'secret'
revoke();
proxy.data; // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как Vue 3 использует Proxy?** — Перехватывает get/set для отслеживания зависимостей и запуска обновлений.
- **Зачем использовать `Reflect` вместе с Proxy?** — `Reflect` предоставляет дефолтное поведение с правильным receiver (this), избегая бесконечной рекурсии.
- **Что такое `Proxy.revocable`?** — Создаёт proxy с методом `revoke()`, который делает его недоступным.

### Красные флаги (чего не говорить)

- «Proxy — просто обёртка для логирования» — это мощный метапрограммный инструмент.
- «`Object.defineProperty` делает то же самое» — у него нет трапов для `has`, `deleteProperty`, вызовов функций.

### Связанные темы

- `060-kak-sozdat-obekty-s-privatnymi-svoystvami.md`
- `044-tipy-obektov-javascript.md`
- `058-plyusy-i-minusy-immutabelnosti.md`
