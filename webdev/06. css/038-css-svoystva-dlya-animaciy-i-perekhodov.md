# Q038. Какие CSS-свойства используются для создания анимаций и плавных переходов?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Для плавных переходов — **`transition`** (срабатывает при смене состояния: hover, focus, class change). Для сложных анимаций — **`animation`** + **`@keyframes`** (циклические, отложенные, многоэтапные). Производительные анимации работают только на свойствах `transform` и `opacity` — они обрабатываются на GPU без Layout и Paint.

---

## Развёрнутый ответ

### Суть и определение

**`transition`:**
```css
transition: <property> <duration> <timing-function> <delay>;
transition: transform 0.3s ease, opacity 0.2s ease-in;
```

**`animation` + `@keyframes`:**
```css
@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

.element {
  animation: slide-in 0.4s ease-out forwards;
}
/* animation: <name> <duration> <timing> <delay> <iteration> <direction> <fill-mode> <play-state> */
```

**Анимируемые свойства и стоимость:**

| Категория | Свойства | Pipeline |
|-----------|---------|---------|
| Compositor-only | `transform`, `opacity` | Только Composite (GPU) |
| Paint-only | `color`, `background-color`, `box-shadow` | Paint + Composite |
| Layout + Paint | `width`, `height`, `margin`, `padding`, `top` | Layout + Paint + Composite |

### Как это работает

**`transition`:** отслеживает изменение значения свойства (триггер — смена CSS-класса или псевдокласса) и плавно интерполирует между старым и новым значением.

**`@keyframes`:** задаёт ключевые кадры (by %, `from`/`to`). Браузер интерполирует промежуточные значения. Анимация запускается при применении к элементу.

**Timing functions:**
- `linear` — равномерно
- `ease` — медленно → быстро → медленно (дефолт)
- `ease-in` — ускорение
- `ease-out` — замедление (наиболее естественное)
- `ease-in-out` — ускорение → замедление
- `cubic-bezier(x1, y1, x2, y2)` — произвольная кривая
- `steps(n, start|end)` — пошаговая
- `spring(mass, stiffness, damping)` — физическая пружина (не в CSS; аналог в Motion/Framer)

### Практика и применение

- Hover-эффекты кнопок: `transition: transform 0.15s ease-out, box-shadow 0.15s ease-out`.
- Появление модалки: `@keyframes` с `opacity` + `transform`.
- Спиннер загрузки: `animation: spin 1s linear infinite`.
- Skeleton loading: `animation: shimmer 1.5s infinite` с `background-position`.
- `animation-fill-mode: forwards` — сохраняет состояние последнего кадра после завершения.

### Важные нюансы и краеугольные камни

- Анимация `width`/`height` → Layout → дорого; замените на `transform: scaleX()`.
- `will-change: transform` — подсказка браузеру поднять элемент на compositor layer заранее.
- `animation-play-state: paused` — остановить анимацию через CSS (без JS).
- `@starting-style` (Chrome 117+) — позволяет анимировать элемент при первом рендере.
- `prefers-reduced-motion` — обязательно отключать анимации для пользователей с вестибулярными расстройствами.
- Transition на `display` — дискретное значение, не анимируется (требует `@starting-style` или visibility + opacity trick).

### Примеры

```css
/* Hover-кнопка */
.btn {
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.2);
}

/* Спиннер */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 0.8s linear infinite;
}

/* Появление модалки */
@keyframes fade-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.modal {
  animation: fade-scale-in 0.2s ease-out forwards;
}

/* Скелетон */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Уважение к prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему анимировать `transform` лучше, чем `width`?** — `transform` обрабатывается на compositor thread (GPU), не вызывает Layout и Paint.
- **Что такое `animation-fill-mode: forwards`?** — Элемент остаётся в состоянии последнего keyframe после завершения (без — возвращается к исходному).
- **Как остановить анимацию через CSS?** — `animation-play-state: paused`.
- **Как анимировать `display: none` → `block`?** — `@starting-style` + `transition` (Chrome 117+) или через visibility + opacity.

### Красные флаги (чего не говорить)

- «Любое свойство можно анимировать без потери производительности» — Layout-свойства (`width`, `top`) вызывают Reflow.
- «`transition: all` — хорошая практика» — анимирует все изменившиеся свойства, включая нежелательные; явно перечислять.

### Связанные темы

- `039-kak-rabotayut-transition-i-animation-otlichiya.md`
- `040-svoystvo-will-change.md`
- `041-mediafunkciya-prefers-reduced-motion.md`
- `025-kogda-ispolzovat-translate-vmesto-absolyutnogo-pozitsionirovaniya.md`
