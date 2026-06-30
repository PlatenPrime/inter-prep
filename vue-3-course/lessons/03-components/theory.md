# Модуль 03 — Компоненты и коммуникация

## Цель

Типобезопасные props/emits, `defineModel`, slots, provide/inject — production-паттерны коммуникации.

## defineProps (Vue 3.5+)

```vue
<script setup lang="ts">
const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()
// title и count реактивны (Reactive Props Destructure)
</script>

<template>
  <h2>{{ title }} ({{ count }})</h2>
</template>
```

Для передачи в composable с сохранением реактивности:

```ts
watch(() => title, (v) => { ... })
// или getter: useSomething(() => props.title)
```

## defineEmits

```vue
<script setup lang="ts">
const emit = defineEmits<{
  save: [id: string]
  cancel: []
}>()

function onSave() {
  emit('save', 'task-1')
}
</script>
```

## defineModel (two-way binding)

```vue
<!-- Child.vue -->
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>
<template>
  <input v-model="model" />
</template>

<!-- Parent.vue -->
<CustomInput v-model="username" />
```

Заменяет boilerplate `modelValue` + `update:modelValue`.

Именованные модели: `defineModel('title')` → `v-model:title`.

## Slots

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" :item="data" /></footer>
  </div>
</template>

<!-- Usage -->
<Card>
  <template #header>Title</template>
  Content
  <template #footer="{ item }">{{ item.id }}</template>
</Card>
```

| Slot | React-аналог |
|------|--------------|
| default | `children` |
| named | props как `header={<.../>}` |
| scoped | render prop `children(item)` |

## provide / inject

```ts
// ancestor
provide('theme', readonly(theme))

// descendant
const theme = inject<Ref<Theme>>('theme')!
```

Для глобального стейта предпочитайте Pinia; provide/inject — для локальных деревьев (theme, form context).

## Примеры

- `examples/03-components/001-props-emits.vue`
- `examples/03-components/002-define-model.vue`
- `examples/03-components/003-slots.vue`

## Anti-patterns

- Мутация props напрямую.
- `defineModel` + ручной emit `update:modelValue` одновременно.
- Глубокий prop drilling (>2 уровней) без Pinia/provide.

## Следующий модуль

[04-composables/theory.md](../04-composables/theory.md)
