# Q018. Что такое "skip-links" и как они используются для улучшения доступности?

> **Источник:** [12. accessibility.md](../12.%20accessibility.md) · **Тема:** Accessibility

---

## Короткий ответ

**Skip-links (ссылки-перепрыжки)** — скрытые ссылки в начале страницы, позволяющие пользователям клавиатуры и скринридеров перепрыгнуть через повторяющийся навигационный контент (шапка, меню) прямо к основному содержимому. Они решают WCAG 2.4.1 (A) — «Bypass Blocks»: обязательный критерий, нарушение которого не позволяет пользователю эффективно навигировать по сайту.

---

## Развёрнутый ответ

### Суть и определение

На каждой странице сайта пользователь клавиатуры вынужден проходить через шапку, глобальную навигацию (20–50+ элементов) прежде чем добраться до основного контента. Skip-link позволяет перепрыгнуть этот блок одним нажатием Tab → Enter.

WCAG 2.4.1 (A): «A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.»

### Как это работает

#### Минимальная реализация

```html
<!-- Первый элемент в <body> -->
<a href="#main-content" class="skip-link">
  Перейти к основному содержимому
</a>

<!-- Основной контент с matching id -->
<main id="main-content" tabindex="-1">
  <h1>Заголовок страницы</h1>
  ...
</main>
```

```css
.skip-link {
  position: absolute;
  top: -100%;          /* скрыт вне viewport */
  left: 0;
  z-index: 9999;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  transition: top 0.1s;
}

/* Появляется при фокусировании */
.skip-link:focus {
  top: 0;
}
```

**Почему `tabindex="-1"` на `<main>`?**

Браузеры Safari/IE не перемещают фокус на нефокусируемые элементы при переходе по якорю `#id`. `tabindex="-1"` делает `<main>` программно фокусируемым (без добавления в Tab-порядок), позволяя скринридеру прочесть содержимое с позиции `<main>`.

#### Несколько skip-links

Для сложных страниц (порталы, дашборды):

```html
<nav aria-label="Быстрая навигация" class="skip-nav">
  <a href="#main-content" class="skip-link">К основному содержимому</a>
  <a href="#site-search" class="skip-link">К поиску</a>
  <a href="#site-nav" class="skip-link">К навигации</a>
</nav>
```

#### Паттерн «видимый при фокусе»

Лучший UX: ссылка скрыта визуально, но появляется при фокусе с клавиатуры. Это не нарушает WCAG — ссылка доступна и работает.

Альтернатива — всегда видимый skip-link (проще, но занимает место):

```html
<a href="#main" class="skip-link skip-link--visible">
  Перейти к содержимому
</a>
```

### Практика и применение

#### SPA (React/Vue/Angular)

При клиентской навигации DOM не перезагружается, `<main id="main-content">` остаётся — skip-link работает. Но фокус не возвращается в начало страницы автоматически. Решение:

```tsx
// При смене маршрута — фокус на main или h1
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function SkipNavTarget() {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    ref.current?.focus();
  }, [location.pathname]);

  return <div id="main-content" tabIndex={-1} ref={ref} />;
}
```

#### WordPress, CMS-системы

Большинство тем WordPress включают skip-link по умолчанию. При кастомизации убедитесь, что `id="content"` или `id="main"` совпадает с `href` в skip-link.

#### Стили для тёмной и высококонтрастной тем

```css
.skip-link:focus {
  top: 0;
  /* Достаточный контраст: WCAG 1.4.3 */
  background: #000000;
  color: #ffffff;
  outline: 3px solid #ffffff;
  outline-offset: -3px;
}

@media (forced-colors: active) {
  .skip-link:focus {
    border: 2px solid ButtonText;
    forced-color-adjust: none;
  }
}
```

### Важные нюансы и краеугольные камни

- Skip-link **должен быть первым фокусируемым элементом** в `<body>` — иначе пользователь дойдёт до него только после прохождения предыдущих элементов.
- Якорь `href="#main-content"` без `tabindex="-1"` на цели не работает в Safari — браузер не переводит фокус.
- Визуально скрытый skip-link через `display: none` или `visibility: hidden` **недоступен** — AT его не увидит. Нужен именно `position: absolute; top: -100%` (или clip-path).
- Landmark навигация (`<nav>`, `<main>`, `<aside>`) — альтернативный механизм для пользователей скринридеров, но не заменяет skip-link для клавиатурных пользователей без AT.
- WCAG 2.4.1 может быть выполнен и через landmark regions без skip-link, но skip-link — наиболее надёжный способ.

### Примеры

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Интернет-магазин</title>
</head>
<body>

  <!-- Skip-links: первое что видит клавиатурный пользователь -->
  <a href="#main-content" class="skip-link">К основному содержимому</a>
  <a href="#search-form" class="skip-link">К поиску</a>

  <header>
    <nav aria-label="Основная навигация">
      <!-- 30+ ссылок меню — без skip-link нужно пройти все -->
      <ul>
        <li><a href="/">Главная</a></li>
        <li><a href="/catalog">Каталог</a></li>
        <!-- ... -->
      </ul>
    </nav>
    <form id="search-form" role="search" aria-label="Поиск по сайту">
      <input type="search" name="q" aria-label="Поисковый запрос" />
      <button type="submit">Найти</button>
    </form>
  </header>

  <main id="main-content" tabindex="-1">
    <h1>Каталог товаров</h1>
    <!-- основной контент -->
  </main>

  <footer>...</footer>

</body>
</html>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем `tabindex="-1"` на `<main>`?** — без него Safari не переводит фокус на нефокусируемый элемент по якорю; `-1` делает элемент программно фокусируемым без добавления в Tab-порядок.
- **Можно ли заменить skip-link landmark-ами?** — частично; WCAG допускает это, но skip-link работает для всех клавиатурных пользователей, а навигация по landmarks — только при наличии скринридера.
- **Сколько skip-links нужно?** — минимум один (к `<main>`); больше — по необходимости (поиск, навигация), но не перегружать.

### Красные флаги (чего не говорить)

- «Skip-link скрыт, поэтому он недоступен для AT» — неверно; скрытый через `position: absolute` + `top: -100%` skip-link доступен AT и появляется при фокусе.
- «Skip-links нужны только на очень длинных страницах» — нужны на любом сайте с повторяющейся навигацией.
- «Landmark-ы заменяют skip-link» — не полностью; skip-link работает без скринридера для пользователей только с клавиатурой.

### Связанные темы

- `006-chto-nuzhno-uchityvat-pri-razrabotke-dostupnogo-sayta.md`
- `015-kak-struktura-zagolovkov-vliyaet-na-dostupnost.md`
- `010-chto-takoe-aria-roli-v-veb-prilozhenii.md`
