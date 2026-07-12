# 06 — Адаптив

## Проблема

Лендинг должен корректно выглядеть на телефоне, планшете и десктопе. Нужна стратегия: не писать отдельную вёрстку под каждое устройство, а **расширять** базовые стили через медиа-запросы и fluid-значения.

## Мостик от SPA

В React часто используют `useMediaQuery` или Tailwind breakpoints. В CSS — **mobile-first**: базовые стили для узкого экрана, `@media (min-width: …)` добавляет правила для широких.

## Рецепт: mobile-first breakpoints

```css
/* База — mobile (320px+) */
.nav { display: none; }
.cards { grid-template-columns: 1fr; }

/* Tablet */
@media (min-width: 640px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .nav { display: flex; }
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

### Типичные breakpoints

| Имя | min-width | Когда |
|-----|-----------|-------|
| sm | 640px | Большие телефоны / маленькие планшеты |
| md | 768px | Планшеты |
| lg | 1024px | Ноутбуки |
| xl | 1280px | Широкие мониторы |

Не обязательно использовать все — выбирай по макету.

## Рецепт: hide/show по breakpoint

```css
.desktop-only { display: none; }
.mobile-only { display: block; }

@media (min-width: 768px) {
  .desktop-only { display: block; }
  .mobile-only { display: none; }
}
```

> Лучше менять layout (grid columns, flex-direction), а не прятать дублирующий контент — так лучше для SEO и a11y.

## Рецепт: fluid typography и spacing (clamp)

```css
:root {
  --text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --space-section: clamp(2rem, 5vw, 4rem);
}

h1 {
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
}

.section {
  padding-block: var(--space-section);
}
```

**Формула clamp:** `clamp(min, preferred, max)` — значение плавно растёт между min и max.

## Рецепт: fluid grid без кучи breakpoints

```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}
```

Карточки сами перестраиваются: 1 колонка на узком, 2–3 на широком — без `@media`.

## Типовые ошибки

| Ошибка | Симптом | Решение |
|--------|---------|---------|
| Desktop-first (`max-width`) | Сложнее поддерживать | Mobile-first (`min-width`) |
| Фиксированные px для всего | Резкие скачки на границах | `clamp()` для type/spacing |
| 10+ breakpoints | Хрупкая вёрстка | auto-fit grid + 2–3 breakpoints |
| `100vh` на mobile Safari | Контент под UI браузера | `100dvh` |

## Примеры

- [01-mobile-first.html](01-mobile-first.html) — breakpoints, hide/show, flex-direction
- [02-fluid-clamp-grid.html](02-fluid-clamp-grid.html) — clamp() + auto-fit grid

## Следующая тема

[07-pixel-perfect/theory.md](../07-pixel-perfect/theory.md) — пиксель-перфект и design tokens.
