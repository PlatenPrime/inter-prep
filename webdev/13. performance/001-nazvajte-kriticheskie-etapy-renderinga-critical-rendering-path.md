# Q001. Назовите критические этапы рендеринга (Critical Rendering Path)?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**Critical Rendering Path (CRP)** — последовательность шагов, которые браузер выполняет от получения HTML до первого отображения пикселей на экране. Включает: загрузку и парсинг HTML → построение DOM, парсинг CSS → построение CSSOM, объединение в Render Tree → вычисление Layout → Paint → Composite. Оптимизация CRP напрямую влияет на метрики FCP и LCP: чем короче путь, тем быстрее пользователь видит контент.

---

## Развёрнутый ответ

### Суть и определение

CRP описывает минимальный набор работ, которые должны быть выполнены, прежде чем браузер сможет отрисовать первый кадр. Каждый этап — потенциальное узкое место. Браузер не может пропустить ни один шаг, но может оптимизировать их параллельное выполнение и уменьшить объём работы.

### Как это работает

```
HTML bytes
    │
    ▼
Parsing HTML ──── Blocking CSS/JS ────► Waiting
    │                                      │
    ▼                                      ▼
  DOM                                   CSSOM
    │                                      │
    └──────────────┬───────────────────────┘
                   ▼
             Render Tree
           (только видимые узлы)
                   │
                   ▼
                Layout
           (геометрия, позиции)
                   │
                   ▼
                Paint
           (растеризация слоёв)
                   │
                   ▼
              Composite
           (склейка GPU-слоёв)
```

**1. Загрузка и парсинг HTML → DOM**
Браузер получает байты, декодирует их, токенизирует и строит DOM-дерево. Встретив `<script>` без `async`/`defer` — останавливается и исполняет скрипт (parser blocking). Встретив `<link rel="stylesheet">` — продолжает парсинг HTML, но блокирует построение Render Tree до готовности CSSOM.

**2. Парсинг CSS → CSSOM**
Полный CSS-файл должен быть загружен и разобран до начала построения Render Tree. CSSOM строится полностью (нельзя использовать частичный граф).

**3. Построение Render Tree**
DOM + CSSOM = Render Tree. Узлы с `display: none` исключаются. Каждый оставшийся узел получает вычисленные стили.

**4. Layout (Reflow)**
Браузер вычисляет геометрию: размеры, позиции каждого элемента. Относительные единицы (%, `em`) разрешаются в абсолютные пиксели. Любое изменение геометрии запускает повторный layout.

**5. Paint**
Браузер растеризует элементы в слои: цвет фона, текст, тени, border. Работа выполняется на CPU.

**6. Composite**
Слои передаются GPU, который склеивает их в финальный кадр. Трансформации (`transform`, `opacity`) обрабатываются только здесь, без Paint/Layout.

### Практика и применение

- **Минимизировать render-blocking ресурсы** — инлайнить критический CSS, переносить некритические стили в `<link media="print">` или загружать динамически.
- **Уменьшать глубину DOM** — чем меньше узлов, тем быстрее Layout и Paint.
- **Использовать `async`/`defer`** для скриптов, чтобы не блокировать парсер.
- **Preload критических ресурсов** — `<link rel="preload">` для шрифтов, изображений LCP.
- **Инлайнить критический CSS** (`above-the-fold`) прямо в `<head>`, остальное — загружать асинхронно.

Без оптимизации CRP страница долго остаётся белой — пользователь уходит раньше, чем увидит контент.

### Важные нюансы и краеугольные камни

- **CSS всегда блокирует рендеринг** (не парсинг), даже если стили на нижней части страницы — весь CSSOM нужен до Render Tree.
- **JS без `async`/`defer` блокирует и парсинг HTML, и CSSOM** — если `<script>` стоит после `<link>`, браузер дожидается CSSOM перед исполнением скрипта.
- **Preload Scanner** — параллельный процесс, который «просматривает» необработанный HTML вперёд и запускает загрузку ресурсов заранее; его не обманешь динамическим созданием `<script>` через JS.
- **Composite-only свойства** (`transform`, `opacity`) — не вызывают Layout и Paint, что делает их идеальными для анимаций.
- **Слишком много слоёв** (will-change / translate3d на всех элементах) — увеличивает потребление памяти GPU и время Composite.

### Примеры

```html
<!-- Плохо: блокирует парсер и рендеринг -->
<head>
  <script src="analytics.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>

<!-- Хорошо: критический CSS inline, некритический JS async -->
<head>
  <style>/* критические above-the-fold стили */</style>
  <link rel="preload" href="hero.webp" as="image">
  <link rel="stylesheet" href="styles.css">
  <script src="analytics.js" async></script>
</head>
```

```javascript
// Измерение CRP через Performance API
const [navEntry] = performance.getEntriesByType('navigation');
console.log('TTFB:', navEntry.responseStart - navEntry.requestStart);
console.log('DOM Content Loaded:', navEntry.domContentLoadedEventEnd);
console.log('Load:', navEntry.loadEventEnd);

// Наблюдение за LCP (первый «тяжёлый» элемент после CRP)
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  console.log('LCP:', entries.at(-1).startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему CSSOM блокирует рендеринг, но не парсинг?** — Render Tree требует полный CSSOM; парсер при этом продолжает работу — это разные потоки.
- **Что такое Preload Scanner и зачем он нужен?** — Браузерный lookahead-парсер, который запускает загрузку ресурсов параллельно основному парсингу.
- **Как `<script>` влияет на CSSOM?** — Скрипт может запрашивать вычисленные стили, поэтому браузер дожидается CSSOM перед выполнением JS.
- **Чем Render Tree отличается от DOM?** — В Render Tree нет скрытых элементов (`display:none`, `<head>`), зато есть псевдоэлементы (`::before`).
- **Как измерить CRP в DevTools?** — Вкладка Performance → запись → дорожка «Main», события Parse HTML / Recalculate Style / Layout / Paint / Composite.
- **Когда выгодно инлайнить CSS?** — Только для критического above-the-fold контента (< ~14 КБ); иначе нет кэширования.

### Красные флаги (чего не говорить)

- «CRP — это просто загрузка ресурсов» — загрузка лишь первый шаг; парсинг, Layout, Paint тоже входят в путь.
- «CSS не блокирует JS» — блокирует: если `<script>` идёт после `<link>`, браузер ждёт CSSOM.
- «Composite и Paint — одно и то же» — Paint растеризует, Composite склеивает GPU-слои; это принципиально разные шаги с разными оптимизациями.
- Путать CRP с «временем загрузки страницы» — CRP заканчивается на первом кадре; полная загрузка (все ресурсы) может занимать значительно больше.

### Связанные темы

- `002-raznica-mezhdu-layout-painting-i-compositing.md`
- `003-pochemu-vazhno-minimizirovat-kolichestvo-reflow-i-repaint.md`
- `004-raznica-mezhdu-render-blocking-i-layout-thrashing.md`
- `005-pochemu-link-v-head-a-script-pered-zakryvayushimsya-body.md`
- `009-chto-takoe-core-web-vitals-kakie-osnovnye-metriki.md`
