# Q039. Как работают `transition` и `animation`, и в чем их отличия?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`transition`** — реактивный: запускается автоматически при изменении CSS-свойства (hover, focus, смена класса), плавно интерполирует между двумя состояниями. **`animation`** — проактивный: запускается самостоятельно по `@keyframes`, не требует изменения состояния, поддерживает множество кадров, циклы, задержки и управление воспроизведением.

---

## Развёрнутый ответ

### Суть и определение

| Критерий | `transition` | `animation` |
|----------|-------------|------------|
| Запуск | Изменение свойства (триггер) | Автоматически (при применении) |
| Кадры | 2 (начало → конец) | Произвольное кол-во (@keyframes) |
| Цикл | Нет | `animation-iteration-count` |
| Задержка | `transition-delay` | `animation-delay` |
| Реверс | Автоматически (при убирании триггера) | `animation-direction: reverse/alternate` |
| Управление | CSS only (play/pause через смену класса) | `animation-play-state` |
| Конечное состояние | Возвращается к исходному | `animation-fill-mode` |
| JS API | `transitionend` event | `animationend`, `animationiteration` |

### Как это работает

**`transition`:**
```
Состояние A ──(триггер)──→ Состояние B
             ←(убрать триггер)──
```
Браузер интерполирует значение свойства от текущего к целевому за указанное время. При убирании триггера — обратная интерполяция (если transition задан и в исходном, и в конечном состоянии).

**`animation`:**
```
@keyframes: 0% → 25% → 50% → 75% → 100%
Выполняется: N раз, infinite, alternate...
```
Браузер запускает timeline анимации при применении CSS-правила. Анимация независима от DOM-изменений.

**Синтаксис `transition`:**
```css
transition: <property> <duration> <timing-function> <delay>;
/* Несколько */
transition: transform 0.3s ease, opacity 0.2s ease-in 0.1s;
```

**Синтаксис `animation`:**
```css
animation: <name> <duration> <timing> <delay> <iteration> <direction> <fill-mode> <play-state>;
animation: bounce 1s ease-in-out 0s infinite alternate both running;
```

### Практика и применение

**`transition` подходит:**
- Hover/focus-эффекты (цвет, тень, трансформация)
- Переходы между состояниями компонента (active, selected)
- Открытие/закрытие dropdown (opacity + visibility)

**`animation` подходит:**
- Постоянно работающие анимации (спиннер, пульс, skeleton)
- Onboarding / intro анимации
- Последовательные многоэтапные переходы
- Анимации, независимые от пользовательских действий

### Важные нюансы и краеугольные камни

- `transition: all` — антипаттерн: анимирует все изменившиеся свойства, включая неожиданные.
- `animation-fill-mode: forwards` — элемент остаётся в последнем кадре после завершения. `both` = `forwards` + `backwards`.
- `animation-delay` отрицательный (например, `-0.5s`) — анимация начинается уже с середины (полезно для staggered animations).
- `transitionend` и `animationend` — события для JavaScript-колбэков.
- Оба работают только со свойствами, поддерживающими интерполяцию (не `display`, `visibility` — дискретные).
- Web Animations API (WAAPI) — мощная JS-альтернатива для программного управления.

### Примеры

```css
/* transition: hover-эффект кнопки */
.btn {
  background: blue;
  transform: translateY(0);
  transition: background 0.2s ease, transform 0.15s ease-out;
}
.btn:hover {
  background: darkblue;
  transform: translateY(-2px);
}

/* animation: пульсирующий индикатор */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.95); }
}
.indicator {
  animation: pulse 2s ease-in-out infinite;
}

/* animation: staggered список */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.list-item {
  animation: fade-up 0.4s ease-out forwards;
}
.list-item:nth-child(2) { animation-delay: 0.1s; }
.list-item:nth-child(3) { animation-delay: 0.2s; }

/* Обработка transitionend в JS */
element.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') {
    element.style.display = 'none';
  }
});
```

---

## Сравнение

| Критерий | `transition` | `animation` |
|----------|-------------|------------|
| Когда запускается | По триггеру | Автоматически |
| Кол-во состояний | 2 | Произвольно |
| Цикличность | Нет | Да |
| Управление playback | Нет | `play-state` |
| Конечное состояние | К исходному | `fill-mode` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда `transitionend` срабатывает?** — При завершении перехода; если `transition: none` — событие не генерируется.
- **Что такое `animation-fill-mode: both`?** — Применяет стили первого кадра до начала (при `animation-delay`) и остаётся на последнем после завершения.
- **Как сделать staggered animation для списка?** — Отрицательный `animation-delay` или CSS Custom Properties с `--index` для каждого item.
- **Чем WAAPI лучше CSS-анимаций?** — Программное управление (play, pause, reverse, currentTime), промисы, динамические параметры.

### Красные флаги (чего не говорить)

- «`transition` работает без триггера» — требует изменения свойства.
- «`animation` нельзя остановить через CSS» — `animation-play-state: paused`.

### Связанные темы

- `038-css-svoystva-dlya-animaciy-i-perekhodov.md`
- `040-svoystvo-will-change.md`
- `041-mediafunkciya-prefers-reduced-motion.md`
