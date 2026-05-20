# Q015. Разница между host и domain?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Domain (доменное имя)** — человекочитаемое имя в иерархии DNS (например `example.com`, поддомен `api.example.com`), зарегистрированное у регистратора и описываемое записями DNS. **Host (хост)** — конкретный **узел сети**, идентифицируемый именем (часто FQDN как `www.example.com`) и/или **IP-адресом**; в HTTP заголовок **`Host`** указывает, какой виртуальный сайт на shared IP запрашивает клиент. Домен — namespace в DNS; host — экземпляр машины/сервиса (может совпадать с доменным именем, но не обязан).

---

## Развёрнутый ответ

### Суть и определение

- **Domain:** зона DNS, делегирование NS, записи A, AAAA, CNAME, MX.
- **Hostname / FQDN:** полное имя хоста (`cdn.shop.example.com.`).
- **Host в HTTP/1.1:** обязательный заголовок `Host: api.example.com` при запросе к IP.
- **Host в URL:** компонент authority (`https://api.example.com/path`).

Один **физический сервер** (IP) — много **virtual hosts** по разным Host.

### Как это работает

1. DNS: `api.example.com` → `198.51.100.20`
2. TCP к `198.51.100.20:443`
3. TLS SNI = `api.example.com`
4. HTTP `Host: api.example.com` → nginx выбирает server block

**Subdomain** — часть домена (`staging.example.com`). **Apex/root** — `example.com` без www.

### Практика и применение

- Мультитенант SaaS: `tenant.app.com` — host per tenant.
- **Cookie Domain**=`.example.com` — все поддомены.
- **CORS** — origin = scheme + host + port.
- Kubernetes **Ingress host rules** — маршрутизация по hostname.

### Важные нюансы и краеугольные камни

- `localhost` — host без публичного DNS.
- **Punycode** домены (IDN) — `xn--...`
- Порт входит в **origin**, но не в классический «домен» (`example.com:3000`).
- Путать **registrar domain** с **DNS hosting**.
- Wildcard cert `*.example.com` не покрывает apex без SAN.

### Примеры

```http
GET /health HTTP/1.1
Host: api.example.com
# Тот же IP, другой Host → другой backend

GET /health HTTP/1.1
Host: www.example.com
```

```javascript
const url = new URL('https://api.example.com/v1/users');
url.hostname; // 'api.example.com' — host part
url.host;     // 'api.example.com' (без порта если 443)
```

---

## Сравнение

| Критерий | Domain | Host (hostname / HTTP Host) |
|----------|--------|------------------------------|
| Уровень | DNS namespace, зона | Конкретный узел / vhost |
| Пример | `example.com` | `api.example.com` или IP |
| Регистрация | У регистратора | A/AAAA запись в DNS |
| HTTP | Не заголовок сам по себе | Заголовок `Host:` обязателен |
| Один IP | Много поддоменов | Много hosts на одном IP |
| Cookie scope | `Domain=` attribute | Привязка к host |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **FQDN vs domain?** — полное имя vs зона.
- **SNI зачем?** — TLS на shared IP.
- **Origin в CORS?** — scheme+host+port.
- **Разница host и hostname в URL?** — RFC 3986 authority.
- **Wildcard DNS vs subdomain?** — `*.example.com`.

### Красные флаги (чего не говорить)

- «Host и domain — синонимы» — domain шире; host конкретнее.
- Забыть **порт** в origin при CORS (`localhost:3000` ≠ `localhost:5173`).
- «IP — это домен» — разные уровни идентификации.

### Связанные темы

- `014-ip-adres.md`, `016-raznica-uri-i-url.md`
- `002-iz-chego-sostoit-http-zapros.md`, `010-http-cookie.md`
