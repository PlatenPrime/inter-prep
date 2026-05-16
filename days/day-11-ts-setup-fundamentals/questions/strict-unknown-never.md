# strict, unknown, never — Interview Q&A

---

## Q1. [RU] Для чего нужен тип never?

**Answer (EN):**
Represents values that never occur: exhaustiveness in switch, functions that always throw. Compiler uses never to prove all union cases handled. Link to assertNever in reducers.

**Follow-ups:**
- never vs void in functions?
- Conditional types with never?

**Red flags:**
- Confusing never with null

---

## Q2. [RU] Что такое exhaustiveness checking?

**Answer (EN):**
After narrowing a union, default assigns to never — adding a variant causes compile error. Runtime mirror: assertNever in default branch. Critical for discriminated unions.

**Follow-ups:**
- Discriminated union pattern?
- switch(kind) best practice?

**Red flags:**
- Missing default in union reducer

---

## Q3. [RU] readonly vs const assertion — разница?

**Answer (EN):**
readonly prevents reassignment of property; as const narrows literals and makes structure deeply readonly. Use as const for config objects and tuple inference.

**Follow-ups:**
- ReadonlyArray vs readonly T[]?
- Deep readonly utility?

**Red flags:**
- Mutating as const object at runtime

---

## Q4. [RU] Что такое definite assignment assertion (!)?

**Answer (EN):**
Tells TS property will be assigned before use. Prefer initialization in constructor or guards. Common legacy misuse on React class fields.

**Follow-ups:**
- strictPropertyInitialization?
- useState vs ! on field?

**Red flags:**
- ! on every field without init logic

---

## Q5. [RU] Как организовать shared types между frontend и backend?

**Answer (EN):**
Monorepo @app/types, OpenAPI/zod codegen, or tRPC inferred types. Runtime validation still required at API boundary — types alone do not validate wire format.

**Follow-ups:**
- OpenAPI codegen pitfalls?
- Versioning breaking changes?

**Red flags:**
- Types only, no runtime validation at edge

---

## Q6. [RU] tsconfig paths (@/*) — зачем и подводные камни?

**Answer (EN):**
paths alias imports; must mirror in Vite/Jest/vitest. baseUrl + paths. Breaks if one tool not configured. Mention moduleResolution bundler vs node16.

**Follow-ups:**
- Project references?
- Composite builds?

**Red flags:**
- paths in tsc but broken in test runner

---

