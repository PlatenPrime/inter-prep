# call, apply, bind Deep Dive — Interview Q&A

---

## Q1. [RU] Разница между call и apply?

**Answer (EN):**
Both invoke function with explicit this and immediate execution. call takes args individually; apply takes array-like args. Use apply for dynamic arg arrays; spread with call is modern equivalent.

**Follow-ups:**
- Max args limit?
- Reflect.apply use?

**Red flags:**
- Cannot explain when to use apply

---

## Q2. [RU] Как работает bind?

**Answer (EN):**
Returns new function with fixed this and optional prepended args. Hard binding: bound this cannot be changed by call/apply. If used as constructor with new, bound thisArg is ignored and prepended args still apply.

**Follow-ups:**
- bind on arrow?
- Bound function prototype chain?

**Red flags:**
- Says bind executes immediately

---

## Q3. [RU] Что такое soft binding?

**Answer (EN):**
Wrapper that uses default this only when call would be default/undefined binding; otherwise uses call-site this. Useful for shared handlers that allow override.

**Follow-ups:**
- lodash bind pattern?
- Event emitter context?

**Red flags:**
- Never heard of soft bind

---

## Q4. [RU] Можно ли переопределить this у bound функции?

**Answer (EN):**
No for hard bind — call/apply with different this still use bound this. new binding is exception: new BoundFn() creates new instance, ignoring bound thisArg.

**Follow-ups:**
- Double bind?
- Arrow cannot be bound meaningfully?

**Red flags:**
- Says call always wins

---

## Q5. [RU] Как реализовать call без native call?

**Answer (EN):**
Temporarily assign function as property on thisArg object (or use Symbol key), invoke as method, delete property. null/undefined thisArg passes to generic function call.

**Follow-ups:**
- Primitive thisArg boxing?
- Strict null handling?

**Red flags:**
- Only mentions .call in answer

---
