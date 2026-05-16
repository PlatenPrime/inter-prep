# WCAG Contrast & A11y — Interview Q&A

---

## Q1. [RU] Как рассчитывается contrast ratio по WCAG?

**Answer (EN):**
Compute relative luminance for each color (sRGB gamma-corrected formula), then ratio = (Llighter + 0.05) / (Ldarker + 0.05). Range 1:1 to 21:1. Tools and tasks use the same math — interviewers may ask you to reason about "#888 on white" qualitatively or calculate.

**Follow-ups:**
- Alpha/transparency over backgrounds?
- Does bold text affect luminance?

**Red flags:**
- Guessing contrast by eye only
- Confusing contrast ratio with opacity

---

## Q2. [RU] Какие пороги WCAG AA и AAA для текста?

**Answer (EN):**
Normal text: AA ≥ 4.5:1, AAA ≥ 7:1. Large text (≥18pt / 14pt bold): AA ≥ 3:1, AAA ≥ 4.5:1. Non-text UI components and graphical objects: 3:1 against adjacent colors (AA). Interview: state text size category before quoting numbers.

**Follow-ups:**
- Placeholder text requirements?
- Disabled controls — exempt?

**Red flags:**
- "AAA is always required"
- Using 4.5:1 for icons without checking 3:1 UI rule

---

## Q3. [RU] Что считается «крупным текстом» (large text)?

**Answer (EN):**
At least 18pt (24px) regular, or 14pt (18.67px) bold (700+). WCAG uses pt; CSS px conversion matters in audits. Headings often qualify; body 16px does not unless bold enough.

**Follow-ups:**
- Responsive font sizes crossing threshold?
- All caps and letter-spacing impact?

**Red flags:**
- Treating 16px body as large text for AAA thresholds

---

## Q4. [RU] Достаточно ли хорошего контраста для полной доступности?

**Answer (EN):**
No — contrast is one criterion. Also need keyboard access, focus visibility, semantic HTML, labels, motion preferences, screen reader announcements. Interview: mention contrast then list 2–3 other WCAG pillars (perceivable, operable, understandable, robust).

**Follow-ups:**
- `:focus-visible` vs `:focus`?
- `aria-label` when to use?

**Red flags:**
- "We passed contrast checker, we're WCAG compliant"

---

## Q5. [RU] Как тестировать focus states для клавиатуры?

**Answer (EN):**
Tab through UI without mouse; every interactive element must show visible focus and activate with Enter/Space (buttons/links). Don't remove `outline` without custom `:focus-visible` styles meeting contrast. Test skip links and modal focus trap.

**Follow-ups:**
- Roving tabindex in composite widgets?
- Focus restoration after closing modal?

**Red flags:**
- `outline: none` globally in reset
- Div-buttons without tabindex

---

## Q6. [RU] Что такое `prefers-reduced-motion` и зачем?

**Answer (EN):**
OS-level user preference for less animation. Respect with `@media (prefers-reduced-motion: reduce)` — disable parallax, large transitions, auto-playing motion. Essential for vestibular disorders. Provide meaningful static alternative, not just slower infinite animations.

**Follow-ups:**
- `prefers-color-scheme`?
- `scroll-behavior: smooth` override?

**Red flags:**
- Auto-play carousel without pause and reduced-motion path

---

## Q7. [RU] Как цветовая слепота влияет на выбор палитры?

**Answer (EN):**
Don't rely on color alone for state (error/success) — add icons, text, patterns. Red/green confusion is common; ensure hue differences plus luminance contrast. Test with simulators and ask whether information is understandable in grayscale.

**Follow-ups:**
- Chart accessibility patterns?
- Dark mode contrast differences?

**Red flags:**
- Red border only for invalid fields without message/icon
