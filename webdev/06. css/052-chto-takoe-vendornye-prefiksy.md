# Q052. Что такое вендорные префиксы? И для чего они используются?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Вендорные префиксы** — специальные строки перед CSS-свойством (`-webkit-`, `-moz-`, `-ms-`, `-o-`), позволявшие браузерам реализовывать экспериментальные CSS-функции до их стандартизации. Сегодня большинство современных свойств стандартизированы и не требуют префиксов — их расставляет автопрефиксер (PostCSS Autoprefixer) при сборке.

---

## Развёрнутый ответ

### Суть и определение

| Префикс | Браузер | Движок |
|---------|---------|--------|
| `-webkit-` | Chrome, Safari, Edge, iOS | WebKit/Blink |
| `-moz-` | Firefox | Gecko |
| `-ms-` | Internet Explorer, old Edge | Trident |
| `-o-` | Opera (до перехода на Blink) | Presto |

### Как это работает

Исторически браузеры внедряли экспериментальные CSS-функции с префиксом до финализации спецификации:

```css
/* Историческая запись для flexbox */
display: -webkit-box;       /* Safari 3-6 */
display: -moz-box;          /* Firefox (старый) */
display: -ms-flexbox;       /* IE 10 */
display: -webkit-flex;      /* Safari 6.1-8 */
display: flex;              /* Стандарт */
```

Сейчас в большинстве случаев достаточно стандартного свойства. PostCSS Autoprefixer автоматически добавляет нужные префиксы на основе базы данных Browserslist.

**Актуальные префиксы (2024):**
- `-webkit-` ещё используется для: `-webkit-text-fill-color`, `-webkit-backdrop-filter`, `-webkit-line-clamp`, `-webkit-overflow-scrolling`.
- Большинство других свойств — без префиксов.

### Практика и применение

- **Современный подход**: не писать префиксы вручную — использовать PostCSS + Autoprefixer с настроенным `browserslist` в `package.json`.
- **`-webkit-line-clamp`**: кастомное ограничение текста по числу строк (работает без префикса в Chrome 80+, Firefox 68+, но Safari до сих пор требует `-webkit-`).
- **Линейные градиенты**: исторически требовали `-webkit-`; теперь стандартны.

```css
/* Актуальный пример: line-clamp */
.excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

### Важные нюансы и краеугольные камни

- Autoprefixer читает `browserslist` из `package.json` или `.browserslistrc` и добавляет только нужные префиксы под целевые браузеры.
- Ручное написание устаревшего кода с полным набором префиксов — антипаттерн.
- `@supports` позволяет feature detection без необходимости полагаться на префиксы.
- `-webkit-appearance: none` — один из редких случаев, где префикс всё ещё нужен для стилизации form elements в Safari.
- Caniuse.com — ресурс для проверки поддержки свойств и необходимости префиксов.

### Примеры

```css
/* Ручное (устаревшее — только для демонстрации) */
.element {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg); /* стандарт, нужен только он */
}

/* Современный подход: только стандарт, Autoprefixer добавит */
.element {
  transform: rotate(45deg);
}

/* Ещё актуальный: -webkit-line-clamp */
.truncated {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /* В Chrome 80+/Firefox 68+: */
  /* line-clamp: 2 — ещё не везде без префикса */
}

/* backdrop-filter — нужен webkit для старого Safari */
.glass {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

```json
// package.json — настройка browserslist
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "not dead",
    "not IE 11"
  ]
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Нужно ли сейчас писать вендорные префиксы вручную?** — Нет; Autoprefixer на этапе сборки добавляет автоматически по Browserslist.
- **Какие префиксы ещё актуальны?** — `-webkit-line-clamp`, `-webkit-backdrop-filter` (для старого Safari), `-webkit-appearance: none`.
- **Что такое Autoprefixer?** — PostCSS-плагин, автоматически добавляющий вендорные префиксы на основе caniuse.com и Browserslist.

### Красные флаги (чего не говорить)

- «Нужно писать `-webkit-`, `-moz-`, `-ms-` для всего» — устаревшее мышление; Autoprefixer делает это автоматически.
- «Вендорные префиксы — это просто дублирование» — исторически они позволяли браузерам внедрять экспериментальные функции безопасно.

### Связанные темы

- `054-chto-takoe-css-preprocessor.md`
- `058-plyusy-i-minusy-metodologii-bem.md`
