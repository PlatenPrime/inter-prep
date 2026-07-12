# 02 — Изображения

## Проблема

На лендингах изображения «ломают» вёрстку: сплющиваются, вылезают за контейнер, прыгают при загрузке (layout shift), текст на фоне нечитаем. Нужно заранее задать **область** для картинки и правила её заполнения.

## Мостик от SPA

В React часто пишут `<img src={url} alt="" />` без размеров — браузер не знает, сколько места зарезервировать. В лендинге всегда задают:

1. **Контейнер с фиксированными пропорциями** (`aspect-ratio`)
2. **Правило заполнения** (`object-fit`, `object-position`)
3. Или **фон** (`background-image` + `background-size: cover`)

## Рецепт: `<img>` в карточке / галерее

```css
.image-wrapper {
  aspect-ratio: 16 / 9;      /* резервируем место до загрузки */
  overflow: hidden;
  border-radius: 0.5rem;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;         /* заполняет область, обрезая лишнее */
  object-position: center;   /* какая часть кадра видна */
}
```

### object-fit: когда что

| Значение | Поведение | Когда использовать |
|----------|-----------|-------------------|
| `cover` | Заполняет область, обрезает края | Карточки, hero, аватары |
| `contain` | Вся картинка видна, могут быть поля | Логотипы, иконки продуктов |
| `fill` | Растягивает без сохранения пропорций | Почти никогда |

## Рецепт: фоновое изображение (hero)

Когда картинка — **декоративный фон**, а не контент:

```css
.hero {
  min-height: 60vh;
  background-image: url('...');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Overlay для читаемости текста */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(15, 23, 42, 0.85) 0%,
    rgba(15, 23, 42, 0.4) 100%
  );
}
```

**Правило:** если картинка несёт смысл (продукт, команда) — `<img alt="...">`. Если декор — `background-image`.

## Базовый reset для img

```css
img {
  display: block;    /* убирает gap под inline-картинкой */
  max-width: 100%;   /* не вылезает за родителя */
}
```

## Типовые ошибки

| Ошибка | Симптом | Решение |
|--------|---------|---------|
| `<img>` без `width/height` или `aspect-ratio` | Layout shift при загрузке | Задать `aspect-ratio` на обёртке |
| `object-fit` без `height: 100%` на img | Свойство не работает | Родитель с aspect-ratio, img `width/height: 100%` |
| `background-size: contain` в hero | Полосы по бокам | Использовать `cover` |
| Текст на яркой картинке без overlay | Нечитаемо | `linear-gradient` overlay или полупрозрачный слой |
| `width: 100%` на img без ограничения родителя | Картинка шире экрана | `max-width: 100%` + контейнер |

## Примеры

- [01-object-fit.html](01-object-fit.html) — cover vs contain vs fill, aspect-ratio
- [02-hero-background.html](02-hero-background.html) — фон cover + gradient overlay

## Следующая тема

[03-header/theory.md](../03-header/theory.md) — хедер: sticky, flex-навбар, бургер.
