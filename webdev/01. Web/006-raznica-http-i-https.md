# Q006. Разница между `HTTP` и `HTTPS`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**HTTP** передаёт запросы и ответы в **открытом виде** по TCP (порт 80). **HTTPS** — это HTTP поверх **TLS** (Transport Layer Security): те же методы и заголовки, но трафик **шифруется**, проверяется **целостность**, сервер (и опционально клиент) **аутентифицируется** сертификатом. Порт по умолчанию 443. Без HTTPS возможны перехват, подмена (MITM) и утечка cookies/токенов.

---

## Развёрнутый ответ

### Суть и определение

HTTPS = HTTP + TLS. TLS (преемник SSL) работает между транспортом (TCP/QUIC) и приложением. Браузер показывает замок при валидной цепочке сертификатов до доверенного CA.

### Как это работает

1. **TCP connect** к :443 (или QUIC для HTTP/3).
2. **TLS handshake** — согласование версии, cipher suite, обмен ключами (часто ECDHE), проверка сертификата (CN/SAN, срок, цепочка).
3. **Application data** — зашифрованные HTTP-сообщения (в HTTP/2 — фреймы внутри TLS).
4. **HSTS** — заголовок `Strict-Transport-Security` заставляет браузер всегда использовать HTTPS.
5. **Mixed content** — HTTP-ресурсы на HTTPS-странице блокируются или понижаются.

### Практика и применение

- Let's Encrypt / ACME — бесплатные сертификаты, автообновление (certbot, Caddy).
- **TLS termination** на load balancer (nginx, Cloudflare) — расшифровка на edge, HTTP внутри VPC (риск, если сеть скомпрометирована).
- **mTLS** — взаимная аутентификация сервисов в mesh (Kubernetes, service mesh).
- Обязателен для **Secure** cookies, Web Crypto, многих PWA API.

### Важные нюансы и краеугольные камни

- Шифрование ≠ авторизация — HTTPS не заменяет login/JWT.
- **Слабые cipher / TLS 1.0** — отключать на проде (минимум TLS 1.2, лучше 1.3).
- **Self-signed** в dev — браузер предупреждает; в prod недопустимо без доверия.
- **Performance** — TLS 1.3 + session resumption (0-RTT осторожно с replay).
- Редирект HTTP→HTTPS должен быть **301/308**, не только JS.

### Примеры

```nginx
# nginx: редирект и TLS
server {
  listen 80;
  server_name example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  ssl_certificate     /etc/ssl/fullchain.pem;
  ssl_certificate_key /etc/ssl/privkey.pem;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

```javascript
// Браузер блокирует mixed content — используйте относительные URL или https:
const api = import.meta.env.PROD
  ? 'https://api.example.com'
  : 'http://localhost:3000';
```

---

## Сравнение

| Критерий | HTTP | HTTPS |
|----------|------|-------|
| Шифрование | Нет | TLS |
| Порт (по умолчанию) | 80 | 443 |
| Защита от MITM | Нет | Да (при валидном cert) |
| SEO / браузеры | Deprecated для ввода данных | Стандарт |
| Overhead | Меньше | Handshake + crypto (TLS 1.3 ~1 RTT) |
| Сертификат | Не нужен | Нужен (публичный CA или private PKI) |
| HTTP/2, HTTP/3 | Возможно (реже без TLS в браузерах) | Де-факто обязателен в вебе |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что проверяет браузер в сертификате?** — цепочка, срок, домен (SAN), отзыв (OCSP stapling).
- **TLS termination где лучше?** — edge vs end-to-end в зависимости от compliance.
- **Что такое HSTS preload?** — список доменов с принудительным HTTPS.
- **HTTP/3 и TLS?** — QUIC встроил шифрование (TLS 1.3), отдельный TLS поверх TCP не нужен.
- **Разница SSL и TLS?** — SSL устарел, говорят TLS.

### Красные флаги (чего не говорить)

- «HTTPS только для паролей» — весь трафик с cookies/токенами уязвим.
- «Самоподписанный сертификат на проде норм» — без доверия пользователей MITM возможен.
- Путать **шифрование** с **хешированием паролей** на сервере.

### Связанные темы

- `001-chto-takoe-http.md`, `007-raznica-http1-i-http2.md`
- `009-http3.md`, `011-trehstoronnee-rukopozhatie.md`
