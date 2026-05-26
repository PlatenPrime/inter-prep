# Q025. В каком случае лучше использовать `translate()` вместо абсолютного позиционирования?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

`translate()` предпочтителен, когда нужно **анимировать или динамически смещать** элемент — он не вызывает Reflow (Layout), работает на GPU через composite layer и не влияет на расположение соседних элементов. Абсолютное позиционирование используется для **структурного размещения** элемента вне нормального потока. Главный критерий выбора — будет ли позиция меняться в runtime.

---

## Развёрнутый ответ

### Суть и определение

**`transform: translate(x, y)`** (или `translate: x y` как отдельное свойство в CSS 2024):
- Смещает визуальное отображение элемента без изменения его позиции в layout.
- Место в потоке документа **остаётся на исходной позиции**.
- Анимируется через CSS Transitions/Animations на compositor thread (GPU).

**`position: absolute; top: X; left: Y`:**
- Выводит элемент из нормального потока.
- Позиционирует относительно containing block.
- Изменение `top`/`left` через JS/CSS вызывает **Layout + Paint**.

### Как это работает

Рендеринговый pipeline браузера:

```
JavaScript → Style → Layout → Paint → Composite
```

- Изменение `top`/`left` → триггерит **Layout** (Reflow) и **Paint** — дорогие операции.
- Изменение `transform` → только **Composite** — GPU-операция без пересчёта layout.

`will-change: transform` — подсказка браузеру поднять элемент на отдельный compositor layer заранее.

### Практика и применение

**Используй `translate()`:**
- Анимации появления/исчезновения (`translateY(-20px)` → `translateY(0)`).
- Slide-in/slide-out меню, drawer, тосты.
- Микроанимации кнопок при hover (`translateY(-2px)`).
- Параллакс-эффекты.
- Центрирование с сохранением потока: `translate(-50%, -50%)` совместно с `position: absolute` (только для центрирования, не для анимации там же).

**Используй `position: absolute`:**
- Модалки, тултипы, дропдауны — элементы, выпавшие из потока.
- Оверлеи поверх контейнера (`inset: 0`).
- Бейджи, иконки поверх карточки.
- Любой случай, где итоговая позиция статична и не меняется в runtime.

### Важные нюансы и краеугольные камни

- Анимация `top`/`left` через JS (`element.style.top = x + 'px'`) — антипаттерн; замените на `requestAnimationFrame` + `transform`.
- `translate()` создаёт stacking context при использовании в `transform` — может неожиданно повлиять на z-index.
- В CSS 2024 `translate` стало **индивидуальным свойством**: `translate: 50px 20px` — не перезаписывает rotate/scale в отличие от шортхенда `transform`.
- `position: absolute` + `translate()` в связке — нормальная практика для одновременного выпадения из потока и анимации смещения.

### Примеры

```css
/* Анимация через translate — GPU-оптимально */
.drawer {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 300px;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.drawer.is-open {
  transform: translateX(0);
}

/* Кнопка с hover-эффектом */
.btn:hover {
  transform: translateY(-2px);
  /* НЕ: top: -2px — вызвало бы Reflow */
}

/* Центрирование через absolute + translate */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%; /* индивидуальное свойство CSS */
}

/* Плохо: анимация через left/top */
@keyframes bad {
  from { left: -100px; }
  to   { left: 0; }
  /* Каждый кадр — Reflow! */
}

/* Хорошо: анимация через transform */
@keyframes good {
  from { transform: translateX(-100px); }
  to   { transform: translateX(0); }
  /* Только Composite */
}
```

---

## Сравнение

| Критерий | `translate()` | `position: absolute` |
|----------|--------------|---------------------|
| Влияет на layout | Нет | Да (выпадает из потока) |
| Анимация (GPU) | Да (только Composite) | Нет (Layout + Paint) |
| Место в потоке | Сохраняется | Убирается |
| Для статичного расположения | Неинтуитивно | Идеально |
| Для анимаций | Предпочтительно | Антипаттерн |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `transform` не вызывает Reflow?** — Composite-операция работает только в GPU, не пересчитывает геометрию других элементов.
- **Что такое `will-change: transform`?** — Подсказка браузеру создать compositor layer заранее; избегает jank при первом кадре анимации.
- **Чем `translate` (CSS property) отличается от `transform: translate()`?** — Индивидуальное свойство `translate` не перезаписывает другие трансформации.
- **Как GPU-compositing влияет на потребление памяти?** — Каждый compositor layer занимает видеопамять; не злоупотребляй `will-change` и `transform: translateZ(0)`.

### Красные флаги (чего не говорить)

- «`position: absolute` быстрее для анимаций» — наоборот, анимация `top`/`left` — антипаттерн производительности.
- «`translate` меняет место элемента в DOM» — нет, только визуальное смещение.

### Связанные темы

- `022-tipy-pozitsionirovaniya-v-css.md`
- `039-kak-rabotayut-transition-i-animation-otlichiya.md`
- `040-svoystvo-will-change.md`
