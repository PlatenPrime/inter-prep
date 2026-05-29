# Q027. Что такое плагины? Какие возможности дают плагины для Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Плагин Vue** — это объект с методом `install(app, options)` или просто функция, которая принимает `app` и расширяет его возможности. Плагины используются для: глобальной регистрации компонентов и директив, добавления глобальных свойств (`app.config.globalProperties`), настройки `provide/inject`, инициализации сторонних библиотек (i18n, router, store), а также добавления методов экземпляра.

---

## Развёрнутый ответ

### Суть и определение

Плагин — это механизм расширения приложения Vue на уровне `app`, до монтирования корневого компонента. Это стандартный способ интеграции библиотек и общей инфраструктуры.

### Как это работает

**Структура плагина:**

```typescript
// plugins/myPlugin.ts
import type { App, Plugin } from 'vue'

interface PluginOptions {
  prefix?: string
  debug?: boolean
}

const myPlugin: Plugin<PluginOptions> = {
  install(app: App, options: PluginOptions = {}) {
    const { prefix = 'My', debug = false } = options

    // 1. Глобальная регистрация компонентов
    app.component(`${prefix}Button`, MyButton)
    app.component(`${prefix}Input`, MyInput)

    // 2. Глобальная директива
    app.directive('tooltip', vTooltip)

    // 3. Глобальное свойство экземпляра (для Options API / this)
    app.config.globalProperties.$formatDate = formatDate
    app.config.globalProperties.$http = createHttpClient()

    // 4. provide на уровне приложения — доступно через inject в любом компоненте
    app.provide('$logger', createLogger(debug))

    // 5. Хук приложения — выполнение при каждом создании компонента
    // app.mixin({ ... }) — не рекомендуется

    if (debug) {
      console.log(`[${prefix}Plugin] installed`)
    }
  },
}

export default myPlugin
```

**Установка плагина:**

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MyPlugin from '@/plugins/myPlugin'
import { createRouter } from 'vue-router'
import { createPinia } from 'pinia'

const app = createApp(App)

// Плагины устанавливаются до монтирования
app.use(createRouter({ ... }))  // Vue Router — плагин
app.use(createPinia())           // Pinia — плагин
app.use(MyPlugin, { prefix: 'App', debug: true })

app.mount('#app')
```

### Возможности плагинов

| Метод `app` | Что делает |
|-------------|-----------|
| `app.component(name, comp)` | Глобальная регистрация компонента |
| `app.directive(name, dir)` | Глобальная регистрация директивы |
| `app.provide(key, value)` | Глобальный provide — доступен через inject |
| `app.config.globalProperties.X` | Добавить свойство на все экземпляры |
| `app.config.errorHandler` | Глобальный обработчик ошибок |
| `app.config.warnHandler` | Глобальный обработчик предупреждений |
| `app.mixin({...})` | Глобальный миксин (не рекомендуется) |

### Практика и применение

**Плагин для UI-компонент библиотеки:**

```typescript
// packages/ui/index.ts
import type { App } from 'vue'
import Button from './Button.vue'
import Input from './Input.vue'
import Modal from './Modal.vue'

const components = { Button, Input, Modal }

export default {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(`Ui${name}`, component)
    })
  },
}
```

**Плагин для i18n (типичный паттерн):**

```typescript
// plugins/i18n.ts
export function createI18n(messages: Record<string, Record<string, string>>) {
  function t(key: string, locale = 'ru'): string {
    return messages[locale]?.[key] ?? key
  }

  return {
    install(app: App) {
      app.config.globalProperties.$t = t
      app.provide('$t', t)
    },
  }
}

// Использование в компоненте (Composition API)
const $t = inject<(key: string) => string>('$t')!
$t('common.submit') // → 'Отправить'
```

**Функциональный плагин (сокращённая форма):**

```typescript
// Плагин может быть просто функцией
const loggerPlugin = (app: App, options: { prefix: string }) => {
  app.config.globalProperties.$log = (msg: string) => {
    console.log(`[${options.prefix}]`, msg)
  }
}

app.use(loggerPlugin, { prefix: 'App' })
```

### Важные нюансы и краеугольные камни

- **Порядок `app.use()`** имеет значение: если плагин B зависит от плагина A (например, компонент в B использует роутер) — A должен быть установлен первым
- **Повторная установка**: если вызвать `app.use(plugin)` дважды, Vue **игнорирует второй вызов** — плагин устанавливается только один раз
- **`app.config.globalProperties` и TypeScript**: нужно расширить тип `ComponentCustomProperties` для автодополнения:

```typescript
// types/vue.d.ts
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatDate: (date: Date) => string
    $http: AxiosInstance
  }
}
```

- Для Composition API предпочтителен `provide/inject`, а не `globalProperties` — лучшая типизация

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `app.provide` в плагине отличается от `provide` в компоненте?** — `app.provide` доступен во всём приложении (глобально), компонентный `provide` — только в поддереве
- **Как передать опции в плагин?** — второй аргумент `app.use(plugin, options)` передаётся в `install(app, options)`
- **Vue Router — это плагин?** — да, `createRouter(...)` возвращает объект с методом `install`, устанавливается через `app.use(router)`

### Красные флаги (чего не говорить)

- «Плагин — это то же самое что миксин» — плагин работает на уровне `app`, миксин — на уровне компонента; у них разный scope
- «Глобальные свойства через `globalProperties` — лучший способ» — для Composition API это антипаттерн; лучше `provide/inject` с типизацией

### Связанные темы

- `013-raznica-mezhdu-lokalnoj-i-globalnoj-registraciej-komponenta.md`
- `025-chto-takoe-miksiny-vue-js.md`
- `033-chto-takoe-vuex.md`
