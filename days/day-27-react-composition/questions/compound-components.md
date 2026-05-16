# Compound Components — Interview Q&A

---

## Q1. [RU] Что такое compound components pattern?

**Answer (EN):**
Related components share implicit state via Context: Tabs, TabList, TabPanel. Flexible API vs monolithic props. Radix/shadcn use this extensively.

**Follow-ups:**
- Context in compound?
- Static properties Tab.List?

**Red flags:**
- God component with 40 props instead of composition

---

## Q2. [RU] compoundSlots — зачем?

**Answer (EN):**
Map slot name to ReactNode children for layout regions (header, footer). Alternative to named props. Used in custom layout primitives.

**Follow-ups:**
- Slot component Radix?
- children as function?

**Red flags:**
- Prop drilling slot content 5 levels

---

## Q3. [RU] useSlot helper?

**Answer (EN):**
Pick child or default for slot name from children structure. Simplified headless pattern for exercises.

**Follow-ups:**
- Children.map?
- isValidElement filter?

**Red flags:**
- Parsing children every render without memo

---

## Q4. [RU] Composition vs render props?

**Answer (EN):**
Composition uses element tree; render props pass function. Composition reads cleaner in JSX; render props flexible for inversion.

**Follow-ups:**
- Hooks replaced render props?
- React 19?

**Red flags:**
- Render prop hell nesting 5 deep

---

## Q5. [RU] forwardRef зачем в UI library?

**Answer (EN):**
Pass ref to inner DOM for focus/measure. React 19 ref as prop reducing forwardRef boilerplate — know both.

**Follow-ups:**
- useImperativeHandle?
- callback refs?

**Red flags:**
- Div wrapper blocking ref to input

---

## Q6. [RU] mergeRefs pattern?

**Answer (EN):**
Combine callback ref and object ref from parent + internal measure ref. Common in input wrappers.

**Follow-ups:**
- useMergeRefs hook?
- Ref cleanup?

**Red flags:**
- Only first ref attached

---

