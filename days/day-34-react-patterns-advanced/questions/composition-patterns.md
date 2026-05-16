# Composition — Interview Q&A

---

## Q1. [RU] Render props vs hooks?

**Answer (EN):**
Hooks replaced most render props; still useful for cross-cutting injection in class legacy.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] HOC pitfalls?

**Answer (EN):**
Ref forwarding, displayName, wrapper hell — prefer hooks.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Polymorphic components?

**Answer (EN):**
as prop with ComponentPropsWithoutRef — type-safe Button as Link.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Controlled vs uncontrolled?

**Answer (EN):**
Controlled for validation/sync; uncontrolled for simple forms/file inputs with ref.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Lift state up when?

**Answer (EN):**
Sibling communication needs common parent; avoid global too early.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Feature flags pattern?

**Answer (EN):**
Toggle at route or component boundary; lazy load experimental chunks.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
