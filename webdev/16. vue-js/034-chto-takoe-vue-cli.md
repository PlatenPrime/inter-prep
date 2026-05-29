# Q034. Что такое Vue CLI?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Vue CLI** — это официальный инструмент командной строки для создания и конфигурирования Vue-проектов на основе webpack. Обеспечивает интерактивный скаффолдинг проекта с выбором плагинов (TypeScript, ESLint, Router, Vuex, тесты). **В 2023–2024 году Vue CLI перешёл в режим обслуживания (maintenance mode)** — для новых проектов команда Vue рекомендует **Vite** (через `npm create vue@latest`).

---

## Развёрнутый ответ

### Суть и определение

Vue CLI решал проблему «настройки с нуля»: вместо ручной конфигурации webpack, Babel, ESLint, TypeScript разработчик запускает `vue create my-app` и интерактивно выбирает нужные функции.

### Как это работало

**Создание проекта:**

```bash
npm install -g @vue/cli
vue create my-project

# Интерактивный выбор:
# ? Please pick a preset:
#   Default ([Vue 3] babel, eslint)
#   Default ([Vue 2] babel, eslint)
# > Manually select features

# ? Check the features needed for your project:
#  ◉ Babel
#  ◉ TypeScript
#  ◉ Progressive Web App (PWA) Support
#  ◉ Router
#  ◉ Vuex
#  ◉ CSS Pre-processors
#  ◉ Linter / Formatter
#  ◉ Unit Testing
#  ◉ E2E Testing
```

**Конфигурация через `vue.config.js`:**

```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // Публичный путь
  publicPath: process.env.NODE_ENV === 'production' ? '/my-app/' : '/',

  // Настройка webpack (без эджекта)
  configureWebpack: {
    resolve: {
      alias: {
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  },

  // Цепочка webpack (более гранулярный контроль)
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'My App'
      return args
    })
  },

  // Dev-сервер
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  // CSS настройки
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
})
```

### Сравнение Vue CLI и Vite

```bash
# Vue CLI (устаревший способ)
npm install -g @vue/cli
vue create my-project

# Vite (современный способ — рекомендован командой Vue)
npm create vue@latest my-project
```

| Критерий | Vue CLI (webpack) | Vite |
|----------|------------------|------|
| Сборщик | webpack | Rollup (prod) / ESBuild (dev) |
| Холодный старт dev | 10–60 сек | < 1 сек |
| HMR | 1–5 сек | < 50 мс |
| Размер бандла | Больше | Меньше |
| Поддержка | Maintenance mode | Активная разработка |
| Конфигурация | `vue.config.js` | `vite.config.ts` |

### Полезные команды Vue CLI

```bash
vue create project-name       # Создание проекта
vue add router                # Добавить плагин в существующий проект
vue add vuex
vue add typescript

vue ui                        # Графический UI для управления проектом

vue inspect                   # Вывести итоговую конфигурацию webpack
vue inspect --rule svg        # Вывести конфигурацию конкретного правила
```

### Практика и применение

Vue CLI всё ещё актуален для:
- Поддержки существующих проектов на Vue CLI
- Крупных enterprise-проектов с глубокой кастомизацией webpack
- Команд, где уже есть экспертиза в webpack

**Для новых проектов — Vite:**

```bash
npm create vue@latest
# ? Project name: my-app
# ? Add TypeScript? Yes
# ? Add Vue Router? Yes
# ? Add Pinia? Yes
# ? Add Vitest? Yes
# ? Add ESLint? Yes
```

### Важные нюансы и краеугольные камни

- Vue CLI **не поддерживает** Vite — это принципиально разные сборщики; нельзя «переключить» CLI на Vite
- **`vue eject`** в Vue CLI нет (в отличие от CRA) — вместо этого используется `vue.config.js` и `chainWebpack` для любой кастомизации
- Плагины Vue CLI (`@vue/cli-plugin-*`) несовместимы с Vite-проектами
- **Vite** использует нативные ES-модули для dev-режима — не собирает код, а отдаёт файлы напрямую, что даёт молниеносный старт

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему Vue CLI переведён в maintenance mode?** — Vite значительно быстрее при разработке; webpack-based DX устарел
- **Как добавить путь алиас `@` в Vite-проекте?** — через `resolve.alias` в `vite.config.ts`: `{ '@': path.resolve(__dirname, 'src') }`
- **Что такое `vue inspect` и зачем нужен?** — выводит итоговую webpack-конфигурацию после всех плагинов — полезно при отладке

### Красные флаги (чего не говорить)

- «Vue CLI — это современный стандарт» — он в maintenance mode; Vite — рекомендованный инструмент
- «Vite — это просто замена dev-сервера» — Vite это полноценный build tool (dev + prod сборка через Rollup)

### Связанные темы

- `035-chto-takoe-vue-loader.md`
- `001-chto-takoe-vue-js.md`
