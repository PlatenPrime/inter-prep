# Polymorphic Components — Interview Q&A

---

## Q1. [RU] Что такое polymorphic as prop?

**Answer (EN):**
Component renders as different element: <Text as="h1">. Type as: E extends ElementType = "span" and merge props of element. Used in design systems (Chakra, Radix patterns).

**Follow-ups:**
- ComponentPropsWithoutRef<E>?
- IntrinsicElements?

**Red flags:**
- as prop without proper prop merging

---

## Q2. [RU] mergeProps / defaultProps pattern?

**Answer (EN):**
Defaults first then user props override — same as default parameters but for objects. clone defaults to avoid mutation. Used in headless UI libraries.

**Follow-ups:**
- clsx with props?
- Tailwind merge?

**Red flags:**
- Mutating shared defaults object

---

## Q3. [RU] Discriminated props variants?

**Answer (EN):**
Button props: { variant: "link"; href: string } | { variant: "button"; onClick: ... }. Ensures href only when link. Better than optional everything.

**Follow-ups:**
- Never optional conflicts?
- Exclusive union?

**Red flags:**
- href? and onClick? both optional on all variants

---

## Q4. [RU] Generic list component List<T>?

**Answer (EN):**
items: T[], renderItem: (item: T) => ReactNode preserves item type. keyExtractor: (item: T) => string | number. Interview classic.

**Follow-ups:**
- key in renderItem?
- Memoized row props?

**Red flags:**
- items: any[]

---

## Q5. [RU] ComponentProps<typeof X> use case?

**Answer (EN):**
Extract props from component or element for wrappers. Extend Button props in IconButton. Keeps sync when upstream props change.

**Follow-ups:**
- typeof imported component?
- Ref forwarding wrapper?

**Red flags:**
- Duplicating 20 props manually

---

## Q6. [RU] Strict children count utility — зачем?

**Answer (EN):**
Runtime validate single child for Slot/Radix patterns. TypeScript cannot enforce count at compile time for ReactNode — runtime guard in dev.

**Follow-ups:**
- Children.only?
- React.Children utilities?

**Red flags:**
- Children.only in production without error boundary

---

