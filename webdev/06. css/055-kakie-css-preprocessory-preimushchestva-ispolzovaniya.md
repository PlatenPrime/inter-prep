# Q055. Какие CSS-препроцессоры вы знаете? Преимущества их использования?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Основные препроцессоры: **Sass/SCSS** (наиболее популярный), **Less** (Bootstrap 3), **Stylus**. Преимущества: переменные, вложенность, миксины, функции, импорт без waterfall, условия и циклы. Sass — де-факто стандарт; Less — проще, Less server-side; Stylus — максимально гибкий синтаксис.

---

## Развёрнутый ответ

### Суть и определение

**Sass/SCSS:**
- Два синтаксиса: SCSS (CSS-совместимый) и Sass (indent-based).
- Самый богатый функционал: `@use`, `@forward`, `@mixin`, `@include`, `@each`, `@for`, `@if`, maps, functions, modules.
- Используется в Angular, Bootstrap 5, многих дизайн-системах.
- Компилятор: `dart-sass` (официальный, Node.js + нативный бинарник).

**Less:**
- JavaScript-based (изначально работал в браузере, сейчас — только Node.js).
- Синтаксис ближе к CSS; переменные через `@`.
- Использовался в Bootstrap 3; сейчас менее популярен.
- Миксины — любой класс можно использовать как mixin.

**Stylus:**
- Максимально гибкий синтаксис: без `{}`, `:`, `;` (опционально).
- Богатые встроенные функции.
- Популярен в экосистеме Node/Vue (исторически).

### Преимущества препроцессоров

| Функция | Пример | Нативный CSS |
|--------|--------|-------------|
| Переменные | `$color: blue` | CSS Custom Properties (runtime) |
| Вложенность | `&:hover { }` | CSS Nesting (2024) |
| Миксины | `@mixin flex-center()` | Нет |
| Функции | `darken($c, 10%)` | `color-mix()` (partial) |
| Циклы | `@each $size in (...)` | Нет |
| Условия | `@if $dark { }` | Нет |
| Импорт (без waterfall) | `@use 'tokens'` | `@import` создаёт HTTP req |
| Maps | `$sizes: ('sm': 16px, ...)` | Нет |

### Практика и применение

```scss
// Sass: дизайн-токены через maps
$sizes: (
  'xs': 4px,
  'sm': 8px,
  'md': 16px,
  'lg': 24px,
  'xl': 48px,
);

@each $name, $value in $sizes {
  .mt-#{$name} { margin-top: $value; }
  .mb-#{$name} { margin-bottom: $value; }
}
/* Генерирует .mt-xs, .mt-sm, .mt-md, ... */
```

```less
// Less: миксин как функция
.border-radius(@r: 4px) {
  -webkit-border-radius: @r;
  border-radius: @r;
}
.card { .border-radius(8px); }
```

### Важные нюансы и краеугольные камни

- `node-sass` (LibSass) — устарел, используйте `sass` (dart-sass).
- Sass `@import` устарел → используйте `@use` и `@forward` для правильной модульности.
- CSS Modules — альтернатива для React/Vue без препроцессора (scope изоляция).
- Tailwind CSS 4 внутри использует собственный движок, не требует Sass.
- В монорепо дизайн-системах Sass-пакеты с токенами — распространённая практика.

### Примеры

```scss
// SCSS: полный пример компонента
@use 'sass:color';
@use '../tokens' as *;

$btn-radius: 6px;

@mixin button-variant($bg, $fg: white) {
  background-color: $bg;
  color: $fg;
  border: none;
  border-radius: $btn-radius;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: color.adjust($bg, $lightness: -8%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn {
  &--primary { @include button-variant($color-primary); }
  &--danger  { @include button-variant($color-danger); }
  &--ghost {
    @include button-variant(transparent, $color-primary);
    border: 2px solid currentColor;
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `@use` лучше `@import` в Sass?** — `@import` устарел: нет namespace, двойной импорт — двойной CSS. `@use` создаёт namespace, подключает один раз.
- **Какой препроцессор выбрать для нового проекта?** — Sass/SCSS: большая экосистема, dart-sass активно поддерживается.
- **Нужен ли препроцессор с Tailwind?** — Обычно нет; Tailwind закрывает большинство потребностей без Sass.

### Красные флаги (чего не говорить)

- «Less и Sass одинаковы» — разный синтаксис, экосистема, функционал.
- «`node-sass` — рекомендуемый компилятор» — устарел, используйте `sass` (dart-sass).

### Связанные темы

- `054-chto-takoe-css-preprocessor.md`
- `059-principy-masshtabiruemosti-i-podderzhivaemosti-css.md`
