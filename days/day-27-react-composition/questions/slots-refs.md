# Slots & Refs — Interview Q&A

---

## Q1. [RU] callback ref vs object ref?

**Answer (EN):**
Callback invoked on mount/unmount with node; object ref uses .current. Callback useful for measuring and mergeRefs.

**Follow-ups:**
- ref null on unmount?
- Strict mode double invoke?

**Red flags:**
- Assuming ref.current set synchronously always

---

## Q2. [RU] forwardRefPoly simplified?

**Answer (EN):**
Attach ref to returned props object for polymorphic component exercise. Bridges typing for generic element.

**Follow-ups:**
- Ref forwarding generics?
- ComponentPropsWithRef?

**Red flags:**
- any ref type

---

## Q3. [RU] Polymorphic + ref together?

**Answer (EN):**
ComponentPropsWithoutRef<E> & { as?: E } with forwarded ref to element type. Advanced DS interview question.

**Follow-ups:**
- asChild Radix?
- Slot merges props?

**Red flags:**
- Ref to wrong element type

---

## Q4. [RU] CloneElement vs composition?

**Answer (EN):**
cloneElement inject props — fragile, breaks memo. Prefer context or explicit subcomponents. Mention anti-pattern in legacy libs.

**Follow-ups:**
- Why avoid cloneElement?
- React.Children.only?

**Red flags:**
- cloneElement for all composition

---

## Q5. [RU] Lifting content via children prop?

**Answer (EN):**
Card accepts children instead of body prop — arbitrary content. Layout components use children as main slot.

**Follow-ups:**
- Named slots vs children?
- Multiple children types?

**Red flags:**
- body prop only string when need rich content

---

## Q6. [RU] Accessibility in compound widgets?

**Answer (EN):**
Tab roving tabindex, aria-selected, keyboard arrows. Compose with Radix primitives when possible.

**Follow-ups:**
- Headless UI?
- ARIA roles?

**Red flags:**
- div onClick tab without keyboard

---

