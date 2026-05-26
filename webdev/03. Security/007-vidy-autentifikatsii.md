# Q007. Виды аутентификации?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Аутентификация делится по **факторам**: знание (пароль, PIN), владение (OTP, аппаратный ключ) и принадлежность (биометрия). По **числу факторов**: SFA (один фактор), MFA/2FA (два и более). По **механизму**: парольная, токенная (JWT, OAuth), сессионная (cookie-based), сертификатная (mTLS), биометрическая и federated (через сторонний IdP — Google, Auth0).

---

## Развёрнутый ответ

### Классификация по факторам

| Фактор | Что это | Примеры |
|--------|---------|---------|
| Knowledge (знание) | Что-то, что знает пользователь | Пароль, PIN, секретный вопрос |
| Possession (владение) | Что-то, чем владеет пользователь | OTP (TOTP/HOTP), SMS-код, YubiKey |
| Inherence (принадлежность) | Что-то неотъемлемое от пользователя | Отпечаток пальца, Face ID, голос |
| Location (место) | Откуда подключается | IP-диапазон, GPS |
| Behavior (поведение) | Поведенческие паттерны | Скорость набора, движение мыши |

**MFA (Multi-Factor Authentication)** — использование 2+ факторов из разных категорий. SMS-код + пароль — это НЕ надёжный MFA, т.к. оба могут быть перехвачены (SIM-swapping).

### Основные механизмы

#### 1. Парольная аутентификация (Password-based)

```typescript
// Хранение пароля: bcrypt с cost factor 12+
import bcrypt from 'bcrypt';

async function login(email: string, password: string) {
  const user = await db.users.findByEmail(email);
  if (!user) {
    // Timing attack: всегда выполняем сравнение, даже если пользователь не найден
    await bcrypt.compare(password, '$2b$12$placeholder_hash_to_prevent_timing');
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}
```

#### 2. Session-based (Cookie-based)

```
POST /login → сервер создаёт сессию → Set-Cookie: sessionId=abc123; HttpOnly; Secure
Каждый запрос → Cookie: sessionId=abc123 → сервер проверяет в Redis/DB → возвращает данные сессии
DELETE /logout → сервер удаляет сессию из хранилища
```

```typescript
// Express Session
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 86400000 },
}));
```

#### 3. Token-based (JWT / Bearer Token)

```typescript
// Генерация JWT при логине
const accessToken = jwt.sign(
  { userId: user.id, roles: user.roles },
  process.env.JWT_SECRET!,
  { expiresIn: '15m', algorithm: 'HS256' },
);

const refreshToken = jwt.sign(
  { userId: user.id, tokenFamily: uuid() },
  process.env.REFRESH_SECRET!,
  { expiresIn: '7d' },
);

// Клиент хранит accessToken в memory (не в localStorage!)
// refreshToken в httpOnly cookie
```

#### 4. TOTP (Time-based One-Time Password) — 2FA

```typescript
import { authenticator } from 'otplib';

// Регистрация: генерируем секрет, показываем QR для Google Authenticator
const secret = authenticator.generateSecret();
const otpAuthUrl = authenticator.keyuri(user.email, 'MyApp', secret);

// Верификация OTP при входе
function verifyOtp(token: string, secret: string): boolean {
  return authenticator.check(token, secret);
}
```

#### 5. OAuth 2.0 / OpenID Connect (Federated)

```typescript
// NextAuth.js — federated auth через Google
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Можно добавить дополнительную логику авторизации
      return true;
    },
  },
});
```

#### 6. WebAuthn / Passkeys (FIDO2)

```typescript
// Регистрация passkey (упрощённо)
const publicKeyCredentialCreationOptions = {
  challenge: crypto.randomBytes(32),
  rp: { name: 'My App', id: 'myapp.com' },
  user: { id: Buffer.from(user.id), name: user.email, displayName: user.name },
  pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256
  authenticatorSelection: {
    residentKey: 'required',
    userVerification: 'required',
  },
};
// Клиент: navigator.credentials.create({ publicKey: ... })
// Сервер: проверяет подпись публичным ключом
```

#### 7. mTLS (Mutual TLS)

Клиент и сервер взаимно аутентифицируют друг друга через X.509 сертификаты. Используется в микросервисных архитектурах (service-to-service auth) и корпоративных VPN.

### Важные нюансы

- **Refresh Token Rotation** — при обновлении access token, старый refresh token инвалидируется; если кто-то пытается использовать старый — это признак компрометации (Token Family)
- **Passwordless** (Magic Link, WebAuthn) — устраняет риски брутфорса паролей и phishing
- **SMS как 2FA фактор** — слабый из-за SIM-swapping и SS7-атак; NIST SP 800-63B не рекомендует SMS как единственный второй фактор

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Сессии vs JWT — что выбрать?** — Сессии: лёгкий logout (удалить из Redis), но стейтфул, нужен хранилище. JWT: статeless, масштабируется горизонтально, но logout сложен (нет механизма инвалидации без blacklist).
- **Где хранить JWT на клиенте?** — accessToken в памяти (memory), refreshToken в httpOnly cookie. localStorage уязвим к XSS.
- **Что такое Token Revocation для JWT?** — Blacklist в Redis, короткий TTL + refresh, JWKS rotation, опционально: jti (JWT ID) + blacklist таблица.
- **Что такое Passkeys?** — FIDO2/WebAuthn credentials, хранящиеся в устройстве; устойчивы к phishing (привязаны к origin), не требуют пароля.

### Красные флаги (чего не говорить)

- «Храним JWT в localStorage — так удобнее» — localStorage доступен из JS, уязвим к XSS.
- «SMS — это надёжный второй фактор» — подвержен SIM-swapping.
- «Выбираем bcrypt с cost 1 — он быстрее» — низкий cost factor означает, что brute force тоже быстрее.

### Связанные темы

- `006-raznica-identifikatsiya-autentifikatsiya-avtorizatsiya.md`
- `008-raspredelennaya-sistema-autentifikatsii.md`
- `009-chto-takoe-tokeny-jwt.md`
- `011-secure-i-httponly-cookies.md`
