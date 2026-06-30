import type { BlogPost } from '../../types/blog'

const posts: BlogPost[] = [
  {
    slug: 'what-is-ssr',
    title: 'What is SSR?',
    excerpt: 'Server-Side Rendering explained for SPA developers.',
    content:
      'SSR means the server renders Vue components to HTML before sending the page to the browser. Search engines and users see content immediately.',
    publishedAt: '2026-06-01',
  },
  {
    slug: 'nuxt-vs-vite-spa',
    title: 'Nuxt vs Vite SPA',
    excerpt: 'When to choose Nuxt over a client-only Vue app.',
    content:
      'Use Nuxt for public pages that need SEO, fast first paint, and optional server API. Use Vite SPA for authenticated dashboards.',
    publishedAt: '2026-06-15',
  },
  {
    slug: 'usefetch-hydration',
    title: 'useFetch and Hydration',
    excerpt: 'How Nuxt avoids double-fetching data on the client.',
    content:
      'useFetch runs on the server first, embeds data in the HTML payload, and reuses it during hydration so the client does not refetch unnecessarily.',
    publishedAt: '2026-06-20',
  },
]

export function getAllPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getPostBySlug(slug: string): BlogPost | null {
  return posts.find((p) => p.slug === slug) ?? null
}
