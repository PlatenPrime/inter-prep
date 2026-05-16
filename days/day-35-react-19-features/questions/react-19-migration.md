# Migration & Compiler — Interview Q&A

---

## Q1. [RU] React 19 breaking changes?

**Answer (EN):**
Strict mode double invoke remains; string refs removed long ago; codemods for act imports from testing-library.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] React Compiler?

**Answer (EN):**
Auto memoization at build time — still add keys and fix impure renders; not magic for network.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Hydration errors debug?

**Answer (EN):**
Mismatch server/client HTML — Date.now, random ids; use suppressHydrationWarning sparingly.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Forms in 19?

**Answer (EN):**
form action prop, pending state from useFormStatus in child submit button.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] RSC + 19?

**Answer (EN):**
Server Components default in Next App Router; client components marked use client.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Testing 19 features?

**Answer (EN):**
Mock Server Actions; await findBy for Suspense; test optimistic rollback paths.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
