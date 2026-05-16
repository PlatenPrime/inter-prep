# Mapped Types — Interview Q&A

---

## Q1. [RU] Синтаксис mapped type {[K in keyof T]: ...}?

**Answer (EN):**
Iterates keys of T transforming each property type. Can add modifiers +readonly, -optional, as clauses. Foundation for built-in utilities and advanced APIs.

**Follow-ups:**
- Key remapping as NewKey?
- Filter keys with extends?

**Red flags:**
- Mapped type without keyof constraint

---

## Q2. [RU] Как сделать all properties optional readonly?

**Answer (EN):**
{[K in keyof T]?: T[K]} and {[K in keyof T]-?: ...} for required. Combine modifiers in mapped types for code generation patterns.

**Follow-ups:**
- -? modifier?
- +readonly?

**Red flags:**
- Forgetting optional modifier semantics

---

## Q3. [RU] Template literal types в mapped keys?

**Answer (EN):**
Getters as `get${Capitalize<K>}` for keys K. Powers typed event maps and CSS-in-JS keys. TS 4.1+ feature senior candidates know.

**Follow-ups:**
- Intrinsic string manipulation types?
- as const satisfies keys?

**Red flags:**
- Excessive complexity for simple string keys

---

## Q4. [RU] Conditional types в mapped properties?

**Answer (EN):**
Per-key transformation: T[K] extends string ? X : Y. Enables DeepPartial, DeepReadonly implementations. Watch recursion depth limits.

**Follow-ups:**
- Type instantiation depth error?
- Simplify levels?

**Red flags:**
- Infinite recursive mapped type

---

## Q5. [RU] satisfies operator vs type annotation?

**Answer (EN):**
satisfies checks value matches type while preserving literal inference. Annotation widens literals. Use for config objects needing both validation and narrow literals.

**Follow-ups:**
- satisfies with generics?
- as const vs satisfies?

**Red flags:**
- Using as const when satisfies needed for checks

---

## Q6. [RU] Когда mapped types в проде избыточны?

**Answer (EN):**
Simple interfaces suffice for CRUD DTOs. Over-engineered mapped types hurt readability. Use utilities from TS/stdlib before custom deep magic.

**Follow-ups:**
- Codegen from OpenAPI instead?
- Zod infer?

**Red flags:**
- 100-line mapped type for 3 fields

---

