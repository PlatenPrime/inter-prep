import type { BlogPost } from '../../types/blog'

export function usePost(slug: MaybeRefOrGetter<string>) {
  return useFetch<BlogPost>(() => `/api/posts/${toValue(slug)}`, {
    key: () => `post-${toValue(slug)}`,
  })
}

export function usePosts() {
  return useFetch<BlogPost[]>('/api/posts', { key: 'posts' })
}
