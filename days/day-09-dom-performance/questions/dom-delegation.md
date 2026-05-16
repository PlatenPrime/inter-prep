# DOM Delegation — Interview Q&A

---

## Q1. [RU] Что такое event delegation и зачем оно?

**Answer (EN):**
Attach one listener on ancestor; on event use event.target.closest(selector) to handle matching descendants. Fewer listeners, works for dynamic children. Common in tables and lists.

**Follow-ups:**
- capture vs bubble phase?
- passive listeners?

**Red flags:**
- Listener per row in 10k row table

---

## Q2. [RU] Как работает stopPropagation vs preventDefault?

**Answer (EN):**
preventDefault blocks default browser action (submit, link); stopPropagation stops event traveling to other elements. They are independent. Interview: don't stop propagation without reason — breaks delegation.

**Follow-ups:**
- stopImmediatePropagation?
- passive: false for preventDefault?

**Red flags:**
- preventDefault on click without explaining why

---

## Q3. [RU] Что такое event.target vs currentTarget?

**Answer (EN):**
target is element that originated event; currentTarget is element with attached listener (often delegate root). In handlers, currentTarget is what you bound to.

**Follow-ups:**
- Shadow DOM retargeting?
- composedPath?

**Red flags:**
- Assuming target is always the button in delegation

---

## Q4. [RU] Как избежать memory leaks от DOM listeners?

**Answer (EN):**
Remove listeners on teardown, use AbortSignal with {signal} option in addEventListener, avoid closing over large DOM in long-lived callbacks.

**Follow-ups:**
- React strict mode double mount?
- WeakRef patterns?

**Red flags:**
- Global listeners never removed on SPA route change

---

## Q5. [RU] Что такое passive event listeners?

**Answer (EN):**
Hint browser you won't call preventDefault — enables scroll optimization. Use {passive: true} on touch/wheel when not preventing default.

**Follow-ups:**
- Chrome intervention?
- React 17 delegation root?

**Red flags:**
- preventDefault in passive wheel listener (ignored)

---

## Q6. [RU] Как тестировать DOM logic без browser?

**Answer (EN):**
jsdom provides minimal DOM; test pure helpers (matcher, virtual slice) separately. Integration with Playwright for real browser behavior.

**Follow-ups:**
- happy-dom?
- @testing-library?

**Red flags:**
- Only E2E for pure string/HTML parsers

---

