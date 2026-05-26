# Q053. Разница между Reset.css и Normalize.css?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Reset.css** (Eric Meyer) полностью убирает все браузерные стили по умолчанию — «чистый лист» с нулевыми отступами, шрифтами и т.д. **Normalize.css** сохраняет полезные дефолты, но нормализует различия между браузерами — все браузеры ведут себя одинаково, сохраняя разумные значения по умолчанию.

---

## Развёрнутый ответ

### Суть и определение

**Reset.css (Eric Meyer, 2004, обновлён 2011):**
```css
html, body, div, span, h1, h2, h3, ... {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* Убирает всё — начинаем с нуля */
```

**Normalize.css (Nicolas Gallagher, 2011):**
```css
/* Нормализует различия между браузерами, сохраняя полезное */
h1 { font-size: 2em; margin: .67em 0; }  /* консистентный размер */
/* Убирает только то, что отличается между браузерами */
```

| Критерий | Reset.css | Normalize.css |
|----------|---------|--------------|
| Подход | «Чистый лист» | Нормализация различий |
| UA-стили | Убирает все | Сохраняет полезные |
| После применения | Нужно задать всё | Можно опираться на дефолты |
| Размер | Небольшой | Больше (документация) |
| Отладка | Проще (нет скрытых стилей) | Надо знать что оставлено |

### Как это работает

**Почему существуют различия браузеров:**
Браузеры имеют собственный User-Agent stylesheet. Например, `<h1>` в Chrome имеет `font-size: 2em; margin: 0.67em 0`, в Firefox чуть иные значения. Normalize выравнивает их; Reset убирает оба.

**Современные альтернативы:**
- **modern-normalize** — обновлённый Normalize для современных браузеров.
- **@layer reset** — помещение сброса в CSS `@layer` для управления приоритетом.
- **CSS Resets 2024**: `box-sizing: border-box` глобально + минимальный сброс.
- **Tailwind CSS Preflight** — Normalize-based reset.

### Практика и применение

- Reset — для дизайн-систем с полным контролем над стилями (каждый элемент стилизуется вручную).
- Normalize — для проектов, использующих браузерные дефолты как основу (контентные сайты, markdown-рендеринг).
- **Минимальный modern reset** — самый популярный подход сегодня:

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
#root, #__next { isolation: isolate; }
```

### Важные нюансы и краеугольные камни

- Ни один из них не является «лучшим» — выбор зависит от проекта.
- `all: revert` — CSS-способ вернуть к UA-стилям (без внешних файлов).
- Tailwind CSS использует Preflight (нормализация) по умолчанию.
- В компонентных системах (React, Vue) каждый компонент стилизует себя — reset более предсказуем.
- @layer reset — помещение любого сброса в нижний cascade layer, чтобы авторские стили всегда побеждали.

### Примеры

```css
/* Reset.css (упрощённый) */
html, body, h1, h2, p, ul, li {
  margin: 0;
  padding: 0;
}
ul { list-style: none; }

/* Normalize.css (фрагмент) */
h1 { font-size: 2em; margin: 0.67em 0; }
pre { font-family: monospace, monospace; font-size: 1em; }

/* Modern minimal reset (Josh Comeau) */
*, *::before, *::after {
  box-sizing: border-box;
}
* {
  margin: 0;
}
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}
input, button, textarea, select {
  font: inherit;
}

/* С @layer */
@layer reset {
  @import url('normalize.css');
}
/* Авторские стили всегда выигрывают у reset */
```

---

## Сравнение

| Критерий | Reset.css | Normalize.css | Modern Reset |
|----------|---------|--------------|-------------|
| Подход | Убрать всё | Выровнять различия | Минимальный функциональный |
| UA-стили | 0 | Сохранены | Частично |
| Популярность | Legacy | Популярен | Современный стандарт |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какой reset использовать в 2024?** — Минимальный modern reset + Normalize как основа; или Tailwind Preflight.
- **Как `@layer reset` помогает?** — Помещает сброс в нижний cascade layer; авторские стили всегда имеют приоритет без `!important`.
- **Нужен ли reset для новых проектов с Tailwind?** — Tailwind Preflight встроен; ничего дополнительного не нужно.

### Красные флаги (чего не говорить)

- «Reset.css лучше Normalize.css» — зависит от задачи; они решают разные проблемы.
- «Reset.css убирает ВСЕ стили, включая наследуемые» — нет, он только задаёт начальные значения явно.

### Связанные темы

- `004-kak-rabotayut-kaskadnost-i-nasledovanie-v-css.md`
- `033-css-cascade-layers-layer.md`
- `063-kak-podderzhivat-stranicy-v-brauzerakh-s-ogranichennymi-funkciyami.md`
