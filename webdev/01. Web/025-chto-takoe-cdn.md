# Q025. Что такое CDN?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**CDN (Content Delivery Network)** — распределённая сеть **edge-серверов**, кэширующих и отдающих статический и динамический контент **ближе к пользователю**, снижая **latency** и нагрузку на origin. Запрос маршрутизируется через **DNS** (часто **Anycast**) к ближайшему PoP. CDN терминирует TLS, сжимает ответы, применяет **Cache-Control**, защищает от DDoS (WAF). Без CDN пользователь из Азии тянет всё с одного дата-центра в Европе — медленный TTFB и LCP.

---

## Развёрнутый ответ

### Суть и определение

CDN — не только «картинки»: кэшируются JS/CSS, шрифты, видео (HLS сегменты), иногда **HTML/API** с коротким TTL или stale-while-revalidate.

Ключевые понятия:

- **Origin** — ваш сервер (S3, nginx, Vercel)
- **Edge / PoP** — точка присутствия CDN
- **Cache hit/miss** — ответ с edge или запрос к origin
- **Purge / invalidation** — сброс кэша при деплое

### Как это работает

1. `cdn.example.com` → CNAME на `xxx.cloudflare.net` или A на Anycast IP.
2. Первый запрос к asset — **MISS**, edge тянет с origin, кэширует по заголовкам.
3. Повторные запросы в регионе — **HIT** без origin round-trip.
4. **Cache key** — URL + query + часто `Vary` (Accept-Encoding, Accept).
5. **Stale content** — `stale-while-revalidate` обновляет в фоне.
6. **Dynamic acceleration** — оптимизация маршрута к origin (меньше RTT).

### Практика и применение

- Статика фронта: `/_next/static`, `/assets/*` с `max-age=31536000, immutable`.
- **Versioned filenames** (`app.a1b2c3.js`) — агрессивный кэш без purge.
- **Image optimization** — resize, WebP/AVIF на лету (Cloudinary, imgix).
- **DDoS mitigation**, bot fight, geographic blocking.
- **Signed URLs** для приватного контента (CloudFront signed cookies).

### Важные нюансы и краеугольные камни

- Кэшировать **HTML с Set-Cookie** персональным — утечка между пользователями.
- Забыть **purge** после критического hotfix JS.
- **Cache poisoning** — неправильный `Vary`, Host header attacks (mitigate на CDN).
- **HTTPS** на CDN — cert на edge, origin cert отдельно.
- Стоимость **egress** и запросов — мониторинг bill.
- `private` / `no-store` — не кэшировать API с PII.

### Примеры

```http
# Origin response — CDN будет кэшировать по директивам
HTTP/1.1 200 OK
Content-Type: application/javascript
Cache-Control: public, max-age=31536000, immutable

# HTML — короткий TTL или no-cache
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

```html
<!-- Подключение статики через CDN -->
<script src="https://cdn.example.com/app.v3.js" crossorigin></script>
<link rel="stylesheet" href="https://cdn.example.com/styles.v3.css" />
```

```javascript
// Cache busting при деплое — hash в имени файла (Vite/Webpack)
// dist/assets/index-a8f3c2.js → автоматически long cache safe
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Cache hit ratio?** — метрика эффективности CDN.
- **Разница CDN и reverse proxy?** — CDN = географически распределённый proxy+cache.
- **Как инвалидировать кэш?** — purge API, versioned assets.
- **Anycast vs GeoDNS?** — маршрутизация к ближайшему PoP.
- **CDN и CORS?** — `Access-Control-Allow-Origin` на edge или origin.

### Красные флаги (чего не говорить)

- «CDN только для картинок» — JS/CSS/video/API caching.
- «CDN заменяет origin» — origin обязателен; CDN кэширует.
- Кэшировать **авторизованные API** без понимания `private`/`Vary`.

### Связанные темы

- `001-chto-takoe-http.md`, `006-raznica-http-i-https.md`
- `014-ip-adres.md`, `024-chto-takoe-api.md`
