# Q009. Разница между `==` и `===` (нестрогое/строгое равенство)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`===` (строгое равенство) сравнивает значения **без приведения типов** — разные типы сразу дают `false`. `==` (нестрогое равенство) перед сравнением выполняет **неявное приведение типов** по сложному алгоритму спецификации. В современном коде почти всегда следует использовать `===`.

---

## Развёрнутый ответ

### Суть и определение

**`===` (Strict Equality):** если типы операндов различаются — `false`. Если одинаковы — сравниваются значения. Исключение: `NaN === NaN` → `false`.

**`==` (Abstract Equality):** запускает алгоритм Abstract Equality Comparison из спецификации, который выполняет coercion по правилам:

1. Если типы одинаковы → действует как `===`.
2. `null == undefined` → `true`.
3. Если один операнд `number`, другой `string` → строка → число.
4. Если один `boolean` → `boolean` → число (true=1, false=0).
5. Если один — объект, другой — примитив → объект `.valueOf()` / `.toString()`.

### Как это работает

```javascript
// Строгое: типы разные → false
"5" === 5   // false
null === undefined // false
0 === false // false

// Нестрогое: coercion
"5" == 5    // true  — строка → число
null == undefined // true  — специальный случай
0 == false  // true  — false → 0
[] == false // true  — [] → "" → 0, false → 0
[] == 0     // true
"" == false // true
```

**Парадокс транзитивности нарушается:**
```javascript
0 == ""   // true
0 == "0"  // true
"" == "0" // false — строки сравниваются строго!
```

### Практика и применение

Правило в современных проектах: **всегда используй `===`**. Исключений два:
1. Проверка `null | undefined` одновременно: `value == null` (аналог `value === null || value === undefined`).
2. Унаследованный код без возможности рефактора.

ESLint правило `eqeqeq` автоматически запрещает использование `==`.

### Важные нюансы и краеугольные камни

- `NaN !== NaN` — ни `==`, ни `===` не работают; нужен `Number.isNaN()`.
- `null == 0` → `false` — `null` не приводится к числу при `==`, только `undefined` равен `null`.
- `[] == ![]` → `true` — один из самых известных парадоксов coercion.
- `Object.is(a, b)` — ещё более строгое сравнение: `Object.is(NaN, NaN)` → `true`, `Object.is(0, -0)` → `false`.

### Примеры

```javascript
// Таблица неожиданных == результатов
console.log([] == ![]);    // true  (оба → 0)
console.log(null == 0);    // false
console.log(null == false);// false
console.log(undefined == false); // false
console.log("" == false);  // true  ("" → 0, false → 0)

// Единственный легитимный кейс для ==
function handleValue(x) {
  if (x == null) {   // null ИЛИ undefined — лаконично
    return 'empty';
  }
  return x;
}
handleValue(null);      // 'empty'
handleValue(undefined); // 'empty'
handleValue(0);         // 0 — не попал в ветку!

// Object.is для специальных кейсов
Object.is(NaN, NaN);  // true
Object.is(0, -0);     // false
Object.is(1, 1);      // true
```

---

## Сравнение

| Критерий | `===` | `==` |
|----------|-------|------|
| Приведение типов | Нет | Да (coercion) |
| `"5" op 5` | `false` | `true` |
| `null op undefined` | `false` | `true` |
| `0 op false` | `false` | `true` |
| `NaN op NaN` | `false` | `false` |
| Предсказуемость | Высокая | Низкая |
| Рекомендация | Всегда | Только `x == null` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое `Object.is()` и чем отличается от `===`?** — Два отличия: `Object.is(NaN,NaN)=true`, `Object.is(0,-0)=false`.
- **Почему `[] == ![]` → `true`?** — `![]` → `false` → `0`; `[]` → `""` → `0`; `0 == 0` → `true`.
- **Как React сравнивает props?** — Shallow equality через `===` для каждого свойства (Object.is под капотом).

### Красные флаги (чего не говорить)

- «Между `==` и `===` нет важной разницы» — разница критична для безопасности и предсказуемости.
- «Всегда используй `==` — удобнее» — нарушает принцип явного кода.
- «`NaN === NaN` → `true`» — нет, всегда `false`.

### Связанные темы

- `010-raznica-yavnoe-i-neyavnoe-preobrazovanie.md`
- `006-raznica-mezhdu-null-i-undefined.md`
- `007-chto-takoe-nan-kak-opredelit-chto-znachenie-ravno-nan.md`
