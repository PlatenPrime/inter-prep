# HTML Semantics & Accessibility — Interview Q&A

---

## Q1. [RU] Зачем нужны семантические теги (`header`, `nav`, `main`, `article`), если можно сверстать всё на `motion.div`?

**Answer (EN):**
Semantic elements communicate document structure to browsers, assistive technologies, and search engines without extra ARIA. A `div` with `role="banner"` works but is easier to get wrong; native semantics give correct defaults (e.g. landmark navigation, heading levels). For interviews: prefer native elements first, add ARIA only when no HTML element fits.

**Follow-ups:**
- When would you use `role` anyway?
- How do screen readers use landmarks?

**Red flags:**
- "Semantics are only for SEO"
- Using `<div onClick>` for primary actions

---

## Q2. [RU] В чём разница между `<button>` и `<motion.div role="button">` с точки зрения доступности?

**Answer (EN):**
A native `<button>` is focusable by default, activatable with Enter/Space, exposed as a button in the accessibility tree, and disabled via the `disabled` attribute. A `motion.div` requires manual `tabIndex`, keyboard handlers, `aria-disabled`, and focus styles — easy to miss in code review. Interview answer: default to `<button>`; custom elements only when design truly requires it.

**Follow-ups:**
- How do you style a button to look like a card link?
- What is `aria-pressed` for toggle buttons?

**Red flags:**
- Div-buttons without keyboard support
- Removing focus outline without replacement

---

## Q3. [RU] Как правильно выстроить иерархию заголовков `h1`–`h6`?

**Answer (EN):**
Headings form a document outline: one logical `h1` per page (or per major view in SPAs), then don't skip levels (e.g. `h1` → `h3` without `h2`) unless the skipped level is intentionally empty. Screen reader users navigate by headings; skipped levels confuse outline navigation. In component libraries, don't hardcode `h2` in a reusable card — use a prop or context for the appropriate level.

**Follow-ups:**
- Multiple `h1` on a page — ever valid?
- How does this relate to SEO?

**Red flags:**
- Choosing heading level by font size only

---

## Q4. [RU] Что такое landmark regions и зачем они на интервью?

**Answer (EN):**
Landmarks (`banner`, `navigation`, `main`, `complementary`, `contentinfo`) let assistive tech users jump between page sections. HTML5 maps `header`, `nav`, `main`, `aside`, `footer` to landmarks when used in correct contexts. Duplicate `nav` landmarks need `aria-label` to distinguish (e.g. "Main" vs "Footer").

**Follow-ups:**
- Difference between `main` and `article`?
- Skip links — what are they?

**Red flags:**
- Wrapping entire page in one `<main>` per component

---

## Q5. [RU] Когда нужен ARIA, а когда он вреден?

**Answer (EN):**
First rule of ARIA: don't use ARIA if a native HTML element exists. ARIA fixes gaps (tabs, combobox, live regions) but duplicated or wrong roles harm more than help — "no ARIA is better than bad ARIA." Dynamic content uses `aria-live` for announcements; decorative icons need `aria-hidden="true"`.

**Follow-ups:**
- What is `aria-live="polite"` vs `assertive"`?
- `aria-label` vs `aria-labelledby`?

**Red flags:**
- `aria-label` on every element
- `role="presentation"` on interactive content

---

## Q6. [RU] Как связаны SEO и accessibility — это одно и то же?

**Answer (EN):**
They overlap (semantic HTML, headings, alt text, crawlable content) but goals differ: SEO targets search bots; a11y targets human users with diverse needs. Good semantic HTML helps both. Interview tip: mention that client-rendered empty shells hurt SEO and users until hydrated — related to SSR/RSC discussions later.

**Follow-ups:**
- Alt text for decorative images?
- `lang` attribute importance?

**Red flags:**
- Keyword stuffing in alt attributes
- Ignoring keyboard users because "we have SEO"

---

## Q7. [RU] Что проверяешь в PR для базовой a11y?

**Answer (EN):**
Keyboard navigation and visible focus, correct semantics (buttons/links), form labels tied to inputs, color contrast, images with meaningful `alt`, heading order, and no positive `tabindex`. Automated tools (axe, Lighthouse) catch ~30–40% — manual keyboard test still required.

**Follow-ups:**
- What is focus trap in modals?
- `outline: none` without alternative?

**Red flags:**
- "We'll add a11y later"
- Only testing with mouse
