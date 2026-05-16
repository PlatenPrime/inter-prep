# RTL Queries & Mocking — Interview Q&A

---

## Q1. [RU] Порядок RTL-запросов?

**Answer (EN):**
getByRole → label → placeholder → text → testId last.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q2. [RU] getBy vs findBy?

**Answer (EN):**
getBy sync throws; findBy async Promise for appearing UI.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q3. [RU] user-event vs fireEvent?

**Answer (EN):**
user-event full interaction; fireEvent single event.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q4. [RU] Тест async fetch?

**Answer (EN):**
MSW mock, findBy, disable query retries in tests.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q5. [RU] Unit vs integration mock?

**Answer (EN):**
Mock at network boundary not React internals.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q6. [RU] Accessible name?

**Answer (EN):**
getByRole with name option uses ACCNAME algorithm.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---
