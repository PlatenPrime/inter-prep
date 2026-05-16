# Coercion & Equality — Interview Q&A

---

## Q1. [RU] В чём разница между `==` и `===`?

**Answer (EN):**
`===` is strict equality — no type coercion; same type and value required (`Object.is` semantics for NaN and ±0). `==` applies Abstract Equality Algorithm: coerces types (e.g. `"5" == 5` true, `null == undefined` true). Interview: prefer `===` / `Object.is`; know `==` rules for code review and legacy APIs.

**Follow-ups:**
- When is `== null` idiomatic?
- `Object.is` vs `===`?

**Red flags:**
- "Always use == for numbers and strings"
- Not knowing `null == undefined` is true

---

## Q2. [RU] Почему `[] == false` и `[] == ![]` ведут себя странно?

**Answer (EN):**
`[]` is object → `ToPrimitive` → `""` → `0`. `false` → `0`. So `[] == false` is true. `![]` is false (array truthy, `!` → false), so `[] == ![]` compares `[]` with `false` → also true. Classic interview traps — explain ToPrimitive steps, don't memorize alone.

**Follow-ups:**
- `[] == 0`?
- `{} == false`?

**Red flags:**
- "== is broken, never use it" without explaining rules

---

## Q3. [RU] Какие значения falsy в JavaScript?

**Answer (EN):**
`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else truthy — including `[]`, `{}`, `"0"`. Important for `if (value)` guards vs explicit `value != null`.

**Follow-ups:**
- `document.all` historical quirk?
- Boolean(`new Boolean(false)`)?

**Red flags:**
- `if (array.length)` without handling undefined array

---

## Q4. [RU] Почему `NaN === NaN` false, а `Object.is(NaN, NaN)` true?

**Answer (EN):**
IEEE 754 defines NaN as not equal to itself; `===` follows that. `Object.is` treats NaN as same as NaN for SameValue equality (used internally by `Map` keys etc.). `+0` and `-0` differ in `Object.is` but not `===`.

**Follow-ups:**
- `Number.isNaN` vs `isNaN`?
- Checking NaN in validation?

**Red flags:**
- `x === NaN` to detect NaN

---

## Q5. [RU] Что делает алгоритм ToNumber для объектов?

**Answer (EN):**
`ToNumber`: call `valueOf`, if not primitive call `toString`, then `Number(string)`. `null` → 0, `undefined` → NaN, `true` → 1. Arrays `[]` → `""` → 0. Explains most `==` puzzles. `BigInt` mixed with Number throws in modern strict operations.

**Follow-ups:**
- `Symbol` to number?
- `parseInt` vs unary `+`?

**Red flags:**
- Using `+[]` in production without comment

---

## Q6. [RU] Когда `== null` считается приемлемым?

**Answer (EN):**
`value == null` checks both `null` and `undefined` in one expression — idiomatic for default parameters and optional chaining era before `??`. Linters often allow only this `==` case. Prefer `value === null || value === undefined` or `value == null` consciously, not loose equality everywhere.

**Follow-ups:**
- `??` vs `||` for defaults?
- Optional chaining `?.`?

**Red flags:**
- `==` for all comparisons "because shorter"

---

## Q7. [RU] Сравнение объектов по ссылке vs по значению?

**Answer (EN):**
`===` on objects compares references — two `{}` are always false. Deep equality needs recursive comparison (task 03) or serialization with caveats (`JSON.stringify` key order, Date, undefined). `Object.is` same as `===` for objects. Interview: mention structural sharing and libraries (lodash isEqual).

**Follow-ups:**
- `Map` key equality?
- `structuredClone` for copy vs equal?

**Red flags:**
- `JSON.stringify(a) === JSON.stringify(b)` as universal deep equal
