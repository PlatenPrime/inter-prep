# 04 — Hero / баннер

## Проблема

Hero — первый экран лендинга. Обычно: заголовок, подзаголовок, CTA-кнопка и изображение/иллюстрация. На десктопе — две колонки (текст + картинка); на мобилке — одна колонка, часто картинка сверху или снизу.

## Мостик от SPA

В React hero часто делают grid/flex компонентом с пропсами. В статическом HTML — CSS Grid с медиа-запросом: одна колонка на mobile, две на desktop.

## Рецепт: split hero (текст + изображение)

```html
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__content">...</div>
    <div class="hero__media">...</div>
  </div>
</section>
```

```css
.hero__grid {
  display: grid;
  gap: 2rem;
  align-items: center;
  padding-block: 4rem;
}

/* Mobile: одна колонка, картинка сверху */
.hero__media { order: -1; }

@media (min-width: 768px) {
  .hero__grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
  .hero__media { order: 0; }  /* текст слева, картинка справа */
}
```

### Почему `order: -1` на mobile?

На узком экране визуально лучше сначала показать иллюстрацию (привлекает внимание), затем текст. На desktop — классический порядок: текст слева, картинка справа.

## Вертикальный ритм

| Элемент | Отступ |
|---------|--------|
| Eyebrow (метка) | `margin-bottom: 0.75rem` |
| H1 | `margin-bottom: 1rem` |
| Подзаголовок | `margin-bottom: 2rem` |
| CTA | без margin снизу (конец блока) |

Используй **единую шкалу отступов** (0.75, 1, 1.5, 2, 3, 4 rem) — см. модуль 07-pixel-perfect.

## Типовые ошибки

| Ошибка | Симптом | Решение |
|--------|---------|---------|
| Grid без `align-items: center` | Текст и картинка «разъезжаются» по вертикали | `align-items: center` |
| Картинка без aspect-ratio | Hero «прыгает» при загрузке | aspect-ratio на .hero__media |
| Фиксированная высота hero | Обрезает текст на mobile | `min-height` + padding, не `height` |
| CTA слишком маленький на touch | Сложно нажать | min 44×44px touch target |

## Примеры

- [01-hero-split.html](01-hero-split.html) — grid 1fr 1fr, order на mobile

## Следующая тема

[05-footer/theory.md](../05-footer/theory.md) — sticky footer и multi-column footer.
