# Utility-First & Tailwind — Interview Q&A

---

## Q1. [RU] Что такое utility-first CSS и главные плюсы/минусы?

**Answer (EN):**
Utility-first applies small single-purpose classes (`flex`, `p-4`, `text-center`) directly in markup instead of naming every component in CSS files. Pros: speed, consistency, no naming fatigue, dead-code elimination with purge. Cons: verbose HTML, learning curve, risk of inconsistency without design tokens, harder for designers who expect semantic class names.

**Follow-ups:**
- When does utility-first break down?
- Comparison to CSS Modules / styled-components?

**Red flags:**
- "Utility-first means no custom CSS ever"
- Inline styles disguised as unlimited arbitrary values

---

## Q2. [RU] Как Tailwind разрешает конфликтующие utilities?

**Answer (EN):**
In generated CSS, order in the **stylesheet** matters, not HTML class order (unlike some libraries). Tailwind sorts utilities in a deterministic layer order; later rules in the same specificity win. For conflicting `p-4` and `p-2`, the one that appears last in the built CSS wins — not document order in `class=""`. Plugins and variants extend this system.

**Follow-ups:**
- `tailwind-merge` / `cn()` helper — why needed in React?
- `@apply` order issues?

**Red flags:**
- Assuming last class in `className` string always wins without merge helper

---

## Q3. [RU] Когда использовать `@apply` vs оставить utilities в JSX?

**Answer (EN):**
Tailwind docs recommend utilities in markup for most cases. `@apply` suits extracting repeated patterns into a component class **when** the abstraction is stable (btn-primary). Over-`@apply` recreates traditional CSS with extra indirection. Interview: prefer components (React) over `@apply` for reuse.

**Follow-ups:**
- `@apply` in CSS modules?
- Performance of huge class strings?

**Red flags:**
- Entire pages written as one `@apply` block — loses purge clarity

---

## Q4. [RU] Что такое JIT compiler в Tailwind v3+?

**Answer (EN):**
Just-In-Time generates only classes found in content paths on demand — faster builds, arbitrary values (`w-[137px]`), all variants without huge prebuilt CSS. Content config (`content: ['./src/**/*.{tsx}']`) drives scanning. Interview: mention purge/content paths or styles bloat.

**Follow-ups:**
- Safelist for dynamic class names?
- v4 CSS-first config changes awareness?

**Red flags:**
- Dynamic string concatenation breaking purge (`'text-' + color`)

---

## Q5. [RU] Как организовать responsive utilities?

**Answer (EN):**
Mobile-first prefixes: `md:flex`, `lg:grid-cols-3` apply at min-width breakpoints defined in theme. Same pattern for `hover:`, `dark:`, `focus-visible:`. Keeps responsive logic colocated with element — readable once you know the prefix system.

**Follow-ups:**
- Container queries `@lg:` in Tailwind v4?
- Arbitrary breakpoints?

**Red flags:**
- Desktop-first `max-lg:` everywhere without reason

---

## Q6. [RU] Arbitrary values — `[...]` — когда уместны?

**Answer (EN):**
`w-[327px]`, `bg-[#1a1a1a]` escape the design scale for one-offs. Use sparingly — repeated arbitrary values signal missing tokens. Interview: promote to theme config if used twice.

**Follow-ups:**
- Arbitrary properties `[mask-image:...]`?
- Type safety with Tailwind + TS plugins?

**Red flags:**
- Every color is arbitrary hex — no design system

---

## Q7. [RU] Как тестировать компоненты с длинными className?

**Answer (EN):**
Test behavior and roles, not exact class strings (implementation detail). If needed, `data-testid` or semantic queries (RTL). For design regression, visual snapshot tests. `cn()` + `tailwind-merge` keep class lists maintainable in code review.

**Follow-ups:**
- Storybook and Tailwind?
- eslint-plugin-tailwindcss?

**Red flags:**
- Snapshotting full className strings on every PR
