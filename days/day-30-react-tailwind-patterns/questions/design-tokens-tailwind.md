# Design Tokens & Tailwind — Interview Q&A

---

## Q1. [RU] tokenResolve pattern?

**Answer (EN):**
Map semantic token names (color.primary) to CSS values from theme object. Runtime for CSS-in-JS; Tailwind uses config theme extend.

**Follow-ups:**
- Style Dictionary?
- Figma tokens?

**Red flags:**
- Hardcoded hex in components

---

## Q2. [RU] CSS variables + Tailwind?

**Answer (EN):**
Define --color-primary in :root, reference in @theme or arbitrary bg-[var(--color-primary)]. Enables runtime theme switch.

**Follow-ups:**
- data-theme attribute?
- OKLCH colors?

**Red flags:**
- Duplicating hex in tailwind config and CSS vars inconsistently

---

## Q3. [RU] Responsive design mobile-first?

**Answer (EN):**
Unprefixed base, md: lg: breakpoints. Match product breakpoints in config. Container queries @container in v4.

**Follow-ups:**
- max-md vs md?
- Fluid typography clamp?

**Red flags:**
- Desktop-first max-width breakpoints only

---

## Q4. [RU] shadcn copy-paste model?

**Answer (EN):**
Own components in repo — full control, not npm black box. cn + CVA + Radix primitives. Update via CLI diff.

**Follow-ups:**
- Registry components?
- Customization policy?

**Red flags:**
- Treating shadcn as opaque npm package

---

## Q5. [RU] Performance Tailwind in React?

**Answer (EN):**
Static classes compile away; avoid dynamic class string building when possible — use safelist or complete class names for purge. No runtime CSS-in-JS cost.

**Follow-ups:**
- Dynamic class purge issue?
- Complete class names rule?

**Red flags:**
- `bg-${color}-500` dynamic breaking purge

---

## Q6. [RU] Accessibility with utility classes?

**Answer (EN):**
sr-only, focus-visible:ring, aria-* in JSX not Tailwind alone. Color contrast from token palette. Do not remove outline without replacement.

**Follow-ups:**
- prefers-reduced-motion?
- Contrast ratio day 3 link?

**Red flags:**
- focus:outline-none without ring replacement

---

