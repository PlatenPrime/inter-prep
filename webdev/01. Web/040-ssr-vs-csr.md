# Q040. SSR (Server-Side Rendering) и CSR (Client-Side Rendering) плюсы и минусы?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**SSR** отдаёт готовый HTML с сервера — быстрее **первый контент**, лучше **SEO** и доступность до JS, но выше **нагрузка на сервер**, сложнее деплой и риск hydration mismatch. **CSR** рендерит в браузере — проще хостинг статики, богатый SPA после загрузки, но **медленный первый экран**, слабее SEO без доп. мер. На практике выбирают гибрид: SSG/SSR для публичных страниц, CSR для app за логином.

---

## Развёрнутый ответ

### Суть и определение

Оба — способы доставить UI пользователю; различается **где и когда** выполняется первый render и кто держит данные для него.

Современные фреймворки (Next.js App Router) смешивают: Server Components + client islands.

### Как это работает

**SSR path:** Request → Server render + data → HTML → Browser paint → Hydrate → SPA navigation (часто CSR дальше).

**CSR path:** Request → Minimal HTML → JS → Fetch → Render → SPA navigation.

Метрики: SSR улучшает **FCP/LCP**; CSR может улучшить **последующие** переходы при агрессивном prefetch и кэше.

### Практика и применение

| Сценарий | Склонность |
|----------|------------|
| Публичный блог, магазин | SSR / SSG |
| SaaS dashboard | CSR или SSR только для shell |
| Маркетинг + app | SSR лендинг + CSR в `/app` |

**Почему без баланса хуже:** только CSR на лендинге — потеря конверсии; только SSR на highly interactive UI — лишний TTFB на каждое действие без client cache.

### Важные нюансы и краеугольные камни

- **Partial hydration / islands** — меньше JS на клиенте (Astro, Qwik).
- **Edge SSR** — ближе к пользователю, но лимиты runtime.
- **Auth:** персональный HTML не кэшировать на shared CDN.
- Не путать SSR с «рендер в iframe» или prerender только для ботов.
- Стоимость: SSR = CPU × RPS; CSR = CDN + API.

### Примеры

```javascript
// Next.js — явное разделение (Pages Router иллюстрация)
// SSR: getServerSideProps на странице
// CSR: dynamic(() => import('./Chart'), { ssr: false })
```

---

## Сравнение

| Критерий | SSR | CSR |
|----------|-----|-----|
| Первый контент (FCP/LCP) | Обычно быстрее | Зависит от размера JS |
| SEO | Лучше из коробки | Нужен prerender/SSR или осторожный CSR |
| Нагрузка на сервер | Выше (рендер на запрос) | Ниже (статика + API) |
| TTFB | Может быть выше (ожидание сервера) | HTML быстрый, контент позже |
| Интерактивность после load | После hydration | После mount |
| Сложность | Гидратация, env, deployment | Проще фронт-only |
| Персонализация | Удобно на сервере | Через API после load |
| Офлайн / PWA | Зависит от кэша SW | Естественно для SPA shell |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда SSG вместо SSR?** — контент редко меняется.
- **Universal/isomorphic app pitfalls?** — window, localStorage на сервере.
- **React 18 Streaming SSR?** — Suspense, progressive HTML.
- **Метрики для выбора?** — LCP, TTFB, INP, server cost.
- **Микрофронт: SSR каждого?** — shell SSR + remote CSR.

### Красные флаги (чего не говорить)

- «Всегда SSR» или «всегда CSR» без контекста продукта.
- «SSR = безопаснее» — XSS и утечки state возможны и там.
- Игнорировать стоимость серверного рендера при scale.

### Связанные темы

- [038-csr.md](038-csr.md)
- [039-ssr.md](039-ssr.md)
- [041-ssg.md](041-ssg.md)
- [042-isr.md](042-isr.md)
- [043-progressivnyy-rendering.md](043-progressivnyy-rendering.md)

---
