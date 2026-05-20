# Q048. Разница между адаптивным (adaptive) и отзывчивым (responsive) дизайнами?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Responsive (отзывчивый)** дизайн — **одна** вёрстка **плавно** подстраивается под любую ширину через fluid grids, `%`, `max-width`, media queries (`min-width`). **Adaptive (адаптивный)** — **несколько фиксированных макетов** под конкретные breakpoints (320, 768, 1024): на сервере или в CSS подставляется «другая версия» UI. На практике чаще говорят «responsive», а adaptive — устаревший термин или гибрид (responsive + discrete layout jumps).

---

## Развёрнутый ответ

### Суть и определение

**Responsive:** Mobile-first, `clamp()`, flex/grid, контент «резиновый». Ethan Marcotte, 2010.

**Adaptive:** определение устройства → отдельный template (раньше m.example.com, отдельные HTML). Сегодня часто — **скачки** layout на breakpoints без отдельного домена.

Споры в терминологии: в русскоязычных собеседованиях contrast именно **fluid vs fixed layouts per breakpoint**.

### Как это работает

**Responsive:**

```css
.container { width: min(100% - 2rem, 1200px); margin-inline: auto; }
.cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
```

**Adaptive (классический):**

- Сервер по User-Agent отдаёт mobile/desktop HTML (редко сейчас).
- Или CSS: `@media (max-width: 767px) { .sidebar { display: none; } }` — резкая смена, не fluid typography.

**Гибрид в индустрии:** responsive сетка + adaptive navigation (бургер только < 768px).

### Практика и применение

- **Маркетинг, блог** — almost always responsive.
- **Сложные дашборды** — adaptive скрытие колонок на tablet vs desktop.
- **Performance:** adaptive server-side мог отдавать меньший HTML mobile — аналог — responsive images `srcset`.

Плохой только responsive без теста на реальных устройствах — «ломается» между breakpoints.

### Важные нюансы и краеугольные камни

- Путать **responsive** с «поддержка мобильных» вообще.
- 20 жёстких breakpoints — maintenance hell; лучше fluid + few breakpoints.
- **Container queries** — responsive внутри компонента, не только viewport.
- Desktop-first media queries — антипаттерн для mobile traffic.
- Только `width` — забыть `prefers-reduced-motion`, dark mode.

### Примеры

```css
/* Responsive — fluid type */
h1 { font-size: clamp(1.5rem, 2vw + 1rem, 2.5rem); }

/* Adaptive jump — другой layout */
@media (min-width: 768px) {
  .nav { display: flex; }
  .nav-toggle { display: none; }
}
```

---

## Сравнение

| Критерий | Responsive (отзывчивый) | Adaptive (адаптивный) |
|----------|-------------------------|------------------------|
| Количество макетов | Один гибкий | Несколько фиксированных |
| Поведение при resize | Плавное | Скачки на breakpoints |
| Типичная реализация | %, flex, grid, clamp | Media queries, отдельные шаблоны |
| Серверная роль | Обычно один HTML | Может разный HTML по UA (legacy) |
| Поддержка | Проще одна кодовая база | Больше вариантов UI для теста |
| Современный стандарт | Доминирует | Элементы в гибриде |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Mobile-first vs desktop-first?** — min-width каскад.
- **rem vs px в media queries?** — доступность zoom.
- **Container vs media queries?** — компонентный responsive.
- **Responsive images?** — `srcset`, `sizes`, art direction `<picture>`.
- **Отдельное mobile-приложение vs responsive web?** — product decision.

### Красные флаги (чего не говорить)

- Использовать термины как синонимы без различий.
- «Adaptive = media queries» без уточнения fluid vs fixed layouts.
- Фиксированная ширина 960px «для всех» в 2025.

### Связанные темы

- [047-krossbrauzernost.md](047-krossbrauzernost.md)
- [049-pe-vs-gd.md](049-pe-vs-gd.md)
- [043-progressivnyy-rendering.md](043-progressivnyy-rendering.md)

---
