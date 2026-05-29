# Q032. Что такое вложенные роуты (Routes)?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Вложенные маршруты (nested routes)** — это иерархическая структура маршрутов, где дочерние маршруты рендерятся внутри `<RouterView>` родительского компонента. Это позволяет строить layout-системы: общий shell с навигацией и изменяемая «область контента» внутри. Определяются через массив `children` в конфигурации маршрута.

---

## Развёрнутый ответ

### Суть и определение

Вложенные маршруты отражают иерархию URL в иерархии компонентов. URL `/admin/users/123` может соответствовать: App → AdminLayout → UsersList → UserDetail, причём каждый уровень рендерится в `<RouterView>` своего родителя.

### Как это работает

**Конфигурация маршрутов:**

```typescript
// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',        // '' — маршрут по умолчанию (индекс)
        name: 'dashboard-home',
        component: () => import('@/views/DashboardHome.vue'),
      },
      {
        path: 'analytics',
        name: 'dashboard-analytics',
        component: () => import('@/views/Analytics.vue'),
      },
      {
        path: 'users',
        component: () => import('@/views/UsersSection.vue'),
        children: [
          {
            path: '',
            name: 'users-list',
            component: () => import('@/views/UsersList.vue'),
          },
          {
            path: ':id',        // /dashboard/users/42
            name: 'user-detail',
            component: () => import('@/views/UserDetail.vue'),
            props: true,
          },
          {
            path: ':id/edit',   // /dashboard/users/42/edit
            name: 'user-edit',
            component: () => import('@/views/UserEdit.vue'),
            props: true,
          },
        ],
      },
    ],
  },
]
```

**Компонент-родитель с RouterView:**

```vue
<!-- DashboardLayout.vue -->
<template>
  <div class="dashboard">
    <aside class="sidebar">
      <nav>
        <!-- Навигация по дочерним маршрутам -->
        <RouterLink :to="{ name: 'dashboard-home' }">Главная</RouterLink>
        <RouterLink :to="{ name: 'dashboard-analytics' }">Аналитика</RouterLink>
        <RouterLink :to="{ name: 'users-list' }">Пользователи</RouterLink>
      </nav>
    </aside>

    <main class="content">
      <!-- Здесь рендерятся дочерние компоненты -->
      <RouterView />
    </main>
  </div>
</template>
```

**Компонент второго уровня с собственным RouterView:**

```vue
<!-- UsersSection.vue -->
<template>
  <div class="users-section">
    <header>
      <h2>Управление пользователями</h2>
      <RouterLink :to="{ name: 'users-list' }">Список</RouterLink>
    </header>

    <!-- Рендерит users-list, user-detail или user-edit -->
    <RouterView />
  </div>
</template>
```

### Визуализация иерархии

```
URL: /dashboard/users/42/edit
│
├── App.vue
│   └── <RouterView />  → DashboardLayout.vue
│                           └── <RouterView />  → UsersSection.vue
│                                                   └── <RouterView />  → UserEdit.vue
```

### Практика и применение

**Паттерн: вложенный маршрут-индекс (`path: ''`)**

```typescript
{
  path: '/settings',
  component: SettingsLayout,
  children: [
    {
      path: '',        // /settings — загружает SettingsGeneral
      component: SettingsGeneral,
    },
    {
      path: 'security',  // /settings/security
      component: SettingsSecurity,
    },
  ]
}
```

**Редирект с родителя на дочерний:**

```typescript
{
  path: '/admin',
  redirect: '/admin/dashboard',  // Перенаправить /admin → /admin/dashboard
  children: [
    { path: 'dashboard', component: AdminDashboard },
    { path: 'users', component: AdminUsers },
  ]
}
```

**Вложенные маршруты с guards на уровне родителя:**

```typescript
{
  path: '/admin',
  component: AdminLayout,
  beforeEnter: (to) => {
    if (!useAuthStore().isAdmin) return '/403'
  },
  children: [
    // Все дочерние маршруты защищены guard'ом родителя
    { path: 'users', component: AdminUsers },
    { path: 'settings', component: AdminSettings },
  ]
}
```

### Важные нюансы и краеугольные камни

- **Путь дочернего маршрута** не должен начинаться с `/` — иначе это абсолютный путь, не вложенный
- **`path: ''`** — индексный маршрут; рендерится когда URL совпадает с родителем точно (без суффикса)
- Родительский компонент **обязан** иметь `<RouterView>` иначе дочерние компоненты не отрендерятся (частая ошибка)
- **`meta` наследуется** от родительских маршрутов в `route.matched` — проверять через `route.matched.some(r => r.meta.requiresAuth)`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как проверить meta от родительского маршрута?** — `route.matched.some(r => r.meta.requiresAuth)` — `route.meta` содержит только мета текущего маршрута, `matched` — всю цепочку
- **Что такое маршрут-индекс и зачем он?** — `path: ''` — компонент по умолчанию при совпадении с родителем; без него URL `/settings` покажет пустой layout без контента
- **Как передать данные от родительского компонента в дочерний через маршруты?** — через store/Pinia; маршруты не имеют прямой связи с props компонентов

### Красные флаги (чего не говорить)

- «Дочерний маршрут с `/admin/users` — это `path: '/admin/users'` в children» — нет, в `children` путь должен быть `'users'` без ведущего `/`
- Забыть `<RouterView>` в родительском компоненте — очень частая ошибка новичков

### Связанные темы

- `031-chto-takoe-vue-router-nazvajte-ego-osobennosti.md`
- `033-chto-takoe-vuex.md`
