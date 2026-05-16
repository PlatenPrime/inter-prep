# useReducer & FSM — Interview Q&A

---

## Q1. [RU] useReducer vs useState?

**Answer (EN):**
useReducer when next state depends on previous and many action types — centralizes transitions, easier to test pure reducer.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] State machine на интервью?

**Answer (EN):**
Explicit states/events prevent impossible UI (e.g. loading + success). XState for complex flows; simple switch for forms.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Compound components?

**Answer (EN):**
Share implicit state via Context (Tabs, Select). Flexible composition vs prop drilling variant props.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Container/presentational?

**Answer (EN):**
Logic in container/hooks; dumb UI components — still valid with hooks (custom hooks replace containers).

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Command pattern UI?

**Answer (EN):**
Queue undoable actions; useful for editors, macro replay.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Anti-pattern: prop drilling 10 levels?

**Answer (EN):**
Context, composition, or state library — explain when each wins.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
