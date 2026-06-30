import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useQuery } from '@pinia/colada'
import { fetchTasks, resetTasksDb } from './tasksApi'

const QueryConsumer = defineComponent({
  setup() {
    const { data, isPending } = useQuery({
      key: ['tasks'],
      query: () => fetchTasks(),
    })
    return { data, isPending }
  },
  template: `
    <div>
      <p v-if="isPending" data-testid="pending">Loading</p>
      <ul v-else data-testid="list">
        <li v-for="t in data" :key="t.id">{{ t.title }}</li>
      </ul>
    </div>
  `,
})

describe('08-server-state useQuery', () => {
  beforeEach(() => {
    resetTasksDb([
      { id: '1', title: 'A', done: false },
      { id: '2', title: 'B', done: true },
    ])
  })

  it('loads tasks via Pinia Colada', async () => {
    const pinia = createPinia()

    const wrapper = mount(QueryConsumer, {
      global: { plugins: [pinia, PiniaColada] },
    })

    expect(wrapper.find('[data-testid="pending"]').exists()).toBe(true)
    await viWaitForQuery()
    expect(wrapper.get('[data-testid="list"]').text()).toContain('A')
    expect(wrapper.get('[data-testid="list"]').text()).toContain('B')
  })
})

async function viWaitForQuery() {
  await new Promise((r) => setTimeout(r, 50))
  await nextTick()
}
