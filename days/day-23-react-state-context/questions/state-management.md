# State Management — Interview Q&A

---

## Q1. [RU] Local vs lifted vs global state?

**Answer (EN):**
Keep state as local as possible; lift when siblings need it; global for app-wide infrequent or complex shared state. Colocate reduces bugs.

**Follow-ups:**
- URL as state?
- Server state vs client?

**Red flags:**
- Everything in Redux day one

---

## Q2. [RU] selector function purpose?

**Answer (EN):**
Derive computed slice from state; memoize to avoid recalc. In Redux reselect; in Zustand pick with shallow compare. Keeps components thin.

**Follow-ups:**
- Reselect createSelector?
- Derived atom in Jotai?

**Red flags:**
- Map entire store in every component

---

## Q3. [RU] Immutability in updates?

**Answer (EN):**
New object/array references trigger React re-render detection. Immer simplifies nested updates. Structural sharing in Redux toolkit.

**Follow-ups:**
- produce from immer?
- Spread shallow limits?

**Red flags:**
- Mutate state array with push in reducer

---

## Q4. [RU] useReducer for global-like state?

**Answer (EN):**
Context + useReducer viable for medium apps. dispatch stable; state changes trigger consumers. Combine with split contexts.

**Follow-ups:**
- useContext dispatch typing?
- Action unions?

**Red flags:**
- Giant switch reducer without slices

---

## Q5. [RU] Colocation with feature folders?

**Answer (EN):**
State hooks beside feature components; export minimal API. Avoid god context file 2000 lines.

**Follow-ups:**
- Feature-sliced design?
- Domain modules?

**Red flags:**
- One store file for entire app

---

## Q6. [RU] Testing stores without React?

**Answer (EN):**
Test reducer and selectors pure functions. Integration with renderHook for context providers.

**Follow-ups:**
- MSW for server state?
- Mock provider?

**Red flags:**
- Only E2E for reducer logic

---

