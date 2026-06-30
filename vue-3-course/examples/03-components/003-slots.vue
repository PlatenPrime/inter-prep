<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <article class="panel" data-testid="panel">
    <header data-testid="header">
      <slot name="header" />
    </header>
    <main data-testid="body">
      <slot />
    </main>
    <footer data-testid="footer">
      <slot name="footer" :year="2026" />
    </footer>
  </article>
</template>

<style scoped>
.panel {
  border: 1px solid #ccc;
  padding: 1rem;
}
</style>
