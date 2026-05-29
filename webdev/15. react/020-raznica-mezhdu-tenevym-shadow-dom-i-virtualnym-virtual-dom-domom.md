# Q020. Разница между теневым (Shadow DOM) и виртуальным (Virtual DOM) домом?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Virtual DOM** — концепция React: JavaScript-объект в памяти, который React использует для вычисления минимального набора изменений реального DOM. **Shadow DOM** — браузерный стандарт (Web Components API) для инкапсуляции разметки, стилей и скриптов внутри компонента, изолируя их от остальной страницы. Это независимые технологии, решающие разные задачи.

---

## Развёрнутый ответ

### Суть и определение

**Virtual DOM:**
- Создан командой React; существует только в JavaScript-рантайме
- Цель: оптимизация обновлений реального DOM через batch + diff
- Является частной реализацией (не браузерный стандарт)
- Живёт в памяти JS, браузер о нём не знает

**Shadow DOM:**
- Часть спецификации W3C (Web Components)
- Цель: инкапсуляция — CSS и DOM внутри компонента не «вытекают» наружу
- Реализован браузером нативно
- Создаётся через `element.attachShadow({ mode: 'open' | 'closed' })`

### Как это работает

**Virtual DOM — diff + patch:**
```
JSX → VDOM tree (JS objects)
      ↓ diff с предыдущим деревом
      ↓ минимальный список изменений
      ↓ apply to Real DOM
```

**Shadow DOM — инкапсуляция:**
```
<custom-button>
  #shadow-root
    ├─ <style>.btn { color: red }</style>  /* стили изолированы */
    └─ <button class="btn">Click</button>  /* DOM изолирован */
```

Глобальный CSS не проникает внутрь Shadow Root (если не использовать CSS Custom Properties).

### Практика и применение

**Virtual DOM используется:**
- В React (reconciler)
- В Vue 2/3 (похожий подход)
- В Preact (1KB альтернатива React)

**Shadow DOM используется:**
- В Web Components: `<video>`, `<input type="range">` — нативные элементы со shadow root
- В Design Systems на основе Web Components (Shoelace, Lit, FAST)
- В Chrome DevTools для изоляции внутреннего UI
- В тестах через Playwright/Cypress (pierce shadow DOM)

**React + Shadow DOM:**
React можно рендерить внутри Shadow Root (нестандартный сценарий — события не всплывают через shadow boundary с synthetic events):
```tsx
// Технически возможно, но требует патчинга
const shadowRoot = element.attachShadow({ mode: 'open' });
const root = ReactDOM.createRoot(shadowRoot);
root.render(<App />);
```

### Важные нюансы и краеугольные камни

- Shadow DOM **реально существует в браузерном DOM** — его можно увидеть в DevTools; Virtual DOM — только в JS-памяти
- React Synthetic Events используют event delegation на корневой контейнер — это конфликтует с Shadow DOM (события не всплывают из shadow boundary)
- Shadow DOM `mode: 'closed'` делает root недоступным снаружи — усложняет тестирование
- **Не путать**: Web Components ≠ React Components; они независимые спецификации

### Примеры

```html
<!-- Shadow DOM (нативный браузер) -->
<script>
  class MyButton extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>button { color: red; }</style>
        <button><slot></slot></button>
      `;
    }
  }
  customElements.define('my-button', MyButton);
</script>

<my-button>Нажми меня</my-button>
<!-- Глобальный CSS не влияет на кнопку внутри shadow root -->
```

```tsx
// Virtual DOM (React) — объекты в памяти JS
const vdom = {
  type: 'button',
  props: { className: 'btn', children: 'Нажми меня' }
};
// Браузер этого не видит, пока React не применит в реальный DOM
```

---

## Сравнение

| Критерий | Virtual DOM | Shadow DOM |
|----------|-------------|------------|
| Природа | JS-объекты в памяти | Реальное DOM-дерево в браузере |
| Стандарт | Нет (частная реализация) | W3C (Web Components) |
| Цель | Оптимизация обновлений DOM | Инкапсуляция стилей и разметки |
| Видимость | Только в JS-рантайме | В DevTools (показывается как #shadow-root) |
| Браузерная поддержка | Не требует (React обеспечивает) | Нативная поддержка |
| Используется в | React, Vue, Preact | Web Components, нативные `<input>`, `<video>` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем нужна инкапсуляция Shadow DOM?** — избежать коллизий CSS, изолировать компоненты для Design System
- **Можно ли использовать React компоненты внутри Web Components?** — да, но требует дополнительной настройки (event delegation, CSS переменные)
- **Что такое CSS Custom Properties и почему они проходят через Shadow DOM?** — `--var: value` пробивает shadow boundary; это механизм кастомизации Web Components

### Красные флаги (чего не говорить)

- «Virtual DOM и Shadow DOM — одно и то же» — принципиально разные технологии
- «React использует Shadow DOM» — нет; React использует свой Virtual DOM

### Связанные темы

- `019-chto-takoe-virtual-dom-kak-on-rabotaet-s-react.md`
- `021-chto-takoe-react-reconciliation.md`
