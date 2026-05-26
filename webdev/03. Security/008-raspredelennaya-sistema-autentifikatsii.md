# Q008. Что такое "распределенная система аутентификации"?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**Распределённая система аутентификации** — архитектура, при которой аутентификация вынесена в отдельный централизованный сервис (Identity Provider, IdP), а множество приложений и сервисов доверяют его решениям, не храня учётные данные самостоятельно. Реализуется через протоколы **OAuth 2.0**, **OpenID Connect (OIDC)** и **SAML**. Ключевой паттерн — **SSO (Single Sign-On)**: пользователь логинится один раз, получает доступ ко всем связанным системам.

---

## Развёрнутый ответ

### Суть и мотивация

В монолитном приложении аутентификация централизована внутри одного сервиса. В микросервисной архитектуре и корпоративных экосистемах нужно решить задачу: как 50 сервисов узнают, что пользователь аутентифицирован, не заставляя его вводить пароль 50 раз?

```
Без распределённой аутентификации:
  Сервис A ← логин
  Сервис B ← логин (снова)
  Сервис C ← логин (снова)

С SSO / IdP:
  IdP ← один логин
  Сервис A ← доверяет IdP-токену ✅
  Сервис B ← доверяет IdP-токену ✅
  Сервис C ← доверяет IdP-токену ✅
```

### Ключевые протоколы

#### OAuth 2.0 + OpenID Connect (OIDC)

```
Authorization Code Flow (для веб-приложений):

1. Пользователь нажимает "Войти через Google"
2. Приложение перенаправляет на IdP (Google) с параметрами:
   GET https://accounts.google.com/oauth2/auth
     ?response_type=code
     &client_id=...
     &redirect_uri=https://myapp.com/callback
     &scope=openid email profile
     &state=<csrf_token>
     &code_challenge=<pkce_challenge>

3. Пользователь вводит пароль у Google
4. Google перенаправляет на redirect_uri с code
5. Приложение обменивает code на токены:
   POST https://oauth2.googleapis.com/token
     code=..., client_id=..., client_secret=..., code_verifier=...

6. Получает: access_token, id_token (JWT с данными пользователя), refresh_token
```

```typescript
// Верификация id_token от Google
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  // payload.sub — уникальный Google ID пользователя
  // payload.email, payload.name — данные профиля
  return payload;
}
```

#### JWT как Inter-Service Token (микросервисы)

```typescript
// API Gateway проверяет JWT и добавляет заголовок с userId
// Внутренние сервисы доверяют этому заголовку (Zero Trust: тоже можно проверять)

// Service A (payments) → Service B (notifications)
async function notifyUser(userId: string, message: string) {
  await fetch('http://notifications-service/api/notify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${await generateServiceToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message }),
  });
}

// Генерация service-to-service токена (short-lived)
function generateServiceToken(): string {
  return jwt.sign(
    { service: 'payments', iss: 'auth-service' },
    process.env.SERVICE_SECRET!,
    { expiresIn: '5m' },
  );
}
```

#### SAML (используется в корпоративном SSO)

```
Типичный флоу (SP-initiated):
1. Пользователь → Service Provider (SP): GET /protected-resource
2. SP → IdP: SAMLRequest (XML, base64-encoded)
3. IdP → Пользователь: форма логина
4. Пользователь → IdP: credentials
5. IdP → SP: SAMLResponse с Assertion (XML с подписью)
6. SP верифицирует подпись IdP → выдаёт сессию
```

### Компоненты архитектуры

```
[Client App]
     ↓
[API Gateway / BFF]     ← проверяет JWT access_token
     ↓
[Auth Service / IdP]    ← Auth0, Keycloak, Cognito, собственный
  - выдаёт токены
  - управляет сессиями
  - хранит пользователей
     ↓
[Resource Services]     ← проверяют JWT через JWKS endpoint
  Service A
  Service B
  Service C
```

### JWKS (JSON Web Key Set)

```typescript
// Сервисы получают публичные ключи IdP для верификации JWT
// без хранения секретных ключей у каждого сервиса

import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

const client = jwksClient({
  jwksUri: 'https://your-idp.com/.well-known/jwks.json',
  cache: true,
  rateLimit: true,
});

async function verifyToken(token: string) {
  const decoded = jwt.decode(token, { complete: true });
  const kid = decoded?.header.kid;
  
  const key = await client.getSigningKey(kid);
  const publicKey = key.getPublicKey();
  
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}
```

### Популярные IdP-решения

| Решение | Тип | Когда использовать |
|---------|-----|-------------------|
| Auth0 | SaaS | Быстрый старт, enterprise features |
| Keycloak | Self-hosted | Полный контроль, on-premise требование |
| AWS Cognito | Cloud | AWS-экосистема |
| Okta | Enterprise SaaS | Корпоративный SSO |
| Supabase Auth | SaaS + open | Стартапы, self-hostable |

### Важные нюансы

- **Token introspection** — для opaque токенов сервис запрашивает IdP для проверки (в отличие от JWT, где верификация локальная)
- **Token refresh** — access tokens короткоживущие (5-15 мин); refresh token хранится безопасно и используется для получения нового access token без повторного логина
- **Federated logout** — при логауте нужно инвалидировать сессии во всех связанных SP (front-channel / back-channel logout в OIDC)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как реализовать logout в SSO?** — Back-channel logout: IdP уведомляет все SP об инвалидации сессии через серверный запрос; front-channel: через iframe/redirect к каждому SP.
- **OAuth 2.0 PKCE — зачем нужен?** — Proof Key for Code Exchange: защита от перехвата authorization code в публичных клиентах (SPA, mobile); code_challenge делает перехваченный code бесполезным без code_verifier.
- **Как защититься от Token Leakage в микросервисах?** — Короткий TTL, mTLS для service-to-service, logging токен-активности, audience validation (`aud` claim в JWT).
- **Разница между IdP и SP?** — IdP (Identity Provider) — выдаёт токены и аутентифицирует; SP (Service Provider) — потребляет токены и доверяет IdP.

### Красные флаги (чего не говорить)

- «Каждый микросервис хранит пароли пользователей» — это антипаттерн, нарушающий centralized identity management.
- «OAuth 2.0 — это протокол аутентификации» — нет, это протокол авторизации; для аутентификации нужен OIDC поверх OAuth 2.0.
- Не знать разницу между access_token и id_token в OIDC.

### Связанные темы

- `006-raznica-identifikatsiya-autentifikatsiya-avtorizatsiya.md`
- `007-vidy-autentifikatsii.md`
- `009-chto-takoe-tokeny-jwt.md`
