# Q016. Что такое вычисляемые свойства?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Вычисляемые свойства (computed properties)** — это реактивные значения, производные от других реактивных данных. Vue автоматически отслеживает зависимости computed и кэширует результат — пересчёт происходит только когда одна из зависимостей изменилась. В отличие от метода, computed не вызывается при каждом рендере; в отличие от `watch`, он возвращает значение.

---

## Развёрнутый ответ

### Суть и определение

Computed property — это **ленивый мемоизированный геттер**. Он вычисляется только по запросу и повторно только при изменении зависимостей.

### Как это работает

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('Иван')
const lastName = ref('Петров')
const items = ref([1, 2, 3, 4, 5, 6])

// Computed геттер — пересчитывается только при изменении firstName/lastName
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// Computed с фильтрацией
const evenItems = computed(() => items.value.filter(i => i % 2 === 0))

// Computed getter + setter — для двустороннего связывания
const fullNameWritable = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value: string) => {
    const [first, last] = value.split(' ')
    firstName.value = first
    lastName.value = last
  },
})
</script>

<template>
  <!-- computed используется как обычное свойство (без .value в шаблоне) -->
  <p>{{ fullName }}</p>
  <input v-model="fullNameWritable" />
  <ul>
    <li v-for="n in evenItems" :key="n">{{ n }}</li>
  </ul>
</template>
```

**Механизм кэширования:**
1. При первом обращении к `fullName` Vue запускает геттер и трекает зависимости (`firstName`, `lastName`)
2. Результат кэшируется
3. При повторном обращении — возвращается кэш без пересчёта
4. При изменении `firstName` или `lastName` — кэш инвалидируется
5. При следующем обращении — пересчёт и новый кэш

### Практика и применение

**Computed vs Method vs Watch:**

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const list = ref([/* ... */])

// ✅ computed — для производных значений с кэшированием
const sortedList = computed(() =>
  [...list.value].sort((a, b) => a.name.localeCompare(b.name))
)

// ❌ method — вычисляется при КАЖДОМ рендере, даже если list не изменился
const getSortedList = () => [...list.value].sort(...)

// ❌ watch — для сайд-эффектов, не для производных значений
watch(list, () => {
  // Использовать watch для HTTP-запросов, логгирования, не для вычислений
})
</script>
```

**Computed с типизацией:**

```typescript
interface Product {
  id: string
  price: number
  quantity: number
}

const products = ref<Product[]>([])

// TypeScript автоматически выводит тип Ref<number>
const totalPrice = computed(() =>
  products.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
)
```

**Дорогостоящие вычисления — computed предотвращает лишний пересчёт:**

```typescript
// Фильтрация большого списка — без computed пересчитывается при любом рендере
const filteredResults = computed(() => {
  return largeDataset.value
    .filter(item => item.category === selectedCategory.value)
    .sort((a, b) => b.score - a.score)
    .slice(0, pageSize.value)
})
```

### Важные нюансы и краеугольные камни

- **Геттер должен быть чистым** (pure function): не изменять реактивные данные внутри computed — это антипаттерн и может вызвать предупреждения Vue 3.4+
- **`computed` не кэшируется** при использовании `Date.now()` или `Math.random()` внутри — они не реактивны, computed будет кэшировать «устаревшее» значение
- **Writable computed** — использовать осторожно: если setter изменяет зависимости геттера через другой путь, может возникнуть неочевидный цикл
- В Vue 3.4+ добавлена опция `{ lazy: true }` для computed — не вычисляется до первого обращения (по умолчанию тоже ленивый, но `lazy` влияет на SSR)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем computed отличается от watch?** — computed возвращает значение и кэширует; watch — для сайд-эффектов (HTTP, localStorage, навигация)
- **Что будет, если изменять данные внутри computed?** — предупреждение в dev-режиме; потенциально бесконечный цикл
- **Когда computed НЕ даёт выигрыша по сравнению с методом?** — когда вычисление простое и зависимости всегда изменяются; overhead трекинга больше, чем выгода от кэша
- **Как computed работает с `reactive` объектом?** — отслеживает конкретные свойства, к которым обращается геттер

### Красные флаги (чего не говорить)

- «computed и метод — одно и то же» — метод не кэшируется и вызывается при каждом рендере
- «computed подходит для асинхронных операций» — computed синхронный; для async нужен `watch` или composable с `ref` + `watchEffect`
- «computed всегда быстрее метода» — для тривиальных вычислений трекинг зависимостей может добавить лишний overhead

### Связанные темы

- `008-kak-realizovana-reaktivnost-vo-vue2-i-vue3.md`
- `017-chto-takoe-uslovnye-direktivy-conditional-directives.md`
