# Q023. Разница между SOAP и REST API?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**SOAP (Simple Object Access Protocol)** — **протокол** обмена XML-сообщениями, часто с жёстким контрактом **WSDL**, операции как **RPC**, поверх HTTP/SMTP и др.; акцент на **WS-* стандарты** (Security, Transaction). **REST** — **архитектурный стиль**: ресурсы, URI, HTTP-методы, JSON/XML representations, stateless, кэш. SOAP типичен в enterprise/banking legacy; REST — де-факто стандарт для публичных и мобильных API из-за простоты, JSON и кэша HTTP.

---

## Развёрнутый ответ

### Суть и определение

| | SOAP | REST |
|---|------|------|
| Тип | Протокол + envelope | Стиль |
| Формат | XML (обязателен) | JSON чаще, XML возможен |
| Контракт | WSDL, XSD | OpenAPI (опционально) |
| Операции | Именованные (GetCustomer) | Ресурсы + HTTP verbs |
| Транспорт | HTTP, JMS, SMTP | Обычно HTTP(S) |
| Инструменты | WS-Security, MTOM | OAuth2, JWT, TLS |

### Как это работает

**SOAP запрос:**

```xml
<soap:Envelope>
  <soap:Body>
    <GetOrder xmlns="http://example.com/ns">
      <orderId>5</orderId>
    </GetOrder>
  </soap:Body>
</soap:Envelope>
```

POST на один URL `.../OrderService`, `SOAPAction` header, ответ в Fault при ошибке.

**REST:**

`GET /orders/5` → JSON, HTTP 404 если нет.

### Практика и применение

- SOAP: банки, телеком, гос., интеграция с SAP, требования WS-Security signing.
- REST: SaaS, мобильные приложения, микросервисы, CDN-кэш GET.
- **gRPC** — третья альтернатива (бинарный, HTTP/2), не SOAP и не REST.

### Важные нюансы и краеугольные камни

- SOAP **не всегда** «только XML RPC» — может быть document/literal style.
- REST API с одним POST endpoint — по сути RPC, не SOAP vs REST спор.
- SOAP **тяжелее** payload и парсинг — latency на слабых клиентах.
- Версионирование WSDL — жёсткие breaking changes vs версии URL REST.

### Примеры

```http
# REST
GET /orders/5 HTTP/1.1
Accept: application/json

# SOAP (упрощённо)
POST /OrderService HTTP/1.1
Content-Type: text/xml; charset=utf-8
SOAPAction: "GetOrder"
# XML body in envelope
```

```javascript
// REST client — простой fetch
const order = await fetch('/orders/5').then((r) => r.json());

// SOAP в JS — обычно библиотека strong-soap / axios + XML builder
```

---

## Сравнение

| Критерий | SOAP | REST |
|----------|------|------|
| Парадигма | RPC / contract-first | Resource-oriented |
| Payload | XML | JSON (типично) |
| Размер сообщений | Больше | Меньше |
| Кэш HTTP | Плохо (обычно POST) | GET кэшируется |
| Безопасность | WS-Security (XML signing) | TLS + OAuth2/JWT |
| Learning curve | Высокий (WSDL, XSD) | Ниже |
| Типичная среда | Enterprise legacy | Modern web/mobile |
| Ошибки | SOAP Fault в body | HTTP status + JSON error |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда выбрать SOAP сегодня?** — regulatory, existing ESB, WS-*.
- **WSDL role?** — codegen клиента/сервера.
- **REST level 0 vs SOAP?** — оба могут быть RPC over HTTP.
- **gRPC vs REST?** — performance, browser support.
- **Document vs RPC style SOAP?** — различие binding.

### Красные флаги (чего не говорить)

- «SOAP мёртв» — в enterprise жив; формулировка «менее популярен в greenfield web».
- «REST только JSON» — representation negotiation.
- «SOAP не работает через HTTP» — чаще всего работает.

### Связанные темы

- `018-chto-takoe-rest.md`, `024-chto-takoe-api.md`
- `021-model-richardsona.md`, `001-chto-takoe-http.md`
