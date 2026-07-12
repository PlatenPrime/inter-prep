# 05 — Футер

## Проблема

Две типичные задачи футера:

1. **Sticky footer** — футер всегда внизу экрана, даже если контента мало (короткая страница).
2. **Multi-column footer** — колонки ссылок (Product, Company, Legal) + копирайт.

## Мостик от SPA

В SPA с минимальным контентом футер «висит» посередине страницы. Решение — flex column на body или grid на page wrapper.

## Рецепт: sticky footer

```html
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
```

```css
body {
  min-height: 100dvh;           /* dvh — dynamic viewport, лучше vh на mobile */
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;                      /* растягивается, выталкивает footer вниз */
}
```

**Альтернатива (grid):**

```css
body {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

## Рецепт: multi-column footer

```css
.footer__grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
}

.footer__bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #334155;
  font-size: 0.875rem;
  color: #94a3b8;
}
```

`auto-fit minmax(10rem, 1fr)` — колонки автоматически перестраиваются без жёстких брейкпоинтов.

## Типовые ошибки

| Ошибка | Симптом | Решение |
|--------|---------|---------|
| `min-height: 100vh` на iOS | Адресная строка ломает высоту | Использовать `100dvh` |
| Sticky footer без flex:1 на main | Футер не внизу | `main { flex: 1 }` |
| Фиксированное число колонок | На tablet ломается | `auto-fit minmax()` |
| Ссылки без достаточного padding | Плохой touch target | `padding-block` на ссылках |

## Примеры

- [01-sticky-footer.html](01-sticky-footer.html) — футер внизу viewport при малом контенте
- [02-multi-column-footer.html](02-multi-column-footer.html) — колонки ссылок + copyright

## Следующая тема

[06-responsive/theory.md](../06-responsive/theory.md) — mobile-first, clamp, fluid grid.
