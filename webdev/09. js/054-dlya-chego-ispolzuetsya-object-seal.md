# Q054. Для чего используется метод `Object.seal()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Object.seal()` «запечатывает» объект: **запрещает добавление и удаление свойств**, но позволяет **изменять значения** существующих. Используется когда структура объекта должна быть фиксированной (schema-like), но сами данные обновляемы. Все свойства становятся `configurable: false`.

---

## Развёрнутый ответ

### Что делает `Object.seal()`

1. Устанавливает `configurable: false` для всех свойств.
2. Предотвращает расширение объекта (`Object.isExtensible(obj)` → `false`).
3. Не меняет `writable` — существующие свойства можно изменять.

```javascript
const settings = Object.seal({
  theme: 'dark',
  fontSize: 14,
  language: 'en'
});

// Разрешено: изменение существующих значений
settings.theme = 'light';    // OK
settings.fontSize = 16;      // OK

// Запрещено: добавление нового свойства
settings.newProp = 'value';  // тихо или TypeError (strict)

// Запрещено: удаление
delete settings.theme;       // тихо или TypeError (strict)

console.log(settings); // { theme: 'light', fontSize: 16, language: 'en' }
Object.isSealed(settings); // true
```

### Практика и применение

- **Конфигурационные объекты** — допускают обновление параметров, но не расширение структуры.
- **DTO / schema enforcement** — убеждаемся, что объект не получит лишних полей.
- **API options объект** — принимаем настройки с фиксированным набором ключей.

```javascript
// Функция с sealed options
function createConnection(options) {
  const config = Object.seal({
    host: 'localhost',
    port: 5432,
    ssl: false,
  });

  // Применяем только известные опции
  for (const key of Object.keys(options)) {
    if (Object.hasOwn(config, key)) {
      config[key] = options[key]; // только существующие ключи
    }
  }

  return config;
}

const conn = createConnection({ host: 'db.example.com', unknown: 'ignored' });
// { host: 'db.example.com', port: 5432, ssl: false }
```

### Отличие от `Object.freeze` и `Object.preventExtensions`

| Метод | Добавление | Удаление | Изменение |
|-------|------------|----------|-----------|
| `preventExtensions` | ✗ | ✓ | ✓ |
| `seal` | ✗ | ✗ | ✓ |
| `freeze` | ✗ | ✗ | ✗ |

### Важные нюансы и краеугольные камни

- `Object.seal` — шallow: вложенные объекты не запечатываются.
- В sloppy mode нарушения тихо игнорируются; в strict mode — TypeError.
- Запечатанный объект нельзя разблокировать — операция необратима.
- `Object.isSealed(frozenObj)` → `true`: замороженный объект также является запечатанным (freeze — более строгое ограничение).

### Примеры

```javascript
// Проверка:
const obj = { a: 1 };
Object.isSealed(obj);   // false
Object.seal(obj);
Object.isSealed(obj);   // true

// Non-writable property в sealed объекте
const obj2 = {};
Object.defineProperty(obj2, 'id', { value: 1, writable: false });
Object.seal(obj2);
obj2.id = 99; // TypeError — writable: false + sealed
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда `seal` лучше `freeze`?** — Когда нужно фиксировать структуру, но позволить обновлять данные.
- **Является ли замороженный объект запечатанным?** — Да, `Object.isFrozen(obj) → true` влечёт `Object.isSealed(obj) → true`.

### Красные флаги (чего не говорить)

- «`seal` запрещает все изменения» — только добавление/удаление; изменение значений разрешено.

### Связанные темы

- `053-raznica-mezhdu-object-freeze-i-object-seal.md`
- `058-plyusy-i-minusy-immutabelnosti.md`
