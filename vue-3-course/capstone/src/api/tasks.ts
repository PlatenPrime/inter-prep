import type { CreateTaskInput, Task } from '@capstone/schemas/task'

let db: Task[] = [
  {
    id: '1',
    title: 'Learn Vue 3 reactivity',
    done: true,
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Build Task Board capstone',
    done: false,
    createdAt: '2026-06-02T10:00:00.000Z',
  },
]

function delay(ms = 30) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchTasks(): Promise<Task[]> {
  await delay()
  return structuredClone(db)
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  await delay()
  return structuredClone(db.find((t) => t.id === id) ?? null)
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  await delay()
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    done: false,
    createdAt: new Date().toISOString(),
  }
  db = [task, ...db]
  return structuredClone(task)
}

export async function toggleTaskDone(id: string): Promise<Task> {
  await delay()
  const task = db.find((t) => t.id === id)
  if (!task) throw new Error('Task not found')
  task.done = !task.done
  return structuredClone(task)
}

export function resetTaskDb(seed: Task[] = []) {
  db = structuredClone(seed)
}
