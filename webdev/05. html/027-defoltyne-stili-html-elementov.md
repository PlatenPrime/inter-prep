# Q027. Есть ли у HTML элементов свои дефолтные специфичные стили?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Да, каждый браузер имеет встроенную **user-agent stylesheet** — таблицу стилей по умолчанию, которая задаёт базовое визуальное представление HTML-элементов. Именно поэтому `<h1>` жирный и большой, `<a>` синий и подчёркнутый, у `<body>` есть отступы без CSS-файла. Эти стили различаются между браузерами, что решается через CSS Reset или Normalize.css.

---

## Развёрнутый ответ

### Суть и определение

**User-agent stylesheet** — CSS, встроенный в браузер, который применяется к HTML-элементам до любых авторских стилей. Это нижний уровень каскада. Спецификация HTML определяет **рекомендуемые** дефолтные стили, но не обязывает браузеры их точно реализовывать — отсюда кроссбраузерные различия.

### Как это работает

В каскаде CSS порядок приоритетов:
1. **User-agent stylesheet** (наименьший приоритет)
2. Пользовательские стили браузера
3. Авторские стили (ваш CSS)
4. Инлайновые стили
5. `!important` правила

Браузер применяет свои стили первыми, авторские их перекрывают.

### Практика и применение

**Примеры дефолтных стилей (рекомендованные W3C):**

```css
/* body */
body { display: block; margin: 8px; }

/* заголовки */
h1 { display: block; font-size: 2em; font-weight: bold; margin: 0.67em 0; }
h2 { display: block; font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }

/* параграф */
p { display: block; margin: 1em 0; }

/* списки */
ul, ol { display: block; margin: 1em 0; padding-left: 40px; }
li { display: list-item; }

/* ссылка */
a { color: blue; text-decoration: underline; }
a:visited { color: purple; }

/* таблица */
table { display: table; border-collapse: separate; border-spacing: 2px; }

/* форма */
input, button { font-family: inherit; /* НЕ всегда — зависит от браузера */ }
```

**Проблемы кроссбраузерных различий:**
- `<button>` имеет разные `padding`, `border`, `background` в Chrome/Firefox/Safari
- `<input>` рендерится по-разному на разных ОС
- `<select>` почти неконтролируем через CSS без кастомного компонента
- `margin` у `<body>` в разных браузерах может отличаться

**Решения:**

```css
/* CSS Reset — обнуляет ВСЕ стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Normalize.css — сохраняет полезные дефолты, исправляет различия */
/* https://necolas.github.io/normalize.css/ */

/* Modern CSS Reset (Andy Bell) */
*, *::before, *::after { box-sizing: border-box; }
body { min-height: 100vh; }
img { max-width: 100%; display: block; }
```

### Важные нюансы и краеугольные камни

- CSS Reset и Normalize.css — разные подходы: Reset обнуляет всё, Normalize выравнивает различия
- `box-sizing: border-box` не является дефолтом в user-agent stylesheet, но стандартом в современных проектах
- `<button>` и `<input>` по умолчанию **не наследуют** `font-family` от родителя в некоторых браузерах — нужно явно указывать `font: inherit`
- DevTools → Styles → показывает user-agent stylesheet для каждого элемента — полезно при отладке

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Чем CSS Reset отличается от Normalize.css?
- Почему `button` иногда использует другой шрифт, чем родительский элемент?
- Как в DevTools посмотреть user-agent стили элемента?
- Почему `* { margin: 0; padding: 0; }` не всегда хорошая идея?
- Как дефолтные стили влияют на специфичность?

### Красные флаги (чего не говорить)

- «HTML элементы не имеют дефолтных стилей» — имеют, это user-agent stylesheet
- «Все браузеры рендерят одинаково» — нет, есть различия
- «CSS Reset и Normalize делают одно и то же» — разные подходы с разными последствиями

### Связанные темы

- [026-inlaynovyy-stil.md](./026-inlaynovyy-stil.md) — специфичность и каскад
- CSS Cascade (каскад) — порядок применения стилей
- Normalize.css / CSS Reset — стандартные инструменты нормализации
- `box-sizing: border-box` — базовая практика современной вёрстки
