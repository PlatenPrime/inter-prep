# HTML + CSS — теория для junior (12 вопросов)

> **Формат:** вопрос RU → ответ EN вслух.  
> **Углубление:** [webdev/05. html](../webdev/05.%20html/), [webdev/06. css](../webdev/06.%20css/)

---

## Q1. [RU] Зачем семантический HTML?

**Answer (EN):**  
Semantic tags (`header`, `nav`, `main`, `article`, `section`, `footer`) describe meaning, not just appearance. Benefits: better accessibility (screen readers use landmarks), SEO, and maintainable code. Avoid div soup when a semantic element fits.

**Подробнее:** [webdev/05. html/012-problemy-div-vmesto-semantiki.md](../webdev/05.%20html/012-problemy-div-vmesto-semantiki.md)

**Red flags:** Using `<div>` for everything «because CSS is easier»

---

## Q2. [RU] `<button>` vs `<div onClick>` — почему это важно?

**Answer (EN):**  
A native `<button>` is keyboard-focusable, activatable with Enter/Space, announced correctly by screen readers, and has built-in disabled state. A `<div onClick>` needs tabindex, key handlers, ARIA role, and focus styles — easy to get wrong. Always use the right interactive element.

**Подробнее:** [days/day-01-web-platform-git/questions/html-semantics-a11y.md](../../days/day-01-web-platform-git/questions/html-semantics-a11y.md)

---

## Q3. [RU] Структура базовой HTML-страницы?

**Answer (EN):**  
`<!DOCTYPE html>`, `<html lang="uk">`, `<head>` with charset, viewport meta, title, linked CSS, then `<body>` with landmark structure: header, main (unique content), footer. Scripts often deferred at end of body or with `defer` attribute.

**Подробнее:** [webdev/05. html/](../webdev/05.%20html/)

---

## Q4. [RU] Атрибуты HTML — `id`, `class`, `data-*`?

**Answer (EN):**  
`id` must be unique per page — used for anchors and `getElementById`. `class` groups elements for CSS/JS — reusable. `data-*` stores custom metadata accessible via `dataset`. Use meaningful names; don't rely on IDs for styling when classes suffice.

**Подробнее:** [webdev/05. html/003-chto-takoe-atributy-v-html.md](../webdev/05.%20html/003-chto-takoe-atributy-v-html.md)

---

## Q5. [RU] Формы: `label`, `input`, `name`, `required`?

**Answer (EN):**  
Every input should have an associated `<label for="id">` (or wrap input inside label) for accessibility. `name` identifies the field on submit. `required`, `type`, `pattern`, `min`/`max` provide native validation. Use correct `type` (`email`, `tel`, `number`) for mobile keyboards and validation.

**Подробнее:** [webdev/05. html/](../webdev/05.%20html/)

---

## Q6. [RU] Box model — content, padding, border, margin?

**Answer (EN):**  
The box model layers: content → padding (inside border) → border → margin (outside, transparent). `box-sizing: border-box` includes padding and border in the declared width/height — easier layouts. Vertical margins between block elements can collapse (larger margin wins).

**Подробнее:** [webdev/06. css/017-raznica-mezhdu-margin-i-padding.md](../webdev/06.%20css/017-raznica-mezhdu-margin-i-padding.md), [027-chto-takoe-i-kak-rabotaet-css-flexbox.md](../webdev/06.%20css/027-chto-takoe-i-kak-rabotaet-css-flexbox.md)

**Red flags:** Forgetting `border-box` when elements «overflow» their container width

---

## Q7. [RU] Flexbox — основные свойства?

**Answer (EN):**  
On container: `display: flex`, `flex-direction` (row/column), `justify-content` (main axis alignment), `align-items` (cross axis), `gap` for spacing. On items: `flex-grow`, `flex-shrink`, `flex-basis`. Centering: `display: flex; justify-content: center; align-items: center;` on parent.

**Подробнее:** [webdev/06. css/](../webdev/06.%20css/), [examples/css/02-flexbox/](../../examples/css/02-flexbox/)

---

## Q8. [RU] Specificity и cascade — как браузер выбирает стиль?

**Answer (EN):**  
Cascade order: origin and importance (`!important`), then specificity (inline > IDs > classes/attributes/pseudo-classes > elements), then source order (later wins). Specificity example: `#nav .link` beats `.link`. Prefer low-specificity selectors and reuse classes over deep nesting.

**Подробнее:** [webdev/06. css/004-kak-rabotayut-kaskadnost-i-nasledovanie-v-css.md](../webdev/06.%20css/004-kak-rabotayut-kaskadnost-i-nasledovanie-v-css.md)

---

## Q9. [RU] Способы подключения CSS?

**Answer (EN):**  
External stylesheet (`<link rel="stylesheet">`) — best for caching and separation. Internal `<style>` in head — small pages or critical CSS. Inline `style=""` — avoid except dynamic one-offs; hard to maintain. CSS-in-JS is a JS-framework pattern.

**Подробнее:** [webdev/06. css/003-varianty-dobavleniya-css-stiley-na-stranicu.md](../webdev/06.%20css/003-varianty-dobavleniya-css-stiley-na-stranicu.md)

---

## Q10. [RU] Mobile-first vs desktop-first?

**Answer (EN):**  
Mobile-first writes base styles for small screens, then adds `min-width` media queries for larger breakpoints. Desktop-first starts large and uses `max-width` to scale down. Mobile-first is the modern default — progressive enhancement, smaller initial CSS.

**Подробнее:** [webdev/06. css/036-raznica-mobile-first-i-desktop-first.md](../webdev/06.%20css/036-raznica-mobile-first-i-desktop-first.md)

---

## Q11. [RU] Псевдоклассы и псевдоэлементы — разница?

**Answer (EN):**  
Pseudo-**classes** (`:hover`, `:focus`, `:nth-child`) style an element in a particular state — single colon. Pseudo-**elements** (`::before`, `::after`, `::placeholder`) style a specific part of an element — double colon in modern CSS.

**Подробнее:** [webdev/06. css/011-raznica-mezhdu-psevdoklassami-i-psevdoelementami.md](../webdev/06.%20css/011-raznica-mezhdu-psevdoklassami-i-psevdoelementami.md)

---

## Q12. [RU] Базовая a11y — что проверить на странице?

**Answer (EN):**  
Logical heading hierarchy (`h1` → `h2`, no skips). Visible focus styles. Alt text on meaningful images (empty alt on decorative). Sufficient color contrast. Keyboard navigation works. Form labels linked. Use landmarks (`main`, `nav`). Don't remove outline without replacement.

**Подробнее:** [webdev/12. accessibility/](../webdev/12.%20accessibility/), [days/day-01 questions](../../days/day-01-web-platform-git/questions/html-semantics-a11y.md)

---

## Шпаргалка Flex (нарисуй на бумаге)

```
┌─────────────────────────────────────┐
│  display: flex                      │
│  flex-direction: row | column       │
│  justify-content: main axis ──────► │
│  align-items: cross axis            │
│  gap: 16px                          │
└─────────────────────────────────────┘
```

## Практика

→ [07-practice/html-css-drill.md](../07-practice/html-css-drill.md)
