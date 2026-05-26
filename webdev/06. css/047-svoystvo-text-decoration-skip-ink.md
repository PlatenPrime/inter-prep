# Q047. Расскажите о свойстве `text-decoration-skip-ink`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`text-decoration-skip-ink`** управляет тем, прерывается ли линия подчёркивания (`underline`) в местах, где она пересекается с символами (нижние части букв g, p, y). Значение `auto` (по умолчанию в современных браузерах) автоматически делает «разрывы» для читаемости. `none` убирает разрывы, `all` делает разрывы для всех символов.

---

## Развёрнутый ответ

### Суть и определение

```css
text-decoration-skip-ink: auto;  /* разрывы там, где глиф пересекает линию */
text-decoration-skip-ink: none;  /* непрерывная линия */
text-decoration-skip-ink: all;   /* разрывы для всех символов */
```

**Визуально:**
```
none: подчёркивание проходит СКВОЗЬ нижние части букв (g, p, q, y)
auto: линия прерывается под "хвостами" букв — типографически правильно
```

### Как это работает

При `auto` браузер вычисляет геометрию каждого глифа и делает «просвет» в месте пересечения с линией `underline`. Алгоритм разработан с учётом типографических стандартов — именно так подчёркивают текст в профессиональной вёрстке.

**Связанные свойства:**

| Свойство | Назначение |
|---------|-----------|
| `text-decoration-line` | Тип: `underline`, `overline`, `line-through` |
| `text-decoration-color` | Цвет линии |
| `text-decoration-style` | Стиль: `solid`, `wavy`, `dashed`, `dotted`, `double` |
| `text-decoration-thickness` | Толщина линии |
| `text-underline-offset` | Смещение линии от базовой |
| `text-decoration-skip-ink` | Разрывы под символами |

### Практика и применение

- **Ссылки**: `auto` (дефолт) — оптимально для обычного текста.
- **Кастомное подчёркивание**: в сочетании с `text-underline-offset` и `text-decoration-thickness` для современного дизайна.
- `none` — когда нужна непрерывная декоративная линия под текстом.
- Вместо `text-decoration` + костылей через `::after` — теперь можно стилизовать линию нативно.

### Важные нюансы и краеугольные камни

- `auto` — дефолтное поведение в Chrome, Firefox, Safari; `none` был дефолтом в старых браузерах.
- `text-underline-offset` — управляет расстоянием от базовой линии до подчёркивания: `text-underline-offset: 3px`.
- `text-decoration-thickness` — толщина линии: `from-font` (из метрик шрифта) или `<length>`.
- `text-decoration-skip` (предшественник) — устаревшее свойство с иным набором значений.

### Примеры

```css
/* Современное стилизованное подчёркивание */
a {
  text-decoration: underline;
  text-decoration-color: var(--color-primary);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  text-decoration-skip-ink: auto; /* разрывы там, где нужно */
}

/* Без разрывов — декоративная линия */
.highlight {
  text-decoration: underline;
  text-decoration-color: oklch(0.85 0.15 80);
  text-decoration-thickness: 8px;
  text-underline-offset: -2px; /* линия под текстом, частично за ним */
  text-decoration-skip-ink: none; /* непрерывная */
}

/* Шортхенд */
.link {
  text-decoration: underline solid var(--color-link) 1px;
  text-underline-offset: 3px;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как задать отступ подчёркивания от текста?** — `text-underline-offset: 4px`.
- **Как изменить толщину линии?** — `text-decoration-thickness: 2px` или `from-font`.
- **Как сделать цветное подчёркивание?** — `text-decoration-color: orange`.
- **Почему `text-decoration-skip-ink: auto` хорошо по умолчанию?** — Следует профессиональным типографическим стандартам: линия не пересекает «хвосты» букв.

### Красные флаги (чего не говорить)

- «`text-decoration-skip-ink` — редко нужно трогать» — важно понимать для кастомного подчёркивания ссылок в дизайн-системах.

### Связанные темы

- `046-svoystvo-text-rendering.md`
- `049-svoystvo-outline.md`
