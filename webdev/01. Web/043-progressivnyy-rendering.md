# Q043. Что такое прогрессивный рендеринг?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Прогрессивный рендеринг** — стратегия отдачи контента **поэтапно**: сначала критичный above-the-fold и быстрый shell, затем остальное по мере готовности данных и JS. Цель — улучшить воспринимаемую скорость (FCP, LCP) и **Time to Interactive**, не заставляя пользователя ждать полной загрузки страницы. Реализуется через streaming SSR, lazy components, skeleton UI, приоритизацию ресурсов и разбиение бандла.

---

## Развёрнутый ответ

### Суть и определение

Не одна технология, а **набор практик** на стыке SSR, CSR, performance и UX. Противоположность «big bang» — один огромный HTML/JS блок в конце.

Связанные термины: **progressive enhancement** (функциональность слоями), **streaming**, **skeleton screens**, **route-based code splitting**.

### Как это работает

1. **Критический CSS inline** — первый paint без ожидания всех стилей.
2. **Streaming SSR (React 18):** сервер шлёт HTML частями; Suspense fallback → контент.
3. **Lazy routes/components:** `React.lazy`, dynamic `import()`.
4. **Приоритеты:** `fetchpriority="high"` на LCP-изображение, defer/async scripts.
5. **Placeholder / skeleton** — layout stable, контент догружается.

Пользователь видит структуру страницы раньше, чем интерактивность всего UI.

### Практика и применение

- **Ленты соцсетей, маркетплейсы** — карточки сверху первыми.
- **Next.js + Suspense** — границы между медленными и быстрыми секциями.
- **Изображения:** blur placeholder (LQIP), `loading="lazy"` ниже fold.

Без прогрессивности — длинный белый экран и высокий bounce rate на мобильных.

### Важные нюансы и краеугольные камни

- **Layout shift (CLS)** — skeleton должен совпадать по размерам с контентом.
- Слишком много lazy boundaries — waterfall запросов.
- Streaming требует поддержки на сервере и прокси (no buffer entire response).
- «Фейковый» skeleton бесконечно — хуже, чем спиннер с таймаутом ошибки.
- Не путать с **Progressive Enhancement** (базовый HTML для всех) — см. [049-pe-vs-gd.md](049-pe-vs-gd.md).

### Примеры

```javascript
// React 18 — lazy секция
const Reviews = React.lazy(() => import('./Reviews'));

function ProductPage() {
  return (
    <>
      <ProductHero /> {/* SSR/stream first */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </>
  );
}
```

```html
<img src="hero.jpg" fetchpriority="high" width="1200" height="630" alt="">
<img src="footer-logo.jpg" loading="lazy" alt="">
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Streaming SSR vs chunk SSR?** — flush по Suspense boundary.
- **Метрики: FCP vs TTI vs INP?** — что оптимизирует каждый приём.
- **Skeleton vs spinner?** — perceived performance и CLS.
- **Critical rendering path?** — блокирующие CSS/JS.
- **Relation to PE?** — enhancement vs rendering pipeline.

### Красные флаги (чего не говорить)

- Смешивать «прогрессивный рендеринг» и «PWA» как одно понятие.
- Lazy-load LCP-изображение (вредит LCP).
- Бесконечный skeleton без error state.

### Связанные темы

- [039-ssr.md](039-ssr.md)
- [049-pe-vs-gd.md](049-pe-vs-gd.md)
- [040-ssr-vs-csr.md](040-ssr-vs-csr.md)

---
