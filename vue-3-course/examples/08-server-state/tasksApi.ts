export interface TaskDto {
  id: string
  title: string
  done: boolean
}

let tasksDb: TaskDto[] = [
  { id: '1', title: 'Learn Vue', done: false },
  { id: '2', title: 'Ship feature', done: true },
]

export async function fetchTasks(): Promise<TaskDto[]> {
  await delay(10)
  return structuredClone(tasksDb)
}

export async function createTask(title: string): Promise<TaskDto> {
  await delay(10)
  const task: TaskDto = { id: crypto.randomUUID(), title, done: false }
  tasksDb = [...tasksDb, task]
  return task
}

export function resetTasksDb(seed: TaskDto[] = []) {
  tasksDb = structuredClone(seed)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
