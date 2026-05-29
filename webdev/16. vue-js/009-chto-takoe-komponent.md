# Q009. Что такое компонент?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Компонент** в Vue.js — это переиспользуемый, самодостаточный блок UI, объединяющий шаблон (разметку), логику (состояние и методы) и стили. Компоненты образуют дерево, из которого собирается всё приложение. Каждый компонент имеет собственный жизненный цикл и изолированное состояние — изменения в одном компоненте не влияют на другой без явной передачи данных.

---

## Развёрнутый ответ

### Суть и определение

Компонент — это **основная единица построения Vue-приложения**. Технически компонент — это объект опций (Options API) или функция с `setup()` (Composition API), описывающий, как рендерить часть UI и как реагировать на взаимодействие пользователя.

Компоненты решают задачи:
- **Переиспользование**: один компонент `<Button>` используется везде в приложении
- **Инкапсуляция**: детали реализации скрыты, снаружи только публичный интерфейс (props/emits)
- **Разделение ответственности**: каждый компонент отвечает за одну часть UI

### Как это работает

**Определение компонента (SFC — рекомендованный способ):**

```vue
<!-- components/UserCard.vue -->
<script setup lang="ts">
interface Props {
  name: string
  avatar: string
  isOnline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOnline: false
})

const emit = defineEmits<{
  follow: [userId: string]
}>()
</script>

<template>
  <div class="user-card">
    <img :src="avatar" :alt="name" />
    <span>{{ name }}</span>
    <span v-if="isOnline" class="badge">Online</span>
    <button @click="emit('follow', name)">Подписаться</button>
  </div>
</template>

<style scoped>
.user-card { display: flex; gap: 8px; align-items: center; }
.badge { color: green; }
</style>
```

**Использование компонента:**

```vue
<script setup lang="ts">
import UserCard from '@/components/UserCard.vue'
</script>

<template>
  <UserCard name="Алиса" avatar="/alice.jpg" :is-online="true" @follow="handleFollow" />
</template>
```

**Типы компонентов:**
- **Глобальные** — зарегистрированы через `app.component('MyComp', MyComp)`, доступны везде
- **Локальные** — импортируются в `<script setup>` или `components: { ... }` — предпочтительный способ
- **Динамические** — `<component :is="currentComponent" />`
- **Асинхронные** — загружаются по требованию через `defineAsyncComponent`
- **Функциональные** — без состояния и жизненного цикла (в Vue 3 это просто функция)

### Практика и применение

- **Атомарный дизайн**: компоненты делятся на атомы (Button), молекулы (SearchBar), организмы (Header), шаблоны (PageLayout), страницы (HomePage)
- **Render props / slots**: компонент принимает контент извне через `<slot>` для максимальной гибкости
- **Composables в компонентах**: вся бизнес-логика выносится в composable-функции, компонент становится «тупым»

```vue
<!-- Паттерн: умный контейнер + тупой компонент -->
<script setup lang="ts">
import { useUserList } from '@/composables/useUserList'
import UserCard from '@/components/UserCard.vue'

const { users, isLoading, fetchUsers } = useUserList()
fetchUsers()
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <UserCard v-for="user in users" :key="user.id" v-bind="user" />
</template>
```

### Важные нюансы и краеугольные камни

- **Каждый экземпляр компонента имеет собственное состояние** — если использовать один компонент несколько раз, у каждого своя копия `data`/`ref`
- **Props — только для чтения**: мутировать prop внутри компонента нельзя (нарушение однонаправленного потока). Для двустороннего связывания — `v-model` или emit события
- В Vue 3 `defineProps`, `defineEmits`, `defineExpose` — **компиляторные макросы**, не импортируются явно
- `<script setup>` — наиболее производительный синтаксис: компилятор минимизирует closure и инициализацию

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как компонент регистрируется глобально и локально?** — `app.component()` vs импорт в `<script setup>`, локальная регистрация предпочтительна для tree-shaking
- **Что такое динамический компонент?** — `<component :is="Tab1">` позволяет переключаться между компонентами по переменной
- **Как передать данные от дочернего к родительскому?** — через `defineEmits` + `emit('eventName', payload)` или через `v-model`
- **Что такое `defineExpose`?** — позволяет явно указать, что компонент открывает через `ref` для родителя (по умолчанию всё скрыто в `<script setup>`)

### Красные флаги (чего не говорить)

- «Компонент — это просто HTML-блок» — компонент содержит логику, состояние, жизненный цикл, не только разметку
- «Можно мутировать props» — это антипаттерн, нарушающий однонаправленный поток данных

### Связанные темы

- `007-chto-takoe-sfc-kakie-problemy-on-reshaet.md`
- `012-chto-takoe-propsy-tipy-propsov.md`
- `010-nazvajte-huki-zhiznennogo-cikla-komponenta-vo-vue-js.md`
- `013-raznica-mezhdu-lokalnoj-i-globalnoj-registraciĭ-komponenta.md`
