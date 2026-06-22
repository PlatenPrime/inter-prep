# this Binding Rules — Interview Q&A

---

## Q1. [RU] Как определяется значение this в JavaScript?

**Answer (EN):**
this is determined by call site, not declaration (except arrows). Four rules: default binding, implicit (method), explicit (call/apply/bind), and new binding. Strict mode changes default to undefined instead of global.

**Follow-ups:**
- Why not use var self = this?
- globalThis vs window?

**Red flags:**
- Says this is lexically scoped for all functions
- Confuses this with scope chain

---

## Q2. [RU] Что такое default binding?

**Answer (EN):**
Plain function call: non-strict binds this to globalThis; strict mode leaves this as undefined. Applies to free functions and extracted methods.

**Follow-ups:**
- IIFE default binding?
- Module top-level this?

**Red flags:**
- Says this is always global

---

## Q3. [RU] Что такое implicit binding?

**Answer (EN):**
When function is called as object method (obj.fn()), this is obj. Lost if method is passed as callback without binding — classic interview trap.

**Follow-ups:**
- obj.fn() vs (obj.fn)()
- Comma operator unbinding?

**Red flags:**
- Thinks this follows where function was defined

---

## Q4. [RU] Что такое explicit binding?

**Answer (EN):**
call, apply, bind force this to provided value. bind creates hard-bound function ignoring later call/apply thisArg (unless constructed with new).

**Follow-ups:**
- Soft bind pattern?
- bind partial application?

**Red flags:**
- Says call can override hard bind

---

## Q5. [RU] Что такое new binding?

**Answer (EN):**
new creates fresh object, sets this to it, runs constructor. If constructor returns object, that replaces default this; primitive return is ignored.

**Follow-ups:**
- new with arrow?
- Class constructor vs function

**Red flags:**
- Says new always returns constructor

---
