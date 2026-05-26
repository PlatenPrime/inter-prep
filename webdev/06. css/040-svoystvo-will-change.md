# Q040. Расскажите о свойстве `will-change`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`will-change`** — CSS-подсказка браузеру о том, какие свойства элемента будут изменяться в будущем. Браузер может заранее создать compositor layer (GPU texture), что устраняет «jank» (рывки) при первом кадре анимации. Его следует использовать **экономно** — каждый compositor layer потребляет видеопамять.

---

## Развёрнутый ответ

### Суть и определение

```css
will-change: transform;
will-change: opacity;
will-change: transform, opacity;
will-change: scroll-position;
will-change: auto; /* убрать подсказку */
```

**Что делает браузер:**
1. Выносит элемент на отдельный compositor layer (GPU texture) заранее.
2. При изменении `transform`/`opacity` — не нужен Repaint всего страницы.
3. Изменение применяется только к этому layer.

### Как это работает

Без `will-change`:
- Первый кадр анимации → браузер создаёт layer → задержка (jank).
- Последующие кадры — плавно.

С `will-change: transform`:
- Layer создаётся заблаговременно.
- Первый кадр — без задержки.

**Неявное создание layer:**
`transform` или `opacity` в анимации/transition уже создают compositor layer без `will-change`. Поэтому `will-change` полезен главным образом для:
- Элементов, которые будут анимированы по пользовательскому взаимодействию (но ещё не анимируются).
- Случаев, когда `transform: translateZ(0)` / `transform: translate3d(0,0,0)` использовался как «GPU-хак» — `will-change` делает это явным.

### Практика и применение

- Большие изображения с hover-анимацией: `will-change: transform` при `:hover` на родителе.
- Элементы с `transition`, которые часто триггерятся.
- Sticky header: `will-change: transform` (хотя `position: sticky` само оптимизировано).

### Важные нюансы и краеугольные камни

- **Не злоупотреблять**: каждый compositor layer = GPU memory. На мобильных устройствах с малым объёмом VRAM — деградация производительности.
- `will-change: transform` создаёт **stacking context** и **containing block** для `position: fixed` — неожиданный побочный эффект.
- Применять `will-change` динамически через JS: добавить перед анимацией, убрать после.
- `will-change: contents` — подсказывает, что содержимое будет меняться (рекомпозит layer).
- Не задавать `will-change` на слишком многих или слишком больших элементах.
- В большинстве случаев браузеры достаточно умны без `will-change` — добавлять только если реально есть проблема.

### Примеры

```css
/* 1. Навешивать will-change через :hover на родителе */
.card-list:hover .card {
  will-change: transform;
}
.card:hover {
  transform: translateY(-4px) scale(1.02);
  transition: transform 0.2s ease-out;
}

/* 2. Добавлять/убирать через JS для точечного применения */
```

```javascript
// Правильный паттерн
button.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform';
});
button.addEventListener('animationend', () => {
  element.style.willChange = 'auto'; // убрать после анимации
});
```

```css
/* 3. Антипаттерн: will-change на всех элементах */
* { will-change: transform; } /* убивает производительность */

/* 4. will-change: scroll-position для scroll-контейнеров */
.scrollable {
  will-change: scroll-position; /* оптимизировать скролл */
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `will-change` на всех элементах — плохо?** — Браузер создаёт compositor layer для каждого → огромный расход GPU-памяти, деградация производительности.
- **Чем `will-change: transform` отличается от `transform: translateZ(0)`?** — Функционально похожи (оба создают compositor layer), но `will-change` — семантически правильный способ без добавления реальной трансформации.
- **Как убрать `will-change` после анимации?** — `element.style.willChange = 'auto'` в `animationend` / `transitionend` обработчике.
- **Какой побочный эффект у `will-change: transform`?** — Создаёт stacking context → может сломать z-index у соседних элементов.

### Красные флаги (чего не говорить)

- «`will-change` всегда улучшает производительность» — при злоупотреблении ухудшает из-за расхода VRAM.
- «`will-change` гарантирует GPU-анимацию» — подсказка, не гарантия; браузер принимает окончательное решение.

### Связанные темы

- `038-css-svoystva-dlya-animaciy-i-perekhodov.md`
- `039-kak-rabotayut-transition-i-animation-otlichiya.md`
- `025-kogda-ispolzovat-translate-vmesto-absolyutnogo-pozitsionirovaniya.md`
