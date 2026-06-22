# Arrow vs Regular Functions — Interview Q&A

---

## Q1. [RU] Чем стрелочные функции отличаются по this?

**Answer (EN):**
Arrows have no own this — they close over lexical this from enclosing scope at definition time. Cannot be used as constructors, no arguments object, no bind/call/apply this change.

**Follow-ups:**
- Arrow as object method anti-pattern?
- Class field arrow rationale?

**Red flags:**
- Says arrow this is always undefined
- Uses arrow as constructor

---

## Q2. [RU] Почему arrow в object literal часто ошибка?

**Answer (EN):**
Lexical this is outer scope (module/global), not the object. Use regular method or define arrow inside regular method to capture object this.

**Follow-ups:**
- React class fields vs methods?
- Performance of field arrows?

**Red flags:**
- Uses arrow methods everywhere

---

## Q3. [RU] Как arrow помогает в React callbacks?

**Answer (EN):**
Class field arrow or arrow inside render closes over component instance this — avoids bind in constructor. Trade-off: per-instance function vs shared prototype method.

**Follow-ups:**
- useCallback dependency?
- Functional components no this?

**Red flags:**
- Only mentions bind, not lexical this

---

## Q4. [RU] this в setTimeout: arrow vs function?

**Answer (EN):**
Regular callback gets default binding (undefined strict / global sloppy). Arrow inherits this from enclosing function — correct pattern inside class methods.

**Follow-ups:**
- addEventListener same rule?
- Node setImmediate?

**Red flags:**
- Says setTimeout preserves method this

---

## Q5. [RU] Можно ли use call на arrow function?

**Answer (EN):**
Syntax allows it but ignores thisArg — lexical this unchanged. bind also cannot rebind arrow this meaningfully.

**Follow-ups:**
- When is arrow wrong for library API?
- Generator this?

**Red flags:**
- Claims call changes arrow this

---
