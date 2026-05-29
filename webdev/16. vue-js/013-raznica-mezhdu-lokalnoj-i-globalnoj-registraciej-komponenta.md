# Q013. Разница между локальной и глобальной регистрацией компонента?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Глобальная регистрация** — `app.component('MyComp', MyComp)` — делает компонент доступным в любом шаблоне приложения без явного импорта. **Локальная регистрация** — импорт компонента в `<script setup>` или в `components: {...}` — ограничивает видимость одним компонентом. Локальная регистрация предпочтительна: она поддерживает tree-shaking и делает зависимости явными.

---

## Развёрнутый ответ

### Суть и определение

Регистрация компонента — это процесс сообщения Vue, что данный компонент используется и как его найти по имени в шаблоне.

### Как это работает

#### Глобальная регистрация

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseCard from '@/components/base/BaseCard.vue'

const app = createApp(App)

// Компоненты доступны во всём приложении
app.component('BaseButton', BaseButton)
app.component('BaseInput', BaseInput)
app.component('BaseCard', BaseCard)

app.mount('#app')
```

```vue
<!-- AnyComponent.vue — не нужен импорт -->
<template>
  <BaseCard>
    <BaseInput v-model="value" />
    <BaseButton @click="submit">Отправить</BaseButton>
  </BaseCard>
</template>
```

#### Локальная регистрация (рекомендованный способ)

В `<script setup>` импортированные компоненты автоматически регистрируются локально:

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'
import UserStats from '@/components/UserStats.vue'
// Больше ничего не нужно — компоненты автоматически доступны в шаблоне
</script>

<template>
  <div>
    <UserAvatar :src="user.avatar" />
    <UserStats :user-id="user.id" />
  </div>
</template>
```

Options API — явная регистрация в `components`:

```javascript
import UserAvatar from '@/components/UserAvatar.vue'

export default {
  components: {
    UserAvatar,
    // Переименование при регистрации:
    'custom-avatar': UserAvatar,
  },
}
```

### Практика и применение

**Хороший паттерн**: глобально регистрировать только базовые UI-компоненты (`BaseButton`, `BaseInput`, `BaseIcon`) через плагин:

```typescript
// plugins/base-components.ts
import type { App } from 'vue'

const components = import.meta.glob('@/components/base/Base*.vue', { eager: true })

export default {
  install(app: App) {
    Object.entries(components).forEach(([path, module]) => {
      const name = path.split('/').pop()!.replace('.vue', '')
      app.component(name, (module as any).default)
    })
  },
}

// main.ts
app.use(BaseComponentsPlugin)
```

**Auto-import через `unplugin-vue-components`**:

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Components({
      // Автоматически импортирует компоненты из src/components
      // Нет ни глобальной, ни ручной локальной регистрации
    }),
  ],
}
```

### Важные нюансы и краеугольные камни

- **Tree-shaking**: глобально зарегистрированные компоненты **всегда попадают в бандл**, даже если не используются. Локальные — удаляются сборщиком при неиспользовании
- **Circular dependency**: глобальная регистрация обходит некоторые проблемы с циклическими зависимостями, но маскирует архитектурные проблемы
- **Именование**: глобальные компоненты должны иметь уникальные имена в рамках приложения — риск конфликтов в больших проектах
- **Vue DevTools**: глобальные компоненты иногда хуже отображаются в дереве компонентов

---

## Сравнение

| Критерий | Глобальная | Локальная |
|----------|-----------|----------|
| Доступность | Весь проект | Только данный компонент |
| Tree-shaking | Нет | Да |
| Явность зависимостей | Нет | Да |
| Бойлерплейт | Минимальный | Импорт в каждом компоненте |
| Риск конфликтов имён | Есть | Нет |
| Рекомендуется для | Базовые UI-компоненты | Все остальные |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему локальная регистрация лучше для tree-shaking?** — сборщик (Vite/webpack) видит явный `import` и может исключить неиспользуемый компонент; глобальный `app.component()` — нет
- **Как автоматически регистрировать компоненты?** — `unplugin-vue-components` или ручной `import.meta.glob` паттерн
- **Что если два компонента зарегистрированы с одним именем?** — последняя регистрация победит; в `<script setup>` локальный приоритетнее глобального

### Красные флаги (чего не говорить)

- «Глобальная регистрация лучше, не нужно писать импорты» — это нарушает принцип явных зависимостей и мешает tree-shaking
- «Tree-shaking работает и с глобальными компонентами» — нет, сборщик не анализирует строковые имена в `app.component()`

### Связанные темы

- `009-chto-takoe-komponent.md`
- `014-perechislite-varianty-kommunikacii-komponentov-vo-vue-js.md`
- `030-chto-takoe-asinhronye-komponenty.md`
