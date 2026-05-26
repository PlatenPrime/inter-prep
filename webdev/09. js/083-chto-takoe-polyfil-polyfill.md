# Q083. Что такое полифил (polyfill)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Полифил** — это код (обычно JS), который реализует функциональность, отсутствующую в старых браузерах или средах, имитируя поведение нативного API. Полифил «заполняет» (fills) пробелы в поддержке браузерами. Например, если браузер не поддерживает `Array.prototype.flat`, полифил добавляет эту реализацию в `Array.prototype`.

---

## Развёрнутый ответ

### Суть и определение

Полифил — от «polyfilla» (шпаклёвка, которая заполняет трещины). Код «заполняет» недостающие фичи так, чтобы они работали так же как нативные.

Отличие от **шима (shim)** — полифил имитирует нативный API; шим может предоставлять альтернативный API (не обязательно совместимый с будущим нативным).

### Пример ручного полифила

```javascript
// Полифил для Array.prototype.flat (ES2019)
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    if (depth === 0) return this.slice();

    return this.reduce((acc, item) => {
      if (Array.isArray(item) && depth > 0) {
        acc.push(...item.flat(depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  };
}

// Полифил для Object.assign (ES6)
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, ...sources) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      for (const source of sources) {
        if (source != null) {
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              to[key] = source[key];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}
```

### Полифил для Promise (концептуально)

```javascript
// Упрощённая иллюстрация — не production-ready!
if (typeof Promise === 'undefined') {
  window.Promise = class Promise {
    constructor(executor) {
      this._callbacks = [];
      this._state = 'pending';
      this._value = undefined;

      const resolve = (value) => {
        if (this._state !== 'pending') return;
        this._state = 'fulfilled';
        this._value = value;
        this._callbacks.forEach(cb => cb(value));
      };

      executor(resolve);
    }

    then(onFulfilled) {
      if (this._state === 'fulfilled') {
        onFulfilled(this._value);
      } else {
        this._callbacks.push(onFulfilled);
      }
      return this;
    }
  };
}
```

### Инструменты для полифилов

**Babel** — транспилирует синтаксис (не API). Для API нужны полифилы отдельно.

**core-js** — самая полная библиотека полифилов для ES5–ES2024+:
```javascript
// Вариант 1: импортировать всё
import 'core-js/stable';

// Вариант 2: точечный импорт
import 'core-js/features/array/flat';
import 'core-js/features/promise';

// Вариант 3: через Babel с @babel/preset-env + useBuiltIns
// babel.config.js:
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage', // автоматически добавляет нужные полифилы
      corejs: 3,
      targets: '> 0.5%, last 2 versions, not dead',
    }],
  ],
};
```

**Polyfill.io** — CDN-сервис, отдаёт полифилы на основе User-Agent браузера:
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.flat"></script>
```

### Полифил vs Транспиляция (Babel)

| Аспект | Полифил | Транспиляция (Babel) |
|--------|---------|---------------------|
| Что обрабатывает | Новые API/методы | Новый синтаксис |
| Пример | `Promise`, `Array.flat()` | Arrow functions, `const`, `async/await` |
| Механизм | Добавляет в прототипы/объекты | Конвертирует код в ES5 |
| Время работы | Runtime | Compile-time |

### Проверка перед добавлением полифила

```javascript
// ВСЕГДА проверять существование перед переопределением
if (!String.prototype.trimStart) {
  String.prototype.trimStart = function() {
    return this.replace(/^\s+/, '');
  };
}

// Нельзя переопределять нативные методы без проверки!
// String.prototype.trimStart = myImpl; // BAD — сломает нативную реализацию
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница между полифилом и Babel?** — Babel транспилирует синтаксис (стрелочные функции → обычные функции); полифил добавляет отсутствующие API (`Promise`, `Array.from`).
- **Почему нельзя просто переопределить нативный метод?** — Может нарушить ожидаемое поведение; нативная реализация обычно быстрее. Всегда проверяем `if (!method)`.
- **Что такое Babel `useBuiltIns: 'usage'`?** — Автоматически добавляет только те полифилы, которые нужны для целевых браузеров и реально используются в коде.

### Красные флаги (чего не говорить)

- «Babel и полифилы — это одно и то же» — Babel транспилирует синтаксис, полифилы — API.
- «Полифилы всегда безопасны» — могут конфликтовать с нативными реализациями или другими полифилами.

### Связанные темы

- `085-kak-obmenivatsya-kodom-mezhdu-faylami.md`
- `019-chto-takoe-strict-mode.md`
- `047-pochemu-rasshirenie-nativnykh-obektov-plokhaya-praktika.md`
