# Q003. Какие принципы следует учитывать при разработке стратегии безопасности?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Ключевые принципы стратегии безопасности: **Defense in Depth** (несколько слоёв защиты), **Least Privilege** (минимум прав), **Fail Secure** (отказ в безопасном состоянии), **Zero Trust** (не доверять никому по умолчанию) и **Security by Design** (безопасность с первого дня, не как добавка). Они описывают не конкретные инструменты, а архитектурный подход, при котором компрометация одного слоя не означает компрометации всей системы.

---

## Развёрнутый ответ

### Основные принципы

#### 1. Defense in Depth (Эшелонированная оборона)

Несколько независимых уровней защиты. Если один слой пробит, следующий останавливает атаку.

```
[Клиент]
  ↓ WAF (Web Application Firewall) — блокирует известные паттерны атак
  ↓ TLS/HTTPS — шифрование транспорта
  ↓ Rate Limiting — защита от brute force и DDoS
  ↓ Authentication — кто ты?
  ↓ Authorization — что тебе разрешено?
  ↓ Input Validation — санитизация данных
  ↓ Business Logic Layer — правила приложения
  ↓ Database — параметризованные запросы
```

#### 2. Least Privilege (Принцип наименьших привилегий)

```typescript
// ❌ Сервис использует root-пользователя БД
const db = new Pool({ user: 'root', password: 'pass', database: 'app' });

// ✅ Отдельный пользователь с минимальными правами
// CREATE USER app_user WITH PASSWORD '...';
// GRANT SELECT, INSERT, UPDATE ON TABLE orders TO app_user;
// GRANT SELECT ON TABLE products TO app_user;
const db = new Pool({ user: 'app_user', password: process.env.DB_PASS });
```

#### 3. Fail Secure (Fail Closed)

При ошибке система переходит в безопасное состояние (запрещает доступ), а не открытое.

```typescript
// ❌ Fail Open — при ошибке пропускаем
async function checkPermission(userId: string, resource: string): Promise<boolean> {
  try {
    return await authService.hasPermission(userId, resource);
  } catch {
    return true; // опасно: любой получает доступ при недоступности сервиса
  }
}

// ✅ Fail Secure — при ошибке запрещаем
async function checkPermission(userId: string, resource: string): Promise<boolean> {
  try {
    return await authService.hasPermission(userId, resource);
  } catch {
    logger.error('Auth service unavailable', { userId, resource });
    return false; // безопасно: доступ запрещён
  }
}
```

#### 4. Zero Trust

«Никогда не доверяй, всегда проверяй» — каждый запрос аутентифицируется и авторизируется независимо от источника (внутренняя сеть не считается безопасной).

```typescript
// Каждый микросервис проверяет JWT, даже если запрос пришёл от другого микросервиса
app.use('/api', async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

#### 5. Security by Design

Угрозы моделируются на этапе проектирования (не «добавим безопасность потом»).

**STRIDE Threat Model:**
- **S**poofing — подмена личности
- **T**ampering — подделка данных
- **R**epudiation — отрицание действий
- **I**nformation Disclosure — утечка данных
- **D**enial of Service — отказ в обслуживании
- **E**levation of Privilege — повышение привилегий

#### 6. Separation of Concerns

Разделение ролей и компонентов: БД не должна быть доступна из интернета, frontend не должен знать бизнес-правила авторизации.

#### 7. Keep It Simple (KISS в безопасности)

Сложные системы сложнее аудировать. Простой, понятный код — меньше поверхность атаки.

### Практика и применение

**Secure SDLC (Software Development Life Cycle):**

| Этап | Активность |
|------|-----------|
| Требования | Threat modeling, security requirements |
| Дизайн | Архитектурный ревью, STRIDE |
| Разработка | SAST, код-ревью с security-чеклистом |
| Тестирование | DAST (OWASP ZAP), pentest, fuzzing |
| Деплой | Secrets management, hardened configs |
| Эксплуатация | Мониторинг, логирование, патчи |

### Важные нюансы

- **Security vs UX trade-off** — чрезмерная безопасность ломает UX; нужен баланс (например, слишком частый MFA-запрос → пользователи его отключают)
- **Принцип «безопасность через неясность»** (Security through Obscurity) — **антипаттерн**; скрытие алгоритмов не заменяет реальной защиты
- **Shared Responsibility Model** (облака) — провайдер отвечает за безопасность инфраструктуры, вы — за безопасность приложения и данных

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница Defense in Depth и Zero Trust?** — Defense in Depth — про слои защиты; Zero Trust — про модель доверия (явная верификация на каждом шаге).
- **Как применить эти принципы в микросервисной архитектуре?** — mTLS между сервисами, service mesh (Istio), centralized secrets (Vault), per-service RBAC.
- **Что такое Attack Surface Reduction?** — уменьшение числа точек входа: отключение неиспользуемых API, порты только для нужных сервисов, удаление ненужных зависимостей.
- **Как провести threat modeling?** — Нарисовать DFD (Data Flow Diagram), найти границы доверия, применить STRIDE к каждому потоку данных.

### Красные флаги (чего не говорить)

- «Security by Obscurity» как основная стратегия — скрытый алгоритм, «секретный» URL не являются защитой.
- «Мы защищены, потому что используем HTTPS» — HTTPS — лишь один слой из многих.
- Описывать безопасность как что-то, что добавляется в конце разработки.

### Связанные темы

- `004-printsip-naimenshikh-privilegiy-polp.md`
- `005-metody-povysheniya-bezopasnosti-veb-prilozhenii.md`
- `002-chto-takoe-owasp-top-10.md`
