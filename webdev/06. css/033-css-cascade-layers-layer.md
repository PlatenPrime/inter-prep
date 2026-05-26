# Q033. Объясните концепцию CSS cascade layers (`@layer`)?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`@layer`** — механизм CSS-каскада, позволяющий организовать таблицы стилей в именованные **слои** с явным приоритетом. Стили в слое с более высоким приоритетом побеждают независимо от специфичности. Стили **вне** слоёв всегда побеждают все слои. Это решает «войны специфичности» при работе с библиотеками.

---

## Развёрнутый ответ

### Суть и определение

```css
/* Объявление порядка слоёв (меньший приоритет → больший) */
@layer base, components, utilities;

@layer base {
  button { background: grey; }          /* специфичность (0,0,1) */
}
@layer components {
  .btn { background: blue; }            /* специфичность (0,1,0) */
}
@layer utilities {
  .bg-red { background: red; }          /* специфичность (0,1,0) */
}

/* Вне слоёв — всегда побеждает */
.btn { background: green; }             /* перекрывает ВСЕ слои */
```

Порядок приоритета:
1. Стили вне `@layer` (наивысший)
2. `utilities` (последний объявленный)
3. `components`
4. `base` (первый = наименьший)

### Как это работает

В каскаде появился новый этап **после origin, до specificity**:

```
Origin + Importance
  ↓
@layer order
  ↓
Specificity
  ↓
Order of appearance
```

Важно: внутри слоя специфичность работает нормально. Но слой с меньшим приоритетом проигрывает слою с большим — даже при большей специфичности.

```css
@layer low { #id { color: red; } }   /* (1,0,0) */
@layer high { .class { color: blue; } } /* (0,1,0) */
/* Победит .class из high, несмотря на меньшую специфичность */
```

### Практика и применение

- **Библиотеки**: помещать стили сторонних библиотек в нижние слои → авторские стили всегда перекрывают без `!important`.
- **Design system**: `base` → `tokens` → `components` → `utilities` — явная иерархия.
- **Tailwind CSS 4**: использует `@layer` нативно.
- **CSS Resets**: `@import "reset.css" layer(reset)` — сброс в нижнем слое.

```css
/* Подключить библиотеку в нижний слой */
@import url('bootstrap.css') layer(vendor);

@layer vendor, base, components, utilities;

/* Авторские стили всегда побеждают vendor */
.btn { background: var(--color-primary); }
```

### Важные нюансы и краеугольные камни

- **Анонимные слои** (`@layer { ... }` без имени) — создаются в порядке появления, нельзя дополнить позже.
- **Вложенные слои** — `@layer components.button { ... }` создаёт подслой внутри `components`.
- `!important` в `@layer` инвертирует приоритет: `!important` в нижнем слое **побеждает** `!important` в верхнем (аналогично author vs user-agent `!important`).
- Поддержка: Chrome 99+, Firefox 97+, Safari 15.4+. Практически полная с 2022 года.
- `@layer` не влияет на порядок загрузки CSS-файлов, только на приоритет применения стилей.

### Примеры

```css
/* Полная архитектура слоёв */
@layer reset, tokens, base, layout, components, utilities;

@import url('normalize.css') layer(reset);

@layer tokens {
  :root {
    --color-primary: #0070f3;
    --spacing-4: 16px;
  }
}

@layer base {
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: system-ui; }
}

@layer components {
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    background: var(--color-primary);
  }
}

@layer utilities {
  .text-center { text-align: center; }
  .mt-4 { margin-top: var(--spacing-4); }
}

/* Вне слоёв — переопределение для конкретной страницы */
.btn { background: orange; } /* всегда перекрывает components */
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что происходит со стилями вне `@layer`?** — Они имеют наивысший приоритет — побеждают любой слой.
- **Как `!important` работает внутри слоёв?** — Инвертирует приоритет: `!important` в нижнем слое побеждает `!important` в верхнем.
- **Зачем объявлять порядок слоёв в начале файла?** — Если слои объявляются в порядке появления — тот, что создан позже, имеет больший приоритет; явный список фиксирует порядок независимо от порядка определения.
- **Как `@layer` помогает с CSS-библиотеками?** — Библиотеку помещают в нижний слой; авторские стили всегда перекрывают без повышения специфичности.

### Красные флаги (чего не говорить)

- «`@layer` заменяет специфичность» — нет, специфичность работает внутри слоя; `@layer` добавляет новый уровень каскада.
- «Стили в слоях всегда побеждают вне слоёв» — наоборот: стили вне слоёв победят любой слой.

### Связанные темы

- `004-kak-rabotayut-kaskadnost-i-nasledovanie-v-css.md`
- `007-chto-takoe-specifichnost-selektora-kak-schitat-ves-selektora.md`
- `005-globalnye-klyuchevye-slova-v-css.md`
