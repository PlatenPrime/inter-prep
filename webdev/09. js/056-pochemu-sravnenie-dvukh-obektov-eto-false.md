# Q056. Почему результат сравнения двух объектов это `false`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Объекты в JavaScript сравниваются **по ссылке**, а не по содержимому. Два объекта с идентичными свойствами — это два разных объекта в памяти с разными адресами. `{} === {}` всегда `false`, потому что это два отдельных объекта в куче, хотя и с одинаковым содержимым.

---

## Развёрнутый ответ

### Суть

```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b; // false — разные объекты в памяти
a === c; // true  — одна и та же ссылка
a == b;  // false — нестрогое тоже сравнивает по ссылке для объектов

// Аналогично для массивов
[1, 2] === [1, 2]; // false
```

**Схема памяти:**
```
Стек          Куча
a → ─────────▶ { x: 1 } @ 0x001
b → ─────────▶ { x: 1 } @ 0x002  ← разные адреса!
c → ─────────▶ { x: 1 } @ 0x001  ← та же ссылка что a
```

### Как сравнить объекты по содержимому

**1. `JSON.stringify` (простой, но с ограничениями):**
```javascript
JSON.stringify(a) === JSON.stringify(b); // true
// Ограничения: зависит от порядка ключей, не работает с undefined, функциями, Date
```

**2. Ручное глубокое сравнение:**
```javascript
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

deepEqual({ x: 1, y: { z: 2 } }, { x: 1, y: { z: 2 } }); // true
```

**3. Lodash `_.isEqual`** — production-готовый, обрабатывает все edge cases.

### Практика и применение

- **React:** props сравниваются по ссылке (shallow). `React.memo` и `useMemo` используют `Object.is` (строгое сравнение). Если нужно сравнение по содержимому — использовать `useMemo` с зависимостями.
- **Тесты:** `expect(a).toEqual(b)` (Jest) — глубокое сравнение содержимого.
- **Redux:** shallow equality в `connect` и `useSelector` — важно возвращать новый объект из reducer при изменении.

### Важные нюансы и краеугольные камни

- `JSON.stringify` не гарантирует стабильный порядок ключей в разных JS-движках (хотя V8 упорядочивает строковые ключи по порядку вставки).
- Глубокое сравнение с циклическими ссылками требует отслеживания посещённых объектов.
- `null === null` → `true` — `null` является примитивом, сравнивается по значению.

### Примеры

```javascript
// React: избегать создания нового объекта в рендере
function Component({ filter }) {
  // Плохо: новый объект при каждом рендере → props "всегда изменились"
  const options = { limit: 10, ...filter };

  // Хорошо: useMemo — стабильная ссылка пока filter не изменился
  const options = useMemo(() => ({ limit: 10, ...filter }), [filter]);

  return <DataTable options={options} />;
}

// Сравнение NaN в объектах
const a = { x: NaN };
const b = { x: NaN };
deepEqual(a, b); // зависит от реализации — NaN !== NaN нужно учесть!

// Учёт NaN в deepEqual
function valuesEqual(a, b) {
  return a === b || (Number.isNaN(a) && Number.isNaN(b));
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как React сравнивает props?** — По ссылке (`Object.is`); для функций-пропов это проблема при каждом рендере.
- **Почему `JSON.stringify` ненадёжен для сравнения?** — Порядок ключей может отличаться, undefined/functions/Date не сохраняются корректно.
- **Что такое `Object.is` и чем отличается от `===`?** — Два отличия: `Object.is(NaN, NaN)=true`, `Object.is(0, -0)=false`.

### Красные флаги (чего не говорить)

- «`==` сравнивает объекты по содержимому» — нет, и `==`, и `===` сравнивают объекты по ссылке.

### Связанные темы

- `002-raznica-mezhdu-primitivom-i-obektom.md`
- `009-raznica-mezhdu-nestrогим-i-строгим-ravенством.md`
- `055-raznica-mezhdu-deep-i-shallow-kopiyami-obiekta.md`
