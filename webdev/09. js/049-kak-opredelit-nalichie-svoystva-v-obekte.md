# Q049. Как определить наличие свойства в объекте?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Основные способы: **`"key" in obj`** — проверяет собственные и унаследованные свойства; **`obj.hasOwnProperty("key")`** или **`Object.hasOwn(obj, "key")`** — только собственные (ES2022 предпочтительнее); **`obj.key !== undefined`** — ненадёжно (не различает отсутствие и `undefined` как значение). Выбор зависит от того, нужны ли унаследованные свойства.

---

## Развёрнутый ответ

### Способы проверки

**1. Оператор `in` — собственные + унаследованные:**
```javascript
const obj = { name: 'Alice' };
'name' in obj;        // true  — собственное
'toString' in obj;    // true  — из Object.prototype
'missing' in obj;     // false
```

**2. `hasOwnProperty()` — только собственные:**
```javascript
obj.hasOwnProperty('name');    // true
obj.hasOwnProperty('toString'); // false — унаследованное
```

**3. `Object.hasOwn()` — ES2022, предпочтительно:**
```javascript
Object.hasOwn(obj, 'name');     // true
Object.hasOwn(obj, 'toString'); // false
```
Безопаснее `hasOwnProperty`, так как работает даже если объект создан через `Object.create(null)` (у которого нет `hasOwnProperty`).

**4. Сравнение с `undefined` — ненадёжно:**
```javascript
const obj = { name: undefined }; // явно undefined
obj.name !== undefined;  // false — хотя свойство ЕСТЬ!
```

**5. `Object.keys()` / `Object.getOwnPropertyNames()`:**
```javascript
Object.keys(obj).includes('name');               // только enumerable собственные
Object.getOwnPropertyNames(obj).includes('name'); // все собственные (включая non-enumerable)
```

### Сравнение методов

| Метод | Собственные | Унаследованные | Non-enumerable | `undefined` значение |
|-------|-------------|----------------|----------------|----------------------|
| `in` | ✓ | ✓ | ✓ | ✓ |
| `hasOwnProperty` | ✓ | ✗ | ✓ | ✓ |
| `Object.hasOwn` | ✓ | ✗ | ✓ | ✓ |
| `obj.key !== undefined` | ✓ | ✓ | ✓ | ✗ (ложный negative) |
| `Object.keys().includes` | ✓ | ✗ | ✗ | ✓ |

### Практика и применение

```javascript
// Правильная проверка наличия ключа
function safeGet(obj, key) {
  if (Object.hasOwn(obj, key)) { // ES2022
    return obj[key];
  }
  return null;
}

// Для Object.create(null) — нет hasOwnProperty
const dict = Object.create(null);
dict.key = 'value';
// dict.hasOwnProperty('key') — TypeError: hasOwnProperty is not a function!
Object.hasOwn(dict, 'key'); // true — безопасно
Object.prototype.hasOwnProperty.call(dict, 'key'); // true — fallback

// Итерация только собственных свойств
function cloneOwnProps(obj) {
  const result = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) { // фильтруем унаследованные
      result[key] = obj[key];
    }
  }
  return result;
}
```

### Важные нюансы и краеугольные камни

- `for...in` итерирует **все enumerable** свойства, включая унаследованные — всегда используйте `hasOwnProperty`/`Object.hasOwn` внутри.
- `Object.keys()` — только собственные enumerable (безопасен по умолчанию).
- Symbol-ключи: `in` находит Symbol-свойства; `Object.keys()` — нет; `Object.getOwnPropertySymbols()` — специально для Symbol-ключей.

### Примеры

```javascript
// Symbol-свойства
const sym = Symbol('id');
const obj = { [sym]: 42, name: 'Alice' };

sym in obj;                           // true
Object.keys(obj);                     // ['name'] — символы не видны
Object.getOwnPropertySymbols(obj);    // [Symbol(id)]
Reflect.ownKeys(obj);                 // ['name', Symbol(id)] — всё

// TypeScript guard с проверкой
function isUser(value: unknown): value is { name: string } {
  return typeof value === 'object' && value !== null && 'name' in value;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `Object.hasOwn` лучше `hasOwnProperty`?** — Безопасно для `Object.create(null)` и когда `hasOwnProperty` переопределён в самом объекте.
- **Как найти все ключи объекта (включая Symbol и non-enumerable)?** — `Reflect.ownKeys(obj)`.
- **Что вернёт `in` для Symbol-свойств?** — `true`, если Symbol является ключом.

### Красные флаги (чего не говорить)

- «Лучше использовать `obj.key !== undefined`» — не работает когда значение намеренно `undefined`.
- «`Object.keys` находит все свойства» — только собственные enumerable.

### Связанные темы

- `050-raznica-mezhdu-in-i-hasownproperty.md`
- `045-chto-takoe-prototip-obiekta.md`
- `048-kak-rabotaet-object-create.md`
