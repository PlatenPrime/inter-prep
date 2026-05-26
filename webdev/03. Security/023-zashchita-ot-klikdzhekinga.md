# Q023. Как можно защититься от кликджекинг-атак (Clickjacking)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**Clickjacking** — атака, при которой злоумышленник накладывает прозрачный iframe с целевым сайтом поверх своей страницы и обманом вынуждает пользователя кликнуть по элементам жертвы. Основная защита: **`X-Frame-Options: DENY`** или **`Content-Security-Policy: frame-ancestors 'none'`** — запрет встраивания страницы в iframe. Дополнительно: `frame-busting` скрипты (устаревший метод), фреймворк-уровневые проверки.

---

## Развёрнутый ответ

### Механизм атаки

```html
<!-- evil.com -->
<style>
  /* Целевой сайт — прозрачный iframe поверх кнопки */
  #overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0;          /* невидим */
    z-index: 999;
  }
  
  .decoy-button {
    position: absolute;
    top: 200px; left: 150px;
    z-index: 1;
  }
</style>

<!-- Приманка для пользователя -->
<button class="decoy-button">Click to win iPhone!</button>

<!-- Целевой сайт наложен прозрачным слоем -->
<iframe 
  id="overlay"
  src="https://mybank.com/transfer?to=attacker&amount=1000"
></iframe>

<!-- Пользователь думает, что кликает на "win iPhone",
     а реально кликает на "Confirm Transfer" в банке -->
```

### Варианты clickjacking

```
Классический: iframe с opacity:0 поверх кнопки
Cursorjacking: подмена курсора, реальный клик происходит в другом месте
Likejacking: незаметная кнопка "Like" в Facebook
Filejacking: форма загрузки файла (file input)
Drag-and-drop: заставить перетащить данные (например, токен) в форму атакующего
```

### Защита 1: X-Frame-Options

```http
X-Frame-Options: DENY          # Полный запрет iframe
X-Frame-Options: SAMEORIGIN    # Только тот же origin
X-Frame-Options: ALLOW-FROM https://trusted.com  # Устарело, не поддерживается
```

```typescript
// Express
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Или через helmet (рекомендуется)
import helmet from 'helmet';
app.use(helmet.frameguard({ action: 'deny' }));
```

### Защита 2: CSP frame-ancestors (предпочтительнее)

```http
Content-Security-Policy: frame-ancestors 'none'
Content-Security-Policy: frame-ancestors 'self'
Content-Security-Policy: frame-ancestors https://trusted-parent.com
```

`frame-ancestors` — более современный и гибкий аналог `X-Frame-Options`:
- Поддерживает whitelist нескольких origins
- Если установлены оба заголовка — `frame-ancestors` имеет приоритет в поддерживающих браузерах

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      frameAncestors: ["'none'"], // запрет iframe полностью
      // ИЛИ для партнёрского embedding:
      // frameAncestors: ["'self'", "https://partner.com"],
    },
  },
  frameguard: { action: 'deny' }, // fallback для старых браузеров
}));
```

### Когда нужно разрешить iframe (легитимный embedding)

```typescript
// Сценарий: виджет оплаты встраивается партнёрами
// Разрешить только конкретные trusted origins

const ALLOWED_EMBEDDERS = ['https://partner1.com', 'https://partner2.com'];

app.get('/widget/payment', (req, res) => {
  // Динамически устанавливаем frame-ancestors для разрешённых embedders
  res.setHeader('Content-Security-Policy', 
    `frame-ancestors 'self' ${ALLOWED_EMBEDDERS.join(' ')}`
  );
  res.render('payment-widget');
});
```

### Защита 3: Frame-busting скрипты (устаревший дополнительный метод)

```javascript
// Старый подход до появления CSP — сайт проверяет, не в iframe ли он
if (window.self !== window.top) {
  // Страница загружена в iframe — принудительно выходим
  window.top.location = window.self.location;
}
```

**Проблемы frame-busting:**
```html
<!-- Атакующий может нейтрализовать через sandbox -->
<iframe src="https://victim.com" sandbox="allow-scripts allow-forms">
  <!-- sandbox без allow-top-navigation → window.top.location недоступен -->
</iframe>

<!-- Или через onbeforeunload перехват -->
```

Вывод: frame-busting ненадёжен. CSP `frame-ancestors` — единственная надёжная защита.

### Защита для форм с критическими действиями

```typescript
// Дополнительная мера: требовать подтверждения через диалог для critical actions
// НО: диалоги подавляются в sandboxed iframe

// Лучший подход: повторная аутентификация
app.post('/api/account/delete', authenticate, async (req, res) => {
  const { password } = req.body;
  
  // Требуем подтверждение паролем — клик в прозрачном iframe не поможет
  const isValid = await bcrypt.compare(password, req.user.passwordHash);
  if (!isValid) return res.status(401).json({ error: 'Password incorrect' });
  
  await db.users.delete({ where: { id: req.user.id } });
  res.json({ success: true });
});
```

### Проверка защиты

```bash
# Проверить заголовки
curl -I https://myapp.com | grep -i "frame\|content-security"

# Ожидаемый ответ:
# X-Frame-Options: DENY
# Content-Security-Policy: ...; frame-ancestors 'none'; ...
```

### Важные нюансы

- **`X-Frame-Options: ALLOW-FROM`** — не поддерживается в Chrome и Firefox; использовать только `frame-ancestors` в CSP
- **Мобильные браузеры** — поддерживают `frame-ancestors`, но некоторые старые версии — только `X-Frame-Options`; рекомендуется устанавливать оба заголовка
- **Drag-and-drop clickjacking** — `frame-ancestors` не защищает от drag-and-drop атак; нужны дополнительные меры (Pointer Events API проверки)
- **Легитимный embedding** — если страница должна встраиваться в iframe (например, виджет), тщательно управлять whitelist; `'self'` не достаточно если нужен конкретный partner.com

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **X-Frame-Options vs frame-ancestors в CSP — что выбрать?** — Оба: `frame-ancestors` — основной, `X-Frame-Options` — fallback для старых браузеров; если конфликт — `frame-ancestors` имеет приоритет.
- **Можно ли обойти frame-ancestors?** — Нет, это браузерная политика; атакующий не может переопределить ответные заголовки сервера.
- **Clickjacking и CSRF — в чём разница?** — CSRF: запрос без ведома пользователя (скрытая форма/img); Clickjacking: пользователь физически кликает, но не туда (обман UI). Оба используют автоматическую отправку кук.
- **Как защититься от UI Redressing атак?** — Это более широкий класс атак (tab-napping, scroll jacking); frame-ancestors + vigilant UI design + re-authentication для критических действий.

### Красные флаги (чего не говорить)

- «Frame-busting достаточен» — обходится через sandbox, onbeforeunload; ненадёжен.
- «Clickjacking — только теоретическая угроза» — реальные инциденты: атаки на Facebook Like, Twitter Follow, онлайн-банки.
- «X-Frame-Options ALLOW-FROM поддерживается везде» — не поддерживается в Chrome/Firefox.

### Связанные темы

- `017-chto-takoe-content-security-policy-csp.md`
- `018-http-zagolovki-dlya-bezopasnosti.md`
- `022-zashchita-ot-csrf.md`
