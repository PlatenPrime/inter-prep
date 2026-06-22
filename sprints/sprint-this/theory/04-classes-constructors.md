# Classes & Constructors — Interview Q&A

---

## Q1. [RU] Как this работает в ES class constructor?

**Answer (EN):**
new binding: this is fresh instance. Must call super() in derived class before using this. Class methods on prototype get implicit binding on instance call.

**Follow-ups:**
- Private fields and this?
- Static methods this?

**Red flags:**
- Uses this before super in derived

---

## Q2. [RU] Class field arrow vs prototype method?

**Answer (EN):**
Field arrow on instance captures this lexically per instance — safe as callback. Prototype method cheaper memory but loses this when extracted unless bound.

**Follow-ups:**
- TypeScript parameter properties?
- Benchmark relevance?

**Red flags:**
- No trade-off discussion

---

## Q3. [RU] Как super связан с this?

**Answer (EN):**
super calls use current this of method invocation — parent method runs as if on child instance. super must be in regular method, not arrow (syntax error).

**Follow-ups:**
- super in static methods?
- Proxy and super?

**Red flags:**
- super in arrow works

---

## Q4. [RU] Что возвращает constructor при return?

**Answer (EN):**
Return object replaces new target instance as result. Return primitive ignored — default instance used. Affects what caller receives, not internal this during construction.

**Follow-ups:**
- Factory constructor pattern?
- anti-pattern?

**Red flags:**
- Says return 42 changes instance

---

## Q5. [RU] Разница class sugar и function constructor?

**Answer (EN):**
Class methods non-enumerable on prototype; class body strict; hoisting TDZ for class binding. Under hood still prototype + constructor function.

**Follow-ups:**
- instanceof behavior?
- extends transpilation?

**Red flags:**
- Says class is not prototype-based

---
