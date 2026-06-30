<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')

onMounted(() => {
  const stored = localStorage.getItem('nuxt-lab-theme')
  if (stored === 'light' || stored === 'dark') {
    theme.value = stored
  }
  applyTheme(theme.value)
})

function applyTheme(value: 'light' | 'dark') {
  document.documentElement.dataset.theme = value
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('nuxt-lab-theme', theme.value)
  applyTheme(theme.value)
}
</script>

<template>
  <button type="button" class="theme-btn" data-testid="theme-toggle" @click="toggleTheme">
    {{ theme === 'light' ? 'Dark' : 'Light' }} mode
  </button>
</template>

<style scoped>
.theme-btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
