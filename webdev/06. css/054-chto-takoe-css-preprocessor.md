# Q054. Что такое CSS препроцессор?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**CSS-препроцессор** — инструмент, расширяющий синтаксис CSS переменными, вложенностью, миксинами, функциями и другими конструкциями. Препроцессор компилирует исходный файл (`.scss`, `.less`, `.styl`) в стандартный CSS, который понимают браузеры. Наиболее популярные: **Sass/SCSS**, **Less**, **Stylus**.

---

## Развёрнутый ответ

### Суть и определение

**Проблемы чистого CSS (до CSS Custom Properties и CSS Nesting):**
- Дублирование цветов и значений без переменных.
- Нет вложенности — приходится дублировать селекторы.
- Нет функций, циклов, миксинов.
- Нет импорта без waterfall (@import → последовательные запросы).

**Препроцессор решает:**
- Переменные (`$primary-color: #0070f3`)
- Вложенность (`&:hover { ... }`)
- Миксины (`@mixin flex-center { display: flex; ... }`)
- Функции (`lighten($color, 10%)`)
- Импорт без HTTP waterfall (Sass компилирует всё в один файл)
- Математика (`width: calc($grid-col * 3)`)

### Как это работает

```
SCSS источник → Sass compiler → CSS файл → браузер
```

Компиляция происходит на этапе сборки (webpack, Vite, Gulp). Браузер получает стандартный CSS.

**SCSS vs Sass:**
- **Sass** (indent-based) — синтаксис без `{}` и `;` через отступы.
- **SCSS** — CSS-совместимый синтаксис с `{}` и `;`. Является расширенным набором CSS.

### Практика и применение

```scss
/* SCSS */
$color-primary: #0070f3;
$border-radius: 8px;

@mixin button-base($bg) {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: $bg;
  border-radius: $border-radius;
  transition: background-color 0.2s;

  &:hover {
    background-color: darken($bg, 10%);
  }
}

.btn--primary { @include button-base($color-primary); }
.btn--danger   { @include button-base(#dc2626); }
```

### Важные нюансы и краеугольные камни

- **CSS Custom Properties (`var(--x)`)** — нативная альтернатива переменным, работает в runtime (JS может менять). Sass-переменные — compile-time.
- **CSS Nesting** (нативный, 2024) — делает вложенность доступной без препроцессора.
- **PostCSS** — не препроцессор, а трансформатор CSS через плагины (Autoprefixer, cssnano, CSS Modules).
- Sass `@use` / `@forward` (новый API) заменяет устаревший `@import` — решает проблему повторного импорта и namespace pollution.
- В проектах с Tailwind CSS препроцессоры часто не нужны.
- CSS Modules (в React/Vue) решают проблему глобального scope без препроцессора.

### Примеры

```scss
/* SCSS: использование в дизайн-системе */

// _variables.scss
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
);

// _mixins.scss
@mixin responsive($bp) {
  @media (min-width: map-get($breakpoints, $bp)) {
    @content;
  }
}

// component.scss
.card {
  padding: 16px;

  @include responsive('md') {
    padding: 24px;
    display: flex;
  }

  &__title {
    font-size: 1.25rem;
  }

  &--featured {
    border: 2px solid $color-primary;
  }
}
```

```less
// Less
@primary: #0070f3;

.mixin-button(@bg: @primary) {
  background: @bg;
  padding: 8px 16px;
  &:hover { background: darken(@bg, 10%); }
}

.btn { .mixin-button(); }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Нужен ли препроцессор сегодня?** — Частично нет: CSS Custom Properties, CSS Nesting, CSS Modules решают многое нативно. Но Sass миксины и функции сложнее заменить.
- **Чем Sass-переменные отличаются от CSS Custom Properties?** — Sass: compile-time, нет runtime-изменения через JS. Custom properties: runtime, меняются JS и каскадом, наследуются.
- **Что такое PostCSS и чем отличается от Sass?** — PostCSS — инструмент трансформации через плагины; не добавляет нового синтаксиса, обрабатывает стандартный CSS.

### Красные флаги (чего не говорить)

- «Препроцессоры устарели» — Sass/SCSS всё ещё активно используется (Bootstrap, Angular, многие проекты).
- «CSS Custom Properties полностью заменяют Sass» — нет функций, циклов, миксинов в нативном CSS.

### Связанные темы

- `055-kakie-css-preprocessory-preimushchestva-ispolzovaniya.md`
- `056-problemy-css-in-js-kak-reshit.md`
- `057-chto-takoe-bem-i-kak-eto-pomogaet-v-css.md`
