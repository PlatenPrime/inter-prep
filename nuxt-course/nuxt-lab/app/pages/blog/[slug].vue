<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: post, pending, error } = await usePost(slug)

useSeoMeta({
  title: () => post.value?.title ?? 'Post',
  description: () => post.value?.excerpt ?? '',
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.excerpt,
})
</script>

<template>
  <article data-testid="blog-post">
    <NuxtLink to="/blog">&larr; Back to blog</NuxtLink>

    <p v-if="pending" data-testid="loading">Loading...</p>
    <p v-else-if="error" data-testid="not-found">Post not found.</p>
    <template v-else-if="post">
      <h1 data-testid="post-title">{{ post.title }}</h1>
      <time :datetime="post.publishedAt">{{ post.publishedAt }}</time>
      <p class="content" data-testid="post-content">{{ post.content }}</p>
    </template>
  </article>
</template>

<style scoped>
article {
  margin-top: 1rem;
}

time {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem;
}

.content {
  line-height: 1.7;
}
</style>
