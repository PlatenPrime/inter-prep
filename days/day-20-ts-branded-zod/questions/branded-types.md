# Branded Types — Interview Q&A

---

## Q1. [RU] Что такое branded type в TypeScript?

**Answer (EN):**
Intersection with unique symbol brand: type UserId = string & { __brand: "UserId" }. Prevents assigning plain string where UserId expected. Erased at compile time — no runtime cost unless you add runtime registry.

**Follow-ups:**
- Brand vs opaque type?
- Nominal typing simulation?

**Red flags:**
- Thinking brand enforces runtime safety alone

---

## Q2. [RU] Как создать brand runtime-safe?

**Answer (EN):**
Validate then assert brand function; store brand in WeakMap or symbol property for debugging. Zod .brand() adds both. Interview: compile-time + runtime validation together.

**Follow-ups:**
- zod brand?
- Private symbol field?

**Red flags:**
- brand() without validation

---

## Q3. [RU] stripBrand зачем?

**Answer (EN):**
Serialize to JSON/plain objects without brand metadata. Interop with APIs expecting string. WeakMap cleanup avoids memory leaks for branded object keys.

**Follow-ups:**
- Structured clone?
- Logging sanitized objects?

**Red flags:**
- Leaking brand symbol to API

---

## Q4. [RU] Template literal brands?

**Answer (EN):**
type Email = `${string}@${string}` — weak validation. Prefer regex/zod at runtime. Template literals help autocomplete not full validation.

**Follow-ups:**
- UUID template?
- ISO date string brand?

**Red flags:**
- Template literal as only email validation

---

## Q5. [RU] Branded vs enum for ids?

**Answer (EN):**
Brands work on primitives; enums add runtime object. Snowflake ids as string brand common. UUID library validates format then brands.

**Follow-ups:**
- const enum runtime?
- as const object vs enum?

**Red flags:**
- numeric enum for string ids

---

## Q6. [RU] When brands are overkill?

**Answer (EN):**
Simple CRUD with one id type — brands add friction. Valuable in large codebases with many id types (finance, healthcare). Team consistency matters.

**Follow-ups:**
- Newtype pattern?
- Haskell comparison?

**Red flags:**
- Branding every string in codebase

---

