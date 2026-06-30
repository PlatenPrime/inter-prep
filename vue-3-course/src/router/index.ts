import { createRouter, createWebHistory } from 'vue-router'
import CourseHomeView from '../views/CourseHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'course-home',
      component: CourseHomeView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@capstone/views/TaskListView.vue'),
    },
    {
      path: '/tasks/settings',
      name: 'task-settings',
      component: () => import('@capstone/views/SettingsView.vue'),
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('@capstone/views/TaskDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
