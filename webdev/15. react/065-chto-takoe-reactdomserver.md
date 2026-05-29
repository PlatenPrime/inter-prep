# Q065. Что такое `ReactDOMServer`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**`ReactDOMServer`** — пакет `react-dom/server`, предоставляющий API для рендеринга React-компонентов в HTML-строку или стрим **на сервере** (Node.js). Используется для **SSR (Server-Side Rendering)**: генерация HTML на сервере улучшает SEO и ускоряет First Contentful Paint. Основные методы: `renderToString()`, `renderToPipeableStream()` (React 18).

---

## Развёрнутый ответ

### Суть и определение

`ReactDOMServer` разделяет цикл рендеринга: на сервере генерируется HTML (без интерактивности), клиент гидрирует его через `hydrateRoot`. Это позволяет поисковым роботам получить готовый HTML без выполнения JavaScript.

### API ReactDOMServer

**`renderToString(element)` — синхронный (legacy)**
```tsx
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
// Возвращает полную HTML-строку
// Блокирует поток до полного рендера — не поддерживает Suspense
```

**`renderToPipeableStream(element, options)` — стриминговый (React 18, Node.js)**
```tsx
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/static/js/main.js'],

  onShellReady() {
    // HTML для контента вне Suspense готов
    response.setHeader('Content-Type', 'text/html');
    pipe(response); // начать стримить
  },

  onShellError(error) {
    // Ошибка в оболочке → отправить fallback HTML
    response.statusCode = 500;
    response.send('<!DOCTYPE html><html>...</html>');
  },

  onAllReady() {
    // Весь HTML готов (включая Suspense)
    // Для ботов/краулеров — ждём полного рендера
  },

  onError(error) {
    console.error(error);
  },
});
```

**`renderToReadableStream(element)` — для Web Streams (Deno, Cloudflare Workers, Edge)**
```tsx
import { renderToReadableStream } from 'react-dom/server';

const stream = await renderToReadableStream(<App />, {
  bootstrapScripts: ['/main.js'],
});

return new Response(stream, {
  headers: { 'Content-Type': 'text/html' },
});
```

**`renderToStaticMarkup(element)` — без data-reactroot атрибутов (без гидрации)**
```tsx
import { renderToStaticMarkup } from 'react-dom/server';

// Для чисто статичного контента (email templates, PDF)
const html = renderToStaticMarkup(<EmailTemplate data={data} />);
// Без React-атрибутов → не гидрируется
```

### Полный SSR сервер (Express + React 18)

```tsx
// server.tsx
import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

const app = express();

app.get('*', (req, res) => {
  const { pipe } = renderToPipeableStream(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>,
    {
      bootstrapScripts: ['/client.js'],
      onShellReady() {
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html><html><head><title>App</title></head><body><div id="root">');
        pipe(res);
        res.write('</div></body></html>');
      },
      onShellError() {
        res.status(500).send('<h1>Ошибка сервера</h1>');
      },
    }
  );
});

// client.tsx
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter><App /></BrowserRouter>
);
```

### Streaming SSR с Suspense

```tsx
// Компоненты загружают данные через Suspense
const UserProfile = React.lazy(() => import('./UserProfile'));

const App = () => (
  <html>
    <body>
      {/* Этот контент стримится первым */}
      <Header />

      {/* UserProfile стримится позже, когда данные готовы */}
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile />
      </Suspense>
    </body>
  </html>
);
```

### Практика и применение

- **SEO-критичные страницы**: лендинги, блог, e-commerce
- **Performance**: быстрый FCP — пользователь видит контент до загрузки JS
- **Email templates**: `renderToStaticMarkup` для HTML-писем
- **PDF generation**: puppeteer + SSR HTML → PDF

### Важные нюансы и краеугольные камни

- `renderToString` — устаревает; `renderToPipeableStream` предпочтительнее в React 18
- **No browser APIs**: на сервере нет `window`, `document`, `localStorage` — нужны guards
- **Data fetching**: на сервере нужно вручную загружать данные (или Next.js `getServerSideProps` / RSC)
- **State hydration**: данные, загруженные на сервере, нужно передать клиенту (Next.js деhydrated state)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем renderToPipeableStream лучше renderToString?** — стриминг: браузер получает и рендерит HTML по частям; поддержка Suspense
- **Как передать данные с сервера клиенту для гидрации?** — `__NEXT_DATA__` (Next.js) или window.__INITIAL_STATE__ как JSON
- **Что такое React Server Components?** — компоненты, которые рендерятся только на сервере; никогда не попадают в клиентский bundle

### Красные флаги (чего не говорить)

- «renderToString поддерживает Suspense» — не поддерживает нативно; используйте renderToPipeableStream
- «ReactDOMServer — для клиентского кода» — только серверная среда (Node.js)

### Связанные темы

- `061-chto-takoe-hydration-v-kontekste-servernogo-renderinga-react-prilozheniĭ.md`
- `066-raznica-mezhdu-react-i-reactdom.md`
