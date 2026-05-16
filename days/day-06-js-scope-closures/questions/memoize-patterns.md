# Memoize & Module Patterns — Interview Q&A

---

## Q1. [RU] Когда memoize помогает, а когда вредит?

**Answer (EN):**
Memoize helps pure expensive functions with repeated inputs. It hurts when inputs are unbounded (memory leak), functions have side effects, or argument equality is wrong (objects by reference). Mention cache eviction strategies in senior interviews.

**Follow-ups:**
- LRU cache?
- WeakMap for object keys?

**Red flags:**
- Memoizing every function blindly

---

## Q2. [RU] Что такое module pattern в JS?

**Answer (EN):**
Encapsulate private state in a closure and expose a public API object. ES modules replaced most use cases with static imports and true file scope. Interviews compare Revealing Module Pattern vs ES modules for bundling and tree-shaking.

**Follow-ups:**
- export vs closure privacy?
- Circular dependencies?

**Red flags:**
- "Modules and IIFE are identical"

---

## Q3. [RU] Как closure используется для data privacy?

**Answer (EN):**
Keep variables in an outer function scope inaccessible from outside; only returned methods can read/write. Unlike class private fields (#), closure privacy is per-instance factory. Trade-off: methods recreated per instance unless on shared prototype.

**Follow-ups:**
- # private fields vs closure?
- Memory per instance?

**Red flags:**
- Exposing mutable object that leaks private state

---

## Q4. [RU] Что такое currying и partial application?

**Answer (EN):**
Currying transforms f(a,b,c) into f(a)(b)(c); partial application fixes some arguments producing a function with fewer parameters. Useful for configuration and event handlers. In interviews distinguish them — not the same thing.

**Follow-ups:**
- _.curry vs bind?
- React useCallback relation?

**Red flags:**
- Using bind when curry is clearer without explaining why

---

## Q5. [RU] Как отладить утечку памяти из closure?

**Answer (EN):**
Closures keep outer bindings alive. If a DOM node or large structure is captured in a long-lived callback, it cannot be GC'd. Fix: null references, WeakMap, remove listeners, avoid storing DOM in global closures.

**Follow-ups:**
- DevTools heap snapshot?
- Detached nodes?

**Red flags:**
- "JS has no memory leaks"

---

## Q6. [RU] Разница между function declaration и expression для hoisting?

**Answer (EN):**
Function declarations are hoisted fully (can call before line in same scope). Function expressions follow variable hoisting rules (var → undefined until assignment; let/const → TDZ). Arrow functions are always expressions.

**Follow-ups:**
- Arrow in object methods?
- Generator functions?

**Red flags:**
- Using arrow as object method when you need dynamic this

---

