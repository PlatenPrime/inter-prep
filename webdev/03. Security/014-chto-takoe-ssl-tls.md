# Q014. Что такое `SSL`/`TLS`? Зачем они используются в веб-разработке?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**TLS (Transport Layer Security)** — криптографический протокол, обеспечивающий **конфиденциальность** (шифрование данных), **целостность** (защита от подмены) и **аутентификацию сервера** (через цифровые сертификаты) при передаче данных по сети. **SSL** — предшественник TLS, устаревший и уязвимый; термины часто используются взаимозаменяемо в быту, но в производстве всегда должен быть TLS 1.2+ (рекомендуется 1.3). HTTPS = HTTP поверх TLS.

---

## Развёрнутый ответ

### SSL vs TLS: история и версии

| Версия | Год | Статус |
|--------|-----|--------|
| SSL 2.0 | 1995 | Устарел, запрещён (RFC 6176) |
| SSL 3.0 | 1996 | Устарел (POODLE атака, RFC 7568) |
| TLS 1.0 | 1999 | Устарел (BEAST, RFC 8996) |
| TLS 1.1 | 2006 | Устарел (RFC 8996) |
| TLS 1.2 | 2008 | Актуален, минимум для production |
| TLS 1.3 | 2018 | Рекомендуется, быстрее и безопаснее |

### TLS Handshake (упрощённо)

**TLS 1.2 (Full Handshake — 2 RTT):**
```
Client                          Server
  |                               |
  |-- ClientHello --------------→ |  (TLS version, cipher suites, random)
  |← ServerHello, Certificate -- |  (выбранный cipher, сертификат)
  |← ServerHelloDone ----------- |
  |                               |
  | [Клиент проверяет сертификат] |
  |-- ClientKeyExchange --------→ |  (pre-master secret, зашифрован публ. ключом)
  |-- ChangeCipherSpec ---------→ |
  |-- Finished (encrypted) ----→ |
  |← ChangeCipherSpec ---------- |
  |← Finished (encrypted) ------ |
  |                               |
  |=== Encrypted HTTP data ====→ |
```

**TLS 1.3 (1 RTT, zero-RTT resumption):**
```
Client                          Server
  |                               |
  |-- ClientHello + KeyShare ---→ |  (DH params уже в первом сообщении)
  |← ServerHello + KeyShare ---- |
  |← Certificate + Finished ---- |
  |                               |
  |-- Finished -----------------→ |
  |=== Encrypted HTTP data ====→ |
```

TLS 1.3: меньше roundtrip'ов, убраны устаревшие cipher suites, forward secrecy обязателен.

### Компоненты TLS

**X.509 Сертификат** — доказательство личности сервера:
```
Сертификат содержит:
- Subject (CN=myapp.com)
- Public Key (RSA 2048+ или ECDSA P-256)
- Validity (Not Before / Not After)
- Issuer (кто подписал: Let's Encrypt, DigiCert...)
- Subject Alternative Names (SAN: myapp.com, www.myapp.com)
- Serial Number
- Signature (подпись CA)
```

**Цепочка доверия:**
```
Root CA (в хранилище браузера/ОС)
  └→ Intermediate CA (выдан Root CA)
        └→ End-entity certificate (выдан Intermediate CA)
               Subject: myapp.com
```

**Типы сертификатов:**
| Тип | Проверка | Стоимость | Применение |
|-----|----------|-----------|-----------|
| DV (Domain Validated) | Только владение доменом | Бесплатно (Let's Encrypt) | Большинство сайтов |
| OV (Organization Validated) | Организация + домен | Платно | Корпоративные сайты |
| EV (Extended Validation) | Полная проверка | Дорого | Банки, госсайты |
| Wildcard | Домен + поддомены | Платно | *.myapp.com |

### Практика: настройка TLS в Node.js

```typescript
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// В production обычно TLS терминируется на nginx/load balancer, не в приложении
// Но для понимания:
const server = https.createServer({
  key: fs.readFileSync('/etc/ssl/private/myapp.key'),
  cert: fs.readFileSync('/etc/ssl/certs/myapp.crt'),
  ca: fs.readFileSync('/etc/ssl/certs/chain.pem'), // Intermediate CA
  
  // TLS options
  minVersion: 'TLSv1.2',
  cipherSuites: [
    'TLS_AES_128_GCM_SHA256',       // TLS 1.3
    'TLS_AES_256_GCM_SHA384',       // TLS 1.3
    'ECDHE-RSA-AES256-GCM-SHA384',  // TLS 1.2
    'ECDHE-RSA-AES128-GCM-SHA256',  // TLS 1.2
  ].join(':'),
}, app);

server.listen(443);
```

### nginx: рекомендуемая конфигурация

```nginx
server {
    listen 443 ssl http2;
    server_name myapp.com;

    ssl_certificate     /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off; # TLS 1.3 сам выбирает

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$host$request_uri;
}
```

### HSTS (HTTP Strict Transport Security)

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- Браузер запоминает, что сайт только HTTPS
- Следующие 31536000 секунд (1 год) — никаких HTTP-запросов даже при явном вводе `http://`
- `includeSubDomains` — применяется ко всем поддоменам
- `preload` — внесение в список браузеров (chromium, firefox), HTTPS даже при первом посещении

### Важные нюансы

- **Certificate Pinning** — клиент хранит fingerprint ожидаемого сертификата; защита от MitM с поддельным сертификатом; риски при ротации сертификата
- **Forward Secrecy (PFS)** — обязателен в TLS 1.3; обмен ключами через Diffie-Hellman Ephemeral; перехваченный трафик нельзя расшифровать даже при компрометации приватного ключа в будущем
- **Let's Encrypt** — бесплатные DV сертификаты с автоматической ротацией каждые 90 дней через ACME protocol; certbot, cert-manager в K8s
- **mTLS** — взаимная аутентификация: сервер проверяет сертификат клиента (не только клиент — сервера); используется в service mesh (Istio, Linkerd)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое TLS termination?** — Расшифровка TLS на уровне load balancer / reverse proxy (nginx, AWS ALB); внутри сети трафик идёт по HTTP; упрощает управление сертификатами.
- **Чем опасен SSL stripping?** — Атака MitM перехватывает HTTP-запрос к myapp.com до редиректа на HTTPS и остаётся посредником; HSTS защищает от этого.
- **Как работает Certificate Transparency?** — Все сертификаты должны быть записаны в публичный лог CT; браузеры проверяют наличие записи; защита от мошеннических сертификатов.
- **Что такое OCSP Stapling?** — Сервер заранее получает от CA подтверждение валидности сертификата и прикрепляет его к TLS handshake; устраняет задержку от запроса клиента к CA.

### Красные флаги (чего не говорить)

- «SSL и TLS — это одно и то же» — SSL устарел и уязвим; корректно говорить TLS.
- «HTTPS защищает от XSS и CSRF» — HTTPS шифрует транспорт, но не защищает от атак на уровне приложения.
- «Самоподписанный сертификат безопасен» — не проверяется цепочкой доверия; браузер показывает предупреждение; не защищает от MitM.

### Связанные темы

- `010-chto-takoe-same-origin-policy.md`
- `018-http-zagolovki-dlya-bezopasnosti.md`
- `015-chto-takoe-cors.md`
