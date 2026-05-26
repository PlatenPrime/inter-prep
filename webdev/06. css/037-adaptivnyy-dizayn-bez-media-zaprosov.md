# Q037. Как можно реализовать адаптивный дизайн без медиа-запросов?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Адаптивный дизайн без медиазапросов реализуется через: **`clamp()`** для плавного масштабирования, **`flex-wrap`** для автоматического переноса, **`grid` с `auto-fit`/`auto-fill` и `minmax()`** для адаптивных сеток, **`min()`/`max()`** для умных ограничений, и **`container queries`** для компонентной адаптивности. Это «интринсик-дизайн» (intrinsic design) — layout определяется содержимым и доступным пространством.

---

## Развёрнутый ответ

### Суть и определение

**Ключевые инструменты:**

| Инструмент | Применение |
|-----------|-----------|
| `clamp(min, val, max)` | Плавное масштабирование размеров/шрифтов |
| `min(a, b)` / `max(a, b)` | Умные ограничения |
| `flex-wrap: wrap` | Автоперенос |
| `grid: auto-fit/auto-fill + minmax` | Адаптивные сетки |
| `container queries` | Компонентная адаптивность |
| `aspect-ratio` | Сохранение пропорций |
| `ch`, `em`, `rem`, `%`, `vw`/`vh` | Относительные единицы |

### Как это работает

**`clamp(min, preferred, max)`:**
```css
font-size: clamp(1rem, 2.5vw, 2rem);
/* мин: 1rem, масштабируется с vw, макс: 2rem */
padding: clamp(16px, 4vw, 48px);
```

**Grid `auto-fit` + `minmax`:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}
/* Автоматически создаёт нужное кол-во колонок */
/* При узком viewport — 1 колонка; при широком — 3-4 */
```

**Flex `flex-wrap: wrap` + `flex-basis`:**
```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card { flex: 1 1 300px; min-width: 0; }
```

**`min()` для умной ширины:**
```css
.container {
  width: min(100%, 1200px);
  margin-inline: auto;
}
/* = max-width: 1200px без медиазапросов */
```

### Практика и применение

- **Типографика** — `clamp()` для шрифтов без breakpoints: `font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem)`.
- **Адаптивные сетки карточек** — `auto-fit + minmax()` без медиазапросов.
- **Fluid spacing** — `padding: clamp(1rem, 5vw, 4rem)` для отзывчивых секций.
- **Изображения** — `width: 100%; height: auto; aspect-ratio: 16/9`.

### Важные нюансы и краеугольные камни

- `auto-fit` vs `auto-fill`: `auto-fit` коллапсирует пустые треки, `auto-fill` нет → с `auto-fit` items растягиваются при малом числе.
- `clamp()` не заменяет медиазапросы для радикальных изменений layout (горизонтальное → вертикальное).
- `min(100%, 1200px)` эквивалентно `width: 100%; max-width: 1200px` — но в одну строку.
- Fluid type scale: `--size-fluid-1: clamp(0.875rem, 1vw + 0.5rem, 1rem)` — библиотека Open Props.
- Container queries — мощнее медиазапросов для компонентов.

### Примеры

```css
/* Fluid type scale */
:root {
  --fs-sm:  clamp(0.875rem, 0.9vw + 0.5rem, 1rem);
  --fs-md:  clamp(1rem,     1.5vw + 0.5rem, 1.25rem);
  --fs-lg:  clamp(1.25rem,  2vw + 0.5rem,   2rem);
  --fs-xl:  clamp(1.75rem,  3vw + 0.5rem,   3rem);
}

/* Адаптивная сетка карточек */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(12px, 3vw, 24px);
}

/* Умная ширина контейнера */
.container {
  width: min(100% - 2rem, 75ch);
  margin-inline: auto;
}

/* Fluid hero section */
.hero {
  padding-block: clamp(3rem, 10vh, 8rem);
}

/* Авто-перенос с минимальной шириной */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём ограничения подхода без медиазапросов?** — Не подходит для радикальных изменений layout (смена направления, показ/скрытие элементов, перестройка навигации).
- **Что такое «intrinsic design»?** — Концепция Jen Simmons: layout управляется содержимым и доступным пространством, а не фиксированными breakpoints.
- **Как `clamp()` вычисляется?** — `clamp(min, preferred, max)` = `max(min, min(preferred, max))`; preferred обычно vw-зависимое значение.

### Красные флаги (чего не говорить)

- «Медиазапросы не нужны» — они необходимы для радикальных изменений layout и устройство-специфичной логики.
- «`auto-fit` и `auto-fill` одинаковы» — `auto-fit` коллапсирует пустые треки, влияя на поведение при малом числе items.

### Связанные темы

- `034-container-queries-vs-media-queries.md`
- `036-raznica-mobile-first-i-desktop-first.md`
- `027-chto-takoe-i-kak-rabotaet-css-flexbox.md`
