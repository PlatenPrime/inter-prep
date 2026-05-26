# Q042. Какие фильтры есть в CSS?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

CSS предоставляет свойство **`filter`** с набором функций для графических эффектов: размытие (`blur()`), яркость (`brightness()`), контраст (`contrast()`), оттенки серого (`grayscale()`), оттенок (`hue-rotate()`), инверсия (`invert()`), непрозрачность (`opacity()`), насыщенность (`saturate()`), сепия (`sepia()`) и тень (`drop-shadow()`). Свойство **`backdrop-filter`** применяет те же эффекты к содержимому **за** элементом.

---

## Развёрнутый ответ

### Суть и определение

| Функция | Описание | Диапазон |
|---------|---------|---------|
| `blur(px)` | Гауссово размытие | 0+ px |
| `brightness(%)` | Яркость | 0% (чёрный) – 100% (норм) – 200%+ |
| `contrast(%)` | Контраст | 0% (серый) – 100% (норм) – 200%+ |
| `grayscale(%)` | Оттенки серого | 0% – 100% |
| `hue-rotate(deg)` | Поворот цветового круга | 0deg – 360deg |
| `invert(%)` | Инверсия цветов | 0% – 100% |
| `opacity(%)` | Прозрачность | 0% – 100% |
| `saturate(%)` | Насыщенность | 0% (серый) – 100% (норм) – 200%+ |
| `sepia(%)` | Сепия | 0% – 100% |
| `drop-shadow(x y blur color)` | Тень по контуру (SVG-like) | — |

Можно комбинировать: `filter: grayscale(50%) blur(2px)`.

### Как это работает

`filter` применяется **после** рендеринга элемента и его потомков. Создаёт новый **stacking context** и выполняется как GPU post-processing эффект.

`backdrop-filter` применяет фильтры к **содержимому позади** элемента:
```css
.glass-card {
  backdrop-filter: blur(12px) brightness(0.8);
  background: rgb(255 255 255 / 0.2);
}
```

Разница `filter: opacity()` vs `opacity`:
- `filter: opacity(50%)` может не создавать stacking context в некоторых реализациях.
- Практически идентичны, но `opacity` — отдельное свойство, оптимизированное браузером.

`drop-shadow()` vs `box-shadow`:
- `box-shadow` — прямоугольная тень по border-box.
- `drop-shadow()` — тень по форме элемента (учитывает прозрачность PNG, SVG-контуры).

### Практика и применение

- **Glassmorphism**: `backdrop-filter: blur(16px) saturate(180%)` + полупрозрачный фон.
- **Hover-эффект на изображения**: `filter: grayscale(100%)` по умолчанию → `grayscale(0%)` при hover.
- **Тёмный оверлей**: `filter: brightness(50%)` вместо слоя с opacity.
- **Тема** через `hue-rotate()`: изменить оттенок всей цветовой схемы без CSS custom properties.
- **Loading state**: `filter: blur(8px)` для placeholder низкого разрешения (LQIP).

### Важные нюансы и краеугольные камни

- `filter` создаёт stacking context — ломает `position: fixed` потомков (аналогично `transform`).
- `backdrop-filter` требует, чтобы фон был полупрозрачным — иначе эффект невиден.
- `backdrop-filter` поддерживается Chrome 76+, Safari 9+, Firefox 103+.
- GPU-обработка фильтров дорога при больших элементах или частом обновлении — не применять к большим областям без нужды.
- `filter: drop-shadow()` медленнее `box-shadow` — box-shadow обрабатывается на compositor, drop-shadow требует полного рендера.

### Примеры

```css
/* Grayscale изображения с hover цветом */
.card__image {
  filter: grayscale(100%) contrast(1.1);
  transition: filter 0.3s ease;
}
.card:hover .card__image {
  filter: grayscale(0%) contrast(1);
}

/* Glassmorphism */
.glass {
  background: rgb(255 255 255 / 0.15);
  backdrop-filter: blur(12px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px) saturate(1.8);
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 16px;
}

/* drop-shadow для SVG-иконки */
.icon {
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.3));
}

/* LQIP placeholder blur */
.image-placeholder {
  filter: blur(20px);
  transform: scale(1.05); /* убрать края размытия */
  transition: filter 0.4s ease;
}
.image-placeholder.loaded {
  filter: blur(0);
  transform: scale(1);
}

/* Тёмная тема через hue-rotate */
[data-theme="alt"] {
  filter: hue-rotate(180deg) invert(1);
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `drop-shadow()` отличается от `box-shadow`?** — `drop-shadow` следует контуру элемента (работает с PNG alpha), `box-shadow` — по border-box.
- **Почему `filter` ломает `position: fixed`?** — `filter` создаёт stacking context, который становится containing block для `fixed` потомков.
- **Как сделать glassmorphism эффект?** — `backdrop-filter: blur()` + полупрозрачный background + border.
- **Влияет ли `backdrop-filter` на производительность?** — Да: фильтр применяется к содержимому под элементом, что требует дополнительного рендера.

### Красные флаги (чего не говорить)

- «`filter: opacity()` то же самое, что `opacity`» — функционально схоже, но семантически и поведенчески могут отличаться.
- «`backdrop-filter` поддерживается везде без префикса» — в Safari нужен `-webkit-backdrop-filter`.

### Связанные темы

- `043-sposoby-zadaniya-cveta-v-css.md`
- `039-kak-rabotayut-transition-i-animation-otlichiya.md`
- `023-chto-takoe-z-index-kak-formiruetsya-kontekst-nalozheniya.md`
