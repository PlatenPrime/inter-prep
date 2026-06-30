<script setup lang="ts">
definePageMeta({
  ssr: false,
})

useSeoMeta({
  title: 'Admin — SPA island',
  description: 'Client-only admin area (ssr: false)',
})
</script>

<template>
  <section data-testid="admin-page">
    <h1>Admin</h1>
    <p>
      This page uses <code>ssr: false</code> — it renders only in the browser, like a Vite SPA.
      No SSR content here (check View Source).
    </p>
    <p class="hint">
      In production, protected admin routes also use auth middleware.
    </p>
    <NuxtLink to="/blog">Back to blog</NuxtLink>
  </section>
</template>

<style scoped>
.hint {
  color: var(--muted);
  margin: 1rem 0;
}
</style>
