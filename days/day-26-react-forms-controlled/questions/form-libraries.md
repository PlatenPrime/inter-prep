# Form Libraries & Patterns — Interview Q&A

---

## Q1. [RU] react-hook-form преимущества?

**Answer (EN):**
Uncontrolled inputs with refs — fewer re-renders. Resolver integrates Zod. watch, control for complex cases. Interview compare to Formik.

**Follow-ups:**
- Controller component?
- register API?

**Red flags:**
- RHF still re-renders everything myth without understanding

---

## Q2. [RU] Zod resolver pattern?

**Answer (EN):**
zodResolver(schema) maps errors to fields. Single schema for client+server in tRPC stack.

**Follow-ups:**
- superRefine cross-field?
- transform before validate?

**Red flags:**
- Schema only on client

---

## Q3. [RU] Server Actions form submit?

**Answer (EN):**
Next.js form action with progressive enhancement. useFormStatus for pending. Combine with client validation before post.

**Follow-ups:**
- useActionState?
- Hidden input tokens?

**Red flags:**
- No loading state on submit

---

## Q4. [RU] Debounced validation?

**Answer (EN):**
Validate async email uniqueness after debounce — avoid hammering API. Cancel in-flight on change.

**Follow-ups:**
- AbortController?
- Optimistic UI?

**Red flags:**
- Validate every keystroke against server

---

## Q5. [RU] Dynamic field arrays?

**Answer (EN):**
useFieldArray (RHF) or reducer APPEND_ROW/REMOVE_ROW. Stable keys for rows — not index keys when reorder/delete.

**Follow-ups:**
- Nested field paths?
- Default values for new row?

**Red flags:**
- Index keys in editable list of forms

---

## Q6. [RU] Form performance large forms?

**Answer (EN):**
Split into steps, uncontrolled library, or isolate field components with memo. Avoid top-level state object replacing entire form each keystroke if not needed.

**Follow-ups:**
- Field-level subscriptions?
- Blur validation only?

**Red flags:**
- Parent state = entire form object recreated each char

---

