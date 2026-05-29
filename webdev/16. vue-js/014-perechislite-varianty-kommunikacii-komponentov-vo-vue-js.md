# Q014. Перечислите варианты коммуникации компонентов во Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Vue предоставляет несколько способов коммуникации компонентов: **props** (родитель → дочерний), **emit** (дочерний → родитель), **v-model** (двустороннее связывание), **provide/inject** (предок → любой потомок), **slots** (родитель передаёт контент), **template refs** (прямой доступ к дочернему компоненту), **Event Bus** (компонент → компонент, устарел) и **Pinia/Vuex** (глобальное состояние для несвязанных компонентов).

---

## Развёрнутый ответ

### Суть и определение

Выбор механизма коммуникации зависит от **отношения между компонентами** (родитель/дитя, предок/потомок, несвязанные) и от **направления потока данных**.

### Как это работает

#### 1. Props — «Props Down»

```vue
<!-- Родитель передаёт данные вниз -->
<ChildComponent :user="currentUser" :config="{ theme: 'dark' }" />
```

**Когда**: передача данных от родителя к прямому дочернему компоненту.

#### 2. Emit — «Events Up»

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
}>()
</script>

<template>
  <button @click="emit('submit', formData)">Отправить</button>
</template>
```

```vue
<!-- Родитель слушает событие -->
<ChildComponent @submit="handleSubmit" @cancel="isOpen = false" />
```

**Когда**: уведомление родителя о действии или изменении в дочернем компоненте.

#### 3. v-model — двустороннее связывание

```vue
<!-- Реализация v-model в компоненте -->
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<!-- Использование — множественные v-model -->
<UserForm v-model:name="name" v-model:email="email" />
```

**Когда**: форм-компоненты, переиспользуемые поля ввода.

#### 4. provide / inject — «Prop Drilling» без бурения

```typescript
// Предок (App.vue или layout)
import { provide, ref } from 'vue'

const theme = ref<'light' | 'dark'>('light')
provide('theme', theme) // или provide(ThemeKey, theme) — с Symbol для типобезопасности
```

```typescript
// Любой потомок (любая глубина вложенности)
import { inject } from 'vue'

const theme = inject<Ref<'light' | 'dark'>>('theme')
// theme?.value — 'light' или 'dark'
```

**Когда**: передача данных через множество уровней (тема, locale, auth, конфигурация).

#### 5. Slots — передача контента

```vue
<!-- Layout.vue -->
<template>
  <div class="layout">
    <slot name="header" />
    <main><slot /></main>
    <slot name="footer" />
  </div>
</template>

<!-- Использование -->
<Layout>
  <template #header><AppHeader /></template>
  Основной контент
  <template #footer><AppFooter /></template>
</Layout>
```

**Когда**: компонент предоставляет структуру, родитель заполняет контент.

#### 6. Template Refs — прямой доступ к экземпляру

```vue
<script setup lang="ts">
import type ChildComponent from './ChildComponent.vue'

const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

onMounted(() => {
  childRef.value?.focus() // вызов метода дочернего компонента
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

В дочернем компоненте с `<script setup>` нужен `defineExpose`:

```typescript
// ChildComponent.vue
defineExpose({ focus, reset, validate })
```

**Когда**: взаимодействие с DOM-методами или методами дочернего компонента напрямую (редкий случай).

#### 7. Pinia (глобальный стейт)

```typescript
// stores/useCartStore.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))
  const addItem = (item: CartItem) => items.value.push(item)
  return { items, total, addItem }
})

// В любом несвязанном компоненте
const cart = useCartStore()
cart.addItem(product)
```

**Когда**: несвязанные компоненты, глобальное состояние (пользователь, корзина, уведомления).

### Практика и применение

**Правило выбора механизма:**

```
Прямой родитель/ребёнок?
  → props + emit (или v-model для форм)

Несколько уровней вложенности?
  → provide/inject (конфигурация) или Pinia (изменяемое состояние)

Компонент передаёт структуру/разметку?
  → slots

Несвязанные компоненты?
  → Pinia

Нужен прямой вызов метода дочернего?
  → ref + defineExpose (редко, только для DOM/императивных операций)
```

### Важные нюансы и краеугольные камни

- **Event Bus** (глобальный `mitt`) — в Vue 3 не рекомендован; заменён на Pinia или provide/inject
- `inject` возвращает `undefined` если ключ не предоставлен — всегда задавать значение по умолчанию или проверять
- `provide/inject` не реактивен автоматически — передавать `ref`/`reactive` объекты, а не примитивы
- `defineExpose` — обязателен в `<script setup>`, иначе родитель не получит доступ ни к чему

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое prop drilling и как его решить?** — передача props через несколько уровней; решение — provide/inject или Pinia
- **В чём разница `provide/inject` и Pinia?** — provide/inject — иерархический (только потомки), Pinia — глобальный (любой компонент)
- **Как сделать provide/inject типобезопасным?** — использовать `InjectionKey<T>` из Vue
- **Когда использовать `defineExpose`?** — только для императивного доступа к методам (focus, scroll); декларативный data-flow через props/emit предпочтительнее

### Красные флаги (чего не говорить)

- «Event Bus — стандартный способ коммуникации в Vue 3» — устарел, в документации Vue 3 не рекомендован
- «provide/inject — замена Pinia» — provide/inject работает только для иерархии компонентов; Pinia — для глобального состояния

### Связанные темы

- `012-chto-takoe-propsy-tipy-propsov.md`
- `015-chto-takoe-slot-vo-vue-js.md`
- `033-chto-takoe-vuex.md`
