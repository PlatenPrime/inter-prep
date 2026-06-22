# DOM & Patterns — Interview Q&A

---

## Q1. [RU] Какой this у обработчика addEventListener?

**Answer (EN):**
Non-arrow handler: this is the element listening. Arrow handler: lexical outer this, not element — use currentTarget parameter instead.

**Follow-ups:**
- removeEventListener same fn reference?
- Once option?

**Red flags:**
- Says this is always element for arrows

---

## Q2. [RU] Паттерны сохранения this?

**Answer (EN):**
bind in constructor, arrow class fields, delegate wrapper, auto-bind all methods, or avoid this with closures. React hooks eliminate this in function components.

**Follow-ups:**
- autoBind decorator?
- Memoization impact?

**Red flags:**
- Only bind, no alternatives

---

## Q3. [RU] Что такое delegate pattern для this?

**Answer (EN):**
delegate(obj, method) returns (...args) => obj[method](...args) preserving receiver — used for event emitters and callbacks.

**Follow-ups:**
- Function.prototype.bind vs delegate?
- Partial application?

**Red flags:**
- Confuses with DOM event delegation

---

## Q4. [RU] Как this ведёт себя с optional chaining вызовом?

**Answer (EN):**
obj?.method() short-circuits if obj nullish — no call, no this binding issue. If called, normal implicit binding applies.

**Follow-ups:**
- obj.method?.()
- Bound method optional chain?

**Red flags:**
- Says optional chaining changes this

---
