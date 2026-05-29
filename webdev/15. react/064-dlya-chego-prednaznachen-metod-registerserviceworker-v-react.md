# Q064. Для чего предназначен метод `registerServiceWorker()` в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`registerServiceWorker()` — функция из старых версий `create-react-app` (до CRA v4), которая регистрировала Service Worker для кэширования ресурсов приложения и поддержки **offline-режима** (PWA). В современном CRA файл называется `serviceWorkerRegistration.js` с явным вызовом `register()`. Вне CRA Service Worker регистрируется напрямую через браузерный API.

---

## Развёрнутый ответ

### Суть и определение

**Service Worker** — скрипт, работающий в фоновом потоке браузера (отдельно от страницы). Перехватывает сетевые запросы, кэширует ресурсы, обеспечивает:
- **Offline-режим** — приложение работает без сети
- **Background sync** — отправка данных при восстановлении соединения
- **Push-уведомления**
- **Ускорение загрузки** — ресурсы из кэша

`registerServiceWorker()` — удобная обёртка из CRA, скрывающая детали регистрации.

### Эволюция в CRA

**CRA 1–3 (устаревший вариант):**
```tsx
// src/index.tsx (старый CRA)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker'; // устаревший импорт

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```

**CRA 4+ (современный вариант):**
```tsx
// src/index.tsx (современный CRA)
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Явно opt-in:
serviceWorkerRegistration.register(); // включить Service Worker
// serviceWorkerRegistration.unregister(); // отключить (по умолчанию)
```

### Прямая регистрация Service Worker (без CRA)

```tsx
// src/index.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}
```

### Workbox — современный способ (Vite PWA Plugin)

```tsx
// vite.config.ts + vite-plugin-pwa
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', expiration: { maxEntries: 100 } },
          },
        ],
      },
      manifest: {
        name: 'My React App',
        short_name: 'ReactApp',
        theme_color: '#ffffff',
        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    }),
  ],
});
```

### Стратегии кэширования Service Worker

| Стратегия | Описание | Когда |
|-----------|----------|-------|
| `CacheFirst` | Из кэша, потом сеть | Статика (JS, CSS) |
| `NetworkFirst` | Из сети, при ошибке — кэш | API, динамические данные |
| `StaleWhileRevalidate` | Кэш + обновление в фоне | Полу-динамические данные |
| `NetworkOnly` | Только сеть | Аналитика, платежи |
| `CacheOnly` | Только кэш | Offline-only ресурсы |

### Практика и применение

- **PWA**: установка на рабочий стол, offline-режим
- **Performance**: предзагрузка критичных ресурсов
- **Push-уведомления**: Service Worker получает push даже при закрытом приложении
- **Background sync**: отправка форм при нестабильном соединении

### Важные нюансы и краеугольные камни

- Service Worker работает только по **HTTPS** (или localhost для разработки)
- SW не обновляется автоматически при деплое — нужна стратегия инвалидации кэша
- `registerType: 'autoUpdate'` (Workbox) — автоматически обновляет SW при новой версии
- Старый SW продолжает работать, пока открыты все вкладки приложения

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое PWA?** — прогрессивное веб-приложение: устанавливаемое, offline, push-уведомления, на базе Service Worker
- **Как обновить Service Worker?** — через `skipWaiting()` в SW + `clients.claim()`; или подождать, пока пользователь закроет все вкладки
- **Почему SW требует HTTPS?** — перехватывает все запросы; без HTTPS — man-in-the-middle атака

### Красные флаги (чего не говорить)

- «registerServiceWorker — стандартная функция React» — это утилита CRA, не часть React
- «Service Worker работает на HTTP» — только HTTPS или localhost

### Связанные темы

- `062-tekhniki-optimizacii-performansa-react.md`
- `065-chto-takoe-reactdomserver.md`
