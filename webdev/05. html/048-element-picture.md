# Q053. Для чего используется элемент `<picture>`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<picture>` — контейнерный элемент HTML5, позволяющий задавать разные источники изображений для разных условий: размера экрана, плотности пикселей и поддержки формата. Главная сила `<picture>` — art direction: возможность показывать принципиально разные кадры одной картинки для мобильных и десктопных экранов, в отличие от `srcset`, который лишь выбирает лучшую версию одного изображения.

---

## Развёрнутый ответ

### Суть и определение

`<picture>` содержит один или несколько элементов `<source>` и обязательный fallback-элемент `<img>`. Браузер перебирает `<source>` сверху вниз и использует первый подходящий. Если ни один не подошёл или браузер не поддерживает `<picture>` — используется `<img>`.

**Два основных сценария использования:**

1. **Art direction** — разные изображения для разных условий (другой кроп, другая композиция)
2. **Format negotiation** — один и тот же контент в разных форматах (AVIF → WebP → JPEG)

### Как это работает

```html
<picture>
  <source media="..." srcset="..." sizes="..." type="..." />
  <!-- ... другие source ... -->
  <img src="fallback.jpg" alt="описание" />
</picture>
```

**Атрибуты `<source>`:**

| Атрибут  | Описание |
|----------|----------|
| `media`  | Media query (как в CSS `@media`); браузер выбирает source если query матчится |
| `type`   | MIME-тип изображения; браузер пропустит source если формат не поддерживается |
| `srcset` | Список URL с дескрипторами ширины (`w`) или плотности (`x`) |
| `sizes`  | Подсказка о размере отображения для `w`-дескрипторов |

### Практика и применение

**1. Art direction — разный кроп под экран:**

```html
<picture>
  <!-- Портретный кроп для мобильных -->
  <source
    media="(max-width: 767px)"
    srcset="hero-mobile.webp 800w, hero-mobile@2x.webp 1600w"
    sizes="100vw"
  />
  <!-- Широкий кроп для десктопа -->
  <source
    media="(min-width: 768px)"
    srcset="hero-desktop.webp 1440w, hero-desktop@2x.webp 2880w"
    sizes="100vw"
  />
  <img src="hero-desktop.jpg" alt="Команда на конференции" />
</picture>
```

**2. Format negotiation — современные форматы с fallback:**

```html
<picture>
  <source type="image/avif" srcset="photo.avif" />
  <source type="image/webp" srcset="photo.webp" />
  <img src="photo.jpg" alt="Фото продукта" width="800" height="600" />
</picture>
```

**3. Комбинированный сценарий:**

```html
<picture>
  <source
    type="image/avif"
    media="(min-width: 768px)"
    srcset="hero-lg.avif 1x, hero-lg@2x.avif 2x"
  />
  <source
    type="image/webp"
    media="(min-width: 768px)"
    srcset="hero-lg.webp 1x, hero-lg@2x.webp 2x"
  />
  <source type="image/avif" srcset="hero-sm.avif 1x, hero-sm@2x.avif 2x" />
  <source type="image/webp" srcset="hero-sm.webp 1x, hero-sm@2x.webp 2x" />
  <img src="hero-sm.jpg" alt="Главный баннер" />
</picture>
```

### Важные нюансы и краеугольные камни

- `<img>` **обязателен** внутри `<picture>` — он является fallback и носителем `alt`, `width`, `height`, `loading`, `fetchpriority`
- Порядок `<source>` имеет значение: браузер берёт **первый подходящий**; ставить более специфичные условия выше
- **`type` проверяется до загрузки**: браузер проверяет поддержку формата без скачивания файла
- `<picture>` **не влияет на layout** — размеры определяются вложенным `<img>`
- При art direction нужно также обновлять `alt` на `<img>` если семантика изображений различается
- Для чисто responsive images (один кадр, разные размеры) достаточно `srcset` + `sizes` на `<img>` — `<picture>` избыточен

### Примеры

```html
<!-- Полный пример: карточка с art direction и modern formats -->
<article class="product-card">
  <picture>
    <source
      type="image/avif"
      media="(min-width: 640px)"
      srcset="
        /images/product-wide.avif    640w,
        /images/product-wide@2x.avif 1280w
      "
      sizes="(min-width: 640px) 50vw"
    />
    <source
      type="image/avif"
      srcset="
        /images/product-square.avif    400w,
        /images/product-square@2x.avif  800w
      "
      sizes="100vw"
    />
    <source
      type="image/webp"
      media="(min-width: 640px)"
      srcset="
        /images/product-wide.webp    640w,
        /images/product-wide@2x.webp 1280w
      "
      sizes="(min-width: 640px) 50vw"
    />
    <img
      src="/images/product-square.jpg"
      alt="Кроссовки Nike Air Max 270, вид спереди"
      width="400"
      height="400"
      loading="lazy"
    />
  </picture>
</article>
```

---

## Сравнение

| Критерий                | `<picture>`                            | `srcset` на `<img>`                  |
|-------------------------|----------------------------------------|--------------------------------------|
| Art direction           | Да (разные изображения)                | Нет (только разные размеры одного)   |
| Format negotiation      | Да (через `type`)                      | Нет                                  |
| Выбор изображения       | Детерминированный (первый подходящий)  | Браузер решает сам                   |
| Сложность разметки      | Высокая                                | Низкая                               |
| Когда использовать      | Разный кроп / разные форматы           | Один контент, разные разрешения      |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- В чём принципиальная разница между `<picture>` и `srcset` на `<img>`?
- Зачем нужен `<img>` внутри `<picture>`?
- Что произойдёт если браузер не поддерживает `<picture>`?
- Как браузер выбирает между несколькими `<source>`?
- Почему порядок `<source>` важен?

### Красные флаги (чего не говорить)

- «`<picture>` заменяет `<img>`» — `<img>` обязателен внутри `<picture>`
- «`<picture>` и `srcset` делают одно и то же» — разные задачи: art direction vs resolution switching
- «`<picture>` нужен для всех изображений» — для простого responsive достаточно `srcset` + `sizes`

### Связанные темы

- [`srcset` и `sizes`](./049-srcset.md) — responsive изображения
- [`alt` атрибут](./047-atribut-alt.md) — альтернативный текст
- [`decoding` атрибут](./043-atribut-decoding.md) — оптимизация декодирования
- [Core Web Vitals / LCP](../06.%20performance.md) — производительность изображений
