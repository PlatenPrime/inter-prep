# Website — практика вёрстки лендингов

Модуль для разработчиков с опытом **React + SPA**, которые знают CSS-свойства по отдельности, но не понимают, как их **комбинировать** для статических страниц: контейнер, изображения, хедер, баннер, футер, адаптив, пиксель-перфект.

## Как запускать

Каждый пример — **один самодостаточный `.html` файл**. Не нужен сервер, npm или сборка.

1. Открой папку темы (например, `01-container/`).
2. Дважды кликни по `.html` — откроется в браузере.
3. Меняй размер окна, смотри DevTools (F12 → Elements → responsive mode).

## Как учиться

1. Прочитай `theory.md` темы — там «зачем» и «когда».
2. Открой примеры темы и сравни с теорией.
3. Попробуй изменить CSS-переменные в `<style>` — посмотри, что ломается.

## Roadmap (7 тем)

| # | Тема | Теория | Примеры |
|---|------|--------|---------|
| 01 | Ограничивающий контейнер | [01-container/theory.md](01-container/theory.md) | [basic](01-container/01-basic-container.html), [full-bleed](01-container/02-full-bleed.html) |
| 02 | Изображения | [02-images/theory.md](02-images/theory.md) | [object-fit](02-images/01-object-fit.html), [hero-bg](02-images/02-hero-background.html) |
| 03 | Хедер | [03-header/theory.md](03-header/theory.md) | [sticky](03-header/01-sticky-header.html), [burger](03-header/02-responsive-burger.html) |
| 04 | Hero / баннер | [04-hero-banner/theory.md](04-hero-banner/theory.md) | [split](04-hero-banner/01-hero-split.html) |
| 05 | Футер | [05-footer/theory.md](05-footer/theory.md) | [sticky](05-footer/01-sticky-footer.html), [columns](05-footer/02-multi-column-footer.html) |
| 06 | Адаптив | [06-responsive/theory.md](06-responsive/theory.md) | [mobile-first](06-responsive/01-mobile-first.html), [clamp+grid](06-responsive/02-fluid-clamp-grid.html) |
| 07 | Пиксель-перфект | [07-pixel-perfect/theory.md](07-pixel-perfect/theory.md) | [spacing](07-pixel-perfect/01-spacing-scale.html) |

**Оценка времени:** ~6–8 часов (теория + эксперименты с примерами).

## Мостик от React / SPA

| Привычка в SPA | В лендинге |
|----------------|------------|
| Компонент `<Container maxWidth="lg">` | CSS-класс `.container` с `max-width` + `margin-inline: auto` |
| `<img src={url} />` без размеров | `aspect-ratio` + `object-fit: cover` — иначе layout shift |
| Layout через flex/grid в JSX | Те же flex/grid, но в CSS; структура — семантический HTML |
| Tailwind `max-w-7xl mx-auto px-4` | Тот же паттерн, только в CSS-переменных |
| Адаптив через JS (`useMediaQuery`) | Mobile-first `@media (min-width: …)` |

## Глоссарий

| Термин | Значение |
|--------|----------|
| **Container** | Блок, ограничивающий ширину контента и центрирующий его на широких экранах |
| **Gutter** | Горизонтальный отступ (`padding-inline`) от края экрана до контента |
| **Full-bleed** | Секция на всю ширину viewport, при этом текст внутри — в контейнере |
| **Sticky header** | Хедер, который «прилипает» к верху при скролле (`position: sticky`) |
| **Hero** | Первый экран лендинга: заголовок, подзаголовок, CTA, часто изображение |
| **Sticky footer** | Футер всегда внизу viewport, даже если контента мало |
| **Mobile-first** | Базовые стили для мобилки, расширение через `min-width` медиа-запросы |
| **Fluid typography** | Размер шрифта плавно растёт через `clamp(min, preferred, max)` |
| **Object-fit** | Как `<img>` заполняет заданную область: `cover`, `contain`, `fill` |
| **Aspect-ratio** | Фиксирует пропорции блока до загрузки изображения — без скачков layout |
| **Design tokens** | CSS-переменные для цветов, отступов, радиусов — единая шкала |

## Связь с inter-prep

- Атомарные CSS-примеры: [examples/css/](../examples/css/) — справочник 100 задач.
- Собеседование по layout: [days/day-02-css-layout-interview/](../days/day-02-css-layout-interview/).
- Этот модуль — **сборочная практика**: как из свойств собрать типовую страницу лендинга.
