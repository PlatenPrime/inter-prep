# Q026. Что такое фильтры? Как создать цепочку фильтров?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Фильтры** — это функции Vue 2, применявшиеся в шаблонах через пайп-синтаксис (`{{ value | filterName }}`) для форматирования отображаемых данных. **В Vue 3 фильтры полностью удалены**. Вместо них рекомендуется использовать **computed properties** или **обычные функции**, вызываемые напрямую. Цепочка фильтров (`{{ value | f1 | f2 }`) в Vue 3 заменяется цепочкой вызовов функций.

---

## Развёрнутый ответ

### Суть и определение

Фильтры в Vue 2 — это трансформаторы значений для отображения (formatting). Они не изменяли исходные данные, только представление в шаблоне.

### Как это работало (Vue 2)

```javascript
// Vue 2 — локальный фильтр
export default {
  filters: {
    uppercase(value) {
      return value?.toUpperCase() ?? ''
    },
    currency(value, symbol = '₽') {
      return `${symbol}${Number(value).toFixed(2)}`
    },
    truncate(value, length = 50) {
      return value?.length > length
        ? `${value.slice(0, length)}...`
        : value
    }
  }
}
```

```html
<!-- Vue 2 — использование в шаблоне -->
{{ name | uppercase }}
{{ price | currency('$') }}
{{ text | truncate(100) }}

<!-- Цепочка фильтров (pipe) -->
{{ text | truncate | uppercase }}
```

```javascript
// Vue 2 — глобальный фильтр
Vue.filter('formatDate', (value) => {
  return new Date(value).toLocaleDateString('ru-RU')
})
```

### Современная замена (Vue 3)

**Вариант 1: Computed property (рекомендовано для одного значения)**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const price = ref(1234.5)
const text = ref('Длинный текст для обрезания')

// Замена фильтра — computed
const formattedPrice = computed(() =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })
    .format(price.value)
)

const truncatedText = computed(() =>
  text.value.length > 50 ? `${text.value.slice(0, 50)}...` : text.value
)
</script>

<template>
  <p>{{ formattedPrice }}</p>
  <p>{{ truncatedText }}</p>
</template>
```

**Вариант 2: Утилитарные функции (рекомендовано для переиспользования)**

```typescript
// utils/formatters.ts
export const formatCurrency = (value: number, currency = 'RUB'): string =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(value)

export const truncate = (value: string, length = 50): string =>
  value.length > length ? `${value.slice(0, length)}...` : value

export const formatDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
```

```vue
<script setup lang="ts">
import { formatCurrency, truncate, formatDate } from '@/utils/formatters'
</script>

<template>
  <!-- Прямой вызов функции в шаблоне -->
  <p>{{ formatCurrency(price) }}</p>
  <p>{{ truncate(description, 100) }}</p>
  <p>{{ formatDate(createdAt) }}</p>
</template>
```

**Цепочка трансформаций (замена pipe-синтаксиса)**

```vue
<template>
  <!-- Vue 2: {{ text | trim | uppercase | truncate(50) }} -->

  <!-- Vue 3: вложенные вызовы функций -->
  <p>{{ truncate(text.trim().toUpperCase(), 50) }}</p>

  <!-- Или через computed для читаемости -->
</template>

<script setup lang="ts">
const processedText = computed(() =>
  truncate(text.value.trim().toUpperCase(), 50)
)
</script>
```

**Вариант 3: Глобальные хелперы через `app.config.globalProperties`**

```typescript
// main.ts — для компонентов Options API
app.config.globalProperties.$filters = {
  formatCurrency,
  truncate,
  formatDate,
}
```

Но для `<script setup>` это не работает — предпочтительнее импортировать функции напрямую.

### Важные нюансы и краеугольные камни

- **Не использовать `app.config.globalProperties.$filters` в новых проектах** — это костыль для совместимости; прямые импорты прозрачнее и дружественны к tree-shaking
- Computed-свойства **кэшируются**, прямые вызовы функций в шаблоне — нет. Для дорогостоящих трансформаций больших данных — computed
- Vue 3 migration guide рекомендует: replace filters with methods or computed properties
- `vue-demi` позволяет писать библиотеки, совместимые с Vue 2 и Vue 3, но фильтры там всё равно не возвращают

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему фильтры удалили из Vue 3?** — они дублировали функционал JavaScript-функций, создавали неявный DSL и не поддерживали TypeScript нормально
- **Как перенести Vue 2 проект с фильтрами на Vue 3?** — заменить `{{ value | filter }}` на `{{ filter(value) }}`, вынести функции в utils
- **Computed vs функция в шаблоне — когда что?** — computed для производных значений, зависящих от реактивных данных (с кэшированием); функция для статических трансформаций или когда входные данные — не реактивные

### Красные флаги (чего не говорить)

- «Использую фильтры в Vue 3» — их нет; если кандидат не знает об удалении — заметный пробел
- «Для Vue 3 нужно написать собственную реализацию фильтров» — нет смысла, когда есть простое решение через функции

### Связанные темы

- `016-chto-takoe-vychislyaemye-svojstva.md`
- `025-chto-takoe-miksiny-vue-js.md`
