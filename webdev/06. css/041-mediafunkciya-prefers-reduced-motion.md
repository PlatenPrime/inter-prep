# Q041. Расскажите о медиафункции `prefers-reduced-motion`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`prefers-reduced-motion`** — медиафункция CSS, отражающая системную настройку пользователя «уменьшить движение». Используется для отключения или замены анимаций, которые могут вызывать дискомфорт у людей с вестибулярными расстройствами. Значения: `no-preference` (без ограничений) и `reduce` (уменьшить анимации).

---

## Развёрнутый ответ

### Суть и определение

```css
@media (prefers-reduced-motion: reduce) {
  /* Стили при включённой настройке "Уменьшить движение" */
}

@media (prefers-reduced-motion: no-preference) {
  /* Стили при обычных настройках */
}
```

**Системные настройки:**
- macOS: Accessibility → Motion → Reduce Motion
- iOS: Accessibility → Motion → Reduce Motion
- Windows: System → Accessibility → Visual Effects → Animation Effects
- Android: Accessibility → Remove animations

### Как это работает

Браузер читает системную настройку и экспонирует её через `prefers-reduced-motion`. CSS-движок применяет соответствующие стили.

**Два подхода к реализации:**

**1. Глобальный сброс (агрессивный):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**2. Motion-first подход (рекомендуемый):**
```css
/* Базовые стили — без анимаций */
.btn { background: blue; }

/* Анимации — только если пользователь ОК */
@media (prefers-reduced-motion: no-preference) {
  .btn {
    transition: transform 0.2s ease;
  }
  .btn:hover {
    transform: translateY(-2px);
  }
}
```

### Практика и применение

- Отключить параллакс-анимации (`scroll-behavior: smooth` → `auto`).
- Заменить большие анимации движения на fade (opacity) — менее проблематично.
- Остановить автоплей-карусели и слайдеры.
- Убрать infinite-анимации (пульс, shimmer) или сделать их статичными.

**JavaScript API:**
```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!prefersReduced.matches) {
  // запустить анимацию
}
prefersReduced.addEventListener('change', (e) => {
  // динамическое изменение настройки
});
```

### Важные нюансы и краеугольные камни

- Не путать «уменьшить» с «убрать полностью» — некоторые анимации (fade, color) менее проблематичны, чем движение.
- `prefers-reduced-motion: reduce` ≠ «пользователь ненавидит анимации» — он просит уменьшить **вестибулярно-триггерные** эффекты (большие перемещения, параллакс, зум).
- WCAG 2.1 SC 2.3.3 (AAA) требует обеспечить альтернативу анимациям, провоцирующим расстройства.
- `animation-duration: 0.01ms` вместо `0s` — потому что некоторый код ожидает события `animationend`, которое не произойдёт при `0s`.
- `scroll-behavior: smooth` также влияет на вестибулярную систему — стоит отключать.

### Примеры

```css
/* motion-first паттерн */
.hero__image {
  /* Base: без анимации */
}

@media (prefers-reduced-motion: no-preference) {
  .hero__image {
    animation: float 4s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-20px); }
}

/* Заменить движение на fade */
@media (prefers-reduced-motion: reduce) {
  .slide-in {
    animation: fade-in 0.3s ease;
    /* вместо translateX(-100%) → translateX(0) */
  }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* scroll-behavior */
html {
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

/* WAAPI */
const animation = element.animate([...], { duration: 500 });
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animation.finish(); // мгновенно
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем `animation-duration: 0.01ms` вместо `0`?** — При `0ms` событие `animationend` может не сработать, ломая JS-логику.
- **Какие анимации всё же допустимы при `reduce`?** — Opacity-transitions (fade), color changes — не вызывают вестибулярных проблем.
- **Как проверить `prefers-reduced-motion` в JS?** — `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- **Что требует WCAG?** — SC 2.3.3 (Level AAA): предоставить способ отключить анимации, провоцирующие нарушения.

### Красные флаги (чего не говорить)

- «`prefers-reduced-motion` — это для пользователей, которым не нравятся анимации» — медицинская необходимость для людей с вестибулярными расстройствами.
- «Достаточно глобально обнулить все анимации» — лучше motion-first подход, заменяя движение на fade там, где нужно.

### Связанные темы

- `038-css-svoystva-dlya-animaciy-i-perekhodov.md`
- `039-kak-rabotayut-transition-i-animation-otlichiya.md`
