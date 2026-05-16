# Type Guards & Narrowing — Interview Q&A

---

## Q1. [RU] Что такое control flow analysis?

**Answer (EN):**
Compiler tracks type refinements after if, switch, return, throw. Variables narrowed in true/false branches. Enables safe access without extra casts after checks.

**Follow-ups:**
- Assignment narrowing?
- Aliasing breaks narrowing?

**Red flags:**
- Assuming narrowed variable stays narrowed after mutation

---

## Q2. [RU] Почему else ветка с never важна?

**Answer (EN):**
Proves all union members handled at compile time. If union extended, build fails until default updated. Pair with runtime assertNever for external data.

**Follow-ups:**
- Exhaustive switch helper libs?
- ts-pattern library?

**Red flags:**
- default: break without never check

---

## Q3. [RU] Как сузить unknown до конкретного типа?

**Answer (EN):**
Chain of typeof, Array.isArray, custom type guards, or schema parse. Never jump with as without validation. Mention narrowing assignment in try/catch.

**Follow-ups:**
- Zod safeParse flow?
- Multiple guards composition?

**Red flags:**
- Single as User after JSON.parse

---

## Q4. [RU] Что такое keyof и как связано с isKeyOf?

**Answer (EN):**
keyof T is union of keys. isKeyOf checks runtime string is key of object — useful for safe dynamic access without casting. Combine with Record for maps.

**Follow-ups:**
- keyof typeof constObj?
- Template literal keys?

**Red flags:**
- Dynamic key access without validation

---

## Q5. [RU] Optional chaining и narrowing — взаимодействие?

**Answer (EN):**
Optional chain short-circuits undefined/null; does not always narrow for later lines unless assigned to const after check. Prefer explicit if (x != null) for multi-step logic.

**Follow-ups:**
- Non-null assertion after ?.
- Nullish coalescing ?? vs ||

**Red flags:**
- x!.foo after optional chain without guard

---

## Q6. [RU] Как тестировать type guards?

**Answer (EN):**
Unit test runtime behavior (true/false cases). Type-level tests via expectTypeOf or dtslint for library code. Guards must be correct at runtime — types do not exist at runtime.

**Follow-ups:**
- @ts-expect-error tests?
- Property-based testing?

**Red flags:**
- Only compile tests, no runtime cases for guard

---

