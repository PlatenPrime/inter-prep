<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app-layout">
    <header class="app-header">
      <RouterLink to="/" class="logo">Vue 3 Course</RouterLink>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/examples">Examples</RouterLink>
        <RouterLink to="/tasks">Task Board</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
}

.logo {
  font-weight: 700;
  color: #42b883;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-active {
  color: #42b883;
  font-weight: 600;
}

.app-main {
  padding: 1.5rem;
}
</style>
