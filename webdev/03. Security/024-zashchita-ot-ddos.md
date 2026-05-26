# Q024. Как можно защищаться от DDoS-атак (Distributed Denial of Service)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**DDoS (Distributed Denial of Service)** — атака на доступность: множество скомпрометированных машин (ботнет) перегружают сервер запросами, вызывая отказ в обслуживании. Защита: **Rate Limiting** (ограничение запросов), **WAF** (Web Application Firewall), **CDN/Anycast** (распределение трафика), **IP-блокировка** и **черные списки**, специализированные **Anti-DDoS сервисы** (Cloudflare, AWS Shield). Полная защита от мощных DDoS требует инфраструктурных решений, а не только кода.

---

## Развёрнутый ответ

### Типы DDoS-атак

| Тип | Уровень OSI | Механизм |
|-----|-------------|---------|
| Volumetric (UDP Flood, DNS Amplification) | L3/L4 | Переполнение пропускной способности |
| Protocol (SYN Flood, Ping of Death) | L3/L4 | Исчерпание ресурсов протокола |
| Application (HTTP Flood, Slowloris) | L7 | Исчерпание ресурсов приложения |
| Slowloris | L7 | Медленные запросы, занимают соединения |

L7-атаки сложнее обнаружить (трафик выглядит легитимно), L3/L4 требуют сетевых решений.

### 1. Rate Limiting (основной уровень приложения)

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

// Общий rate limit для всех запросов
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 1000,                 // 1000 запросов с одного IP
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() / 1000),
    });
  },
});

// Строгий лимит для login (защита от brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true, // не считаем успешные логины
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});

// Лимит для поиска (тяжелые запросы)
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});

app.use(generalLimiter);
app.post('/api/auth/login', loginLimiter, loginHandler);
app.get('/api/search', searchLimiter, searchHandler);
```

### 2. Защита от Slowloris

```typescript
// Slowloris держит соединения открытыми, отправляя данные очень медленно
// Защита: таймауты на соединения

import http from 'http';

const server = http.createServer(app);

// Таймаут на чтение заголовков (по умолчанию 60s в Node.js — слишком долго)
server.headersTimeout = 10000; // 10 секунд
server.requestTimeout = 30000; // 30 секунд для тела запроса
server.keepAliveTimeout = 5000; // keepalive соединение

// Лучше: использовать nginx как reverse proxy с собственными таймаутами
```

```nginx
# nginx: защита от Slowloris
http {
    client_body_timeout   10s;
    client_header_timeout 10s;
    keepalive_timeout     5s 5s;
    send_timeout          10s;
    
    # Ограничение размера тела запроса
    client_max_body_size  1m;
    
    # Rate limiting на уровне nginx
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            limit_req_status 429;
        }
    }
}
```

### 3. Cloudflare и CDN-защита

```
CDN/Anycast маршрутизация:
  Запросы распределяются по 200+ дата-центрам Cloudflare
  Атака, требующая 100Gbps, рассредоточивается → каждый DC получает ~0.5Gbps
  
Cloudflare защита:
  - Anycast absorption (L3/L4)
  - WAF правила (L7)
  - Bot Management (распознавание ботов)
  - Under Attack Mode: JavaScript Challenge для всех
  - Rate Limiting rules
  - IP Reputation blocking (known bad actors)
```

### 4. WAF (Web Application Firewall)

```typescript
// AWS WAF правила (Infrastructure as Code, CDK)
const webAcl = new wafv2.CfnWebACL(this, 'WebAcl', {
  scope: 'CLOUDFRONT',
  defaultAction: { allow: {} },
  rules: [
    {
      name: 'AWSManagedRulesCommonRuleSet',
      priority: 1,
      overrideAction: { none: {} },
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesCommonRuleSet',
        },
      },
      visibilityConfig: { /* ... */ },
    },
    {
      name: 'RateLimitRule',
      priority: 2,
      action: { block: {} },
      statement: {
        rateBasedStatement: {
          limit: 2000,          // 2000 запросов за 5 мин с одного IP
          aggregateKeyType: 'IP',
        },
      },
    },
  ],
});
```

### 5. IP Blocking и черные списки

```typescript
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

