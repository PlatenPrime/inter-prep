# Q060. Как создавать и поддерживать единый стиль CSS на больших проектах?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Единый стиль CSS поддерживается через: **stylelint** (автоматическое форматирование и правила), **design tokens** (единый источник правды для значений), **документированную компонентную библиотеку** (Storybook), **code review с CSS-чеклистом**, и **согласованную архитектуру** (@layer, BEM/OOCSS). Автоматизация важнее документации — инструменты не позволяют написать плохой CSS.

---

## Развёрнутый ответ

### Суть и определение

**Инструменты для единства:**

| Инструмент | Роль |
|-----------|-----|
| `stylelint` | Линтинг: правила, порядок свойств, паттерны |
| `prettier` | Форматирование кода |
| `Style Dictionary` | Синхронизация дизайн-токенов Figma → CSS |
| `Storybook` | Документация и визуальное регрессионное тестирование |
| `Chromatic / Percy` | Screenshot testing при PR |
| `CSS Modules` | Изоляция scoped стилей |
| Shared token package | Единый источник CSS Custom Properties |

### Как это работает

**1. Автоматизация через stylelint:**
```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard"],
  "plugins": ["stylelint-order", "stylelint-selector-bem-pattern"],
  "rules": {
    "selector-max-specificity": "0,2,0",
    "max-nesting-depth": 2,
    "order/properties-order": [
      ["position", "top", "right", "bottom", "left", "z-index"],
      ["display", "flex-*", "grid-*", "align-*", "justify-*", "gap"],
      ["width", "height", "padding", "margin"],
      ["background", "color", "font-*"],
      ["transition", "animation"]
    ]
  }
}
```

**2. Дизайн-токены:**
Figma → Style Dictionary → `tokens.css` + `tokens.js` для CSS и JavaScript.

```css
/* Auto-generated tokens.css */
:root {
  --color-brand-primary: oklch(0.55 0.2 260);
  --spacing-md: 16px;
  --radius-sm: 4px;
  --shadow-card: 0 2px 8px rgb(0 0 0 / 0.1);
}
```

**3. Shared компонентная библиотека:**
Монорепо с `@company/ui` пакетом. Все команды используют одни компоненты.

**4. CSS Code Review чеклист:**
- Специфичность ≤ (0,2,0)?
- Использованы токены или хардкодные значения?
- Есть ли responsive-стили?
- Доступность: focus-visible, contrast ratio?
- Нет magic numbers?

### Практика и применение

- **Monorepo**: `packages/tokens`, `packages/ui`, `apps/web`, `apps/admin` — общие стили в токенах и библиотеке.
- **Pre-commit hook** (husky + lint-staged): stylelint + prettier перед коммитом.
- **CI/CD**: stylelint в pipeline — PR не merge без исправления ошибок.
- **Living Styleguide**: Storybook с автодокументацией CSF3 stories для каждого компонента.

### Важные нюансы и краеугольные камни

- **Enforced > Documented**: инструменты, запрещающие нарушения, лучше руководств.
- **Token audits**: регулярная проверка, все ли значения используют токены (нет `#0070f3` в коде).
- **CSS Regression**: автоматические screenshot tests при каждом PR — незаменимы.
- Onboarding-документация: «How we write CSS» — короткий doc с примерами правильного/неправильного.
- Versioning: изменение токенов — semver в npm пакете; breaking changes → major версия.

### Примеры

```yaml
# .github/workflows/css-lint.yml
name: CSS Quality
on: [pull_request]
jobs:
  stylelint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx stylelint "**/*.css" "**/*.scss"
```

```javascript
// lint-staged.config.js
module.exports = {
  '**/*.{css,scss}': ['stylelint --fix', 'prettier --write'],
};
```

```css
/* Пример «правильного» CSS по соглашениям команды */
.card {
  /* positioning */
  position: relative;
  
  /* box model */
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);

  /* visual */
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

  /* transition */
  transition: box-shadow 0.2s ease;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как синхронизировать токены Figma и CSS?** — Style Dictionary: JSON-токены из Figma → CSS custom properties, SCSS variables, JS constants.
- **Как предотвратить хардкодные значения в CSS?** — stylelint-plugin с правилом `declaration-property-value-disallowed-list` для конкретных паттернов.
- **Как тестировать CSS-регрессии?** — Chromatic (cloud), Percy или Playwright visual comparisons при каждом PR.

### Красные флаги (чего не говорить)

- «CSS-единство поддерживается документацией» — без автоматизации документация устаревает.
- «Достаточно code review» — ручной review пропускает мелкие несоответствия; lint автоматизирует.

### Связанные темы

- `059-principy-masshtabiruemosti-i-podderzhivaemosti-css.md`
- `057-chto-takoe-bem-i-kak-eto-pomogaet-v-css.md`
