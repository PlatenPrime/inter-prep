# Q049. Разница между Progressive Enhancement и Graceful Degradation?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Progressive Enhancement (PE)** — строим от **базового работающего** слоя (семантический HTML, формы без JS) и **добавляем** улучшения (CSS, JS, API). **Graceful Degradation (GD)** — сначала **полная** версия для современных браузеров, затем **упрощаем** для старых (fallback). PE безопаснее для доступности и SEO; GD исторически «сайт для IE с урезаниями». Сегодня PE — предпочтительная философия веб-стандартов.

---

## Развёрнутый ответ

### Суть и определение

**PE:** контент и основные действия доступны без JS; JS — enhancement.

**GD:** проектировали Flash/тяжёлый JS app, для legacy — «если нет feature X, покажи упрощёнку».

Оба про **устойчивость** к ограниченной среде; разница в **направлении проектирования**.

### Как это работает

**PE пример:** форма отправляется обычным POST; `preventDefault` + fetch — быстрее, но не обязательно.

**GD пример:** SPA на React; без JS — пустая страница, «включите JS» (плохой GD).

**Современный PE:** Server Components + minimal JS; `<noscript>` предупреждение; `enhanced` класс после load.

Связь с **responsive / cross-browser:** PE на уровне возможностей, не только размера экрана.

### Практика и применение

- **Госуслуги, банки, e-commerce** — PE для критичных потоков (оплата, login).
- **Внутренний admin** — допустим GD «только Chrome latest» по контракту.
- **Почему PE лучше:** SEO, a11y screen readers, медленные сети, блокировщики скриптов.

GD без плана — «у нас не работает в Safari» после релиза.

### Важные нюансы и краеугольные камни

- PE **не** значит «без JavaScript вообще» для сложного продукта — значит осмысленная база.
- «Feature detection, not browser sniffing» — часть PE.
- Перепутать с **progressive rendering** — про скорость отдачи UI, не философию baseline.
- Фейковый PE: пустой `<div>` без HTML — нет базового слоя.

### Примеры

```html
<!-- PE: форма работает без JS -->
<form action="/search" method="get">
  <input name="q" required>
  <button type="submit">Найти</button>
</form>
<script type="module">
  // enhancement: instant search, history API
  initLiveSearch();
</script>
```

```javascript
// Feature detection (PE-стиль)
if ('geolocation' in navigator) {
  showMapWithUserLocation();
} else {
  showMapWithDefaultCenter();
}
```

---

## Сравнение

| Критерий | Progressive Enhancement | Graceful Degradation |
|----------|-------------------------|---------------------|
| Направление | База → улучшения | Полная версия → упрощения |
| Стартовая точка | Минимально работающий опыт | Максимальный для target browser |
| Риск без JS | Ниже | Выше (если не спланировано) |
| SEO / a11y | Естественно лучше | Требует дисциплины |
| Типичная эра | Современная веб-разработка | Legacy enterprise, Flash-era |
| Тестирование | Сначала без JS/CSS | Сначала happy path, потом fallbacks |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **PE и SPA совместимы?** — SSR/SSG даёт HTML baseline + hydrate.
- **Что такое «core experience»?** — договор с продуктом.
- **`<noscript>` достаточно?** — нет, нужен реальный HTML контент.
- **GD в микрофронтах?** — согласованные fallback между командами.
- **PE vs feature flags?** — flags для rollout, PE для capability.

### Красные флаги (чего не говорить)

- «PE устарел, все SPA».
- Путать PE с «поддержкой старых IE любой ценой».
- «GD = плохо, PE = хорошо» без контекста internal tools.

### Связанные темы

- [047-krossbrauzernost.md](047-krossbrauzernost.md)
- [043-progressivnyy-rendering.md](043-progressivnyy-rendering.md)
- [039-ssr.md](039-ssr.md)
- [048-adaptive-vs-responsive.md](048-adaptive-vs-responsive.md)

---
