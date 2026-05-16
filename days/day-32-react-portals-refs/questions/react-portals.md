# React Portals — Interview Q&A

---

## Q1. [RU] Зачем React Portal?

**Answer (EN):**
Render children into DOM node outside parent hierarchy — modals, tooltips escape overflow:hidden.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q2. [RU] SSR с порталами?

**Answer (EN):**
Need container element on server; hydrate carefully to avoid mismatch.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q3. [RU] createPortal API?

**Answer (EN):**
ReactDOM.createPortal(child, domNode) keeps React tree/event bubbling context.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q4. [RU] Event bubbling через portal?

**Answer (EN):**
Events bubble according to React tree not DOM tree — important for modals.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q5. [RU] Портал vs position fixed?

**Answer (EN):**
Portal solves stacking context/overflow; fixed alone may clip.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---

## Q6. [RU] Accessibility портала?

**Answer (EN):**
Focus trap, aria-modal, return focus on close.

**Follow-ups:**
- Follow-up?

**Red flags:**
- Red flag

---
