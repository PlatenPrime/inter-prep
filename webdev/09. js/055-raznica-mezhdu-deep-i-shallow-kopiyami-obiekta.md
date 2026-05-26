# Q055. Разница между глубокой (deep) и поверхностной (shallow) копиями объекта? Как сделать каждую из них?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Shallow copy** — копирует только первый уровень объекта; вложенные объекты копируются по ссылке (изменение вложенного в копии — меняет оригинал). **Deep copy** — рекурсивно копирует все уровни вложенности, создавая полностью независимый объект. Методы: `{...obj}` и `Object.assign({}, obj)` — shallow; `structuredClone(obj)` (ES2022) — deep.

---

## Развёрнутый ответ

### Shallow copy

Только верхний уровень создаётся заново; вложенные объекты — те же ссылки.

```javascript
const original = {
  name: 'Alice',
  address: { city: 'Moscow', zip: '101000' }
};

// Spread (shallow)
const shallow = { ...original };

// Object.assign (shallow)
const shallow2 = Object.assign({}, original);

// Независимость верхнего уровня
shallow.name = 'Bob';
console.log(original.name); // 'Alice' — не изменился

// НО вложенный объект — та же ссылка!
shallow.address.city = 'London';
console.log(original.address.city); // 'London' — изменился!
```

### Deep copy

Полная независимость всех уровней.

**`structuredClone()` — рекомендуемый способ (ES2022, Node 17+):**
```javascript
const deep = structuredClone(original);
deep.address.city = 'Paris';
console.log(original.address.city); // 'Moscow' — не изменился!
```

**`JSON.parse(JSON.stringify())` — работает, но с ограничениями:**
```javascript
const deep2 = JSON.parse(JSON.stringify(original));
// Ограничения:
// - undefined свойства теряются
// - Date → строка
// - Function → теряется
// - Symbol → теряется
// - Circular references → ошибка
```

**Ручная рекурсивная реализация:**
```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
```

### Сравнение методов

| Метод | Тип | Circular ref | Date | Function | Symbol | Производительность |
|-------|-----|-------------|------|----------|--------|--------------------|
| `{...obj}` | Shallow | ✓ (ссылка) | ✓ (ссылка) | ✓ (ссылка) | ✓ | Лучшая |
| `Object.assign({}, obj)` | Shallow | ✓ (ссылка) | ✓ (ссылка) | ✓ (ссылка) | ✓ | Хорошая |
| `JSON.parse(JSON.stringify())` | Deep | ✗ (ошибка) | ✗ (строка) | ✗ (теряется) | ✗ | Хорошая |
| `structuredClone()` | Deep | ✓ | ✓ | ✗ (ошибка) | ✗ | Хорошая |
| `lodash.cloneDeep()` | Deep | ✓ | ✓ | ✓ | ✓ | Медленнее |

### Практика и применение

- **React state updates** — всегда shallow copy: `setState({ ...state, key: newValue })`.
- **Redux reducers** — иммутабельные обновления через spread.
- **API-ответы** — `structuredClone` для глубокого клонирования сложных объектов.
- **Конфигурации** — `JSON.parse(JSON.stringify())` если нет функций и Date.

### Важные нюансы и краеугольные камни

- `structuredClone` не поддерживает: функции, DOM-узлы, WeakMap, WeakSet, Symbol.
- Spread `[...arr]` — shallow copy массива: вложенные объекты — ссылки.
- `Object.assign` — также shallow, но копирует Symbol-свойства и геттеры выполняет (в отличие от spread при определённых сценариях).
- lodash `_.cloneDeep` — наиболее полный вариант для production (копирует Functions, Maps, Sets, RegExp).

### Примеры

```javascript
// Иммутабельное обновление вложенного свойства (Redux-style)
const state = {
  user: { name: 'Alice', preferences: { theme: 'dark' } }
};

// Неправильно: shallow copy — mutates вложенный объект
const wrong = { ...state, user: { ...state.user } };
wrong.user.preferences.theme = 'light'; // мутирует state!

// Правильно: deep spread на нужном уровне
const correct = {
  ...state,
  user: {
    ...state.user,
    preferences: { ...state.user.preferences, theme: 'light' }
  }
};
console.log(state.user.preferences.theme); // 'dark' — не изменился
```

---

## Сравнение

| Критерий | Shallow Copy | Deep Copy |
|----------|-------------|-----------|
| Уровни | Только первый | Все уровни |
| Вложенные объекты | Ссылки | Новые объекты |
| Производительность | Быстрее | Медленнее |
| Независимость | Частичная | Полная |
| Методы | `{...}`, `Object.assign` | `structuredClone`, `JSON.parse/stringify`, `cloneDeep` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда `JSON.parse(JSON.stringify())` не подходит?** — При наличии `undefined`, функций, Date, Symbol, циклических ссылок.
- **Как скопировать массив объектов так, чтобы каждый объект был независим?** — `arr.map(item => structuredClone(item))` или `JSON.parse(JSON.stringify(arr))`.
- **Чем `structuredClone` лучше `JSON` подхода?** — Поддерживает circular references, Date, Map, Set, ArrayBuffer.

### Красные флаги (чего не говорить)

- «`Object.assign` делает deep copy» — нет, только shallow.
- «`{...obj}` — это deep copy» — нет, shallow.

### Связанные темы

- `002-raznica-mezhdu-primitivom-i-obektom.md`
- `040-kak-peredayutsya-parametry-po-ssylke-ili-po-znacheniyu.md`
- `058-plyusy-i-minusy-immutabelnosti.md`
