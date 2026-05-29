# Q063. Лучшие практики безопасности в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Ключевые практики: никогда не вставлять неочищенный HTML через `dangerouslySetInnerHTML` (XSS), хранить секреты только на сервере (не в `.env` на клиенте), использовать HTTPS + CSP-заголовки, валидировать данные через Zod/Yup, избегать eval и динамических импортов из пользовательского ввода, правильно обрабатывать JWT и куки (httpOnly).

---

## Развёрнутый ответ

### Суть и определение

React защищает от XSS автоматически — экранирует все JSX-выражения. Но разработчик может намеренно или случайно обойти эту защиту. Дополнительно: угрозы приходят не только от UI, но и от управления секретами, CSRF, и неправильной обработки данных.

### 1. XSS (Cross-Site Scripting)

**React автоматически экранирует:**
```tsx
const userInput = '<script>alert("xss")</script>';
// JSX: <div>{userInput}</div>
// Рендерится как текст, не как HTML ✅
```

**dangerouslySetInnerHTML — только с очищенным HTML:**
```tsx
import DOMPurify from 'dompurify';

// ❌ Опасно
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Безопасно — очистить перед вставкой
const cleanHtml = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['p', 'strong', 'em', 'a'],
  ALLOWED_ATTR: ['href', 'rel'],
});
<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
```

**href/src инъекции:**
```tsx
// ❌ Опасно — javascript: URL
const url = 'javascript:alert(document.cookie)';
<a href={url}>Click me</a>  // XSS!

// ✅ Валидировать URL
const isSafeUrl = (url: string): boolean =>
  url.startsWith('/') || url.startsWith('https://');

<a href={isSafeUrl(url) ? url : '#'}>{text}</a>
```

### 2. Хранение секретов

```tsx
// ❌ Секреты в .env КЛИЕНТА видны в bundle
REACT_APP_API_KEY=secret123  // попадает в JS bundle!

// ✅ Секреты только на СЕРВЕРЕ
// Next.js: процесс на сервере
process.env.DATABASE_PASSWORD  // только server-side

// ✅ Публичные ключи (не секреты) — OK для клиента
NEXT_PUBLIC_ANALYTICS_ID=UA-123  // публичный, в bundle OK
```

### 3. Управление JWT/аутентификацией

```tsx
// ❌ JWT в localStorage — уязвим к XSS
localStorage.setItem('token', jwt);

// ✅ httpOnly cookie — недоступна JavaScript
// Устанавливается сервером:
// Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// ✅ Если всё же нужно хранить в memory (не localStorage)
// Использовать in-memory переменную, сбрасывать при перезагрузке
let accessToken: string | null = null;
const setAccessToken = (token: string) => { accessToken = token; };
```

### 4. CSRF защита

```tsx
// Для REST API с cookies — CSRF токен
// Backend отдаёт CSRF token в cookie (не httpOnly)
// Frontend читает и отправляет в заголовке

const getCsrfToken = () =>
  document.cookie.split('; ')
    .find(row => row.startsWith('csrf='))
    ?.split('=')[1];

fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken() ?? '',
  },
  body: JSON.stringify(data),
});
```

### 5. Валидация входных данных

```tsx
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Неверный email').max(255),
  password: z.string().min(8, 'Минимум 8 символов').max(128),
});

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    // data типизирован и валидирован
    loginUser(data);
  };
};
```

### 6. Content Security Policy (CSP)

```html
<!-- Предотвращает выполнение inline скриптов -->
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:">

<!-- Или через HTTP заголовок (предпочтительнее) -->
<!-- Content-Security-Policy: default-src 'self'; ... -->
```

### 7. Безопасные ссылки

```tsx
// Открытие внешних ссылок
// ❌ rel="noopener" без noreferrer
<a href="https://external.com" target="_blank" rel="noopener">Link</a>

// ✅ rel="noopener noreferrer"
<a href="https://external.com" target="_blank" rel="noopener noreferrer">Link</a>
// noopener: открытая страница не может обратиться к opener через window.opener
// noreferrer: не отправлять Referer заголовок
```

### 8. Dependency Security

```bash
# Аудит зависимостей
npm audit
npm audit fix

# Регулярное обновление
npx npm-check-updates

# Мониторинг CVE
# Snyk, Dependabot, GitHub Security Advisories
```

### Практика и применение

- ESLint плагин `eslint-plugin-security` — статический анализ
- `helmet` (Express/Next.js) — HTTP заголовки безопасности
- SonarQube / Snyk — CI/CD интеграция для проверки безопасности

### Важные нюансы и краеугольные камни

- React экранирует JSX **только при использовании как выражение** `{value}`; `dangerouslySetInnerHTML` — дыра
- `process.env.REACT_APP_*` переменные **видны в production bundle** — не хранить секреты
- Dependency confusion attacks — проверять `package.json` на typosquatting пакеты

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как React защищает от XSS автоматически?** — экранирует специальные символы в JSX-выражениях (`<` → `&lt;` и т.д.)
- **Где хранить JWT токены?** — httpOnly cookie безопаснее localStorage; в-памяти — максимально безопасно (теряется при reload)
- **Что такое CSRF и как защититься?** — межсайтовая подделка запросов; защита: SameSite cookie, CSRF-токены, проверка Origin

### Красные флаги (чего не говорить)

- «React автоматически защищает от всего» — только от XSS в JSX; секреты, CSRF, авторизация — ответственность разработчика
- «localStorage лучше cookie» — httpOnly cookie недоступны JS-атакам; localStorage уязвим к XSS

### Связанные темы

- `045-kak-otrenderet-html-kod-v-react-komponente.md`
- `055-chto-takoe-sinteticheskie-sobytiya-syntheticevent-v-react.md`
