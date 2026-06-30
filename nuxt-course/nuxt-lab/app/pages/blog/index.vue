<script setup lang="ts">
const { data: posts, pending, error } = await usePosts()

useSeoMeta({
  title: 'Blog — All posts',
  description: 'SSR-rendered list of blog posts from the Nuxt course.',
})
</script>

<template>
  <section data-testid="blog-index">
    <h1>Blog</h1>
    <p v-if="pending" data-testid="loading">Loading posts...</p>
    <p v-else-if="error" data-testid="error">Failed to load posts.</p>
    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post.slug" data-testid="post-item">
        <NuxtLink :to="`/blog/${post.slug}`" data-testid="post-link">
          {{ post.title }}
        </NuxtLink>
        <p class="excerpt">{{ post.excerpt }}</p>
        <time :datetime="post.publishedAt">{{ post.publishedAt }}</time>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

li a {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

li a:hover {
  color: var(--accent);
}

.excerpt {
  color: var(--muted);
  margin: 0.25rem 0;
}

time {
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
