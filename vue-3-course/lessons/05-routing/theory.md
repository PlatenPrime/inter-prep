# Модуль 05 — Vue Router

## Цель

Навигация в SPA: маршруты, nested layouts, guards, lazy loading, typed routes.

## Базовая настройка

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  ],
})
```

## Nested routes

```ts
{
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    { path: '', name: 'dashboard', component: DashboardHome },
    { path: 'settings', name: 'settings', component: DashboardSettings },
  ],
}
```

Layout рендерит `<RouterView />` для дочерних маршрутов.

## Params и query

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const taskId = computed(() => route.params.id as string)
const page = computed(() => Number(route.query.page ?? 1))

function goNext() {
  router.push({ name: 'tasks', query: { page: page.value + 1 } })
}
</script>
```

## Navigation guards

```ts
router.beforeEach((to, from) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

## Lazy loading

```ts
component: () => import('@/views/HeavyView.vue')
```

Vite создаёт отдельный chunk — загружается при первом визите.

## Примеры

- `examples/05-routing/001-nested-router.test.ts` — тесты с `createMemoryHistory`

## React-bridge

| React Router | Vue Router |
|--------------|------------|
| `<Routes>` / `<Route>` | `routes` config |
| `useParams()` | `useRoute().params` |
| `useNavigate()` | `useRouter().push()` |
| `<Outlet>` | `<RouterView>` |
| loader | `beforeEnter` / `beforeResolve` |

## Следующий модуль

[06-pinia/theory.md](../06-pinia/theory.md)
