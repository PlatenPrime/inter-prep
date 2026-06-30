import { describe, it, expect } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { getAllPosts } from '../server/utils/posts'
import BlogIndex from '../app/pages/blog/index.vue'

registerEndpoint('/api/posts', {
  method: 'GET',
  handler: () => getAllPosts(),
})

describe('blog index page', () => {
  it('renders post list from API', async () => {
    const wrapper = await mountSuspended(BlogIndex, { route: '/blog' })
    await viWaitFor(() => wrapper.findAll('[data-testid="post-item"]').length >= 3)
    const titles = wrapper.findAll('[data-testid="post-link"]').map((w) => w.text())
    expect(titles.some((t) => t.includes('SSR'))).toBe(true)
  })
})

async function viWaitFor(predicate: () => boolean, timeoutMs = 3000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return
    await new Promise((r) => setTimeout(r, 50))
  }
  throw new Error('Timeout waiting for condition')
}
