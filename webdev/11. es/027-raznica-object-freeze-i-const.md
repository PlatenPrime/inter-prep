# Q027. Разница между методом `Object.freeze()` и `const`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`const` запрещает **переназначение переменной** — нельзя направить её на другой объект. `Object.freeze()` запрещает **изменение самого объекта** — нельзя добавлять, изменять или удалять свойства. Они ортогональны: `const` работает с привязкой переменной, `freeze` — с содержимым объекта. Вместе они создают максимально защищённую, но поверхностно-иммутабельную константу.

---

## Развёрнутый ответ

### Суть и определение

**`const`** — ключевое слово объявления: запрещает операцию присваивания (`=`) для данной привязки. Содержимое объекта по-прежнему мутируемо.

**`Object.freeze(obj)`** — метод: устанавливает все свойства объекта как `writable: false, configurable: false`, запрещает добавление новых свойств. Сама переменная при этом может быть переназначена (если объявлена через `let`/`var`).

### Как это работает

`Object.freeze()` внутренне:
1. Вызывает `Object.preventExtensions(obj)` — запрещает добавление свойств
2. Для каждого собственного свойства устанавливает `writable: false, configurable: false`
3. Возвращает тот же объект (frozen in-place)

В strict mode мутация frozen объекта → `TypeError`. В non-strict — молча игнорируется.

**Поверхностность**: freeze не рекурсивный — вложенные объекты остаются мутируемыми.

### Практика и применение

```javascript
// const — переменная не переназначается, объект мутируется
const config = { port: 3000, debug: false };
config.port = 8080;     // ОК — мутация объекта
config.newProp = 'x';   // ОК — добавление
// config = {};          // TypeError — переназначение запрещено

// Object.freeze — объект нельзя изменить, переменная может быть переназначена
let frozen = Object.freeze({ port: 3000, debug: false });
frozen.port = 8080;     // игнорируется (TypeError в strict)
frozen.newProp = 'x';   // игнорируется
delete frozen.port;     // игнорируется
frozen = { port: 9000 }; // ОК (let — переназначение разрешено)

// const + Object.freeze — максимальная защита (поверхностная)
const MAX_CONFIG = Object.freeze({ port: 3000, debug: false });
// Нельзя ни мутировать, ни переназначить
```

**Глубокая заморозка:**
```javascript
function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  Object.getOwnPropertyNames(obj).forEach(name => {
    deepFreeze(obj[name]);
  });
  return Object.freeze(obj);
}

const config = deepFreeze({
  server: { host: 'localhost', port: 3000 },
  db: { name: 'mydb' },
});
config.server.port = 9000; // TypeError в strict — глубокая заморозка!
```

**Перечисляемые неизменяемые константы:**
```javascript
const Direction = Object.freeze({
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
});
// Безопасно передавать, никто не добавит Direction.DIAGONAL
```

### Важные нюансы и краеугольные камни

- **`Object.freeze` поверхностный**: только первый уровень. Вложенные объекты мутируемы без `deepFreeze`.
- **Проверка заморозки**: `Object.isFrozen(obj)` → `boolean`.
- **Frozen ≠ sealed**: `Object.seal(obj)` запрещает добавление/удаление свойств, но разрешает изменение существующих.
- **`const` в for...of**: каждая итерация — новая привязка, поэтому `const item of items` — корректно.
- **TypeScript**: `as const` — примерный аналог `Object.freeze` на уровне типов (делает тип `readonly`).
- **Производительность**: `Object.freeze` может помочь движку применять оптимизации (скрытые классы V8 не меняются), но разница обычно незначительна.

### Примеры

```javascript
// Демонстрация разницы
const obj1 = { x: 1 };
obj1.x = 99;     // ОК
// obj1 = {};    // TypeError

let obj2 = Object.freeze({ x: 1 });
// obj2.x = 99; // TypeError (strict) / игнорируется
obj2 = { x: 99 }; // ОК

const obj3 = Object.freeze({ x: 1 });
// obj3.x = 99; // TypeError (strict)
// obj3 = {};   // TypeError

// Поверхностность freeze
const state = Object.freeze({
  user: { name: 'Alice', age: 30 },
  items: [1, 2, 3],
});
state.user = null;          // TypeError — первый уровень заморожен
state.user.name = 'Bob';    // ОК — вложенный объект не заморожен!
state.items.push(4);        // ОК — массив внутри не заморожен!

// Object.isFrozen
const a = Object.freeze({});
const b = {};
Object.isFrozen(a); // true
Object.isFrozen(b); // false

// Примитивы всегда "заморожены"
Object.isFrozen(42);     // true
Object.isFrozen('str');  // true
Object.isFrozen(null);   // true
```

---

## Сравнение

| Критерий | `const` | `Object.freeze()` |
|----------|---------|-------------------|
| Что защищает | Привязку переменной | Содержимое объекта |
| Переназначение | Запрещено | Разрешено (зависит от let/const) |
| Мутация свойств | Разрешена | Запрещена |
| Добавление свойств | Разрешено | Запрещено |
| Вложенные объекты | Не защищены | Не защищены (поверхностно) |
| Работает с примитивами | Да | Нет смысла |
| Глубокая защита | Нет | Только с `deepFreeze` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли заморозить прототип объекта?** — Да, `Object.freeze(Object.prototype)` — но это опасно и ломает библиотеки.
- **Чем `freeze` отличается от `seal`?** — `seal` запрещает добавление/удаление, но разрешает изменение; `freeze` запрещает всё.
- **Как сделать глубоко иммутабельный объект?** — Рекурсивный `deepFreeze` или `structuredClone` + freeze, или библиотека Immer.
- **`as const` в TypeScript vs `Object.freeze`?** — `as const` только на уровне типов (compile-time), `freeze` — runtime. Совмещают оба для полной защиты.

### Красные флаги (чего не говорить)

- «`const` делает объект иммутабельным» — только привязку; объект мутируется.
- «`Object.freeze` глубокий» — нет, поверхностный; вложенные объекты мутируются.
- «Замороженный объект нельзя скопировать» — можно: `{...frozen}` или `Object.assign({}, frozen)`.

### Связанные темы

- [`003-mozhno-li-izmenit-znachenie-opredelennoe-cherez-const.md`](003-mozhno-li-izmenit-znachenie-opredelennoe-cherez-const.md)
- [`002-raznica-mezhdu-let-const-i-var.md`](002-raznica-mezhdu-let-const-i-var.md)
- [`028-dlya-chego-metod-getownpropertydescriptors.md`](028-dlya-chego-metod-getownpropertydescriptors.md)
