# memo & useMemo — Interview Q&A

---

## Q1. [RU] Когда React.memo помогает?

**Answer (EN):**
When parent re-renders often but props shallow-equal — skip child render. Useless if props always new references (inline objects/functions). Profile first.

**Follow-ups:**
- memo vs PureComponent?
- Custom compare function?

**Red flags:**
- memo every leaf component by default

---

## Q2. [RU] useMemo vs useCallback — разница?

**Answer (EN):**
useMemo caches computed value; useCallback caches function reference. Both need stable deps. Compiler may automate — still understand semantics.

**Follow-ups:**
- Expensive calc without useMemo?
- Referential equality for deps?

**Red flags:**
- useMemo for cheap string concat

---

## Q3. [RU] shallowEqual что сравнивает?

**Answer (EN):**
Same keys, Object.is per property. Not deep — nested object change undetected if parent ref same. Used in connect/memo comparisons.

**Follow-ups:**
- Deep equality cost?
- Immutable data helps?

**Red flags:**
- shallowEqual for nested form state

---

## Q4. [RU] Profiler API в React DevTools?

**Answer (EN):**
Record commit times, why components rendered. Flamegraph shows slow trees. Use in staging not guess.

**Follow-ups:**
- React.Profiler onCommit?
- Interaction tracing?

**Red flags:**
- Optimizing without measuring

---

## Q5. [RU] Lifting state up performance impact?

**Answer (EN):**
Central state causes wider re-render subtree. Colocate or split context/selectors. Mention children as element prop trick.

**Follow-ups:**
- Composition pattern?
- State colocation article?

**Red flags:**
- All state in root App component

---

## Q6. [RU] Virtualization requirement?

**Answer (EN):**
Long lists need windowing — memo row component with stable props. key stability critical.

**Follow-ups:**
- react-window?
- Dynamic row height?

**Red flags:**
- Only memo without virtualization on 10k list

---

