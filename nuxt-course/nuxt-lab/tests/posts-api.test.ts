import { describe, it, expect } from 'vitest'
import { handleGetPosts, handleGetPostBySlug } from '../server/utils/post-handlers'

describe('posts API handlers', () => {
  it('GET /api/posts returns list', () => {
    const posts = handleGetPosts()
    expect(posts.length).toBeGreaterThanOrEqual(3)
    expect(posts[0]?.slug).toBeDefined()
  })

  it('GET /api/posts/:slug returns post', () => {
    const post = handleGetPostBySlug('what-is-ssr')
    expect(post.title).toBe('What is SSR?')
  })

  it('GET /api/posts/:slug throws 404 for missing', () => {
    expect(() => handleGetPostBySlug('missing')).toThrowError(
      expect.objectContaining({ statusCode: 404 }),
    )
  })
})
