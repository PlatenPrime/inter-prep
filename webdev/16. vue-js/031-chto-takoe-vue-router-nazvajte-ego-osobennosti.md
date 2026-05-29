# Q031. Что такое Vue Router? Назовите его особенности?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Vue Router** — официальный роутер для Vue.js, обеспечивающий навигацию в SPA без перезагрузки страницы. Ключевые особенности: декларативное определение маршрутов с компонентами, два режима истории (HTML5 History API и Hash), вложенные маршруты, динамические сегменты `:id`, навигационные guards (beforeEach, beforeRouteEnter), ленивая загрузка маршрутов через `import()`, именованные маршруты и представления.

---

## Развёрнутый ответ

### Суть и определение

Vue Router — это клиентский маршрутизатор, сопоставляющий URL с компонентами Vue. Интегрируется как плагин и предоставляет компоненты `<RouterView>` и `<RouterLink>`, а также composable `useRouter`/`useRoute`.

### Как это работает

**Настройка роутера:**

```typescript
// router/index.ts
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'), // Lazy loading
  },
  {
    path: '/users/:id',   // Динамический сегмент
    name: 'user-profile',
    component: () => import('@/views/UserProfile.vue'),
    props: true,           // Передать params как props компонента
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [            // Вложенные маршруты
      {
        path: 'dashboard',
        component: () => import('@/views/AdminDashboard.vue'),
      },
      {
        path: 'users',
        component: () => import('@/views/AdminUsers.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all — страница 404
    component: () => import('@/views/NotFound.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // HTML5 History
  // history: createWebHashHistory(), // Hash-режим: /#/path
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 } // прокрутка наверх при навигации
  },
})
```

**Использование в компоненте:**

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// route.params.id, route.query.page, route.meta.requiresAuth
console.log(route.params.id)

// Программная навигация
const goToUser = (id: string) => {
  router.push({ name: 'user-profile', params: { id } })
  // или: router.push(`/users/${id}`)
  // или: router.replace({ ... }) — без записи в историю
}
</script>

<template>
  <!-- Декларативная навигация -->
  <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
  <RouterLink :to="`/users/${userId}`" active-class="active">Профиль</RouterLink>

  <!-- Место рендера компонента маршрута -->
  <RouterView />
</template>
```

### Ключевые особенности

**1. Навигационные Guards:**

```typescript
// Глобальный guard — проверка аутентификации
router.beforeEach((to, from) => {
  const isAuthenticated = useAuthStore().isLoggedIn

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

// Глобальный afterEach — аналитика
router.afterEach((to) => {
  analytics.trackPageView(to.fullPath)
})
```

```vue
<!-- Guard на уровне компонента -->
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Предупреждение при уходе с несохранёнными изменениями
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    return confirm('Есть несохранённые изменения. Уйти?')
  }
})
</script>
```

**2. Именованные представления (Multiple RouterView):**

```typescript
const routes = [{
  path: '/',
  components: {
    default: MainContent,
    sidebar: Sidebar,
    header: Header,
  },
}]
```

```vue
<RouterView />              <!-- default -->
<RouterView name="sidebar" />
<RouterView name="header" />
```

**3. `props: true` — params как props:**

```typescript
// params передаются напрямую в props компонента
{ path: '/users/:id', component: UserProfile, props: true }
```

```vue
<!-- UserProfile.vue получает id как prop, а не через useRoute() -->
<script setup lang="ts">
defineProps<{ id: string }>()
</script>
```

**4. Scroll Behavior — управление скроллом:**

```typescript
scrollBehavior(to, from, savedPosition) {
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  if (savedPosition) return savedPosition
  return { top: 0 }
}
```

### Важные нюансы и краеугольные камни

- **History vs Hash режим**: History требует серверной настройки (nginx fallback); Hash работает «из коробки» но URL некрасивый
- **`router.push` vs `router.replace`**: push добавляет в историю, replace заменяет текущую запись (Back не вернёт на предыдущую страницу)
- `useRoute()` возвращает **реактивный** объект — изменения `route.params` автоматически отслеживаются
- **Динамические маршруты**: при изменении `:id` в URL компонент не пересоздаётся — нужен `watch(() => route.params.id, ...)`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `beforeEach` guard отличается от `beforeRouteEnter`?** — `beforeEach` глобальный, вызывается для каждой навигации; `beforeRouteEnter` — локальный для компонента, нет доступа к `this`/экземпляру (в Composition API — `onBeforeRouteLeave`)
- **Что произойдёт при переходе на тот же маршрут с другим `:id`?** — компонент не пересоздаётся; нужен `watch` или `onBeforeRouteUpdate`
- **Как передать данные в маршрут без params/query?** — через `router.push({ state: { data } })` (History State API) или через store

### Красные флаги (чего не говорить)

- «Vue Router делает полную перезагрузку страницы» — нет, это SPA-роутер, работает через History/Hash API без перезагрузки
- «`useRoute` и `useRouter` — одно и то же» — `useRoute` — текущий маршрут (read-only), `useRouter` — инстанс роутера с методами навигации

### Связанные темы

- `032-chto-takoe-vlozhennye-routy-routes.md`
- `030-chto-takoe-asinhronye-komponenty.md`
