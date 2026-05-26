# Q063. Как поддерживать страницы в браузерах с ограниченными функциями?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Для поддержки браузеров с ограниченными возможностями используется **прогрессивное улучшение** (progressive enhancement): начинать с базовой функциональностью для всех, добавлять улучшения через `@supports`, медиазапросы и вендорные префиксы. Инструменты: Autoprefixer, PostCSS, Browserslist, `@supports`.

---

## Развёрнутый ответ

### Суть и определение

**Прогрессивное улучшение (Progressive Enhancement):**
- Базовый слой: HTML + базовый CSS (работает везде).
- Улучшенный слой: современные CSS-функции через `@supports`.
- Верхний слой: JS-улучшения для поддерживающих браузеров.

**Graceful Degradation** (обратный подход):
- Проектируем для современных браузеров.
- Добавляем fallback'и для старых.

### Как это работает

**Стратегии поддержки:**

**1. Fallback-значения:**
```css
/* Браузер без oklch поддержки возьмёт HEX */
.button {
  background: #0070f3;
  background: oklch(0.55 0.2 260); /* переопределяет если поддерживается */
}
```

**2. `@supports` для изолированных улучшений:**
```css
/* Flexbox везде (IE 11+), Grid — для поддерживающих */
.layout { display: flex; flex-wrap: wrap; }
@supports (display: grid) {
  .layout { display: grid; grid-template-columns: repeat(3, 1fr); }
}
```

**3. Autoprefixer:**
```json
// package.json browserslist
{
  "browserslist": "> 0.5%, last 2 versions, not dead"
}
```
Autoprefixer добавляет нужные вендорные префиксы автоматически.

**4. PostCSS плагины:**
- `postcss-custom-properties` — полифил CSS Custom Properties для IE.
- `postcss-color-oklch` — преобразует oklch в rgb.
- `postcss-nesting` — разворачивает CSS Nesting для старых браузеров.

**5. Browserslist:**
Определяет целевые браузеры для всех инструментов (Autoprefixer, Babel, ESBuild).

### Практика и применение

**Чеклист поддержки:**
- [ ] Определить список поддерживаемых браузеров (`browserslist`).
- [ ] Настроить Autoprefixer в build pipeline.
- [ ] Для новых CSS-функций — проверить caniuse.com + задать fallback.
- [ ] Тестировать в реальных браузерах (BrowserStack, Sauce Labs).
- [ ] `@supports` для прогрессивных улучшений.

**Когда использовать полифилы:**
- CSS Custom Properties в IE 11: PostCSS (`postcss-custom-properties`).
- CSS Grid для IE 11: `-ms-grid` через Autoprefixer.
- `ResizeObserver` для старых браузеров: JS-полифил.

### Важные нюансы и краеугольные камни

- Проверять поддержку на **caniuse.com** перед использованием.
- IE 11 конец поддержки — июнь 2022; большинство проектов могут исключить.
- Тестировать в реальных устройствах, не только в DevTools mobile emulation.
- `@supports` — сам не поддерживается в IE 8-10 (полный @supports нет).
- CSS Error Recovery: браузер игнорирует нераспознанные свойства — fallback должен быть ПЕРЕД новым значением.
- Конфигурация: `not IE 11` в browserslist исключает большинство legacy проблем.

### Примеры

```css
/* Паттерн 1: Fallback значения */
.element {
  /* Старый браузер возьмёт значение выше */
  color: #0070f3;
  color: oklch(0.55 0.2 260);

  /* Grid с flex-fallback */
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
@supports (display: grid) {
  .element {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Паттерн 2: clip-path с fallback */
.hero {
  background: var(--color-primary);
}
@supports (clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%)) {
  .hero {
    clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  }
}

/* Паттерн 3: container queries с fallback */
.card { /* flex layout по умолчанию */ }

@supports (container-type: inline-size) {
  .card-wrapper { container-type: inline-size; }
  @container (min-width: 400px) {
    .card { flex-direction: row; }
  }
}
```

```json
// .browserslistrc
> 0.5%
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not IE 11
not dead
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Progressive Enhancement отличается от Graceful Degradation?** — PE: строим снизу вверх (base → enhanced); GD: строим сверху, добавляем fallback'и.
- **Как тестировать поддержку браузеров?** — BrowserStack / Sauce Labs для реальных браузеров; caniuse.com для статистики; DevTools для быстрой проверки.
- **Когда стоит поддерживать IE 11?** — Только если статистика проекта это требует; большинство SaaS могут не поддерживать (EOL июнь 2022).

### Красные флаги (чего не говорить)

- «IE 11 нужно поддерживать всегда» — Microsoft прекратила поддержку; в большинстве проектов не нужно.
- «Достаточно DevTools mobile emulation для тестирования» — эмуляция не воспроизводит реальные баги браузера.

### Связанные темы

- `062-kak-opredelit-podderzhivaetsya-li-svoystvo-v-brauzere.md`
- `064-ispravlenie-specifichnykh-problem-so-stilyami-v-brauzerakh.md`
- `052-chto-takoe-vendornye-prefiksy.md`
