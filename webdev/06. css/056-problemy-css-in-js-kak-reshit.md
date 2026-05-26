# Q056. Проблемы использования `CSS-in-JS`? Как их решить?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**CSS-in-JS** (styled-components, Emotion) генерирует CSS в runtime (JavaScript): стили вычисляются и вставляются при рендере, что увеличивает JS bundle, замедляет TTI и Time to First Byte при SSR. Проблемы решаются: **zero-runtime CSS-in-JS** (Linaria, vanilla-extract, StyleX), статической экстракцией при билде и переходом на CSS Modules + CSS Custom Properties.

---

## Развёрнутый ответ

### Суть и определение

**Runtime CSS-in-JS (styled-components, Emotion):**
```javascript
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'white'};
  color: ${props => props.primary ? 'white' : 'blue'};
`;
```

При рендере JS генерирует CSS-строку, создаёт `<style>` тег, вставляет правила. Это происходит при каждом рендере компонента.

### Проблемы

| Проблема | Описание |
|---------|---------|
| **Производительность runtime** | Генерация CSS при каждом рендере — CPU-нагрузка |
| **Блокировка гидрации (SSR)** | Критический CSS нужно собрать на сервере, сериализовать в HTML, реконцилировать на клиенте |
| **Увеличение JS bundle** | Сам styled-components ~30KB gzip; + сгенерированные стили |
| **React Server Components (RSC)** | Styled-components несовместим с RSC — использует Context (client-only) |
| **Отладка** | Генерируемые классы нечитаемы; нужны Babel/SWC плагины для display-name |
| **Нет шейкинга** | Все стили компонента включаются в bundle, даже если не рендерится |
| **Несовместимость с Streaming SSR** | CSSStyleSheet creation не работает с React 18 Suspense streaming |

### Как решить

**1. Zero-runtime CSS-in-JS (Linaria, vanilla-extract):**
```typescript
// vanilla-extract — полностью статический
import { style } from '@vanilla-extract/css';

export const button = style({
  background: 'blue',
  color: 'white',
  ':hover': { background: 'darkblue' }
});
// Компилируется в .css файл при сборке
```

**2. StyleX (Meta):**
```javascript
import * as stylex from '@stylexjs/stylex';
const styles = stylex.create({ base: { color: 'blue' } });
// Статический анализ, atomic CSS, zero-runtime
```

**3. CSS Modules + CSS Custom Properties:**
```css
/* Button.module.css */
.button {
  background: var(--btn-bg, blue);
  color: var(--btn-color, white);
}
```
```javascript
// Button.jsx
import styles from './Button.module.css';
const Button = ({ primary }) => (
  <button
    className={styles.button}
    style={{ '--btn-bg': primary ? 'blue' : 'white' }}
  />
);
```

**4. Tailwind CSS — utility-first:**
Классы предгенерированы, zero-runtime, JIT-компиляция.

### Практика и применение

- Новые проекты на Next.js App Router — Tailwind или vanilla-extract (совместимы с RSC).
- Миграция с styled-components — пошагово через CSS Modules + `@emotion/css` → vanilla-extract.
- Если нужен динамический styling с CSS Custom Properties — runtime CSS-in-JS допустим в изолированных client components.

### Важные нюансы и краеугольные камни

- Emotion и styled-components имеют SSR-поддержку, но она сложная (`ServerStyleSheet`, `StyleSheetManager`).
- React 18 Concurrent Features + runtime CSS-in-JS — могут создавать flash of unstyled content.
- `@emotion/react` с `css` prop — популярная альтернатива styled API, но те же проблемы.
- Styled-components v6 убрал части проблем SSR, но RSC несовместимость осталась.

### Примеры

```typescript
// vanilla-extract: типобезопасный статический CSS
import { createVar, style } from '@vanilla-extract/css';

const primaryColor = createVar();

export const button = style({
  vars: { [primaryColor]: 'blue' },
  background: primaryColor,
  selectors: {
    '&:hover': {
      background: 'darkblue',
    }
  }
});

// Динамика через CSS Custom Properties (runtime safe)
export const buttonVariant = styleVariants({
  primary: { vars: { [primaryColor]: 'blue' } },
  danger:  { vars: { [primaryColor]: 'red' } },
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему styled-components несовместим с React Server Components?** — Использует Context API (client-only) для theme injection; RSC не поддерживает Context.
- **Что такое zero-runtime CSS-in-JS?** — Стили компилируются в статический CSS при сборке; в runtime нет генерации — только CSS-переменные.
- **Как StyleX решает проблемы?** — Статический анализ при сборке + atomic CSS + zero-runtime; разработан Meta для facebook.com.
- **Как правильно использовать styled-components с SSR?** — `ServerStyleSheet.collectStyles()` на сервере + сериализация в HTML.

### Красные флаги (чего не говорить)

- «CSS-in-JS всегда плохо» — обоснованный выбор для client-only SPA; проблематичен для SSR/RSC.
- «Tailwind решает все проблемы CSS-in-JS» — разные инструменты для разных задач; динамические стили сложнее в Tailwind.

### Связанные темы

- `054-chto-takoe-css-preprocessor.md`
- `057-chto-takoe-bem-i-kak-eto-pomogaet-v-css.md`
- `059-principy-masshtabiruemosti-i-podderzhivaemosti-css.md`
