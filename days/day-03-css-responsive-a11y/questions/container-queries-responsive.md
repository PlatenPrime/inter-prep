# Container Queries & Responsive — Interview Q&A

---

## Q1. [RU] Чем container queries отличаются от media queries?

**Answer (EN):**
Media queries respond to **viewport** size (`@media (min-width: 768px)`). Container queries respond to a **parent container's** size (`@container (min-width: 400px)`), so reusable components adapt to their slot, not the window. Essential for sidebars, cards in grids, and design systems where the same component appears in narrow and wide contexts.

**Follow-ups:**
- `container-type: inline-size` vs `size`?
- Naming containers with `container-name`?

**Red flags:**
- "Container queries replace all media queries"
- Forgetting to set `container-type` on ancestor

---

## Q2. [RU] Когда всё ещё нужны viewport breakpoints?

**Answer (EN):**
Page-level layout: navigation collapse, global typography scale, page gutters, multi-column shells. Container queries handle **component-level** responsiveness. Interview answer: use both — viewport for macro layout, container for component internals.

**Follow-ups:**
- Mobile-first vs desktop-first?
- `prefers-reduced-motion` — media or container?

**Red flags:**
- Putting nav hamburger logic inside card container queries

---

## Q3. [RU] Что такое fluid typography и `clamp()`?

**Answer (EN):**
Fluid type scales between min and max using viewport or container units: `font-size: clamp(1rem, 0.5rem + 2vw, 2rem)`. Avoids abrupt jumps at breakpoints while capping readability. Interview: explain all three arguments — minimum, preferred (often linear expression), maximum.

**Follow-ups:**
- `min()`, `max()` with clamp?
- Accessibility of too-small text on mobile?

**Red flags:**
- Only vw without min/max caps (unreadable on large/small screens)

---

## Q4. [RU] Как работает `min-width: 0` в flex/grid для responsive?

**Answer (EN):**
Default `min-width: auto` prevents flex/grid items from shrinking below content min-size, causing overflow. `min-width: 0` (or `overflow: hidden` trick) allows shrinking so text can truncate or scroll. Common fix for ellipsis in flex rows and responsive tables.

**Follow-ups:**
- `min-height: 0` in column flex?
- Intrinsic sizing keywords `min-content`?

**Red flags:**
- `overflow-x: scroll` on body without fixing flex child min-width

---

## Q5. [RU] Что такое `aspect-ratio` и зачем он в responsive UI?

**Answer (EN):**
`aspect-ratio` reserves space before media loads — reduces CLS (layout shift). Useful for video embeds, cards, skeleton placeholders. Combine with `object-fit: cover` on images inside fixed-ratio boxes.

**Follow-ups:**
- Padding-bottom hack vs native aspect-ratio?
- Responsive images `srcset`?

**Red flags:**
- Fixed height images without reserved space in CLS-sensitive pages

---

## Q6. [RU] Объясните mobile-first CSS подход.

**Answer (EN):**
Start with base styles for small screens; add `min-width` media queries for larger enhancements. Reduces override complexity vs desktop-first `max-width` chains. Aligns with progressive enhancement and performance (often less CSS parsed on mobile if structured well).

**Follow-ups:**
- `max-width` queries — ever valid?
- Container queries mobile-first pattern?

**Red flags:**
- Duplicate rules in both mobile and desktop blocks without system

---

## Q7. [RU] Как `picture` и `srcset` связаны с responsive images?

**Answer (EN):**
`srcset` offers multiple resolutions (`1x, 2x` or `w` descriptors) for browser to pick based on DPR and viewport. `<picture>` adds **art direction** — different crops/sources per media condition. Interview: srcset for performance; picture for different crops, not just size.

**Follow-ups:**
- `sizes` attribute role?
- WebP/AVIF with fallback?

**Red flags:**
- Giant 4000px image with only CSS `width: 100%`
