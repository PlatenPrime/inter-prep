# Q035. Что такое `vue-loader`?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**`vue-loader`** — это webpack loader, который разбирает `.vue`-файлы (SFC) на составные части: `<template>` → рендер-функция через компилятор Vue, `<script>` → JavaScript-модуль, `<style>` → CSS (с поддержкой `scoped`, CSS Modules, препроцессоров). Это обязательный инструмент для webpack-проектов с Vue SFC. В Vite-проектах аналогом является `@vitejs/plugin-vue`.

---

## Развёрнутый ответ

### Суть и определение

Webpack не знает, как обрабатывать `.vue`-файлы. `vue-loader` обеспечивает это, действуя как «оркестратор»: он извлекает блоки из SFC и передаёт каждый соответствующему loader-у.

### Как это работает

**Процесс обработки `.vue`-файла:**

```
Component.vue
     │
     ▼
vue-loader (разбирает SFC на блоки)
     │
     ├── <template> ──► vue-template-compiler ──► render function (JS)
     │
     ├── <script setup lang="ts"> ──► ts-loader / babel-loader ──► JS модуль
     │
     └── <style scoped lang="scss"> ──► scss-loader → css-loader → style-loader
                                          + vue-loader добавляет data-v-xxxxx атрибуты
```

**Настройка webpack:**

```javascript
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      // Правило для .vue файлов
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // Правило для .js файлов (в том числе из vue-loader)
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      // Правило для CSS (в том числе из <style> блоков)
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      // SCSS поддержка
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    // Обязательный плагин для vue-loader
    new VueLoaderPlugin(),
  ],
}
```

### Функциональность vue-loader

**1. Scoped CSS**

`vue-loader` добавляет уникальный `data-v-[hash]` атрибут к DOM-элементам и трансформирует CSS-селекторы:

```html
<!-- До -->
<div class="card">...</div>

<!-- После компиляции -->
<div class="card" data-v-7ba5bd90>...</div>
```

```css
/* До */
.card { color: red; }

/* После */
.card[data-v-7ba5bd90] { color: red; }
```

**2. CSS Modules**

```vue
<style module>
.title { font-size: 24px; }
</style>

<template>
  <!-- $style.title — уникальный хэшированный класс -->
  <h1 :class="$style.title">Заголовок</h1>
</template>
```

**3. Кастомные блоки**

```vue
<docs>
  Документация компонента в формате Markdown
</docs>

<i18n>
{
  "en": { "greeting": "Hello" },
  "ru": { "greeting": "Привет" }
}
</i18n>
```

```javascript
// webpack.config.js — обработка кастомных блоков
{
  resourceQuery: /blockType=docs/,
  loader: './loaders/docs-loader.js',
}
```

**4. Hot Module Replacement (HMR)**

`vue-loader` поддерживает умный HMR: изменение `<template>` или `<style>` перезагружает только рендеринг без потери состояния компонента.

### `@vitejs/plugin-vue` — аналог для Vite

```typescript
// vite.config.ts — Vite не использует vue-loader
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      // Опции компилятора Vue
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('my-'),
        },
      },
    }),
  ],
})
```

### Практика и применение

`vue-loader` критически важен для понимания при:
- Отладке проблем со `scoped` CSS не применяющимся
- Настройке webpack для монорепозитория или нестандартной структуры
- Добавлении поддержки кастомных языков в шаблонах (`lang="pug"`)
- Конфигурировании `vue.config.js` в Vue CLI проектах

```javascript
// vue.config.js — конфигурация vue-loader через Vue CLI
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          isCustomElement: (tag) => tag === 'ion-icon',
        },
      }))
  },
}
```

### Важные нюансы и краеугольные камни

- **`VueLoaderPlugin`** обязателен — без него `vue-loader` не работает; плагин применяет правила к языковым блокам SFC
- `vue-loader` версии для Vue 2 (`vue-loader@15`) и Vue 3 (`vue-loader@17`) несовместимы между собой
- В Vite нет `vue-loader` вообще — `@vitejs/plugin-vue` работает принципиально иначе (нет webpack rules)
- **Производительность**: `vue-loader` с `thread-loader` и `cache-loader` для ускорения пересборки в больших проектах

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем нужен `VueLoaderPlugin`?** — применяет определённые в конфиге правила к языковым блокам SFC (`<script lang="ts">` получает ts-loader)
- **Как `vue-loader` реализует scoped CSS?** — добавляет уникальный data-атрибут через PostCSS-трансформацию после компиляции
- **Чем Vite отличается от webpack + vue-loader?** — Vite в dev-режиме не собирает код, использует нативные ES-модули; `@vitejs/plugin-vue` трансформирует SFC через ESBuild, а не webpack

### Красные флаги (чего не говорить)

- «vue-loader нужен в Vite-проектах» — нет, в Vite используется `@vitejs/plugin-vue`
- «vue-loader — это часть самого Vue» — это отдельный пакет для webpack; Vue Core не зависит от vue-loader

### Связанные темы

- `007-chto-takoe-sfc-kakie-problemy-on-reshaet.md`
- `034-chto-takoe-vue-cli.md`
