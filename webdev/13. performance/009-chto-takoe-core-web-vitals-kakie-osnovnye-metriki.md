# Q009. Что такое Core Web Vitals? Какие основные метрики туда входят?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**Core Web Vitals** — набор метрик от Google, измеряющих реальный пользовательский опыт по трём ключевым аспектам: скорость загрузки, интерактивность и визуальная стабильность. С 2021 года входят в факторы ранжирования Google Search. Три основные метрики: **LCP** (Largest Contentful Paint) — скорость загрузки, **INP** (Interaction to Next Paint) — отзывчивость, **CLS** (Cumulative Layout Shift) — стабильность макета.

---

## Развёрнутый ответ

### Суть и определение

Core Web Vitals (CWV) — часть более широкого набора Web Vitals, но именно они считаются «ядром» и являются сигналами качества страницы в алгоритме Google. Метрики измеряются в реальных условиях (Real User Monitoring, RUM) через Chrome User Experience Report (CrUX) — агрегированные данные миллионов реальных пользователей Chrome.

До 2024 года вторая метрика называлась **FID** (First Input Delay). В марте 2024 Google заменил FID на **INP** как более полную метрику отзывчивости.

### Как это работает

**LCP — Largest Contentful Paint**

Измеряет время от начала загрузки страницы до момента, когда **самый большой видимый элемент** в viewport отрисован.

Учитываемые элементы: `<img>`, `<video>` (постер), CSS background-image (через url()), блочные элементы с текстом (`<p>`, `<h1>`, `<div>`).

Пороги:
- ✅ Хорошо: ≤ 2,5 с
- ⚠️ Требует улучшения: 2,5–4 с
- ❌ Плохо: > 4 с

**INP — Interaction to Next Paint**

Измеряет задержку отрисовки **для всех взаимодействий** (клики, нажатия клавиш, тапы) в течение сессии. Итоговая оценка — 98-й персентиль всех взаимодействий (не худшее, а «почти худшее»).

Пороги:
- ✅ Хорошо: ≤ 200 мс
- ⚠️ Требует улучшения: 200–500 мс
- ❌ Плохо: > 500 мс

**CLS — Cumulative Layout Shift**

Измеряет суммарный сдвиг макета — насколько элементы страницы «прыгают» без участия пользователя. Формула: `impact fraction × distance fraction` для каждого сдвига, сумма за сессию.

Пороги:
- ✅ Хорошо: ≤ 0,1
- ⚠️ Требует улучшения: 0,1–0,25
- ❌ Плохо: > 0,25

### Практика и применение

**Инструменты измерения:**

| Инструмент | Тип данных | CWV |
|-----------|-----------|-----|
| Lighthouse | Lab (синтетика) | LCP, CLS, (INP в новых версиях) |
| PageSpeed Insights | Lab + Field (CrUX) | Все три |
| Chrome DevTools → Performance | Lab | LCP, CLS |
| Chrome DevTools → Performance Insights | Lab | Все |
| `web-vitals` npm package | Field (RUM) | Все три |
| Google Search Console | Field | Все три |

```javascript
// Мониторинг CWV в production через web-vitals
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ metric: name, value, id }),
  });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

**Реальный сценарий:** Команда замечает падение трафика из Google. PageSpeed Insights показывает LCP = 4,8 с (плохо) и CLS = 0,3 (плохо). Причина LCP: hero-изображение не preloaded, загружается через CSS background. Причина CLS: изображения без атрибутов `width`/`height`. Исправление — `<link rel="preload">` + размеры изображений → LCP 2,1 с, CLS 0,05.

### Важные нюансы и краеугольные камни

- **Lab vs Field данные**: Lighthouse измеряет в контролируемых условиях (симулированный throttling), CrUX — реальные пользователи на реальных устройствах; они могут расходиться значительно.
- **FID → INP**: FID измерял только первое взаимодействие и только задержку до начала обработки; INP охватывает все взаимодействия и полное время до repaint.
- **CLS на длинных страницах**: с 2021 года считается windowed CLS (максимальное окно 5 с с gap 1 с), а не total shift за всё время — это справедливее для длинных страниц.
- **CWV — сигнал ранжирования**, но не единственный: качество контента и релевантность важнее; плохой CWV снижает позиции при прочих равных.
- **TTFB и FCP** — дополнительные метрики Web Vitals (не Core), но влияют на LCP и пользовательский опыт.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему FID заменили на INP?** — FID измерял только первое взаимодействие и только input delay (не обработку и рендеринг); INP полнее отражает отзывчивость.
- **Как CWV влияет на SEO?** — С 2021 — сигнал Page Experience; при равном качестве контента страница с хорошим CWV ранжируется выше.
- **Что такое CrUX и зачем он нужен?** — Chrome User Experience Report: агрегированные Field-данные реальных пользователей Chrome; используется в PageSpeed Insights и Search Console.
- **Почему Lighthouse CWV отличается от PageSpeed Insights Field?** — Lighthouse — контролируемый Lab; PSI Field — реальные устройства, сети, браузеры; мобильные пользователи могут иметь значительно хуже показатели.
- **Как измерять INP самостоятельно?** — `web-vitals` пакет + RUM; PerformanceObserver с `event` type для отдельных взаимодействий.

### Красные флаги (чего не говорить)

- «Core Web Vitals — это FCP, TTI и TBT» — это Lighthouse-метрики; CWV — LCP, INP, CLS.
- «FID ещё актуален» — заменён на INP с марта 2024.
- «Lighthouse показывает реальные CWV» — Lighthouse — Lab data; реальные CWV — только через RUM или CrUX (Field data).
- «CWV — главный фактор SEO» — один из множества сигналов; контент и релевантность важнее.

### Связанные темы

- `010-rasskazhite-o-metrikakh-core-web-vitals.md`
- `011-chto-takoe-tti-time-to-interactive.md`
- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `013-kak-optimizirovat-zagruzku-izobrazhenij.md`
