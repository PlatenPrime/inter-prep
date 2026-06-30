import { describe, it, expect } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { usePosts } from '../app/composables/usePost'

registerEndpoint('/api/posts', {
  method: 'GET',
  handler: () => [
    {
      slug: 'test',
      title: 'Test Post',
      excerpt: 'x',
      content: 'y',
      publishedAt: '2026-01-01',
    },
  ],
})

const PostsConsumer = defineComponent({
  async setup() {
    const { data, pending } = await usePosts()
    return { data, pending }
  },
  template: `
    <div>
      <p v-if="pending" data-testid="pending">loading</p>
      <p v-else data-testid="title">{{ data?.[0]?.title }}</p>
    </div>
  `,
})

describe('usePosts composable', () => {
  it('loads posts via useFetch', async () => {
    const wrapper = await mountSuspended(PostsConsumer)
    await viWaitFor(() => wrapper.find('[data-testid="title"]').exists())
    expect(wrapper.get('[data-testid="title"]').text()).toBe('Test Post')
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
