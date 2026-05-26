# Q006. Разница между идентификацией, аутентификацией, авторизацией?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**Идентификация** — «кто ты?» (пользователь называет свой логин или email). **Аутентификация** — «докажи, что ты это ты» (проверка пароля, OTP, биометрии). **Авторизация** — «что тебе разрешено?» (проверка прав доступа к конкретному ресурсу). Все три этапа последовательны: сначала установить личность, затем её подтвердить, затем определить уровень доступа.

---

## Развёрнутый ответ

### Суть каждого понятия

**Идентификация (Identification)**
- Пользователь предъявляет свой идентификатор: логин, email, username, userId
- Система находит запись в БД: «такой пользователь существует»
- Не подтверждает, что это именно тот человек

**Аутентификация (Authentication / AuthN)**
- Система проверяет факторы, доказывающие личность
- Факторы: знание (пароль), владение (OTP-устройство), принадлежность (биометрия)
- Результат: сессия / токен, подтверждающий личность

**Авторизация (Authorization / AuthZ)**
- Происходит после успешной аутентификации
- Определяет, какие ресурсы и действия разрешены данному пользователю
- Механизмы: RBAC, ABAC, ACL, Policy-based

### Схема последовательности

```
Пользователь → вводит login/email    → Идентификация (кто?)
              → вводит пароль/OTP    → Аутентификация (это правда он?)
              → запрашивает ресурс   → Авторизация (разрешено ли?)
```

### Пример кода

```typescript
// Middleware цепочка в Express
app.get('/api/admin/users', 
  identifyUser,      // шаг 1: найти пользователя по токену
  authenticateUser,  // шаг 2: проверить подлинность токена
  authorizeAdmin,    // шаг 3: проверить права
  getUsers,
);

// Идентификация — извлечение userId из токена
async function identifyUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.decode(token) as { userId: string } | null;
    if (!decoded?.userId) return res.status(401).json({ error: 'Invalid token format' });
    
    req.userId = decoded.userId; // идентифицировали — знаем userId
    next();
  } catch {
    res.status(401).json({ error: 'Cannot identify user' });
  }
}

// Аутентификация — проверка подписи токена
async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    const verified = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload;
    req.user = await db.users.findById(verified.userId); // убеждаемся, что пользователь существует
    next();
  } catch {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Авторизация — проверка прав
function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.roles.includes('admin')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
}
```

### Коды ошибок HTTP

```
401 Unauthorized — ошибка аутентификации (не доказал личность)
                   (название misleading — правильнее было бы 401 Unauthenticated)
403 Forbidden     — ошибка авторизации (доказал личность, но нет прав)
```

### Важные нюансы

- **401 vs 403** — частая путаница: 401 = не аутентифицирован, 403 = аутентифицирован, но не авторизован
- **Authentication != Authorization** — системы OAuth 2.0 и OpenID Connect специально разделяют: OIDC отвечает за AuthN (кто ты), OAuth — за AuthZ (что тебе разрешено)
- **Re-authentication** — для критичных операций (смена пароля, платёж) стоит запросить повторную аутентификацию, даже если пользователь уже залогинен
- **Federation** — сторонний Identity Provider (Google, Auth0) берёт на себя идентификацию и аутентификацию; ваше приложение доверяет их утверждениям и занимается только авторизацией

---

## Сравнение

| Критерий | Идентификация | Аутентификация | Авторизация |
|----------|---------------|----------------|-------------|
| Вопрос | Кто ты? | Это правда ты? | Что тебе можно? |
| Данные | Логин, email, ID | Пароль, OTP, биометрия | Роли, permissions |
| Протоколы | — | OIDC, SAML, WebAuthn | OAuth 2.0, RBAC, ABAC |
| HTTP-ошибка | — | 401 | 403 |
| Момент | До логина | Во время логина | После логина |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем отличается OAuth 2.0 от OpenID Connect?** — OAuth 2.0 — фреймворк авторизации (даёт доступ к ресурсу); OIDC — расширение OAuth для аутентификации (говорит, кто пользователь через `id_token`).
- **Что такое SSO?** — Single Sign-On: пользователь аутентифицируется один раз у Identity Provider и получает доступ ко всем связанным сервисам без повторного ввода пароля.
- **Что такое RBAC vs ABAC?** — RBAC: права по ролям (admin может всё); ABAC: права по атрибутам (пользователь из EU может читать данные EU-пользователей).
- **Почему 401 называется Unauthorized, а не Unauthenticated?** — Историческая ошибка в стандарте HTTP; семантически 401 означает «не аутентифицирован».

### Красные флаги (чего не говорить)

- Путать аутентификацию и авторизацию — это очень базовая концепция для любого разработчика.
- «401 — нет прав, 403 — не залогинен» — это наоборот.
- «После аутентификации пользователь автоматически имеет все права» — авторизация — отдельный слой.

### Связанные темы

- `007-vidy-autentifikatsii.md`
- `008-raspredelennaya-sistema-autentifikatsii.md`
- `009-chto-takoe-tokeny-jwt.md`
