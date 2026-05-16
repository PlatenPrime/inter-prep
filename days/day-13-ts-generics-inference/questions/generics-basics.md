# Generics Basics — Interview Q&A

---

## Q1. [RU] Зачем нужны generics в TypeScript?

**Answer (EN):**
Reuse logic across types while preserving type relationships. Functions like identity<T>, arrays, promises, and React useState infer T. Without generics you duplicate or fall back to any.

**Follow-ups:**
- Generic vs union overload?
- When inference fails?

**Red flags:**
- Generic defaults to any in APIs

---

## Q2. [RU] Что такое constraint extends?

**Answer (EN):**
Limits T to types satisfying a shape: T extends { id: string }. Enables accessing constrained properties inside function. Common pattern T extends keyof U for key utilities.

**Follow-ups:**
- Multiple constraints intersection?
- T extends string | number?

**Red flags:**
- Unconstrained T used as object without extends

---

## Q3. [RU] Как работает inference для generic arguments?

**Answer (EN):**
Compiler infers T from arguments; explicit <T> when ambiguous. Multiple type params infer together. Failure case: widen to unknown — use satisfies or const.

**Follow-ups:**
- NoInfer utility?
- Inference in conditional types?

**Red flags:**
- Forcing any with explicit <any>

---

## Q4. [RU] Generic defaults T = string — когда?

**Answer (EN):**
Optional type parameter when sensible default exists. Document when callers should override. Used in libraries (Promise, Array methods).

**Follow-ups:**
- Default vs overload?
- Breaking change if default changes?

**Red flags:**
- Default hides missing type param bugs

---

## Q5. [RU] const type parameter <const T> (TS 5+)?

**Answer (EN):**
Preserves literal types in arguments instead of widening. Useful for tuple inference and readonly configs. Mention relation to as const.

**Follow-ups:**
- Before 5.0 workaround?
- satisfies with generics?

**Red flags:**
- Ignoring widening when literals matter

---

## Q6. [RU] Generic components in React — пример?

**Answer (EN):**
Props<T> with items: T[] and renderItem: (item: T) => ReactNode. List<T> preserves item type. Avoid casting item inside render.

**Follow-ups:**
- forwardRef generics?
- Polymorphic components?

**Red flags:**
- List component using any for items

---

