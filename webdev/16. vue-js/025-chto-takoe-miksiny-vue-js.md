# Q025. Что такое миксины Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Миксин (mixin)** — это объект с опциями компонента (`data`, `methods`, `computed`, lifecycle hooks), который можно подмешать в любой компонент через `mixins: [myMixin]`. Это был основной механизм переиспользования логики в Vue 2. В Vue 3 миксины **устарели** как паттерн: их заменили **composables** (Composition API), которые лишены проблем конфликтов имён, неявного происхождения данных и сложного дебаггинга.

---

## Развёрнутый ответ

### Суть и определение

Миксин — это «примесь»: его свойства сливаются с опциями компонента. Полезен для совместного использования логики (например, обработки форм, пагинации) между несколькими компонентами.

### Как это работает

```javascript
// mixins/formMixin.js
export const formMixin = {
  data() {
    return {
      isSubmitting: false,
      errors: {},
    }
  },

  methods: {
    async submitForm(data) {
      this.isSubmitting = true
      this.errors = {}
      try {
        await this.$api.post('/submit', data)
      } catch (e) {
        this.errors = e.response.data
      } finally {
        this.isSubmitting = false
      }
    },

    clearErrors() {
      this.errors = {}
    },
  },
}
```

```vue
<!-- Компонент использует миксин -->
<script>
import { formMixin } from '@/mixins/formMixin'

export default {
  mixins: [formMixin],
  data() {
    return {
      name: '',
      email: '',
    }
  },
}
</script>

<template>
  <form @submit.prevent="submitForm({ name, email })">
    <input v-model="name" />
    <input v-model="email" />
    <button :disabled="isSubmitting">Отправить</button>
    <span v-for="(err, key) in errors" :key="key">{{ err }}</span>
  </form>
</template>
```

**Глобальный миксин:**
```javascript
app.mixin({
  mounted() {
    console.log('Каждый компонент смонтирован!') // вызовется ДЛЯ КАЖДОГО компонента
  }
})
```

### Правила слияния

| Опция | Стратегия |
|-------|-----------|
| `data` | Рекурсивное слияние; при конфликте — компонент побеждает |
| `methods`, `components`, `directives` | Слияние; при конфликте — компонент побеждает |
| Lifecycle hooks | Объединяются в массив; миксин вызывается первым |
| `watch` | Объединяются; оба вотчера выполнятся |

### Проблемы миксинов

**1. Конфликты имён — неявные и молчаливые:**

```javascript
// mixin A
const mixinA = { data: () => ({ count: 0 }) }

// mixin B
const mixinB = { data: () => ({ count: 100 }) }

// Компонент — непонятно, какое значение count?
export default {
  mixins: [mixinA, mixinB], // count = 100 (последний побеждает? нет, компонент побеждает)
}
```

**2. Неясное происхождение:**

```vue
<template>{{ isSubmitting }}</template>
<!-- Откуда isSubmitting? Из mixinA? mixinB? Самого компонента? -->
```

**3. Нет TypeScript-поддержки** — миксины не типизируются нормально.

### Composable как замена миксину

```typescript
// composables/useForm.ts — эквивалент formMixin
export function useForm() {
  const isSubmitting = ref(false)
  const errors = ref<Record<string, string>>({})

  async function submitForm(url: string, data: unknown) {
    isSubmitting.value = true
    errors.value = {}
    try {
      await api.post(url, data)
    } catch (e: any) {
      errors.value = e.response.data
    } finally {
      isSubmitting.value = false
    }
  }

  return { isSubmitting, errors, submitForm }
}

// Использование — источник данных очевиден
const { isSubmitting, errors, submitForm } = useForm()
```

### Важные нюансы и краеугольные камни

- **Глобальные миксины** — анти-паттерн: загрязняют все компоненты, очень сложно отследить
- Vue 3 предупреждает об использовании миксинов: не запрещает, но рекомендует composables
- При использовании `<script setup>` миксины **невозможны** — только composables
- Миксины поддерживаются в Vue 3 для обратной совместимости с Vue 2-кодом

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему composable лучше миксина?** — явное происхождение данных, нет конфликтов имён, полная TypeScript-поддержка, нет ограничений на `this`
- **Что такое «конфликт имён в миксинах» и как Vue его разрешает?** — свойство компонента побеждает; при нескольких миксинах — побеждает позднее объявленный
- **Как lifecycle hooks ведут себя при слиянии?** — объединяются в массив, вызываются все; сначала миксин, потом компонент

### Красные флаги (чего не говорить)

- «Миксины — современный способ переиспользования логики» — это устаревший паттерн, замещённый composables
- «Глобальный миксин — удобный способ добавить логику везде» — это анти-паттерн с непредсказуемыми последствиями

### Связанные темы

- `002-perechislite-osobennosti-vue-js.md`
- `014-perechislite-varianty-kommunikacii-komponentov-vo-vue-js.md`
