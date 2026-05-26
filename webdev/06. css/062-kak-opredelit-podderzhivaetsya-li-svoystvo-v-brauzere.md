# Q062. Как с помощью CSS определить, поддерживается ли свойство в браузере?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`@supports`** — CSS at-rule для feature detection: применяет стили только если браузер поддерживает указанное свойство/значение. Это нативная CSS-альтернатива JavaScript-based feature detection (Modernizr). Позволяет прогрессивно улучшать стили без ломки для старых браузеров.

---

## Развёрнутый ответ

### Суть и определение

```css
@supports (property: value) {
  /* Применяется только если поддерживается */
}

@supports not (property: value) {
  /* Fallback для неподдерживающих браузеров */
}

@supports (A) and (B) {
  /* Оба должны поддерживаться */
}

@supports (A) or (B) {
  /* Хотя бы одно */
}
```

**Синтаксис:**

```css
/* Проверка свойства */
@supports (display: grid) { ... }

/* Проверка с вендорным префиксом */
@supports (-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px)) {
  .glass { backdrop-filter: blur(10px); }
}

/* CSS Custom Properties */
@supports (--css: variables) { ... }

/* Selector */
@supports selector(:has(a)) { ... }

/* Font technology */
@supports font-technology(color-COLRv1) { ... }
```

### Как это работает

Браузер парсит `@supports` условие и вычисляет результат. Если результат `true` — применяет вложенные стили; если `false` — игнорирует блок.

**Алгоритм проверки:**
1. Браузер проверяет, знает ли он указанное свойство.
2. Проверяет, валидно ли значение для этого свойства.
3. Если оба условия — `true`.

**JS-аналог:**
```javascript
if (CSS.supports('display', 'grid')) { ... }
if (CSS.supports('(display: grid) and (display: subgrid)')) { ... }
```

### Практика и применение

- **Прогрессивное улучшение**: базовые стили для всех + улучшения через `@supports`.
- **Container queries**: `@supports (container-type: inline-size)` — проверка поддержки.
- **Wide gamut colors**: `@supports (color: color(display-p3 0 0 0))`.
- **CSS Grid subgrid**: `@supports (grid-template-rows: subgrid)`.
- **`:has()` fallback**: `@supports selector(:has(a))`.

### Важные нюансы и краеугольные камни

- Сам `@supports` поддерживается IE 11+ (с ограничениями), Chrome 28+, Firefox 22+.
- **Проверка `@supports`** не гарантирует правильную реализацию — только наличие в парсере.
- `@supports not (...)` — fallback; полезнее чем проверка наличия в некоторых случаях.
- `caniuse.com` + `@supports` — комплементарные инструменты: caniuse для статистики, @supports для runtime.
- `@supports selector(...)` — проверяет поддержку синтаксиса селектора (Chrome 83+).
- `@layer` объявления внутри `@supports` — возможны.

### Примеры

```css
/* 1. CSS Grid с fallback на flexbox */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

/* 2. Backdrop filter с fallback */
.modal-backdrop {
  background: rgb(0 0 0 / 0.8); /* Fallback */
}

@supports (-webkit-backdrop-filter: blur(8px)) or (backdrop-filter: blur(8px)) {
  .modal-backdrop {
    background: rgb(0 0 0 / 0.4);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
}

/* 3. Wide gamut colors */
.brand-color {
  color: oklch(0.55 0.2 260); /* sRGB fallback */
}

@supports (color: color(display-p3 0 0 0)) {
  .brand-color {
    color: color(display-p3 0 0.4 1); /* более насыщенный */
  }
}

/* 4. :has() fallback */
.form-field { border: 1px solid #ccc; }

@supports selector(:has(input:invalid)) {
  .form-field:has(input:invalid) {
    border-color: red;
  }
}

/* 5. JS API */
const hasGrid = CSS.supports('display', 'grid');
const hasSubgrid = CSS.supports('(grid-template-rows: subgrid)');
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `@supports` отличается от медиазапросов?** — Медиазапросы реагируют на характеристики устройства/viewport; `@supports` — на поддержку CSS-функций.
- **Как использовать `@supports` через JavaScript?** — `CSS.supports('property', 'value')` или `CSS.supports('(property: value)')`.
- **Заменяет ли `@supports` Modernizr?** — Для CSS-свойств — да; для HTML5 API (localStorage, WebGL) — нет.

### Красные флаги (чего не говорить)

- «`@supports (display: flex)` подходит для IE 11» — IE 11 не понимает `@supports` полностью; нужна проверка.
- «`@supports` гарантирует правильную работу свойства» — только что браузер знает синтаксис.

### Связанные темы

- `063-kak-podderzhivat-stranicy-v-brauzerakh-s-ogranichennymi-funkciyami.md`
- `052-chto-takoe-vendornye-prefiksy.md`
