# Q061. Что такое "Hydration" в контексте серверного рендеринга React-приложений?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Hydration (гидрация)** — процесс, при котором React на клиенте «оживляет» статичный HTML, полученный с сервера: присоединяет обработчики событий, инициализирует state и восстанавливает виртуальный DOM. В отличие от чистого CSR (создания DOM с нуля), hydration использует существующие DOM-узлы сервера и только добавляет к ним интерактивность.

---

## Развёрнутый ответ

### Суть и определение

При SSR сервер рендерит React-компоненты в HTML-строку и отправляет её браузеру. Браузер немедленно показывает контент (хороший FCP). Затем загружается JS-бандл, и React «гидрирует» этот HTML — превращает статичные узлы в живое React-приложение.

### Как это работает

**Шаг 1: Сервер рендерит HTML**
```tsx
// server.tsx (Node.js/Next.js)
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
// Отдаётся в браузер как готовый HTML
```

**Шаг 2: Браузер показывает HTML (FCP)**
```html
<!-- Пользователь видит контент ДО загрузки JS -->
<div id="root">
  <div class="header"><h1>Мой сайт</h1><!-- навигация --></div>
  <main><article>...статья...</article></main>
</div>
```

**Шаг 3: JS загружается, React гидрирует**
```tsx
// client.tsx
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('root')!,
  <App /> // React "узнаёт" DOM, присоединяет события
);
```

**Внутри hydrateRoot**: React обходит существующий DOM и Virtual DOM дерево одновременно. Если они совпадают — не создаёт новых узлов, только присоединяет обработчики. Если не совпадают — выдаёт предупреждение (hydration mismatch).

### Типы рендеринга в контексте гидрации

| API | Назначение |
|-----|-----------|
| `renderToString` | HTML-строка (синхронный, без Suspense) |
| `renderToPipeableStream` | Стриминговый HTML с Suspense |
| `hydrateRoot` | Гидрация на клиенте (React 18) |
| `createRoot` | Чистый CSR без гидрации |

### Hydration в Next.js

```tsx
// Next.js автоматически управляет гидрацией
// pages/article.tsx
export async function getServerSideProps(context) {
  const article = await fetchArticle(context.params.id);
  return { props: { article } };
}

const ArticlePage: React.FC<{ article: Article }> = ({ article }) => {
  // Рендерится на сервере + гидрируется на клиенте
  return <div>{article.title}</div>;
};

// App Router (Next.js 13+): Server Components не гидрируются!
// "use client" — компонент гидрируется
// Без директивы — Server Component (только на сервере)
```

### Selective Hydration (React 18)

```tsx
// React 18 + renderToPipeableStream: частичная гидрация
// Компоненты внутри Suspense гидрируются отдельно
<html>
  <body>
    <Suspense fallback={<HeaderSkeleton />}>
      <Header /> {/* гидрируется при загрузке */}
    </Suspense>
    <Suspense fallback={<ContentSkeleton />}>
      <MainContent /> {/* гидрируется независимо */}
    </Suspense>
  </body>
</html>
```

### Проблема: Hydration Mismatch

```tsx
// ❌ Несоответствие: сервер рендерит одно, клиент другое
const TimeStamp: React.FC = () => {
  // Сервер: "2026-01-15 10:00:00"
  // Клиент (через 2 сек): "2026-01-15 10:00:02"
  // → Hydration mismatch warning!
  return <span>{new Date().toLocaleString()}</span>;
};

// ✅ Решение: suppressHydrationWarning для динамических значений
const TimeStamp: React.FC = () => (
  <span suppressHydrationWarning>{new Date().toLocaleString()}</span>
);

// ✅ Или: рендерить динамическое только после гидрации
const TimeStamp: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <span>{mounted ? new Date().toLocaleString() : ''}</span>;
};
```

### Практика и применение

- **SEO**: HTML-контент доступен поисковикам сразу (без ожидания JS)
- **Performance**: FCP быстрый (HTML), TTI позже (после гидрации)
- **Next.js / Remix**: управляют гидрацией автоматически
- **React Server Components**: серверные компоненты не гидрируются (только клиентские)

### Важные нюансы и краеугольные камни

- **Hydration mismatch** в development вызывает предупреждение; в production React пытается исправить (может мигание)
- **`suppressHydrationWarning`** — для заведомо различающегося контента (timestamp, случайный ID)
- **Partial Hydration** / **Islands Architecture**: только интерактивные части гидрируются (Astro, Qwik)
- **Streaming SSR** (React 18): HTML стримится, Suspense-границы гидрируются по частям — улучшает TTFB

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница render vs hydrate?** — `createRoot().render` создаёт DOM с нуля; `hydrateRoot` использует существующий DOM с сервера
- **Что такое hydration mismatch и как исправить?** — различие HTML сервера и клиента; решение: синхронизировать данные через SSR props
- **Что такое React Server Components и как они связаны с hydration?** — RSC рендерятся только на сервере, не включаются в client bundle, не гидрируются

### Красные флаги (чего не говорить)

- «Hydration = повторный рендер на клиенте» — нет; React переиспользует DOM, не создаёт заново
- «SSR и гидрация — одно и то же» — SSR генерирует HTML; гидрация активирует его на клиенте

### Связанные темы

- `065-chto-takoe-reactdomserver.md`
- `019-chto-takoe-virtual-dom-kak-on-rabotaet-s-react.md`
- `066-raznica-mezhdu-react-i-reactdom.md`
