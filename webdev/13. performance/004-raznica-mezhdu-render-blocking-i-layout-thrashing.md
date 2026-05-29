# Q004. Разница между "Render Blocking" и "Layout Thrashing"?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**Render Blocking** — ситуация, когда браузер не может отрисовать первый кадр из-за ожидания загрузки/парсинга CSS или JS-ресурсов; проблема возникает **до** рендеринга. **Layout Thrashing** — многократный форсированный пересчёт геометрии (synchronous layout) внутри одного кадра, вызванный чередованием чтения и записи DOM-свойств; проблема возникает **во время** выполнения JS после загрузки страницы. Оба явления блокируют main thread, но на разных фазах жизненного цикла страницы.

---

## Развёрнутый ответ

### Суть и определение

**Render Blocking** касается фазы начальной загрузки: ресурс мешает браузеру построить Render Tree и выполнить первый Layout/Paint. Пользователь видит белый экран.

**Layout Thrashing** касается фазы взаимодействия: JS-код внутри одного кадра поочерёдно читает геометрические свойства и изменяет стили, заставляя браузер синхронно выполнять Layout снова и снова (вместо одного отложенного пересчёта).

### Как это работает

**Render Blocking:**

```
Браузер скачивает HTML
    ├─ Встречает <link rel="stylesheet"> → STOP рендеринг → загружает CSS
    │   CSSOM не готов → Render Tree не строится → белый экран
    └─ Встречает <script> без async/defer → STOP парсинг → ждёт JS
        JS загружен → выполняется → парсинг продолжается
```

Блокирующие ресурсы: CSS (`<link>` в `<head>`), синхронный JS (`<script>` без `async`/`defer`).

**Layout Thrashing:**

Браузер откладывает вычисление Layout до конца кадра («lazy evaluation»). Но если JS читает геометрическое свойство (`offsetWidth`, `getBoundingClientRect`) **после** изменения DOM/стилей — браузер вынужден немедленно выполнить Layout, чтобы вернуть актуальные данные.

```javascript
// Thrashing: на каждой итерации — forced synchronous layout
elements.forEach(el => {
  el.style.width = el.parentElement.offsetWidth + 'px'; // write → read → LAYOUT
});
```

В DevTools → Performance это выглядит как серия быстрых событий «Layout» на дорожке Main с предупреждением «Forced reflow».

### Практика и применение

**Устранение Render Blocking:**

```html
<!-- CSS: инлайн critical styles, остальное async -->
<head>
  <style>/* critical CSS */</style>
  <link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>

<!-- JS: async или defer -->
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
```

**Устранение Layout Thrashing:**

```javascript
// Паттерн: сначала все reads, потом все writes
const widths = elements.map(el => el.parentElement.offsetWidth); // read phase
elements.forEach((el, i) => {
  el.style.width = widths[i] + 'px'; // write phase
});

// Или через FastDOM (библиотека батчинга)
import fastdom from 'fastdom';
elements.forEach(el => {
  fastdom.measure(() => {
    const w = el.parentElement.offsetWidth;
    fastdom.mutate(() => {
      el.style.width = w + 'px';
    });
  });
});
```

### Важные нюансы и краеугольные камни

- **Render Blocking — проблема времени загрузки (load time)**; Layout Thrashing — проблема времени выполнения (runtime).
- **Оба блокируют main thread**, но по разным причинам и в разное время.
- **`async` не устраняет все блокировки**: если async-скрипт изменяет DOM при загрузке, он может вызвать Layout.
- **CSS не блокирует парсинг HTML**, но блокирует рендеринг и выполнение синхронного JS (браузер ждёт CSSOM перед выполнением `<script>`).
- **Диагностика Render Blocking**: Lighthouse → «Eliminate render-blocking resources»; Network вкладка → фиолетовые/зелёные блоки до FCP.
- **Диагностика Layout Thrashing**: Performance вкладка → красные треугольники на событиях Layout, tooltip «Forced reflow is a likely performance bottleneck».

---

## Сравнение

| Критерий | Render Blocking | Layout Thrashing |
|----------|-----------------|------------------|
| Фаза | Загрузка страницы (до первого кадра) | Runtime (во время работы JS) |
| Причина | CSS/JS блокируют Render Tree | Чередование DOM read/write в одном кадре |
| Симптом | Белый экран, высокий FCP/LCP | Заикание анимаций, низкий FPS |
| Инструмент диагностики | Lighthouse, Network waterfall | DevTools Performance, «Forced reflow» |
| Решение | `async`/`defer`, critical CSS inline, preload | Разделить read/write, `requestAnimationFrame`, FastDOM |
| Где блокирует | До построения Render Tree | Внутри кадра на main thread |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Может ли CSS вызвать Layout Thrashing?** — Сам по себе нет; но JS, читающий геометрию после CSS-изменений через JS, может.
- **Как `requestAnimationFrame` помогает против Layout Thrashing?** — rAF выполняется в начале кадра; если группировать writes внутри rAF и reads — до, thrashing минимален.
- **Что такое FastDOM?** — Библиотека, которая батчит measure/mutate операции через micro/macro очередь, автоматически предотвращая thrashing.
- **Блокирует ли `<script defer>` рендеринг?** — Нет; defer-скрипты загружаются параллельно и выполняются после парсинга, но до `DOMContentLoaded`.
- **Влияет ли Server-Side Rendering на Render Blocking?** — SSR отправляет готовый HTML с контентом, уменьшая время до FCP; но CSS всё равно блокирует рендеринг.

### Красные флаги (чего не говорить)

- «Render Blocking и Layout Thrashing — одно и то же» — совершенно разные явления на разных фазах.
- «Layout Thrashing — это когда стили применяются медленно» — нет, это forced synchronous layout из-за паттерна «write-read-write-read».
- «`async` полностью решает проблему Render Blocking» — только для JS; CSS всё равно блокирует рендеринг.
- «Проблему Layout Thrashing не видно инструментами» — отлично видно в DevTools Performance как серия Layout-событий с предупреждением.

### Связанные темы

- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `002-raznica-mezhdu-layout-painting-i-compositing.md`
- `003-pochemu-vazhno-minimizirovat-kolichestvo-reflow-i-repaint.md`
- `005-pochemu-link-v-head-a-script-pered-zakryvayushimsya-body.md`
- `006-raznica-mezhdu-script-script-async-i-script-defer.md`
