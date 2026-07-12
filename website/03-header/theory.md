# 03 — Хедер

## Проблема

Хедер лендинга — логотип, навигация, CTA-кнопка. На десктопе всё в одну строку; на мобилке — бургер-меню. При скролле хедер часто должен «прилипать» к верху (sticky).

## Мостик от SPA

В React-админках хедер часто фиксированный компонент с flex-раскладкой. В лендинге — тот же flex, но без JS для базового sticky; бургер можно сделать на чистом CSS (checkbox hack) для статики.

## Рецепт: flex-навбар

```html
<header class="site-header">
  <div class="container site-header__inner">
    <a class="logo" href="#">Brand</a>
    <nav class="nav">...</nav>
    <a class="cta" href="#">Sign up</a>
  </div>
</header>
```

```css
.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

**Ключ:** `justify-content: space-between` — logo слева, nav по центру/справа, CTA справа.

## Рецепт: sticky header

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}
```

| Свойство | Зачем |
|----------|-------|
| `position: sticky` | Прилипает при скролле, но не вырывается из потока (в отличие от `fixed`) |
| `top: 0` | Точка прилипания — верх viewport |
| `z-index` | Хедер поверх контента |
| `background` | Без фона контент «просвечивает» под хедером |

## Рецепт: responsive burger (CSS-only)

На `max-width: 768px` скрываем `.nav`, показываем кнопку-бургер. Checkbox hack:

```html
<input type="checkbox" id="nav-toggle" class="nav-toggle" hidden />
<label for="nav-toggle" class="burger">☰</label>
<nav class="nav">...</nav>
```

```css
@media (max-width: 767px) {
  .burger { display: block; }
  .nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
  }
  .nav-toggle:checked ~ .nav { display: flex; }
}
```

> В продакшене для a11y лучше JS + `aria-expanded`. Для обучения CSS-паттерна — checkbox hack достаточен.

## Типовые ошибки

| Ошибка | Симптом | Решение |
|--------|---------|---------|
| Sticky без `background` | Контент виден под хедером | `background: #fff` |
| Nav items не выровнены | «Прыгают» по baseline | `align-items: center` на flex |
| `position: fixed` без padding на body | Контент под хедером | Sticky или `padding-top` на main |
| Бургер без `z-index` | Меню под контентом | z-index на выпадающем nav |

## Примеры

- [01-sticky-header.html](01-sticky-header.html) — flex-навбар + sticky при скролле
- [02-responsive-burger.html](02-responsive-burger.html) — бургер-меню на CSS

## Следующая тема

[04-hero-banner/theory.md](../04-hero-banner/theory.md) — hero-секция: текст + изображение.
