# Q050. Особенности разработки мультиязычных сайтов?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

Мультиязычный сайт (i18n) — не только перевод строк: нужны **локали** (язык + регион), **форматы** дат/чисел/валют, **RTL**-вёрстка, SEO (`hreflang`), маршрутизация (`/en/`, `/ru/` или subdomain), загрузка переводов без раздувания бандла и **fallback**-язык. На фронте — `Intl` API, библиотеки (i18next, react-intl, vue-i18n); контент из CMS с ключами; на сервере — `Accept-Language`, cookie, гео — с возможностью ручного выбора языка.

---

## Развёрнутый ответ

### Суть и определение

**i18n (internationalization)** — подготовка приложения к переводам (архитектура).

**l10n (localization)** — конкретные переводы и культурные правила для локали `ru-RU`, `en-US`.

**Locale** влияет на: plural rules, сортировку, календарь, первый день недели, валюту.

### Как это работает

1. **Определение локали:** URL prefix > cookie > `Accept-Language` > default.
2. **Каталоги переводов:** JSON/PO по namespace; lazy load locale chunk.
3. **Интерполяция и pluralization:** `{{count}}` + правила `one/few/many` (русский — 3 формы).
4. **RTL:** `dir="rtl"`, logical properties (`margin-inline-start`).
5. **SEO:** `<link rel="alternate" hreflang="ru" href="...">`, каноникал, отдельные URL не дубли без hreflang.

**SSR:** локаль на сервере для первого HTML; совпадение с клиентом при гидратации.

### Практика и применение

- **E-commerce:** цены в локальной валюте, форматы адреса, юридические тексты по стране.
- **SaaS:** UI на EN, документация на нескольких; не хардкодить строки в JSX.
- **Проблема без i18n:** конкатенация строк, неверные plurals, «вылезание» текста из кнопок (немецкий длиннее).

CMS workflow: ключи → переводчики → QA в контексте (pseudo-localization для теста overflow).

### Важные нюансы и краеугольные камни

- **Конкатенация** `"Hello " + name` — плохо; шаблоны с порядком слов по языку.
- **Даты:** не `toLocaleDateString` без явной locale; хранить UTC, показывать в TZ пользователя.
- **Перевод только UI**, контент из API — два источника правды.
- **hreflang** ошибки — штрафы SEO (неправильные reciprocal links).
- Флаги стран ≠ языки (Бразилия ≠ Португалия).
- Юридическое: GDPR тексты, RTL не «зеркалить» иконки со смыслом направления.

### Примеры

```javascript
// Intl — формат без библиотеки
const price = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
}).format(1990.5);

const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });
rtf.format(-1, 'day'); // «вчера»
```

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="ru" href="https://example.com/ru/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/en/page">
```

```javascript
// i18next (упрощённо)
import i18n from 'i18next';
await i18n.init({
  lng: 'ru',
  fallbackLng: 'en',
  resources: { ru: { translation: await import('./locales/ru.json') } },
});
// t('cart.items', { count: 5 }) — plural rules
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **URL vs query `?lang=ru`?** — SEO предпочитает отдельные URL + hreflang.
- **Как тестировать длинные строки?** — pseudo-localization (`[ŖŚŔŢ]`).
- **Plural rules в CLDR?** — русский 1, 2-4, 5+.
- **RTL и Tailwind?** — `rtl:` variant, logical properties.
- **SSG для 20 языков?** — build time × locales, ISR per locale.

### Красные флаги (чего не говорить)

- «Google Translate кнопка = i18n» для продукта.
- Хардкод русских строк в компонентах «потом переведём».
- Один `lang="en"` на всём сайте при русском контенте.
- Игнорировать `hreflang` при дублях URL.

### Связанные темы

- [039-ssr.md](039-ssr.md)
- [041-ssg.md](041-ssg.md)
- [034-history-api.md](034-history-api.md)
- [047-krossbrauzernost.md](047-krossbrauzernost.md)

---
