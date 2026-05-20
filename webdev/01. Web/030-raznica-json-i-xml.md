# Q030. Разница между `JSON` и `XML`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**JSON** (JavaScript Object Notation) — лёгкий текстовый формат «ключ–значение» и массивов, нативно парсится в JS (`JSON.parse`). **XML** (eXtensible Markup Language) — разметка с тегами, атрибутами, namespace и схемами (XSD), строгая валидность и богатая экосистема (XPath, XSLT). JSON доминирует в REST и браузерных API; XML — в enterprise, SOAP, документообороте, RSS/старых интеграциях.

---

## Развёрнутый ответ

### Суть и определение

| | JSON | XML |
|---|------|-----|
| Синтаксис | Объекты `{}`, массивы `[]`, примитивы | Вложенные элементы `<tag>`, атрибуты, CDATA |
| Типы | string, number, boolean, null, object, array | Всё — текст; типы через схему |
| Комментарии | Не поддерживаются в стандарте | `<!-- -->` |
| Расширяемость | Соглашения в полях | Namespace, XSD, DTD |

JSON: RFC 8259. XML: W3C, много связанных стандартов.

### Как это работает

**JSON:** парсер строит дерево объектов; сериализация детерминирована при фиксированном порядке ключей (в JS порядок строковых ключей сохраняется). Числа — только IEEE double (нет `BigInt` в классическом JSON).

**XML:** парсер DOM или SAX; валидация по XSD; трансформации XSLT; подпись XML-DSig в банках и гос. API.

Размер: для типичных API JSON обычно **компактнее**; XML с namespace и повторяющимися тегами раздувается.

### Практика и применение

- **REST, GraphQL responses, config (package.json)** — JSON.
- **SOAP, SAML, Office Open XML, Android layouts (исторически), банковские ISO 20022** — XML.
- **Проблема неверного выбора:** парсить XML в браузере тяжелее; тащить JSON в систему со строгой XSD-валидацией — потеря контрактов.

`Content-Type`: `application/json` vs `application/xml` / `text/xml`.

### Важные нюансы и краеугольные камни

- JSON: **нет дат**, `undefined`, `NaN`, `Infinity` в стандарте — договорённости (ISO строки).
- XML: **XXE** при небезопасном парсере — отключать external entities.
- «JSON как JavaScript» — `JSON.parse` безопасен; `eval` на JSON — XSS.
- Конвертация JSON↔XML теряет семантику атрибутов и порядка элементов.

### Примеры

```json
{
  "id": 42,
  "name": "Product",
  "tags": ["web", "api"]
}
```

```xml
<product id="42">
  <name>Product</name>
  <tags>
    <tag>web</tag>
    <tag>api</tag>
  </tags>
</product>
```

```javascript
const data = JSON.parse('{"ok":true}');
// XML в браузере
const doc = new DOMParser().parseFromString('<root/>', 'application/xml');
```

---

## Сравнение

| Критерий | JSON | XML |
|----------|------|-----|
| Читаемость для человека | Высокая, лаконично | Verbose, но структурировано |
| Размер payload | Обычно меньше | Часто больше |
| Схема и валидация | JSON Schema (опционально) | XSD, DTD — зрелая экосистема |
| Парсинг в браузере | `JSON.parse` — быстро | DOMParser — тяжелее |
| Подходит для документов | Слабо (нет разметки) | Да (разметка, mixed content) |
| Типичные API сегодня | REST, GraphQL | SOAP, legacy enterprise |
| Безопасность парсера | Mainly injection в приложении | XXE, billion laughs (если DTD) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему JSON вытеснил XML в веб-API?** — простота, размер, нативная поддержка в JS.
- **Когда всё ещё XML?** — регуляторика, подписанные документы, legacy SOAP.
- **JSON Schema vs OpenAPI?** — контракт API и генерация клиентов.
- **Проблема больших чисел в JSON?** — потеря точности > 2^53, использовать string.
- **XXE mitigation?** — отключить external entities в парсере.

### Красные флаги (чего не говорить)

- «XML устарел везде» — неверно для enterprise и документов.
- «JSON безопаснее XML» без оговорок про инъекции в приложении.
- Путать JSON с JS-объектным литералом (ключи без кавычек — не JSON).

### Связанные темы

- [028-jsonp.md](028-jsonp.md)
- [023-raznica-soap-i-rest.md](023-raznica-soap-i-rest.md) *(если создан)*
- [018-chto-takoe-rest.md](018-chto-takoe-rest.md) *(если создан)*

---
