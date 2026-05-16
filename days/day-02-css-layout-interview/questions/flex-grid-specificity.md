# Flex, Grid & Specificity — Interview Q&A

---

## Q1. [RU] Когда выбрать Flexbox, а когда Grid?

**Answer (EN):**
Flexbox is one-dimensional: distribute space along a single axis (row OR column) — nav bars, centering, equal-height cards in a row. Grid is two-dimensional: rows and columns together — page layouts, dashboards, complex alignment. Rule: content-first flow → flex; layout shell / explicit tracks → grid. They combine: grid for page, flex inside cells.

**Follow-ups:**
- `subgrid` — what problem does it solve?
- Can you use both on same element?

**Red flags:**
- "Grid replaced flex entirely"
- Using flex with many `width: 33.33%` hacks instead of grid

---

## Q2. [RU] Разница между `justify-content` и `align-items` в flex?

**Answer (EN):**
In default `flex-direction: row`, `justify-content` aligns items along the main axis (horizontal), `align-items` along the cross axis (vertical). Axes swap when direction is column. `align-content` matters when multiple flex lines exist (`flex-wrap: wrap`). Interview: always state direction before naming which property does what.

**Follow-ups:**
- `justify-items` in grid vs flex?
- `gap` vs margin between items?

**Red flags:**
- Memorizing "justify = horizontal" without mentioning flex-direction

---

## Q3. [RU] Что делают `flex-grow`, `flex-shrink`, `flex-basis`?

**Answer (EN):**
`flex-basis` is initial size before free space distribution. `flex-grow` distributes positive free space proportionally. `flex-shrink` removes space when items overflow (default 1). Shorthand `flex: 1` often means `1 1 0%` — grow/shrink with zero basis. `min-width: 0` prevents flex items from refusing to shrink below content size.

**Follow-ups:**
- `flex: auto` vs `flex: 1`?
- Why do long words break flex layouts?

**Red flags:**
- Setting only `flex-grow` without understanding overflow shrink

---

## Q4. [RU] Как работает CSS Grid `fr` unit?

**Answer (EN):**
`fr` distributes **remaining** space after fixed tracks and gaps. `1fr 2fr` splits free space 1:2. Unlike %, fr accounts for gaps and min-content sizes. `minmax(0, 1fr)` prevents overflow from min-content defaults. Interview: fr is flex-like sharing on the grid axis.

**Follow-ups:**
- `auto` vs `minmax(auto, 1fr)`?
- Dense packing with `grid-auto-flow`?

**Red flags:**
- Treating `1fr` as exactly 50% in two-column without gap context

---

## Q5. [RU] Как считается specificity и почему `!important` — отдельная история?

**Answer (EN):**
Specificity is (inline styles, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements) compared lexicographically as tuples — not as a single number in modern understanding. `!important` beats normal rules regardless of specificity (except cascade layers and equal important order). Inline style beats ID selector unless `!important` on ID rule in some cases — know your cascade layers.

**Follow-ups:**
- `:where()` specificity zero — why use it?
- `@layer` vs specificity?

**Red flags:**
- Adding IDs everywhere to "win" specificity wars
- `!important` as first debugging tool

---

## Q6. [RU] Что такое stacking context и связь с `z-index`?

**Answer (EN):**
`z-index` only compares elements within the same stacking context. New contexts created by `position` + z-index, `opacity < 1`, `transform`, `filter`, `isolation: isolate`, etc. A child with `z-index: 9999` cannot escape above a sibling context's parent. Interview: debug overlays by finding which ancestor creates a context.

**Follow-ups:**
- `z-index` on `position: static`?
- Portal/modals and stacking?

**Red flags:**
- Raising z-index without finding trapping parent context

---

## Q7. [RU] Как центрировать элемент — «классический» ответ на интервью?

**Answer (EN):**
Modern answer: `display: grid; place-items: center` on parent, or flex with `justify-content` + `align-items: center`. For unknown dimensions, flex/grid beat transform `translate(-50%)` hacks. Mention when absolute + inset 0 + margin auto still applies (legacy/full-bleed patterns).

**Follow-ups:**
- Center in viewport vs in card?
- `margin: auto` in flex?

**Red flags:**
- Only knowing `position: absolute; top: 50%; left: 50%; transform` without flex/grid
