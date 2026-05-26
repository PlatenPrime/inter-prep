# Q004. Что такое принцип наименьших привилегий (POLP)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**POLP (Principle of Least Privilege)** — каждый субъект системы (пользователь, процесс, сервис) должен иметь ровно те права, которые необходимы для выполнения его задач, и не более. Это ограничивает радиус поражения при компрометации: если злоумышленник захватит сервис с минимальными правами, он не получит доступа ко всей системе.

---

## Развёрнутый ответ

### Суть и определение

POLP формализован в стандартах безопасности (NIST SP 800-53, ISO 27001) и применяется ко всем уровням стека:

- **Пользователи** — видят только свои данные; администраторы — отдельные учётные записи
- **Сервисы/процессы** — читают только нужные файлы; пишут только в нужные директории
- **Базы данных** — сервис-аккаунт имеет `SELECT` там, где только читает
- **API-токены** — scope токена ограничен конкретными операциями
- **IAM роли в облаке** — минимальный набор permissions

### Применение на разных уровнях

**Уровень БД:**
```sql
-- ❌ Сервис использует суперпользователя
-- user: postgres (или root) — полный доступ ко всей БД

-- ✅ Создаём отдельного пользователя с минимальными правами
CREATE USER payments_service WITH PASSWORD 'strong_pass';
GRANT CONNECT ON DATABASE app TO payments_service;
GRANT USAGE ON SCHEMA public TO payments_service;
GRANT SELECT, INSERT ON TABLE transactions TO payments_service;
GRANT SELECT ON TABLE users TO payments_service;
-- payments_service НЕ может делать DROP, DELETE от transactions, читать таблицу admin_logs
```

**Уровень файловой системы:**
```typescript
// ❌ Node.js процесс запущен от root
// Если приложение взломают — атакующий получает root

// ✅ Dedicated user с правами только на нужные директории
// Dockerfile:
// RUN addgroup -S appgroup && adduser -S appuser -G appgroup
// RUN chown -R appuser:appgroup /app
// USER appuser
```

**Уровень AWS IAM:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-uploads-bucket/*"
    }
  ]
}
// ❌ НЕ используем AdministratorAccess или * на все ресурсы
```

**Уровень API-токенов:**
```typescript
// ❌ Один токен для всего
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // repo:all, admin:all

// ✅ Fine-grained токены с ограниченным scope
// GitHub Fine-grained PAT: только read:repo для конкретного репозитория
// Stripe webhook signing secret — только для верификации webhooks, не для создания платежей
```

**Уровень RBAC в приложении:**
```typescript
// Роли с минимальными правами для каждой функции
enum Role {
  VIEWER = 'viewer',     // только чтение
  EDITOR = 'editor',     // чтение + редактирование
  ADMIN = 'admin',       // всё выше + управление пользователями
}

const permissions: Record<Role, string[]> = {
  [Role.VIEWER]: ['posts:read', 'comments:read'],
  [Role.EDITOR]: ['posts:read', 'posts:write', 'comments:read', 'comments:write'],
  [Role.ADMIN]: ['posts:*', 'comments:*', 'users:*'],
};

function can(role: Role, action: string): boolean {
  return permissions[role].some(p => p === action || p === `${action.split(':')[0]}:*`);
}
```

### Just-in-Time (JIT) доступ

Для особо критичных операций — доступ выдаётся временно и только по запросу:

```typescript
// Пример с AWS IAM Roles Anywhere или Vault:
// Разработчик запрашивает доступ к prod БД → получает временные credentials на 1 час
// После истечения — доступ автоматически отзывается
// Весь доступ логируется (non-repudiation)
```

### Практика и применение

- **Secrets rotation** — токены и пароли должны иметь TTL и ротироваться автоматически (AWS Secrets Manager, HashiCorp Vault)
- **Service Accounts** — каждый микросервис имеет свою identity и credentials
- **Break Glass** процедура — для экстренного доступа с полными правами, но с обязательным аудитом

### Важные нюансы

- **Over-privileged by default** — облачные managed-сервисы часто создаются с избыточными правами «для простоты»; нужно явно ограничивать
- **Creeping Privileges** — права со временем накапливаются, если нет регулярного ревью (access certification)
- **Transitive permissions** — если сервис A может вызвать сервис B, а B имеет права на C, то A фактически тоже имеет доступ к C; нужно учитывать при threat modeling

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как реализовать POLP в Kubernetes?** — RBAC, PodSecurityPolicy/PSA, NetworkPolicy, запуск контейнеров без root, read-only filesystem.
- **Что такое Separation of Duties?** — Родственный принцип: критические операции требуют участия нескольких людей (4 eyes principle) — например, деплой в prod требует одобрения от другого инженера.
- **Как POLP помогает при compromised credentials?** — Радиус поражения ограничен; атакующий с украденным API-токеном может делать только то, что разрешено токену.
- **Как автоматизировать enforcement POLP?** — Policy as Code (OPA/Gatekeeper), IAM Access Analyzer, automated access reviews.

### Красные флаги (чего не говорить)

- «Дадим admin права всем разработчикам для удобства» — это прямое нарушение POLP.
- «Мы проверяем права только на уровне UI» — авторизация должна быть на уровне API/бэкенда.
- Не упоминать необходимость регулярного ревью и ротации прав (права устаревают).

### Связанные темы

- `003-printsipy-strategii-bezopasnosti.md`
- `006-raznica-identifikatsiya-autentifikatsiya-avtorizatsiya.md`
- `007-vidy-autentifikatsii.md`
