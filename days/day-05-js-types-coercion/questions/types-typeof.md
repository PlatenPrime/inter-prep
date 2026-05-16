# Types & typeof — Interview Q&A

---

## Q1. [RU] Почему `typeof null === 'object'`?

**Answer (EN):**
Historical bug from first JS implementation — `null` was represented as null pointer (type tag 0, same as object). Never fixed for backward compatibility. Use `value === null` or `value == null`. Modern code uses `value === null` or optional chaining. `typeof` still useful for primitives.

**Follow-ups:**
- `value === null` vs `== null`?
- Pattern `x === null || x === undefined`?

**Red flags:**
- `typeof x === 'object'` to exclude null without null check

---

## Q2. [RU] Как надёжно определить массив?

**Answer (EN):**
`Array.isArray(value)` — only correct built-in. `typeof []` is `"object"`. `instanceof Array` breaks across realms/iframes. `Object.prototype.toString.call(value) === '[object Array]'` works everywhere but verbose.

**Follow-ups:**
- Typed arrays `ArrayBuffer.isView`?
- `Array.isArray` vs duck typing `length`?

**Red flags:**
- `arr instanceof Object` or checking only `.length`

---

## Q3. [RU] Что возвращает `typeof` для функций и классов?

**Answer (EN):**
Functions (including classes) return `"function"`. Classes are syntactic sugar for constructor functions. Arrow functions also `"function"`. Async functions and generators too. No separate `"class"` type at runtime.

**Follow-ups:**
- `typeof class {}`?
- Callable objects without `typeof function`?

**Red flags:**
- Expecting `typeof MyClass === 'class'`

---

## Q4. [RU] Как реализовать deepEqual lite без подводных камней?

**Answer (EN):**
Base case: `Object.is` for primitives. Reject mismatched types. Arrays: same length, recursive index compare. Plain objects: same key sets, recursive values. Skip: Date (compare time), Map/Set, prototypes, circular refs (need WeakMap in full version). Don't use `JSON.stringify` for functions, undefined, key order.

**Follow-ups:**
- Circular reference detection?
- `structuredClone` vs deep equal?

**Red flags:**
- Deep equal via stringify only
- No `Object.is` for NaN

---

## Q5. [RU] Разница между `typeof`, `instanceof`, и `Object.prototype.toString`?

**Answer (EN):**
`typeof`: primitives + broad "object"/"function". `instanceof`: prototype chain check, breakable across realms. `toString.call`: `[[Class]]` slot — reliable for `Date`, `RegExp`, `Array` in older code. Modern: combine `Array.isArray`, `Number.isInteger`, etc.

**Follow-ups:**
- `Symbol.toStringTag` customization?
- `instanceof` with `Symbol.hasInstance`?

**Red flags:**
- Only `typeof` for all type detection

---

## Q6. [RU] Что такое boxing для примитивов?

**Answer (EN):**
Primitives auto-wrap in object wrappers temporarily — `"hi".length` works. `typeof "hi"` is string; `typeof Object("hi")` is object. `null`/`undefined` have no wrappers. Explains rare `new String` vs primitive string confusion.

**Follow-ups:**
- `Object.is` on wrapped primitives?
- Why `new Number(3)` is bad practice?

**Red flags:**
- `new String('x')` in application code

---

## Q7. [RU] TypeScript vs runtime types — что сказать на интервью?

**Answer (EN):**
TypeScript erases at compile time — no runtime type safety unless you add Zod/io-ts validation at boundaries. `typeof` in TS is operator context vs value context. Interview full-stack: validate API responses at runtime; use TS for developer ergonomics inside app.

**Follow-ups:**
- `unknown` vs `any`?
- Type guards `value is string`?

**Red flags:**
- "TypeScript makes runtime type errors impossible"
