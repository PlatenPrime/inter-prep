# Validation — Interview Q&A

---

## Q1. [RU] Где валидировать input?

**Answer (EN):**
At boundary: HTTP body/query/params before business logic. Share schema with frontend if TS.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] zod vs joi?

**Answer (EN):**
zod infers TS types; joi mature ecosystem. express-zod-safe pattern.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Whitelist validation?

**Answer (EN):**
stripUnknown / .strict() — reject unexpected fields mass assignment.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Custom error messages?

**Answer (EN):**
Map Zod issues to 422 field errors for forms.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Validate env at boot?

**Answer (EN):**
envalid/zod env schema — fail fast misconfiguration.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] File upload validation?

**Answer (EN):**
Size, MIME magic bytes, virus scan, store outside webroot.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
