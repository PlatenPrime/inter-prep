# Closures & Lexical Scope — Interview Q&A

---

## Q1. [RU] Что такое closure и когда он создаётся?

**Answer (EN):**
A closure is formed when a function references variables from an outer lexical environment and that function outlives the outer call. The inner function keeps access to those bindings even after the outer function returns. Interviews use this for data privacy, factories, and callbacks.

**Follow-ups:**
- What is the difference between scope and closure?
- How do closures relate to garbage collection?

**Red flags:**
- "Closures copy all variables by value always"
- Cannot explain why var + setTimeout in a loop fails

---

## Q2. [RU] Что такое temporal dead zone для let/const?

**Answer (EN):**
let and const are hoisted but not initialized until their declaration line runs; accessing them before that throws ReferenceError. var is hoisted and initialized to undefined. This matters for hoisting questions and async callbacks inside loops.

**Follow-ups:**
- Does typeof on undeclared let throw?
- Why prefer let in for-loops with async callbacks?

**Red flags:**
- "let is not hoisted"
- Confusing TDZ with undefined from var

---

## Q3. [RU] Как работает IIFE и зачем он в legacy-коде?

**Answer (EN):**
An Immediately Invoked Function Expression runs once to create a private scope before block scope was common. It avoids polluting global and captures state in closures. Modern code uses ES modules instead, but interviews still ask about pre-module patterns.

**Follow-ups:**
- Module vs IIFE privacy?
- When would you still use IIFE today?

**Red flags:**
- "IIFE is required in all modern apps"

---

## Q4. [RU] Что такое stale closure в React и как с ним бороться?

**Answer (EN):**
A stale closure captures an old value of state/props because the callback was created in a previous render. Fixes: functional updates setState(fn), refs for latest values, correct dependency arrays, or lifting state. This links scope day to React hooks interviews.

**Follow-ups:**
- useEffect empty deps with state?
- useRef for latest callback?

**Red flags:**
- Blaming React instead of explaining closures

---

## Q5. [RU] В чём разница между var, let и const в scope?

**Answer (EN):**
var is function-scoped and hoisted with undefined; let/const are block-scoped with TDZ. const prevents rebinding the binding but not mutating object contents. Interview tip: default to const, use let when rebinding, avoid var in new code.

**Follow-ups:**
- const with object mutation?
- Block scope in switch/catch?

**Red flags:**
- "const makes objects immutable"

---

## Q6. [RU] Как реализовать once(fn) через closure?

**Answer (EN):**
Store a flag and cached result in the closure created when once runs. On first call invoke fn and cache; later calls return cache without calling fn. Edge case: if fn throws, decide whether to retry — usually once still counts as called.

**Follow-ups:**
- once vs memoize?
- Thread safety in JS?

**Red flags:**
- Forgetting that this binding changes when passing methods

---

