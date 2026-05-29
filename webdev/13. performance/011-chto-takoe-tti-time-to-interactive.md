# Q011. Что такое TTI (Time to Interactive)? Как его измерить и улучшить?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**TTI (Time to Interactive)** — время от начала загрузки страницы до момента, когда она становится **полностью интерактивной**: основной контент отображён, зарегистрированы обработчики событий, страница стабильно отвечает на ввод за ≤ 50 мс. TTI измеряется через Lighthouse (Lab metric) и определяется как конец последнего «тихого окна» после FCP, в котором нет Long Tasks. Улучшается уменьшением объёма и времени парсинга/выполнения JS.

---

## Развёрнутый ответ

### Суть и определение

TTI решает проблему «визуально готово, но не кликабельно» — классическая боль SPA: страница нарисована (хороший FCP/LCP), но кнопки не реагируют, потому что main thread занят исполнением бандла. TTI фиксирует конец этой мёртвой зоны.

Важно: TTI — **Lab метрика** (измеряется Lighthouse), не Field метрика. В реальных пользовательских данных (RUM) вместо TTI используется **INP** — он лучше отражает интерактивность на протяжении всей сессии.

### Как это работает

**Алгоритм вычисления TTI:**

1. Начинается с FCP (First Contentful Paint).
2. Ищется первое **тихое окно** размером минимум **5 секунд**, в котором:
   - нет Long Tasks (задач > 50 мс на main thread),
   - не более 2 активных сетевых запросов.
3. TTI = начало этого тихого окна (конец последней Long Task перед ним).

```
Timeline:
─────────────────────────────────────────────────────────
FCP          LongTask  LongTask      [5s quiet window]
 │            ████████  ██████             │
 ▼                                         ▼
0s    1s    2s    3s    4s    5s    6s    7s ← TTI
```

**Связь с другими метриками:**
- **FCP** — страница что-то отрисовала (визуальная обратная связь).
- **LCP** — главный контент загружен.
- **TTI** — страница полностью готова к взаимодействию.
- **TBT (Total Blocking Time)** = сумма (Long Task − 50 мс) между FCP и TTI; коррелирует с TTI и измеряется в Lab.
- **INP** — Field-аналог: реальные задержки на ввод пользователя.

### Практика и применение

**Измерение TTI:**

```javascript
// Lighthouse programmatically
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
const { lhr } = await lighthouse('https://example.com', {
  port: chrome.port,
  onlyCategories: ['performance'],
});

console.log('TTI:', lhr.audits['interactive'].numericValue, 'ms');
console.log('TBT:', lhr.audits['total-blocking-time'].numericValue, 'ms');
await chrome.kill();
```

```javascript
// PerformanceObserver: Long Tasks (компонент TTI)
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (entry.duration > 50) {
      console.warn('Long Task:', entry.duration, 'ms', entry.attribution);
    }
  });
});
observer.observe({ type: 'longtask', buffered: true });
```

**Способы улучшения TTI:**

**1. Уменьшить JavaScript payload**
```javascript
// Code splitting: загружать только нужное
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Tree shaking: импортировать конкретные функции
import { debounce } from 'lodash-es'; // НЕ import _ from 'lodash'
```

**2. Разбить Long Tasks через `scheduler.yield()`**
```javascript
async function parseAndRenderData(data) {
  const results = [];
  for (let i = 0; i < data.length; i++) {
    results.push(expensiveTransform(data[i]));
    // Yield каждые 100 итераций — отдать main thread
    if (i % 100 === 0) await scheduler.yield();
  }
  renderResults(results);
}
```

**3. Перенести тяжёлые вычисления в Web Worker**
```javascript
// main.js
const worker = new Worker('/workers/compute.js');
worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => renderResults(e.data);

// compute.js (Web Worker — отдельный поток)
self.onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  self.postMessage(result);
};
```

**4. Отложить некритические скрипты**
```html
<!-- Аналитика, чаты, виджеты — после load -->
<script>
window.addEventListener('load', () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.intercom.io/widget.js';
  document.head.appendChild(script);
});
</script>
```

**5. Server-Side Rendering / Static Generation**

CSR (React/Vue без SSR): HTML пустой → JS загружается → парсится → выполняется → TTI высокий.

SSR/SSG: HTML с контентом → JS для hydration → TTI значительно ниже.

### Важные нюансы и краеугольные камни

- **TTI — Lab-only метрика**: нельзя измерить через RUM (нет стандартного браузерного API); Lighthouse вычисляет его ретроспективно по timeline.
- **TTI vs TBT**: TBT — суммарная «задержанность» между FCP и TTI; является более стабильной прокси-метрикой для Lab-тестирования (меньше дисперсия между запусками).
- **Hydration penalty в SSR**: SSR отдаёт готовый HTML быстро (хороший FCP/LCP), но hydration занимает JS-время на main thread → TTI может быть высоким несмотря на хороший FCP.
- **Progressive Hydration / Islands Architecture** (Astro, Qwik) — hydrate только интерактивные части → минимальный TTI.
- **TTI не отражает взаимодействие после загрузки**: страница может иметь хороший TTI, но плохой INP из-за тяжёлых обработчиков.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем TTI отличается от INP?** — TTI — Lab, момент первой полной интерактивности; INP — Field, 98-й персентиль задержки отрисовки для всех взаимодействий в сессии.
- **Что такое Long Task и порог 50 мс?** — Задача на main thread > 50 мс блокирует ввод; 50 мс = бюджет для ответа в пределах 100 мс (рекомендация RAIL).
- **Почему SSR не всегда улучшает TTI?** — Hydration — это JS-работа на main thread; большой SSR-бандл может иметь хороший FCP, но плохой TTI из-за гидратации.
- **Как Web Worker влияет на TTI?** — Переносит CPU-работу с main thread, уменьшает Long Tasks → тихое окно наступает раньше → TTI снижается.
- **Что такое TBT и как он связан с TTI?** — Total Blocking Time = сумма «избытков» Long Tasks между FCP и TTI; хороший прокси для TTI, более стабилен при повторных запусках Lighthouse.

### Красные флаги (чего не говорить)

- «TTI = FCP» — FCP — первый пиксель; TTI — полная интерактивность; разница может быть несколько секунд.
- «TTI измеряется у реальных пользователей» — только Lab (Lighthouse); RUM-аналог — INP.
- «Хороший LCP гарантирует хороший TTI» — нет: страница может отрисоваться быстро, но JS hydration займёт ещё 3 с.
- «TTI = время загрузки всех скриптов» — это время до первого «тихого окна»; скрипты могут быть загружены, но если они долго исполняются — TTI высокий.

### Связанные темы

- `009-chto-takoe-core-web-vitals-kakie-osnovnye-metriki.md`
- `010-rasskazhite-o-metrikakh-core-web-vitals.md`
- `008-dlya-chego-nuzhen-pattern-prpl.md`
- `012-sposoby-umensheniya-vremeni-zagruzki-veb-stranicy.md`
