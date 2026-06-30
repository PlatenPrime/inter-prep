import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostBySlug } from '../server/utils/posts'

describe('posts utils', () => {
  it('returns all posts sorted by date', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThanOrEqual(3)
    expect(posts[0]!.publishedAt >= posts[1]!.publishedAt).toBe(true)
  })

  it('finds post by slug', () => {
    const post = getPostBySlug('what-is-ssr')
    expect(post?.title).toBe('What is SSR?')
  })

  it('returns null for unknown slug', () => {
    expect(getPostBySlug('missing')).toBeNull()
  })
})
