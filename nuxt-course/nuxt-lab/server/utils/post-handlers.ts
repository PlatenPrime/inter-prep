import { getAllPosts, getPostBySlug } from './posts'

export function handleGetPosts() {
  return getAllPosts()
}

export function handleGetPostBySlug(slug: string) {
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const post = getPostBySlug(slug)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  return post
}
