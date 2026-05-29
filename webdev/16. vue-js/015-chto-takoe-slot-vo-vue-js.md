# Q015. Что такое слот (`<slot>`) во Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Slot** (`<slot>`) — это механизм Vue для передачи произвольного контента (разметки) от родительского компонента внутрь дочернего. Компонент объявляет «дыры» через `<slot>`, родитель их заполняет. Vue поддерживает три типа слотов: **дефолтный** (безымянный), **именованные** (`name="header"`) и **scoped slots** (с передачей данных из дочернего в родительский шаблон).

---

## Развёрнутый ответ

### Суть и определение

Slots — это аналог `props.children` в React, но более мощный благодаря именованным и scoped слотам. Они позволяют строить гибкие компоненты-«обёртки», которые предоставляют структуру, но делегируют содержимое родителю.

### Как это работает

#### 1. Дефолтный слот

```vue
<!-- BaseCard.vue — компонент с дефолтным слотом -->
<template>
  <div class="card">
    <slot />
    <!-- или с фоллбэком: -->
    <slot>Контент по умолчанию, если ничего не передано</slot>
  </div>
</template>

<!-- Использование -->
<BaseCard>
  <p>Любой HTML-контент здесь</p>
  <UserProfile :user="user" />
</BaseCard>
```

#### 2. Именованные слоты

```vue
<!-- PageLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot /> <!-- дефолтный -->
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<!-- Использование через директиву v-slot (или сокращение #) -->
<PageLayout>
  <template #header>
    <nav>Навигация</nav>
  </template>

  <p>Основной контент страницы</p>

  <template #footer>
    <small>© 2026</small>
  </template>
</PageLayout>
```

#### 3. Scoped слоты — данные из дочернего в шаблон родителя

```vue
<!-- DataTable.vue — передаёт данные строки в слот -->
<script setup lang="ts">
defineProps<{ rows: Record<string, unknown>[] }>()
</script>

<template>
  <table>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <!-- Передаём данные в слот -->
        <slot :row="row" :index="index" />
      </tr>
    </tbody>
  </table>
</template>

<!-- Родитель получает данные строки и решает, как её рендерить -->
<DataTable :rows="users">
  <template #default="{ row, index }">
    <td>{{ index + 1 }}</td>
    <td>{{ row.name }}</td>
    <td>
      <button @click="editUser(row.id)">Редактировать</button>
    </td>
  </template>
</DataTable>
```

#### 4. Динамические именованные слоты

```vue
<template>
  <BaseLayout>
    <template #[dynamicSlotName]>
      Контент для динамического слота
    </template>
  </BaseLayout>
</template>
```

### Практика и применение

**Паттерн: renderless component (компонент без разметки)**

```vue
<!-- MouseTracker.vue — только логика, рендер делегирован -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

const update = (e: MouseEvent) => {
  x.value = e.clientX
  y.value = e.clientY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>
  <slot :x="x" :y="y" />
</template>

<!-- Использование — UI полностью под контролем родителя -->
<MouseTracker #default="{ x, y }">
  <div>Позиция: {{ x }}, {{ y }}</div>
</MouseTracker>
```

**Паттерн: компонент-обёртка с дефолтным контентом**

```vue
<!-- AlertDialog.vue -->
<template>
  <dialog>
    <slot name="title">
      <h2>Предупреждение</h2>
    </slot>
    <div class="body">
      <slot />
    </div>
    <div class="actions">
      <slot name="actions">
        <button>OK</button>
      </slot>
    </div>
  </dialog>
</template>
```

### Важные нюансы и краеугольные камни

- **Область видимости слота**: контент слота имеет доступ к данным **родительского** компонента, а не дочернего. Scoped slot — единственный способ получить данные из дочернего
- **`$slots` в Composition API**: `useSlots()` возвращает объект слотов; можно проверить, передан ли слот: `!!slots.header`
- Слоты **не могут** получить доступ к `data`/`props` дочернего компонента напрямую без scoped slot
- **Производительность**: scoped slots компилируются как функции рендера — они вычисляются при каждом рендере дочернего, но это нормально

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем scoped slot отличается от обычного?** — scoped slot передаёт данные из дочернего компонента в шаблон родителя, обычный — нет
- **Как в компоненте проверить, передан ли слот?** — через `useSlots()`: `const slots = useSlots(); if (slots.header) {...}`
- **Аналог slots в React?** — `props.children` для дефолтного; именованные пропсы с JSX для именованных; render props для scoped
- **Что такое renderless component?** — компонент без собственной разметки, предоставляет только логику через scoped slot

### Красные флаги (чего не говорить)

- «Scoped slot — это когда передаёшь данные из родителя в слот» — наоборот: данные идут из **дочернего** в шаблон **родителя**
- Путать `v-slot` и `slot` (устаревший атрибут Vue 2) — использовать только `v-slot`/`#` в Vue 3

### Связанные темы

- `014-perechislite-varianty-kommunikacii-komponentov-vo-vue-js.md`
- `009-chto-takoe-komponent.md`
