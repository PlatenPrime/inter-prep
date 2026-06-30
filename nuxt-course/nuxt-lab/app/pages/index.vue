<script setup lang="ts">
useSeoMeta({
  title: 'Blog Catalog — Nuxt SSR Course',
  description: 'Learn Nuxt 4 and Server-Side Rendering with a hands-on blog example.',
  ogTitle: 'Blog Catalog',
  ogDescription: 'Nuxt 4 SSR capstone project',
})
</script>

<template>
  <section>
    <h1>Blog Catalog</h1>
    <p class="lead">
      Capstone проекта <strong>nuxt-course</strong>. Публичный блог рендерится на сервере (SSR),
      admin — чистый SPA.
    </p>
    <div class="actions">
      <NuxtLink to="/blog" class="btn">Read the blog</NuxtLink>
    </div>
    <h2>What you will see</h2>
    <ul>
      <li><code>View Source</code> on <NuxtLink to="/blog">/blog</NuxtLink> — post titles in HTML</li>
      <li>Per-post SEO meta on <code>/blog/[slug]</code></li>
      <li>Theme toggle uses <code>localStorage</code> (client-only)</li>
      <li><NuxtLink to="/admin">/admin</NuxtLink> — <code>ssr: false</code></li>
    </ul>
  </section>
</template>

<style scoped>
.lead {
  color: var(--muted);
  line-height: 1.6;
}

.actions {
  margin: 1.5rem 0;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: var(--accent);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

ul {
  line-height: 1.8;
}
</style>
