import { handleGetPostBySlug } from '../../utils/post-handlers'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  return handleGetPostBySlug(slug ?? '')
})
