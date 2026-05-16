# Reconciliation & Keys — Interview Q&A

---

## Q1. [RU] Что такое reconciliation в React?

**Answer (EN):**
React diffs new element tree against previous, reuses DOM when type/props match, and schedules updates via Fiber. O(n) heuristic vs full tree diff. Interview: virtual DOM is blueprint; Fiber enables scheduling.

**Follow-ups:**
- Double buffering tree?
- Concurrent rendering?

**Red flags:**
- "Virtual DOM is always faster than real DOM"

---

## Q2. [RU] Зачем нужны keys в списках?

**Answer (EN):**
Keys identify stable identity across renders so React matches correct instance when reordering. Wrong keys cause state bugs and unnecessary unmount/remount. Prefer stable ids from data.

**Follow-ups:**
- key on Fragment?
- key={Math.random()}?

**Red flags:**
- Index as key in sortable/filterable list

---

## Q3. [RU] Что происходит при смене key у компонента?

**Answer (EN):**
React treats as different instance — unmount old, mount new, reset state. Useful for forcing reset on route change; harmful if accidental.

**Follow-ups:**
- reset state without remount?
- key={id} form pattern?

**Red flags:**
- Changing key to fix state instead of lifting state

---

## Q4. [RU] Element type change vs same type?

**Answer (EN):**
Different type (div→span) destroys subtree and rebuilds. Same type updates props in place. Component type change resets child state unless state lifted.

**Follow-ups:**
- Same component different position?
- Portal reconciliation?

**Red flags:**
- Replacing button with Link without moving state up

---

## Q5. [RU] Controlled vs uncontrolled remount?

**Answer (EN):**
Remount resets DOM input state. key on form when switching user. Mention defaultValue vs value controlled pattern link.

**Follow-ups:**
- key on route outlet?
- Suspense boundary reset?

**Red flags:**
- Remounting entire app on minor prop change

---

## Q6. [RU] React 18 batching и reconciliation?

**Answer (EN):**
Multiple setStates batch in event handlers and promises (automatic batching). Fewer intermediate paints. flushSync opts out for DOM measure.

**Follow-ups:**
- React 17 batching limits?
- useTransition priority?

**Red flags:**
- flushSync in every handler

---

