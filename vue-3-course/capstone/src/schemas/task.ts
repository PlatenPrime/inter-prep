import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Max 100 characters'),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export interface Task {
  id: string
  title: string
  done: boolean
  createdAt: string
}
