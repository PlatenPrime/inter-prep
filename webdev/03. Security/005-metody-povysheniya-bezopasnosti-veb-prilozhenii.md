# Q005. Методы повышения безопасности веб-приложений?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Методы повышения безопасности охватывают несколько слоёв: **валидация и санитизация входных данных**, **правильные HTTP-заголовки безопасности** (CSP, HSTS, X-Frame-Options), **защита аутентификации** (MFA, безопасные сессии), **шифрование данных** (at rest и in transit), **dependency scanning** и **регулярные pentest/аудиты**. Ни один из методов не является единственным достаточным — применяется Defense in Depth.

---

## Развёрнутый ответ

### 1. Валидация и санитизация входных данных

```typescript
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Строгая схема валидации на уровне API
const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  age: z.number().int().min(13).max(120),
});

app.post('/api/users', async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  // Работаем только с валидированными данными
  const { email, username, age } = parsed.data;
});

// Санитизация HTML-контента (если нужно сохранить разметку)
const safeHtml = DOMPurify.sanitize(userProvidedHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
  ALLOWED_ATTR: [],
});
```

### 2. HTTP Security Headers

```typescript
// Express — установка заголовков через helmet
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.trusted.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.myapp.com'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' }, // X-Frame-Options: DENY
  xssFilter: true,
  noSniff: true, // X-Content-Type-Options: nosniff
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

### 3. Безопасная аутентификация

```typescript
// Безопасное хранение паролей
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Rate limiting на login endpoint (защита от brute force)
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // не более 5 попыток с одного IP
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/auth/login', loginLimiter, loginHandler);

// Secure session cookie
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 часа
  },
}));
```

### 4. Параметризованные запросы (защита от SQL Injection)

```typescript
// ❌ Уязвимо
const users = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Параметризованный запрос (Postgres, MySQL, любая SQL БД)
const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// ✅ ORM (Prisma, TypeORM) параметризует автоматически
const user = await prisma.user.findUnique({ where: { email } });
```

### 5. Управление секретами

```typescript
// ❌ Секреты в коде
const JWT_SECRET = 'my-hardcoded-secret';
const DB_URL = 'postgresql://user:pass@localhost/db';

// ✅ Из переменных окружения, управляемых через секрет-менеджер
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env var is required');

// В production: AWS Secrets Manager, HashiCorp Vault, Doppler
// .env файлы — только для локальной разработки, в .gitignore
```

### 6. Dependency Security

```bash
# Регулярная проверка уязвимостей
npm audit
npm audit fix

# Более детальный инструмент
npx snyk test

# Автоматическое обновление (GitHub Dependabot / Renovate Bot)
# dependabot.yml в репозитории
```

### 7. CORS (настройка, а не отключение)

```typescript
import cors from 'cors';

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://myapp.com', 'https://admin.myapp.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 8. Логирование и мониторинг

```typescript
// Логировать попытки неавторизованного доступа, не логировать sensitive данные
logger.warn('Unauthorized access attempt', {
  ip: req.ip,
  path: req.path,
  userId: req.user?.id, // только ID, не полный объект
  timestamp: new Date().toISOString(),
  // НЕ логировать: пароли, токены, PII
});
```

### Практика и применение

Минимальный набор для production:
1. HTTPS с HSTS
2. Security headers (helmet)
3. Input validation (Zod/Joi)
4. Rate limiting
5. Bcrypt для паролей
6. CSRF-защита для форм
7. `npm audit` в CI/CD
8. Secrets из env vars

### Важные нюансы

- **Безопасность — это процесс**, а не состояние: регулярные pentest, patch management, security training
- Ошибки безопасности часто допускаются при **авральном деплое** — важно иметь security checklist для релизов
- **OWASP SAMM** (Software Assurance Maturity Model) — фреймворк для оценки зрелости процессов безопасности в команде

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как проводить security code review?** — Checklist из OWASP ASVS: проверить входные данные, авторизацию, логирование, обработку ошибок; искать инъекции, небезопасные прямые ссылки на объекты.
- **Что такое SAST vs DAST?** — SAST анализирует исходный код без запуска (Semgrep, SonarQube); DAST атакует запущенное приложение (OWASP ZAP, Burp Suite).
- **Как защитить API от злоупотреблений?** — Rate limiting, API keys с квотами, JWT с коротким TTL, мониторинг аномалий.
- **Что такое Secret Scanning?** — Автоматический поиск credentials в git-истории (GitHub Secret Scanning, TruffleHog, GitLeaks).

### Красные флаги (чего не говорить)

- «Валидация только на фронтенде» — сервер должен независимо валидировать всё, что получает.
- «CORS отключён для простоты разработки» — в production это критическая уязвимость.
- Называть только 1-2 метода (например, только HTTPS и авторизацию), не упоминая комплексный подход.

### Связанные темы

- `015-chto-takoe-cors.md`
- `017-chto-takoe-content-security-policy-csp.md`
- `018-http-zagolovki-dlya-bezopasnosti.md`
- `021-zashchita-ot-xss.md`
