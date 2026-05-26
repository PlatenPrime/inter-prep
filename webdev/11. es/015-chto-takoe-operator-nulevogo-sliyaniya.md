# Q015. Что такое оператор нулевого слияния (`??`)?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Оператор нулевого слияния `??` (nullish coalescing, ES2020) возвращает правый операнд, только если левый равен `null` или `undefined`. В отличие от `||`, он не реагирует на другие falsy-значения: `0`, `''`, `false`, `NaN`.

---

## Развёрнутый ответ

### Суть и определение

`a ?? b` означает: «если `a` — nullish (`null` или `undefined`), верни `b`, иначе верни `a`».

Оператор решает проблему оператора `||`, который заменял любое falsy-значение, что приводило к багам при корректных значениях `0`, `false`, `''`.

### Как это работает

```
a ?? b
  ├── a === null или a === undefined  → вернуть b
  └── иначе                           → вернуть a
```

Короткое замыкание: правый операнд вычисляется только если левый — `null`/`undefined`.

### Практика и применение

```javascript
// Дефолтные значения для конфига
const config = { timeout: 0, retries: 3, debug: false };

// ПРОБЛЕМА с ||: 0 и false считаются falsy
const timeout1 = config.timeout || 5000; // 5000 — НЕВЕРНО, 0 легитимно!
const debug1 = config.debug || true;     // true — НЕВЕРНО!

// ПРАВИЛЬНО с ??
const timeout2 = config.timeout ?? 5000; // 0 — корректно
const debug2 = config.debug ?? true;     // false — корректно
```

**Типичные use cases:**
```javascript
// API response с нулевыми значениями
const score = response.score ?? 'N/A';   // score=0 → '0', не 'N/A'
const name = user.name ?? 'Anonymous';   // null/undefined → 'Anonymous'

// Компонент React
function Rating({ value, max = 5 }) {
  const displayValue = value ?? '—'; // value=0 отображается как '0', не '—'
  return <span>{displayValue}/{max}</span>;
}

// Цепочка значений
const port = envPort ?? configPort ?? 3000;
```

**С optional chaining `?.`:**
```javascript
const city = user?.address?.city ?? 'Unknown';
```

### Важные нюансы и краеугольные камни

- **Приоритет `??` ниже `||` и `&&`** — без скобок комбинирование даёт SyntaxError в некоторых контекстах:
  ```javascript
  // a || b ?? c  →  SyntaxError (требуются скобки)
  (a || b) ?? c;  // ОК
  a || (b ?? c);  // ОК
  ```
- **`??=` (ES2021)** — логическое присваивание: `a ??= b` означает `a = a ?? b`.
- **Не путать с Elvis-оператором** (`?:` в других языках) — в JS есть `?.` (optional chaining), это другое.
- **`??` не подходит** для проверки «значение задано?» если `0`, `false`, `''` — invalid значения.

### Примеры

```javascript
// Базовые случаи
console.log(null ?? 'default');       // 'default'
console.log(undefined ?? 'default'); // 'default'
console.log(0 ?? 'default');         // 0 — НЕ дефолт!
console.log('' ?? 'default');        // '' — НЕ дефолт!
console.log(false ?? 'default');     // false — НЕ дефолт!
console.log(NaN ?? 'default');       // NaN — НЕ дефолт!

// Сравнение || и ??
const userAge = 0;
console.log(userAge || 18);  // 18 — НЕВЕРНО (0 — валидный возраст)
console.log(userAge ?? 18);  // 0  — ВЕРНО

// Короткое замыкание
let sideEffect = false;
const result = 'value' ?? (sideEffect = true, 'fallback');
console.log(sideEffect); // false — правая часть не вычислялась

// Цепочка с ?.
const config = null;
const host = config?.server?.host ?? 'localhost';
// host = 'localhost' — безопасно

// ??= (ES2021)
let settings = null;
settings ??= { theme: 'dark' };
console.log(settings); // { theme: 'dark' }

settings ??= { theme: 'light' }; // settings уже не null
console.log(settings); // { theme: 'dark' } — не изменился
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое nullish?** — Только `null` и `undefined`. `0`, `''`, `false`, `NaN` — не nullish.
- **Почему нельзя написать `a || b ?? c` без скобок?** — Операторы `||`, `&&` и `??` имеют разный приоритет и движок запрещает их смешивать без явного группирования.
- **Что такое `??=`?** — Оператор логического присваивания ES2021: присваивает значение только если текущее — `null`/`undefined`.
- **Когда использовать `||` вместо `??`?** — Когда нужно отсечь все falsy значения (0, false, ''), а не только null/undefined.

### Красные флаги (чего не говорить)

- «`??` и `||` одно и то же» — принципиальная разница в отношении к `0`, `false`, `''`.
- «`??` реагирует на все falsy» — нет, только на `null` и `undefined`.
- «`??` можно свободно комбинировать с `||`/`&&`» — требуются скобки.

### Связанные темы

- [`016-otlichie-operatora-nulevogo-sliyaniya-i-operatora-ili.md`](016-otlichie-operatora-nulevogo-sliyaniya-i-operatora-ili.md)
- [`017-operator-optional-chaining.md`](017-operator-optional-chaining.md)
- [`018-chto-takoe-operator-logicheskogo-prisvaivaniya.md`](018-chto-takoe-operator-logicheskogo-prisvaivaniya.md)
