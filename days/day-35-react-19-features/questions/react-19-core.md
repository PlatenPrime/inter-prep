# React 19 Core — Interview Q&A

---

## Q1. [RU] use() hook?

**Answer (EN):**
Read promise or context in render; suspends until resolved — pairs with Suspense boundaries.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Server Actions?

**Answer (EN):**
Async functions on server called from forms; serializable; integrate with useActionState for pending/errors.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] useActionState?

**Answer (EN):**
Manages action result + pending + form state from Server Action or client action.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] useOptimistic?

**Answer (EN):**
Show immediate UI while mutation in flight; rollback on error — better UX for likes/comments.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] ref as prop?

**Answer (EN):**
ref passed like normal prop — drops forwardRef boilerplate in 19.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Document metadata?

**Answer (EN):**
Built-in title/meta in components — replaces react-helmet for many cases.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
