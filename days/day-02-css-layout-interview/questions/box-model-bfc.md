# Box Model & BFC — Interview Q&A

---

## Q1. [RU] В чём разница между `content-box` и `border-box`?

**Answer (EN):**
In `content-box` (default in many resets, but often set globally to `border-box`), `width`/`height` apply to the content area only — padding and border add to the total size. In `border-box`, `width`/`height` include padding and border; content shrinks instead. Interview tip: `box-sizing: border-box` makes layout math predictable when setting width 100% with padding.

**Follow-ups:**
- What does `width: 100%` + padding do in each model?
- How does `min-width` interact?

**Red flags:**
- "They look the same"
- Forgetting padding breaks full-width layouts in content-box

---

## Q2. [RU] Что такое margin collapse и когда он происходит?

**Answer (EN):**
Adjacent vertical margins between block-level boxes collapse into one margin equal to the maximum (if both positive), minimum (if both negative), or sum (if mixed signs). Horizontal margins don't collapse. Parent-child margins can collapse through the parent if no border/padding/BFC separates them — a common "mystery gap" bug.

**Follow-ups:**
- How do flex/grid items behave with margin collapse?
- Does `overflow: hidden` on parent stop collapse?

**Red flags:**
- "Margins always add up"
- Using margin-top on first child without understanding collapse through parent

---

## Q3. [RU] Что такое Block Formatting Context (BFC) и зачем он на интервью?

**Answer (EN):**
A BFC is an isolated layout region where floats are contained, margins don't collapse with outside siblings, and auto height includes floated children. Created by `overflow` not visible, `display: flow-root`, `float`, `position: absolute/fixed`, flex/grid items, etc. Used to clear floats, contain margins, or create two-column layouts.

**Follow-ups:**
- `display: flow-root` vs clearfix hack?
- Does `display: flex` create a BFC?

**Red flags:**
- "BFC is deprecated"
- Only knowing clearfix without understanding why it works

---

## Q4. [RU] Как `overflow: hidden` влияет на layout и доступность?

**Answer (EN):**
It creates a BFC, clips overflowing content, and can accidentally hide focus rings or tooltips that extend outside. For interviews: useful for containing floats; risky for focusable elements clipped without scroll alternative. Prefer `overflow: auto` when users may need hidden content.

**Follow-ups:**
- `overflow: clip` vs `hidden`?
- Scroll chaining and `overscroll-behavior`?

**Red flags:**
- `overflow: hidden` on `body` to fix margin collapse without side effects discussion

---

## Q5. [RU] Чем отличаются `em`, `rem`, `%` для отступов?

**Answer (EN):**
`rem` is relative to root font size — consistent across components. `em` is relative to the element's own `font-size` (or parent for font-size) — compounds in nested components. `%` on margin/padding is relative to **width** of containing block (even for vertical margin). Interview: prefer `rem` for spacing scale; `em` for typography tied to local font size.

**Follow-ups:**
- `ch` and `ex` units — when useful?
- Container query units `cqw`?

**Red flags:**
- Using `em` for global spacing scale without compounding awareness

---

## Q6. [RU] Что делает `box-sizing: inherit` в design system?

**Answer (EN):**
Children inherit parent's box model — useful when a component wrapper sets `border-box` and inner third-party widgets should match. Often projects set on `*, *::before, *::after { box-sizing: border-box }` via reset. Interview: always state what your project default is before solving width puzzles.

**Follow-ups:**
- Universal selector performance concerns?
- Shadow DOM and inherited box-sizing?

**Red flags:**
- Mixing content-box and border-box in same component without documenting

---

## Q7. [RU] Как бы вы объяснили «сломанную» ширину 100% + padding?

**Answer (EN):**
With `content-box`, `width: 100%` sets content width to parent; adding `padding` increases total beyond 100%, causing overflow. Fix: `border-box`, or reduce width with `calc(100% - padding)`, or use flex/grid gap instead of horizontal padding on full-width elements. Walk through the box model layers: content → padding → border → margin.

**Follow-ups:**
- Does `min-width: 0` in flex fix overflow?
- `width: 100%` in grid item?

**Red flags:**
- Only answer "add box-sizing" without explaining the math
