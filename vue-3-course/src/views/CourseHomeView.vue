<script setup lang="ts">
const lessons = [
  { id: '00', title: 'Setup', path: 'lessons/00-setup/theory.md' },
  { id: '01', title: 'Fundamentals', path: 'lessons/01-fundamentals/theory.md' },
  { id: '02', title: 'Reactivity', path: 'lessons/02-reactivity/theory.md' },
  { id: '03', title: 'Components', path: 'lessons/03-components/theory.md' },
  { id: '04', title: 'Composables', path: 'lessons/04-composables/theory.md' },
  { id: '05', title: 'Routing', path: 'lessons/05-routing/theory.md' },
  { id: '06', title: 'Pinia', path: 'lessons/06-pinia/theory.md' },
  { id: '07', title: 'Forms', path: 'lessons/07-forms/theory.md' },
  { id: '08', title: 'Server State', path: 'lessons/08-server-state/theory.md' },
  { id: '09', title: 'Performance', path: 'lessons/09-performance/theory.md' },
  { id: '10', title: 'Testing', path: 'lessons/10-testing/theory.md' },
  { id: '11', title: 'Production', path: 'lessons/11-production/theory.md' },
]
</script>

<template>
  <section class="course-home">
    <h1>Vue 3 Course</h1>
    <p class="lead">
      Производственный туториал для разработчиков с опытом React. Теория в
      <code>lessons/</code>, примеры в <code>examples/</code>, тесты через Vitest.
    </p>

    <div class="actions">
      <RouterLink class="btn primary" to="/tasks">Open Capstone — Task Board</RouterLink>
      <a class="btn secondary" href="../../nuxt-course/README.md" target="_blank" rel="noopener">
        Module 12 — Nuxt 4 + SSR
      </a>
    </div>

    <h2>Modules</h2>
    <ol class="modules">
      <li v-for="lesson in lessons" :key="lesson.id">
        <strong>{{ lesson.id }}.</strong> {{ lesson.title }}
        <span class="path">{{ lesson.path }}</span>
      </li>
    </ol>

    <h2>Commands</h2>
    <pre class="commands">npm run dev
npm run test
npm run typecheck
npm run build</pre>
  </section>
</template>

<style scoped>
.course-home {
  max-width: 720px;
  margin: 0 auto;
}

.lead {
  color: #555;
  line-height: 1.6;
}

.actions {
  margin: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn.secondary {
  background: transparent;
  color: #42b883;
  border: 2px solid #42b883;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.btn.primary {
  background: #42b883;
  color: white;
}

.modules {
  line-height: 1.8;
}

.path {
  display: block;
  font-size: 0.85rem;
  color: #888;
  font-family: monospace;
}

.commands {
  background: #f4f4f5;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}
</style>
