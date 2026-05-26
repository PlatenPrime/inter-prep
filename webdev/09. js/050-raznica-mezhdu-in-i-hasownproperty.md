# Q050. Разница между оператором `in` и методом `.hasOwnProperty()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`"key" in obj` проверяет наличие свойства в объекте **и по всей цепочке прототипов** (собственные + унаследованные). `obj.hasOwnProperty("key")` — только **собственные** свойства объекта, без цепочки прототипов. Современный аналог `hasOwnProperty` — `Object.hasOwn(obj, "key")` (ES2022).

---

## Развёрнутый ответ

### Суть

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.breathe = function() {};

const dog = new Animal('Rex');
dog.breed = 'Labrador';

// in — проверяет весь prototype chain
'breed' in dog;    // true  — собственное
'name' in dog;     // true  — собственное
'breathe' in dog;  // true  — из Animal.prototype
'toString' in dog; // true  — из Object.prototype
'missing' in dog;  // false

// hasOwnProperty — только собственные
dog.hasOwnProperty('breed');   // true
dog.hasOwnProperty('name');    // true
dog.hasOwnProperty('breathe'); // false — унаследованное!
dog.hasOwnProperty('toString'); // false — унаследованное!
```

### Практика

```javascript
// for...in без фильтрации — включает унаследованные!
for (const key in dog) {
  console.log(key); // breed, name, breathe — breathe тоже!
}

// Правильно: фильтрация через hasOwn
for (const key in dog) {
  if (Object.hasOwn(dog, key)) { // ES2022
    console.log(key); // только breed, name
  }
}

// Object.keys() — безопаснее, уже фильтрует
Object.keys(dog); // ['breed', 'name'] — только собственные enumerable
```

### `Object.hasOwn` vs `hasOwnProperty`

```javascript
// Проблема hasOwnProperty:
const obj = Object.create(null); // нет прототипа!
obj.key = 'val';
obj.hasOwnProperty('key'); // TypeError — метода нет!

// Безопасный вызов старым способом:
Object.prototype.hasOwnProperty.call(obj, 'key'); // true

// Или — современный Object.hasOwn (ES2022):
Object.hasOwn(obj, 'key'); // true — работает всегда

// Проблема: hasOwnProperty может быть переопределён
const evil = { hasOwnProperty: () => false };
evil.hasOwnProperty('x'); // false — переопределён!
Object.hasOwn(evil, 'x'); // false — правильный результат
```

### Важные нюансы и краеугольные камни

- `in` работает с Symbol-ключами.
- `hasOwnProperty` проверяет `enumerable` и `non-enumerable` собственные свойства (в отличие от `Object.keys()`, который только enumerable).
- Для массивов: `3 in [1,2,3,4]` → `true` (индекс 3 существует).

### Примеры

```javascript
// Безопасная проверка ключа конфигурации
function getConfig(config, key) {
  if (Object.hasOwn(config, key)) {
    return config[key];
  }
  return undefined;
}

// Проверка типа через in (type guard)
function isMouseEvent(event) {
  return 'clientX' in event && 'clientY' in event;
}
```

---

## Сравнение

| Критерий | `in` | `hasOwnProperty` | `Object.hasOwn` |
|----------|------|------------------|-----------------|
| Собственные | ✓ | ✓ | ✓ |
| Унаследованные | ✓ | ✗ | ✗ |
| `Object.create(null)` | ✓ | ✗ (TypeError) | ✓ |
| Переопределение | — | Уязвим | Безопасен |
| ES версия | ES1 | ES3 | ES2022 |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `Object.hasOwn` предпочтительнее `hasOwnProperty`?** — Безопасен для `Object.create(null)` и когда метод переопределён.
- **Что вернёт `'length' in []`?** — `true` — `length` — собственное свойство массива.

### Красные флаги (чего не говорить)

- «`in` и `hasOwnProperty` — одно и то же» — `in` включает прототипную цепочку.

### Связанные темы

- `049-kak-opredelit-nalichie-svoystva-v-obekte.md`
- `045-chto-takoe-prototip-obiekta.md`
