# Q009. Что такое токены JWT? Как их можно использовать для аутентификации пользователей?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**JWT (JSON Web Token)** — стандарт RFC 7519 для компактной, самодостаточной передачи информации между сторонами в виде JSON-объекта с цифровой подписью. Состоит из трёх частей: **Header** (алгоритм), **Payload** (claims/данные), **Signature** (подпись). Для аутентификации: сервер генерирует JWT после логина, клиент отправляет его в каждом запросе, сервер проверяет подпись локально без обращения к БД.

---

## Развёрнутый ответ

### Структура JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTYwMDAwMDAsImV4cCI6MTcxNjAwOTAwMH0
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

[Header].[Payload].[Signature]
```

**Header** (base64url-декодированный):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (base64url-декодированный):
```json
{
  "userId": "123",
  "role": "admin",
  "iat": 1716000000,
  "exp": 1716009000,
  "iss": "https://auth.myapp.com",
  "aud": "https://api.myapp.com"
}
```

**Signature**:
```
HMACSHA256(
  base64url(header) + "." + base64url(payload),
  secret
)
```

### Флоу аутентификации с JWT

```
1. POST /api/auth/login { email, password }
2. Сервер: проверяет credentials → генерирует access + refresh токены
3. Ответ: { accessToken: "eyJ..." } + Set-Cookie: refreshToken=...; HttpOnly; Secure
4. Клиент: хранит accessToken в памяти (не localStorage!)
5. Запрос: Authorization: Bearer eyJ...
6. Сервер: верифицирует подпись локально → извлекает userId, role → обрабатывает запрос
7. После истечения TTL: POST /api/auth/refresh (с refreshToken из cookie)
8. Сервер: выдаёт новый accessToken
```

### Реализация

```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: 'user' | 'admin';
}

// Генерация пары токенов
function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role } satisfies TokenPayload,
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: '15m',
      algorithm: 'RS256', // ассиметричный: приватный ключ подписывает, публичный верифицирует
      issuer: 'https://auth.myapp.com',
      audience: 'https://api.myapp.com',
    },
  );

  const refreshToken = jwt.sign(
    { userId, tokenFamily: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d', algorithm: 'RS256' },
  );

  return { accessToken, refreshToken };
}

// Middleware верификации
function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_PUBLIC_KEY!, {
      algorithms: ['RS256'],
      issuer: 'https://auth.myapp.com',
      audience: 'https://api.myapp.com',
    }) as TokenPayload;

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Access + Refresh Token Pattern

```typescript
// Refresh Token Rotation — защита от Token Theft
app.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_PUBLIC_KEY!) as {
      userId: string;
      tokenFamily: string;
    };

    // Проверяем, что tokenFamily не в blacklist (не был уже использован)
    const isRevoked = await tokenStore.isRevoked(payload.tokenFamily);
    if (isRevoked) {
      // Возможная компрометация — инвалидируем все токены пользователя
      await tokenStore.revokeAllForUser(payload.userId);
      return res.status(401).json({ error: 'Token reuse detected' });
    }

    // Инвалидируем старый tokenFamily, генерируем новые токены
    await tokenStore.revoke(payload.tokenFamily);
    const tokens = generateTokens(payload.userId, 'user');

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

### HS256 vs RS256

| Аспект | HS256 (HMAC) | RS256 (RSA) |
|--------|-------------|------------|
| Тип | Симметричный | Ассиметричный |
| Ключи | Один секрет | Приватный (подпись) + публичный (верификация) |
| Где использовать | Один сервис | Микросервисы, внешние клиенты |
| Безопасность | Секрет нужно передать всем верификаторам | Публичный ключ можно публиковать (JWKS) |

### Важные нюансы

- **JWT не шифрует** payload — только подписывает. Payload виден всем, кто имеет токен (base64url — не шифрование). Не хранить sensitive данные в payload.
- **Алгоритм `alg: none`** — исторически уязвимость: библиотеки принимали токены без подписи. Всегда явно указывать разрешённые алгоритмы при верификации.
- **Logout проблема** — JWT нельзя инвалидировать без blacklist (stateless природа). Решение: короткий TTL access token + blacklist для refresh.
- **`exp` claim** — обязателен, всегда проверять.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Где хранить JWT на клиенте?** — accessToken: в памяти (React state / closure). refreshToken: в httpOnly cookie. localStorage уязвим к XSS, cookie с httpOnly — нет.
- **Как реализовать logout с JWT?** — Короткий TTL, refresh token blacklist в Redis, при логауте инвалидировать refreshToken.
- **Что такое JWE?** — JSON Web Encryption — зашифрованный JWT (в отличие от JWS — только подписанного); payload недоступен без ключа.
- **Как JWT работает в микросервисах?** — Каждый сервис верифицирует JWT локально через публичный ключ (JWKS endpoint); не нужно обращаться к auth-сервису на каждый запрос.

### Красные флаги (чего не говорить)

- «JWT зашифрован» — нет, только подписан; payload читается через base64.
- «Храним JWT в localStorage — это норм» — уязвимо к XSS.
- «JWT можно использовать вечно — так удобнее» — токены без `exp` — критическая уязвимость.
- Путать подпись и шифрование.

### Связанные темы

- `007-vidy-autentifikatsii.md`
- `008-raspredelennaya-sistema-autentifikatsii.md`
- `011-secure-i-httponly-cookies.md`
