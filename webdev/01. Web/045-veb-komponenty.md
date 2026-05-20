# Q045. Что такое Веб-компоненты и какие технологии в них используются?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Веб-компоненты (Web Components)** — набор **нативных** браузерных API для создания переиспользуемых **кастомных HTML-элементов** с инкапсулированным DOM и стилями. Состоят из **Custom Elements** (имя тега, lifecycle), **Shadow DOM** (изолированное дерево), **HTML Templates** (`<template>`, `<slot>`) и ранее **HTML Imports** (устарели). Работают в React/Vue как «чёрный ящик» или без фреймворка; Lit — популярная обёртка.

---

## Развёрнутый ответ

### Суть и определение

Цель — **стандарты** вместо только framework-specific компонентов: один `<my-button>` в любом стеке. Не конкурирует с React напрямую — часто **сосуществуют** (обёртки, design system tokens).

Спецификации WHATWG/W3C; поддержка во всех evergreen браузерах.

### Как это работает

**Custom Elements:** `class MyCard extends HTMLElement { connectedCallback() { ... } }` + `customElements.define('my-card', MyCard)`.

**Shadow DOM:** `this.attachShadow({ mode: 'open' })` — стили не протекают наружу (и наоборот, с оговорками `:host`).

**Templates:** клонирование `template.content` в shadow root; **slots** для projection контента.

Lifecycle: `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `observedAttributes`.

### Практика и применение

- **Design systems** (Material Web, Shoelace) — единые виджеты в микрофронтах.
- **Виджеты на чужих сайтах** — embed без конфликта CSS.
- **Постепенная миграция** legacy jQuery → web component island.

Без Shadow DOM глобальные стили ломают виджет на host-странице.

### Важные нюансы и краеугольные камни

- **React 19+** лучше поддерживает custom elements; раньше — странности с props vs attributes.
- **SSR:** custom elements на сервере ограничены — нужен declarative shadow DOM или client-only.
- **Form participation** — `ElementInternals` для native form behavior.
- **Accessibility:** shadow закрывает дерево для некоторых инструментов — явные ARIA на host.
- CE в имени **обязательно** содержит дефис: `my-element`, не `myelement`.

### Примеры

```javascript
class UserBadge extends HTMLElement {
  static observedAttributes = ['name'];

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>:host { display: inline-flex; font: 14px system-ui; }</style>
      <slot name="avatar"></slot>
      <span class="label"></span>
    `;
    this._label = root.querySelector('.label');
  }

  connectedCallback() {
    this._label.textContent = this.getAttribute('name') ?? '';
  }

  attributeChangedCallback(_, __, value) {
    if (this._label) this._label.textContent = value ?? '';
  }
}

customElements.define('user-badge', UserBadge);
```

```html
<user-badge name="Anna">
  <img slot="avatar" src="/a.jpg" alt="">
</user-badge>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Web Components vs React components?** — стандарт, shadow, framework-agnostic.
- **Как стилизовать :host и CSS variables?** — design tokens через custom properties.
- **closed vs open shadow?** — тестирование и инспекция.
- **Lit, Stencil, Hybrids?** — DX поверх standards.
- **Почему HTML Imports умерли?** — ES modules заменили.

### Красные флаги (чего не говорить)

- «Web Components заменяют React везде».
- Custom element без дефиса в имени.
- Игнорировать a11y из-за «инкапсуляции».

### Связанные темы

- [044-pwa.md](044-pwa.md)
- [038-csr.md](038-csr.md)
- [047-krossbrauzernost.md](047-krossbrauzernost.md)

---
