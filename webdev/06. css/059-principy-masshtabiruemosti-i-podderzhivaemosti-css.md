# Q059. Принципы и подходы для обеспечения масштабируемости и поддерживаемости CSS-кода?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Масштабируемый и поддерживаемый CSS строится на: **методологиях** (BEM, OOCSS), **архитектуре** (ITCSS, @layer), **изоляции** (CSS Modules, Shadow DOM), **токенах** (CSS Custom Properties), **низкой специфичности**, **единообразии** (stylelint, prettier-plugin-sort-imports) и **документировании** стилевой системы.

---

## Развёрнутый ответ

### Суть и определение

**10 принципов масштабируемого CSS:**

**1. Низкая специфичность:**
Держать специфичность на уровне одного класса (0,1,0). Использовать `@layer` для управления приоритетом без повышения специфичности.

**2. Методология именования:**
BEM, OOCSS, SMACSS — единый стандарт для команды. Предсказуемые имена = понятный код без документации.

**3. CSS Custom Properties для токенов:**
```css
:root {
  --color-primary: oklch(0.55 0.2 260);
  --space-4: 16px;
  --radius-md: 8px;
}
```
Изменение темы — только в одном месте.

**4. Архитектура слоёв (ITCSS + @layer):**
```css
@layer reset, tokens, base, layout, components, utilities;
```
Понятная иерархия приоритетов.

**5. Изоляция стилей:**
CSS Modules, Shadow DOM, `container-name` — стили не «утекают».

**6. Single Responsibility:**
Один класс — одна ответственность. Modifier-классы для вариаций вместо переопределений.

**7.避免 !important:**
Использовать `!important` только в utility-классах (Tailwind pattern) или accessibility overrides.

**8. Документирование:**
Storybook, ZeroHeight, Figma Tokens — компоненты документируются визуально.

**9. Линтинг:**
`stylelint` + правила: `max-nesting-depth`, `selector-max-specificity`, BEM-паттерны.

**10. Design Tokens:**
Синхронизация токенов между Figma и CSS (Style Dictionary, Token Pipeline).

### Практика и применение

**ITCSS-архитектура (Inverted Triangle CSS):**
```
Settings → Tools → Generic → Elements → Objects → Components → Utilities
(самый широкий охват → самый узкий)
```

**Стратегия для большой команды:**
1. Общие токены в отдельном npm-пакете (`@design-system/tokens`).
2. Базовые компоненты в shared-библиотеке.
3. Каждый feature-модуль — CSS Modules или Scoped CSS.
4. Utility-классы через Tailwind (или собственный набор).

### Важные нюансы и краеугольные камни

- Без методологии CSS деградирует: специфичность растёт, изменения страшны.
- Code review для CSS — важен: не только JS подлежит ревью.
- `stylelint-order` — сортировка CSS-свойств по алфавиту или логической группировке (positioning → box model → visual → text → misc).
- **Dead CSS** — неиспользуемые стили; PurgeCSS / Tailwind JIT убирают автоматически.
- Regression testing: screenshot tests (Chromatic, Percy) для компонентов.

### Примеры

```css
/* 1. Токены через Custom Properties */
:root {
  /* Color palette */
  --color-blue-50:  oklch(0.97 0.02 260);
  --color-blue-500: oklch(0.55 0.2  260);
  --color-blue-900: oklch(0.25 0.15 260);

  /* Semantic tokens */
  --color-primary:  var(--color-blue-500);
  --color-surface:  var(--color-blue-50);

  /* Spacing scale */
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;
}

/* 2. Архитектура @layer */
@layer reset, tokens, base, components, utilities;

@layer tokens { :root { --color-primary: oklch(0.55 0.2 260); } }
@layer base   { *, *::before, *::after { box-sizing: border-box; } }
@layer components {
  .btn { padding: var(--space-2) var(--space-4); }
}
@layer utilities {
  .sr-only { /* ... */ }
}

/* 3. Single Responsibility */
.card { border-radius: var(--radius-md); overflow: hidden; }
.card--elevated { box-shadow: var(--shadow-md); }
/* Не переопределяем, а добавляем modifier */
```

```json
// stylelint.config.js
{
  "rules": {
    "selector-max-specificity": "0,2,0",
    "max-nesting-depth": 2,
    "no-duplicate-selectors": true,
    "order/properties-alphabetical-order": true
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как управлять CSS в monorepo с 10+ командами?** — Shared token package + component library + per-feature CSS Modules; строгий stylelint.
- **Что такое ITCSS?** — Архитектура «перевёрнутый треугольник»: от общих (settings, tools) к специфичным (utilities) стилям.
- **Как избежать деградации CSS со временем?** — Code review, stylelint с правилами специфичности, документация компонентов, регулярный аудит мёртвого CSS.

### Красные флаги (чего не говорить)

- «Главное — писать хороший CSS, методологии не нужны» — без соглашений масштаб невозможен.
- «`!important` решает проблемы специфичности» — создаёт их.

### Связанные темы

- `057-chto-takoe-bem-i-kak-eto-pomogaet-v-css.md`
- `033-css-cascade-layers-layer.md`
- `060-edinyy-stil-css-na-bolshikh-proektakh.md`
