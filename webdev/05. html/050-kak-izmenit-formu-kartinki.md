# Q055. Как можно изменить форму картинки или HTML элемента?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Форму изображения или HTML-элемента можно изменить несколькими способами: `border-radius` для скруглений и кругов, `clip-path` для произвольных геометрических и полигональных форм, `mask-image` для масок на основе изображений или градиентов, SVG `clipPath` для векторного обрезания. Для изображений внутри контейнеров используют `object-fit` совместно с формой контейнера.

---

## Развёрнутый ответ

### Суть и определение

«Изменить форму» означает управление тем, какая область элемента видима (clipping/masking) или как деформируется его геометрия. CSS предоставляет несколько независимых механизмов, каждый с разными trade-offs по мощности, поддержке и производительности.

### Как это работает

#### 1. `border-radius` — скругления

Самый простой способ. Работает на любом блочном элементе.

```css
/* Скруглённые углы */
.card { border-radius: 12px; }

/* Эллипс */
.oval { border-radius: 50% / 30%; }

/* Идеальный круг */
.avatar { border-radius: 50%; }

/* Произвольная форма (pill) */
.badge { border-radius: 9999px; }
```

#### 2. `clip-path` — обрезка по контуру

Мощный инструмент для произвольных форм. Поддерживает анимацию.

```css
/* Геометрические фигуры */
.circle    { clip-path: circle(50%); }
.ellipse   { clip-path: ellipse(60% 40% at 50% 50%); }
.inset     { clip-path: inset(10px 20px 10px 20px round 8px); }

/* Полигоны */
.triangle  { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
.hexagon   { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
.arrow     { clip-path: polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%, 30% 50%); }

/* SVG-путь */
.custom    { clip-path: path('M 0 0 L 100 0 Q 100 100 50 100 Q 0 100 0 0 Z'); }

/* Ссылка на SVG clipPath */
.svg-clip  { clip-path: url(#my-clip); }
```

#### 3. `mask-image` — пиксельная маска

Позволяет использовать изображение или градиент как маску прозрачности.

```css
/* Градиентная маска (fade из центра) */
.fade {
  mask-image: radial-gradient(circle, black 40%, transparent 70%);
}

/* Маска из SVG или PNG */
.star-shape {
  mask-image: url(star-mask.svg);
  mask-size: contain;
  mask-repeat: no-repeat;
}
```

#### 4. `object-fit` + форма контейнера

Для `<img>` и `<video>` внутри контейнера с заданной формой.

```css
.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden; /* обрезает img по форме контейнера */
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;   /* масштабирует без искажений */
  object-position: center top; /* позиция фокуса */
}
```

### Практика и применение

- **Аватары**: круглые фото пользователей (`border-radius: 50%` + `object-fit: cover`)
- **Hero-секции**: срезанный угол (`clip-path: polygon(...)`)
- **Декоративные карточки**: волнистый нижний край через `clip-path`
- **Маски для фото**: плавное растворение краёв через `mask-image` + gradient
- **Иконки кастомных форм**: `clip-path` + SVG

```html
<!-- Круглый аватар -->
<div class="avatar">
  <img src="user.jpg" alt="Иван Петров" />
</div>

<!-- Карточка со срезанным углом -->
<div class="card-clipped">
  <img src="product.jpg" alt="Продукт" />
</div>
```

```css
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-clipped {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 85% 100%, 0 100%);
  overflow: hidden;
}
```

### Важные нюансы и краеугольные камни

- `clip-path` и `mask-image` создают **новый stacking context** и могут влиять на `z-index`
- `clip-path` с `polygon` и `path` поддерживает **анимацию через `transition`** при одинаковом числе точек
- `border-radius` + `overflow: hidden` — самый производительный способ для прямоугольных форм с закруглениями
- `shape-outside` — изменяет **обтекание** текста вокруг элемента, но не clip видимой области
- `aspect-ratio` задаёт пропорции контейнера, не форму — полезен совместно с `clip-path`
- SVG `clipPath` внутри HTML даёт максимальную гибкость для сложных форм (кривые Безье)
- Инструменты для генерации `clip-path`: [bennettfeely.com/clippy](https://bennettfeely.com/clippy)

### Примеры

```html
<!-- Полный пример: профильная карточка с аватаром и badge -->
<div class="profile-card">
  <!-- Аватар-круг -->
  <div class="avatar">
    <img src="avatar.webp" alt="Анна Смирнова" width="80" height="80" />
  </div>

  <!-- Бейдж в форме ромба -->
  <span class="badge-diamond">Pro</span>

  <!-- Карточка с волнистым дном -->
</div>

<style>
  .profile-card {
    position: relative;
    clip-path: polygon(
      0 0, 100% 0,
      100% 85%, 90% 100%, 10% 100%, 0 85%
    );
    background: #fff;
    padding: 24px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .badge-diamond {
    display: inline-block;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background: #6366f1;
    color: white;
    padding: 4px 8px;
  }
</style>
```

---

## Сравнение

| Метод             | Форма                          | Анимация | Производительность | Поддержка |
|-------------------|--------------------------------|----------|--------------------|-----------|
| `border-radius`   | Скругления, круги, эллипсы     | Да       | Отличная (GPU)     | Все       |
| `clip-path`       | Любая геометрия, SVG-пути      | Да*      | Хорошая            | Все совр. |
| `mask-image`      | Любая (bitmap/gradient)        | Частично | Средняя            | Все совр. |
| SVG `clipPath`    | Векторная, любой сложности     | Да (SVG) | Хорошая            | Все совр. |
| `overflow:hidden` | Форма контейнера               | Нет      | Отличная           | Все       |

_* При одинаковом числе точек в полигоне_

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- В чём разница между `clip-path` и `mask-image`?
- Как анимировать `clip-path` без джанка?
- Зачем нужен `object-fit: cover` при изменении формы `<img>`?
- Что такое `shape-outside` и чем отличается от `clip-path`?
- Как `clip-path` влияет на доступность и интерактивность (клики за пределами формы)?

### Красные флаги (чего не говорить)

- «`border-radius: 50%` работает только для квадратных элементов» — для круга нужен квадратный контейнер, но сам atribute работает с любым размером
- «`clip-path` и `overflow: hidden` одно и то же» — `overflow` обрезает по прямоугольнику, `clip-path` — по произвольной форме
- «`shape-outside` меняет форму элемента» — только обтекание текста, не визуальный вид

### Связанные темы

- [`<picture>` элемент](./048-element-picture.md) — адаптивные изображения
- [`srcset`](./049-srcset.md) — responsive изображения
- [CSS transforms](../css/transforms.md) — деформация и трансформация элементов
- [SVG](../05.%20html.md) — векторная графика в HTML