// Middleware: проверка черного списка IP
async function ipBlockMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? req.socket.remoteAddress ?? '';
  
  const isBlocked = await redis.get(`blocked:${ip}`);
  if (isBlocked) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
}

// Автоматическая блокировка при превышении лимита
async function autoBlockIp(ip: string, reason: string) {
  await redis.setEx(`blocked:${ip}`, 24 * 60 * 60, reason); // блокировка на 24 часа
  logger.warn('IP auto-blocked', { ip, reason });
}
```

### 6. CAPTCHA для подозрительных запросов

```typescript
import { RecaptchaV3 } from 'express-recaptcha';

const recaptcha = new RecaptchaV3(
  process.env.RECAPTCHA_SITE_KEY!,
  process.env.RECAPTCHA_SECRET_KEY!,
  { score: 0.5 } // минимальный score для прохождения
);

// Включаем CAPTCHA для login при высокой нагрузке
app.post('/api/auth/login', recaptcha.middleware.verify, (req, res) => {
  if (!req.recaptcha?.data || req.recaptcha.data.score < 0.5) {
    return res.status(403).json({ error: 'Bot detected' });
  }
  // ... обычный логин
});
```

### 7. Мониторинг и оповещения

```typescript
// Метрики для обнаружения DDoS
// Prometheus + Grafana или Datadog

app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const labels = {
      method: req.method,
      route: req.route?.path ?? 'unknown',
      status: res.statusCode,
    };
    
    httpRequestDuration.observe(labels, duration / 1000);
    httpRequestTotal.inc(labels);
    
    // Алерт при аномальном количестве 429/503
    if (res.statusCode === 429) {
      rateLimitHits.inc({ ip: req.ip });
    }
  });
  
  next();
});
```

### Архитектура защиты

```
Internet
  ↓
Cloudflare (L3/L4 + WAF + Rate Limiting)
  ↓
CDN Edge Cache (статические ресурсы отдаются без нагрузки на origin)
  ↓
Load Balancer (nginx/AWS ALB — rate limiting + SSL termination)
  ↓
Application Servers (express rate-limiting, timeouts)
  ↓
Redis (shared rate limit state)
  ↓
Database (connection pooling — защита от DB connection flooding)
```

### Важные нюансы

- **Amplification атаки** — DNS/NTP amplification: небольшой запрос → ответ в 50-100x размере, направленный на жертву; защита: блокировать открытые DNS/NTP резолверы
- **BGP Blackholing** — при масштабной атаке провайдеры могут «обнулить» маршрут на IP жертвы; трафик атаки уходит в никуда
- **Economic DDoS** — атака не на доступность, а на счёт (cloud auto-scaling масштабируется под атаку → huge bill); AWS Shield Advanced защищает от этого
- **Rate limiting по пользователю** — IP не всегда уникален (NAT, IPv6); rate limit по userId или API key точнее

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как Rate Limiting на application уровне помогает против L3/L4 DDoS?** — Не помогает; L3/L4 атаки нужно останавливать на уровне провайдера/CDN. Rate limiting — только для L7.
- **Что такое Slowloris и как nginx защищает?** — Slowloris держит соединения открытыми медленными запросами; nginx с `client_header_timeout` и `keepalive_timeout` закрывает медленные соединения.
- **Как автоматически масштабироваться при DDoS в AWS?** — Auto Scaling + AWS Shield + WAF; но осторожно с "economic DDoS" — масштабирование = большой счёт.
- **Что такое Anycast?** — Несколько серверов имеют один IP; BGP маршрутизация направляет трафик в ближайший дата-центр; DDoS-трафик распределяется по всем точкам присутствия.

### Красные флаги (чего не говорить)

- «Rate limiting полностью защищает от DDoS» — против volumetric L3/L4 атак не поможет.
- «HTTPS защищает от DDoS» — HTTPS шифрует трафик, но не снижает нагрузку.
- «Просто увеличим серверы» — без распределённой защиты (CDN/Anycast) вертикальное масштабирование не спасёт от крупной атаки.

### Связанные темы

- `005-metody-povysheniya-bezopasnosti-veb-prilozhenii.md`
- `017-chto-takoe-content-security-policy-csp.md`
- `018-http-zagolovki-dlya-bezopasnosti.md`
