# Q002. Что такое OWASP Top 10?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**OWASP Top 10** — официальный список десяти наиболее критичных угроз безопасности веб-приложений, публикуемый организацией Open Web Application Security Project. Список обновляется раз в несколько лет на основе реальных данных об инцидентах и статистики уязвимостей. Он служит отраслевым стандартом при проведении аудитов безопасности, обучении разработчиков и построении политик разработки (SDLC).

---

## Развёрнутый ответ

### Суть и определение

OWASP (Open Web Application Security Project) — некоммерческий фонд, занимающийся улучшением безопасности ПО. Top 10 — их флагманский документ, последняя версия: **OWASP Top 10:2021**.

### OWASP Top 10:2021

| # | Категория | Суть |
|---|-----------|------|
| A01 | Broken Access Control | Пользователь получает доступ к ресурсам, которые ему не разрешены |
| A02 | Cryptographic Failures | Слабое шифрование, передача данных по HTTP, хранение паролей в plain text |
| A03 | Injection | SQL, NoSQL, OS, LDAP injection; XSS попал сюда из отдельной позиции |
| A04 | Insecure Design | Архитектурные изъяны, отсутствие threat modeling |
| A05 | Security Misconfiguration | Дефолтные пароли, verbose error messages, открытые cloud bucket'ы |
| A06 | Vulnerable and Outdated Components | Использование библиотек с известными CVE |
| A07 | Identification and Authentication Failures | Слабые пароли, отсутствие MFA, session fixation |
| A08 | Software and Data Integrity Failures | CI/CD без верификации, десериализация ненадёжных данных |
| A09 | Security Logging and Monitoring Failures | Нет логов, нет алертов — атака незаметна |
| A10 | Server-Side Request Forgery (SSRF) | Сервер делает запросы к внутренней инфраструктуре по команде пользователя |

### Детали ключевых позиций

**A01: Broken Access Control** (поднялась с 5-го места)
```typescript
// ❌ IDOR — пользователь 123 запрашивает данные пользователя 456
app.get('/api/users/:id/profile', async (req, res) => {
  const profile = await db.profiles.findById(req.params.id); // нет проверки авторизации
  res.json(profile);
});

// ✅ Проверяем, что запрашивают свои данные
app.get('/api/users/:id/profile', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const profile = await db.profiles.findById(req.params.id);
  res.json(profile);
});
```

**A02: Cryptographic Failures**
```typescript
// ❌ Хранение пароля в MD5 — давно взломан радужными таблицами
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ bcrypt с cost factor 12
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(inputPassword, hash);
```

**A10: SSRF (Server-Side Request Forgery)**
```typescript
// ❌ Сервер делает fetch по URL от пользователя
app.post('/api/preview', async (req, res) => {
  const response = await fetch(req.body.url); // атакующий передаёт http://169.254.169.254/metadata
  res.json(await response.json());
});

// ✅ Whitelist разрешённых доменов + блокировка приватных IP
const ALLOWED_HOSTS = new Set(['api.trusted.com', 'cdn.partner.com']);
const url = new URL(req.body.url);
if (!ALLOWED_HOSTS.has(url.hostname)) {
  return res.status(400).json({ error: 'URL not allowed' });
}
```

### Практика и применение

- **Pentest-чеклист:** OWASP Top 10 — минимальный набор проверок при любом security-аудите
- **DevSecOps:** интеграция OWASP ZAP или Burp Suite в CI/CD pipeline
- **Обучение:** OWASP WebGoat — намеренно уязвимое приложение для практики
- **Стандарты:** PCI DSS, SOC 2 требуют демонстрации покрытия OWASP Top 10

### Важные нюансы

- Top 10 — это **не полный список** угроз, а 10 самых распространённых и критичных. Полный список — OWASP ASVS
- Категории изменились между версиями 2017 и 2021: XSS теперь часть Injection (A03), появился SSRF (A10)
- **OWASP WSTG** (Web Security Testing Guide) — детальная методология тестирования каждой из угроз
- Параллельно существуют **OWASP Top 10 for APIs**, **for Mobile** — для соответствующих контекстов

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что нового в версии 2021 vs 2017?** — Появились Insecure Design (A04) и SSRF (A10); XSS вошёл в Injection; Broken Access Control поднялась на 1-е место.
- **Как встроить OWASP в процесс разработки?** — Threat modeling на этапе дизайна, SAST/DAST в CI, dependency scanning (Snyk, Dependabot), код-ревью с security-чеклистом.
- **Что такое OWASP ASVS?** — Application Security Verification Standard, 286 требований в трёх уровнях (L1-L3); используется для формальной аттестации приложений.
- **Что делать с A06 (Outdated Components) в реальном проекте?** — `npm audit fix`, Dependabot, Snyk в CI, политика обновления зависимостей раз в квартал.

### Красные флаги (чего не говорить)

- Называть Top 10 «полным списком всех веб-угроз» — это лишь 10 самых распространённых.
- «OWASP Top 10 2017 актуален» — с 2021 года список изменился существенно.
- Путать OWASP Top 10 с CVE (Common Vulnerabilities and Exposures) — CVE это конкретные уязвимости в продуктах, Top 10 — категории угроз.

### Связанные темы

- `001-osnovnye-ugrozy-bezopasnosti-veb-stranits.md`
- `003-printsipy-strategii-bezopasnosti.md`
- `005-metody-povysheniya-bezopasnosti-veb-prilozhenii.md`
