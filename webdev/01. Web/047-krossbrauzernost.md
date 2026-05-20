# Q047. Что такое кроссбраузерность?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Кроссбраузерность (cross-browser compatibility)** — способность сайта **корректно работать** в целевом наборе браузеров и версий (Chrome, Firefox, Safari, Edge, мобильные WebView). Достигается через стандарты, **progressive enhancement**, полифилы, **Autoprefixer**, тестирование на реальных устройствах и явный **browserslist** в проекте. Цель — одинаковый **функционал** и приемлемый **визуал**, а не пиксель-перфект во всех движках.

---

## Развёрнутый ответ

### Суть и определение

Различия: движки (Blink, Gecko, WebKit), политики (cookies, storage), поддержка API (`gap` в старых Safari, `:has()`), баги рендеринга. **Baseline** (web.dev) — ориентир «безопасных» API.

Не «поддержка IE6 в 2025», а контракт с бизнесом: «последние 2 версии major browsers».

### Как это работает

1. **Статистика аудитории** — Analytics → browserslist в `package.json`.
2. **PostCSS Autoprefixer**, `@supports` для fallback CSS.
3. **Polyfill** (core-js, intersection-observer) — только если нужно, differential serving.
4. **Feature detection** — `if ('serviceWorker' in navigator)` вместо user-agent sniffing.
5. **QA:** BrowserStack, Sauce Labs, реальные iPhone/Android.

**@supports** и **graceful degradation** — см. [049-pe-vs-gd.md](049-pe-vs-gd.md).

### Практика и применение

- **Формы, платежи** — тест Safari iOS обязателен (autofill, date input).
- **CSS grid/flex** — fallback layout для старых корпоративных браузеров если в scope.
- **Почему важно:** 5% Safari users × revenue = заметные потери при «работает только в Chrome».

Без стратегии — «у меня работает» на одной версии Chrome и баги в проде.

### Важные нюансы и краеугольные камни

- **User-Agent sniffing** — хрупко; feature detection предпочтительнее (кроме узких workaround).
- Полифилы **увеличивают бандл** — import только для старых через `nomodule` или conditional.
- `-webkit-` префиксы для sticky, backdrop-filter — проверять caniuse.
- **WebView в приложениях** — не равен Chrome desktop.
- `100vh` на мобильном Safari — известные баги (`dvh`).

### Примеры

```css
.card {
  display: block;
}

@supports (display: grid) {
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
```

```json
// package.json
"browserslist": [
  ">0.5%",
  "last 2 versions",
  "not dead",
  "not op_mini all"
]
```

```javascript
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(onResize).observe(el);
} else {
  window.addEventListener('resize', onResize);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Polyfill vs transpile?** — Babel для синтаксиса, core-js для API.
- **Safari и даты input?** — кастомный picker fallback.
- **Что такое Baseline / Interop?** — согласованная поддержка между браузерами.
- **Как тестировать без фермы устройств?** — cloud + минимальный матрица.
- **`-moz-`, `-webkit-` ещё нужны?** — Autoprefixer по browserslist.

### Красные флаги (чего не говорить)

- «Все используют Chrome, остальное не важно».
- Определять возможности по `navigator.userAgent` без крайней нужды.
- «Polyfill всего core-js на 10 МБ» без анализа аудитории.

### Связанные темы

- [049-pe-vs-gd.md](049-pe-vs-gd.md)
- [048-adaptive-vs-responsive.md](048-adaptive-vs-responsive.md)
- [045-veb-komponenty.md](045-veb-komponenty.md)

---
