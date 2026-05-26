# Q011. Как превратить любой тип данных в булевый? Перечислите ложные значения в JS?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Любое значение конвертируется в булевый тип через `Boolean(value)` или двойное отрицание `!!value`. В JavaScript **7 ложных (falsy) значений**: `false`, `0`, `-0`, `0n`, `""` (пустая строка), `null`, `undefined`, `NaN`. Всё остальное, включая `[]` и `{}`, является **truthy**.

---

## Развёрнутый ответ

### Суть и определение

ToBoolean — один из алгоритмов преобразования типов в спецификации ECMAScript. Вместо сложной логики, он работает по принципу «белого списка» ложных значений: если значение есть в списке — `false`, иначе — `true`.

**Исчерпывающий список falsy значений:**

| Значение | Тип | Примечание |
|----------|-----|-----------|
| `false` | boolean | Сам `false` |
| `0` | number | Ноль |
| `-0` | number | Отрицательный ноль |
| `0n` | bigint | Ноль типа BigInt |
| `""` | string | Пустая строка |
| `null` | null | |
| `undefined` | undefined | |
| `NaN` | number | Not-a-Number |

### Как это работает

```javascript
// Явная конвертация
Boolean(false)     // false
Boolean(0)         // false
Boolean(-0)        // false
Boolean(0n)        // false
Boolean("")        // false
Boolean(null)      // false
Boolean(undefined) // false
Boolean(NaN)       // false

// Всё остальное — truthy
Boolean({})        // true  ← пустой объект!
Boolean([])        // true  ← пустой массив!
Boolean("0")       // true  ← непустая строка!
Boolean(" ")       // true  ← строка с пробелом!
Boolean(-1)        // true
Boolean(Infinity)  // true
Boolean(new Date())// true
```

### Практика и применение

- **Условия в `if`:** неявная конвертация через ToBoolean — основной паттерн проверки «есть ли значение».
- **Фильтрация массивов:** `arr.filter(Boolean)` убирает все falsy значения.
- **Значения по умолчанию:** `const x = value || 'default'` — работает через truthy/falsy, но небезопасно для `0`, `""`, `false`; лучше `??` (nullish coalescing).

### Важные нюансы и краеугольные камни

- `Boolean([])` → `true`, но `[] == false` → `true` — это не противоречие: `==` использует другой алгоритм (Abstract Equality с coercion через valueOf/toString), не ToBoolean.
- `Boolean("false")` → `true` — строка `"false"` непустая, значит truthy.
- `Boolean(new Boolean(false))` → `true` — объект-обёртка всегда truthy.
- `document.all` — историческое исключение, единственный объект (из браузерного API) с `typeof document.all === "undefined"` и falsy-поведением.

### Примеры

```javascript
// Способы конвертации в boolean
const val = "hello";
Boolean(val);  // явный — рекомендуемый
!!val;          // двойное отрицание — идиоматично

// Фильтрация falsy из массива
const mixed = [0, 1, "", "hi", null, undefined, NaN, false, {}, []];
mixed.filter(Boolean);
// [1, "hi", {}, []]

// Ловушка: || vs ??
const count = 0;
const display1 = count || 'нет данных';  // "нет данных" — 0 falsy!
const display2 = count ?? 'нет данных';  // 0 — nullish только null/undefined

// Проверка наличия объекта
function processUser(user) {
  if (!user) throw new Error('User required'); // null, undefined → ошибка
  return user.name;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `[] == false` но `Boolean([]) === true`?** — `==` применяет AbstractEquality (coercion), `if([])` использует ToBoolean — разные алгоритмы.
- **Что опасного в `value || default`?** — Срабатывает на `0`, `""`, `false` — допустимых значениях; `??` корректнее.
- **Сколько falsy значений в JavaScript?** — 8 (включая `-0` и `0n` — часто забывают).

### Красные флаги (чего не говорить)

- «`[]` и `{}` — falsy, они же пустые» — нет, пустые объекты и массивы всегда truthy.
- «Falsy значений 5 или 6» — их 8 (не забываем `-0`, `0n`).
- «`Boolean("false") === false`» — нет, любая непустая строка truthy.

### Связанные темы

- `010-raznica-yavnoe-i-neyavnoe-preobrazovanie.md`
- `012-dlya-chego-ispolzuetsya-operator-dvoynogo-otricaniya.md`
- `015-operatory-i-i-ili.md`
